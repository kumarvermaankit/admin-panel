import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { IOrder, IOrderVariable } from "../types/orderInterfaces";
import {
  createOrder,
  deleteOrder,
  fetchOrderById,
  fetchOrders,
  fetchProductVariants,
  updateOrder,
} from "../api/ordersApi";
import { IVariant } from "../../products/types/productInterfaces";

export const useOrders = (): UseQueryResult<IOrder[], Error> => {
  return useQuery<unknown, Error, IOrder[], QueryKey>({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
};

export const useOrder = (id: number): UseQueryResult<IOrder, Error> => {
  return useQuery<unknown, Error, IOrder, QueryKey>({
    queryKey: ["order", id],
    queryFn: () => fetchOrderById(id),
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IOrderVariable, unknown>({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, {order: IOrderVariable, deletedIds: number[]}, unknown>({
    mutationFn: ({order, deletedIds}) => updateOrder(order, deletedIds),
    onSuccess: (_, {order}) => {
      queryClient.resetQueries({ queryKey: ["order", order.id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number, unknown>({
    mutationFn: (id: number) => deleteOrder(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useFetchProductVariants = () => {
  return useQuery<unknown, Error, IVariant[], QueryKey>({
    queryKey: ["variants"],
    queryFn: fetchProductVariants,
  });
};
