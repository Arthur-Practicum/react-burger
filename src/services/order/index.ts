import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { useSyncExternalStore } from 'react';

import { WS_HOST, API_DOMAIN } from '@utils/constants.ts';

import type {
  Order,
  OrderRequest,
  OrdersQueryResponse,
  UserOrdersQueryResponse,
  WSMessage,
  WSOrder,
  WSOrderResponse,
} from '@/types/order';

const WS_CONFIG = {
  BASE_URL: WS_HOST,
  ORDERS_PATH: '/orders/all',
  USER_ORDERS_PATH: '/orders',
  MAX_RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY_MS: 1000,
} as const;

const stripBearer = (token: string): string =>
  token.startsWith('Bearer ') ? token.slice(7) : token;

const isWSMessage = (data: unknown): data is WSMessage => {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  return Array.isArray(obj.orders);
};

type WSStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error';

type WSManagerOptions = {
  logPrefix: string;
  getUrl: () => string;
  processMessage?: (data: unknown) => { fatal: true; reason: string } | null;
};

type ConnectHandlers = {
  onMessage: (data: WSMessage) => void;
  onError: (error: Event) => void;
  onFatal?: (reason: string) => void;
};

class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private status: WSStatus = 'idle';
  private isReady = false;
  private fatalReason: string | null = null;
  private statusListeners = new Set<() => void>();

  constructor(private readonly options: WSManagerOptions) {}

  getStatus(): WSStatus {
    return this.status;
  }

  getIsReady(): boolean {
    return this.isReady;
  }

  getFatalReason(): string | null {
    return this.fatalReason;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  subscribe(listener: () => void): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  private setStatus(status: WSStatus): void {
    if (this.status === status) return;
    this.status = status;
    this.notifyListeners();
  }

  private setIsReady(value: boolean): void {
    if (this.isReady === value) return;
    this.isReady = value;
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.statusListeners.forEach((listener) => {
      listener();
    });
  }

  connect(handlers: ConnectHandlers): void {
    if (
      this.ws?.readyState === WebSocket.OPEN ||
      this.ws?.readyState === WebSocket.CONNECTING
    ) {
      return;
    }

    this.cleanup();
    this.fatalReason = null;
    this.setStatus('connecting');

    try {
      this.ws = new WebSocket(this.options.getUrl());

      this.ws.onopen = (): void => {
        this.reconnectAttempts = 0;
        this.setStatus('open');
        console.log(`${this.options.logPrefix} Connected`);
      };

      this.ws.onmessage = (event: MessageEvent<string>): void => {
        try {
          const data = JSON.parse(event.data) as unknown;

          const verdict = this.options.processMessage?.(data);
          if (verdict?.fatal) {
            console.error(`${this.options.logPrefix} Fatal message: ${verdict.reason}`);
            this.fatalReason = verdict.reason;
            handlers.onFatal?.(verdict.reason);
            this.disconnect();
            return;
          }

          if (!isWSMessage(data)) {
            console.warn(`${this.options.logPrefix} Unexpected message shape`, data);
            return;
          }

          this.setIsReady(true);
          handlers.onMessage(data);
        } catch (parseError) {
          console.error(
            `${this.options.logPrefix} Failed to parse message:`,
            parseError
          );
          handlers.onError(new Event('parse_error'));
        }
      };

      this.ws.onerror = (error: Event): void => {
        console.error(`${this.options.logPrefix} Connection error:`, error);
        this.setStatus('error');
        handlers.onError(error);
      };

      this.ws.onclose = (): void => {
        this.setStatus('closed');
        if (this.fatalReason !== null) return;
        this.scheduleReconnect(handlers);
      };
    } catch (error) {
      console.error(`${this.options.logPrefix} Failed to create connection:`, error);
      this.setStatus('error');
      handlers.onError(new Event('connection_failed'));
    }
  }

  private scheduleReconnect(handlers: ConnectHandlers): void {
    if (this.reconnectAttempts >= WS_CONFIG.MAX_RECONNECT_ATTEMPTS) return;

    this.reconnectAttempts++;
    const delay = WS_CONFIG.RECONNECT_DELAY_MS * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      `${this.options.logPrefix} Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${WS_CONFIG.MAX_RECONNECT_ATTEMPTS})`
    );

    this.reconnectTimeoutId = setTimeout(() => {
      this.reconnectTimeoutId = null;
      this.connect(handlers);
    }, delay);
  }

  disconnect(): void {
    this.cleanup();
    this.reconnectAttempts = 0;
    this.setIsReady(false);
    this.setStatus('idle');
  }

  private cleanup(): void {
    if (this.reconnectTimeoutId !== null) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }

    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
  }
}

const wsManager = new WebSocketManager({
  logPrefix: '[WebSocket]',
  getUrl: (): string => `${WS_CONFIG.BASE_URL}${WS_CONFIG.ORDERS_PATH}`,
});

let userOrdersToken = '';

const userWsManager = new WebSocketManager({
  logPrefix: '[UserOrders WebSocket]',
  getUrl: (): string =>
    `${WS_CONFIG.BASE_URL}${WS_CONFIG.USER_ORDERS_PATH}?token=${stripBearer(
      userOrdersToken
    )}`,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  processMessage: (data) => {
    if (
      typeof data === 'object' &&
      data !== null &&
      (data as Record<string, unknown>).message === 'Invalid or missing token'
    ) {
      return { fatal: true, reason: 'invalid_token' };
    }
    return null;
  },
});

const useWsState = (
  manager: WebSocketManager
): { isConnected: boolean; isReady: boolean; status: WSStatus } => {
  const subscribe = (listener: () => void): (() => void) => manager.subscribe(listener);

  const status = useSyncExternalStore(
    subscribe,
    () => manager.getStatus(),
    () => manager.getStatus()
  );
  const isReady = useSyncExternalStore(
    subscribe,
    () => manager.getIsReady(),
    () => manager.getIsReady()
  );

  return {
    status,
    isReady,
    isConnected: status === 'open',
  };
};

const emptyWsMessage: WSMessage = { orders: [], total: 0, totalToday: 0 };

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_DOMAIN}/`,
    prepareHeaders: (headers, { getState }): Headers => {
      headers.set('Content-Type', 'application/json');

      const state = getState() as { auth: { accessToken: string | null } };
      const token = state.auth.accessToken;

      if (token) {
        headers.set('Authorization', `Bearer ${stripBearer(token)}`);
      }

      return headers;
    },
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, OrderRequest>({
      query: (body) => ({
        url: 'orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),

    getOrders: builder.query<WSMessage, void>({
      queryFn: (): { data: WSMessage } => ({ data: emptyWsMessage }),
      async onCacheEntryAdded(this: void, _arg, cacheApi) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { updateCachedData, cacheDataLoaded, cacheEntryRemoved } = cacheApi;

        const handleMessage = (data: WSMessage): void => {
          updateCachedData((): WSMessage => data);
        };

        const handleError = (error: Event): void => {
          console.error('[Orders Cache] WebSocket error:', error);
        };

        try {
          await cacheDataLoaded;
          wsManager.connect({ onMessage: handleMessage, onError: handleError });

          await cacheEntryRemoved;
        } catch (error) {
          console.error('[Orders Cache] Entry error:', error);
        } finally {
          wsManager.disconnect();
        }
      },
      providesTags: (
        result
      ): ({ type: 'Order'; id: string } | { type: 'Order'; id: 'LIST' })[] =>
        result?.orders
          ? [
              ...result.orders
                .filter((order): order is WSOrder => Boolean(order._id))
                .map(({ _id }) => ({
                  type: 'Order' as const,
                  id: _id,
                })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    getUserOrders: builder.query<WSMessage, string>({
      queryFn: (): { data: WSMessage } => ({ data: emptyWsMessage }),
      async onCacheEntryAdded(this: void, token, cacheApi) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { updateCachedData, cacheDataLoaded, cacheEntryRemoved } = cacheApi;

        const handleMessage = (data: WSMessage): void => {
          updateCachedData((): WSMessage => data);
        };

        const handleError = (error: Event): void => {
          console.error('[User Orders Cache] WebSocket error:', error);
        };

        const handleFatal = (reason: string): void => {
          console.error('[User Orders Cache] Fatal:', reason);
        };

        try {
          await cacheDataLoaded;
          userOrdersToken = token;
          userWsManager.connect({
            onMessage: handleMessage,
            onError: handleError,
            onFatal: handleFatal,
          });

          await cacheEntryRemoved;
        } catch (error) {
          console.error('[User Orders Cache] Entry error:', error);
        } finally {
          userWsManager.disconnect();
          userOrdersToken = '';
        }
      },
      providesTags: (
        result
      ): ({ type: 'Order'; id: string } | { type: 'Order'; id: 'USER_LIST' })[] =>
        result?.orders
          ? [
              ...result.orders
                .filter((order): order is WSOrder => Boolean(order._id))
                .map(({ _id }) => ({
                  type: 'Order' as const,
                  id: _id,
                })),
              { type: 'Order', id: 'USER_LIST' },
            ]
          : [{ type: 'Order', id: 'USER_LIST' }],
    }),

    getOrderById: builder.query<WSOrderResponse, string>({
      query: (id) => ({
        url: `orders/${id}`,
        method: 'GET',
      }),
      providesTags: (
        result,
        _error,
        id
      ): ({ type: 'Order'; id: string } | { type: 'Order'; id: 'LIST' })[] =>
        result?.orders
          ? [
              ...result.orders
                .filter((order): order is WSOrder => Boolean(order._id))
                .map(({ _id }) => ({
                  type: 'Order' as const,
                  id: _id,
                })),
              { type: 'Order', id },
            ]
          : [{ type: 'Order', id }],
    }),
  }),
});

export const useGetOrdersWithStatus = (): OrdersQueryResponse => {
  const { data, error, isLoading } = useGetOrdersQuery();
  const { isConnected, isReady } = useWsState(wsManager);

  return {
    orders: data?.orders ?? [],
    total: data?.total ?? 0,
    totalToday: data?.totalToday ?? 0,
    isConnected,
    isLoading: isLoading || !isReady,
    error,
  };
};

export const useGetUserOrdersWithStatus = (token: string): UserOrdersQueryResponse => {
  const { data, error, isLoading } = useGetUserOrdersQuery(token);
  const { isConnected, isReady } = useWsState(userWsManager);

  return {
    orders: data?.orders ?? [],
    total: data?.total ?? 0,
    totalToday: data?.totalToday ?? 0,
    isConnected,
    isLoading: isLoading || (!isReady && userWsManager.getFatalReason() === null),
    error,
    isTokenInvalid: userWsManager.getFatalReason() === 'invalid_token',
  };
};

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
} = orderApi;
