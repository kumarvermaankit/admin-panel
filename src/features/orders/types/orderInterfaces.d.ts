import { IMedia } from "../../media/types/mediaInterfaces";
import { IVariant } from "../../products/types/productInterfaces";

export interface IOrder {
    id: int;
    created_at: Date;
    delivery_date: Date;
    customers: ICustomer;
    order_line_items: IOrderLineItem[];
  }
  
  export interface IOrderVariable {
    id?: int;
    created_at: Date,
    delivery_date: Date;
    customer_id: int;
    order_line_items: IOrderLineItemVariable[];
  }
  
  export interface IOrderLineItemVariable {
    id?: int;
    media?: IMedia;
    variant_id: int;
    quantity: int;
    rate: numeric;
    order_id: int;
  }
  
  export interface IOrderLineItem {
    id: int;
    created_at: Date;
    quantity: int;
    rate: numeric;
    variant_id: int;
    variant: IVariant;
    order_id: int;
  }