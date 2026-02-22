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
