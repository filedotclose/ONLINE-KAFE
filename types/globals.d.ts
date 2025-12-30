export {};

declare global {
  interface UserType {
    name: string;
    email: string;
    id: string;
  }

  interface Category {
    _id?: string;
    id?: string;
    name: string;
    icon: string;
  }

  interface MenuItem {
    _id: string;
    name: string;
    price: number;
    description?: string;
  }

  interface CartItem {
    menuItemId?: string;
    menuItem?: string;
    name?: string;
    price: number;
    quantity: number;
    _id?: string;
  }
  interface OrderItem  {
    menuItem?: string;
    name?: string;
    price: number;
    quantity: number;
    _id?: string;
  };
  
  interface Order  {
    _id: string;
    orderId: string;
    orderItems: OrderItem[];
    totalprice: number;
    payment: string;
    iat: string;
  }
}
