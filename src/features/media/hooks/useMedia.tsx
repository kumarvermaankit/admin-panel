import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { IMedia } from "../types/mediaInterfaces";
import { deleteMedia, fetchMediaGallery, insertMedia } from "../api/mediaApi";
import { RcFile } from "antd/es/upload";

export const useMedia = (
  page: number
): UseQueryResult<{ data: IMedia[]; total: number }> => {
  return useQuery<unknown, Error, { data: IMedia[]; total: number }, QueryKey>({
    queryKey: ["media", page],
    queryFn: () => fetchMediaGallery(page),
  });
};

export const useCreateMedia = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, RcFile>({
    mutationFn: (file: RcFile) => insertMedia(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, IMedia>({
    mutationFn: (media: IMedia) => deleteMedia(media),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
}
