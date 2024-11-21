import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { ICustomer, ICustomerVariables } from "../types/customerInterfaces";
import {
  createCustomer,
  deleteCustomer,
  fetchCustomerById,
  fetchCustomers,
  updateCustomer,
} from "../api/customersApi";

export const useCustomers = (): UseQueryResult<ICustomer[], Error> => {
  return useQuery<unknown, Error, ICustomer[], QueryKey>({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });
};

export const useCustomer = (id: number): UseQueryResult<ICustomer, Error> => {
  return useQuery<ICustomer, Error>({
    queryKey: ["customer", id],
    queryFn: () => fetchCustomerById(id),
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ICustomerVariables, unknown>({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { id: number; customer: ICustomerVariables },
    unknown
  >({
    mutationFn: ({ id, customer }) => updateCustomer(id, customer),
    onSuccess: (_, {customer}) => {
      queryClient.resetQueries({ queryKey: ["customer", customer.id] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number, unknown>({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};
