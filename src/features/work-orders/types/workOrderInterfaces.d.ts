import { IOperation } from "../../operations/types/operationInterfaces";
import { IOrderLineItem } from "../../orders/types/orderInterfaces";
import { IProfile } from "../../profiles/types/profileInterfaces";

export interface IWorkOrder {
  id?: number;
  created_at: Date;
  updated_at: Date;
  order_line_item: IOrderLineItem;
  operation: IOperation;
  status: string;
  start_date: Date;
  end_date: Date;
  quantity: number;
  weight: number;
  due_date?: Date;
  profile?: IProfile;
}

export interface IWorkOrderVariables {
  id?: number;
  profile: IProfile;
  status: string;
}
