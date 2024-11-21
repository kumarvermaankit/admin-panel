import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  fetchCategoryById,
  updateCategory,
} from "../api/categoriesApi";
import { ICategory, ICategoryVariables } from "../types/categoryInterfaces";

export const useCategories = (): UseQueryResult<ICategory[], Error> => {
  return useQuery<unknown, Error, ICategory[], QueryKey>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};

export const useCategory = (id: number): UseQueryResult<ICategory, Error> => {
  return useQuery<ICategory, Error>({
    queryKey: ["category", id],
    queryFn: () => fetchCategoryById(id),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ICategoryVariables, unknown>({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ICategoryVariables & { id: number }, unknown>(
    {
      mutationFn: updateCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      },
    }
  );
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number, unknown>({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
