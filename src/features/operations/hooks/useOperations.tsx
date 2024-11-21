import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { IOperation, IOperationVariables } from "../types/operationInterfaces";
import {
  createOperation,
  deleteOperation,
  fetchOperations,
  fetchOpertionById,
  updateOperation,
} from "../api/operationsApi";

export const useOperations = (): UseQueryResult<IOperation[], Error> => {
  return useQuery<unknown, Error, IOperation[], QueryKey>({
    queryKey: ["operations"],
    queryFn: fetchOperations,
  });
};

export const useOperation = (id: number): UseQueryResult<IOperation, Error> => {
  return useQuery<unknown, Error, IOperation, QueryKey>({
    queryKey: ["operation", id],
    queryFn: () => fetchOpertionById(id),
  });
};

export const useCreateOperation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IOperationVariables, unknown>({
    mutationFn: createOperation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operations"] });
    },
  });
};

export const useUpdateOperation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IOperationVariables, unknown>({
    mutationFn: (operation) => updateOperation(operation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operations"] });
    },
  });
}

export const useDeleteOperation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number, unknown>({
    mutationFn: (id) => deleteOperation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operations"] });
    },
  });
};
