import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { IWorkOrder, IWorkOrderVariables } from "../types/workOrderInterfaces";
import { fetchWorkOrders, updateWorkOrderById } from "../api/workOrdersApi";

export const useWorkOrders = (
  page: number
): UseQueryResult<{ data: IWorkOrder[]; total: number, }, Error> => {
  return useQuery<
    unknown,
    Error,
    { data: IWorkOrder[]; total: number },
    QueryKey
  >({
    queryKey: ["workOrders", page],
    queryFn: () => fetchWorkOrders(page),
  });
};

export const useUpdateWorkOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IWorkOrderVariables, unknown>({
    mutationFn: (workOrder) => updateWorkOrderById(workOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
    },
  });
};
