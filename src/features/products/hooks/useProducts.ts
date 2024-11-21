import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { IProduct, IProductVariables } from "../types/productInterfaces";
import {
  createProduct,
  deleteProduct,
  fetchProductById,
  fetchProducts,
  updateProduct,
} from "../api/productsApi";

export const useProducts = (): UseQueryResult<IProduct[], Error> => {
  return useQuery<unknown, Error, IProduct[], QueryKey>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IProductVariables, unknown>({
    mutationFn: (product) => createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useFetchProductById = (id: number) => {
  return useQuery<unknown, Error, IProduct, QueryKey>({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, {product: IProductVariables, deletedIds: number[]}, unknown>({
    mutationFn: ({ product, deletedIds }) => updateProduct(product, deletedIds),  
    onSuccess: (_, {product}) => {
      queryClient.resetQueries({ queryKey: ["product", product.id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number, unknown>({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
