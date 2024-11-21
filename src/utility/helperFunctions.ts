import { IOrder } from "../features/orders/types/orderInterfaces";

export const formatCurrency = (value: number): string => {
  return `₹ ${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

// Calculate total quantity in order line items table
export const calculateTotalQuantity = (
  orderLineItems: IOrder["order_line_items"]
): number => {
  return orderLineItems.reduce((total, item) => total + item.quantity, 0);
};

// Calculate total amount order line items table
export const calculateTotalAmount = (
  orderLineItems: IOrder["order_line_items"]
): number => {
  return orderLineItems.reduce(
    (total, item) => total + item.quantity * item.rate,
    0
  );
};
