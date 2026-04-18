export type OrderResponse = {
  name: string;
  order: {
    number: number;
  };
  succeeded: boolean;
};

export type OrderRequest = {
  ingredients: string[];
};

export type Order = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

export type WSOrderResponse = {
  success: boolean;
  orders: WSOrder[];
};

export type WSMessage = {
  orders: WSOrder[];
  total: number;
  totalToday: number;
};

export type WSOrder = {
  _id: string;
  ingredients: string[];
  status: 'done' | 'pending' | 'created';
  name: string;
  number: number;
  createdAt: string;
  updatedAt: string;
};

export type OrdersQueryResponse = {
  orders: WSOrder[];
  total: number;
  totalToday: number;
  isConnected: boolean;
  isLoading: boolean;
  error: unknown;
};

export type UserOrdersQueryResponse = {
  orders: WSOrder[];
  total: number;
  totalToday: number;
  isConnected: boolean;
  isLoading: boolean;
  error: unknown;
  isTokenInvalid: boolean;
};
