export interface CartItem {
  name: string;
  price: number;
  qty: number;
}

export interface CreatePaymentRequest {
  cart: CartItem[];
}
