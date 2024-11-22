import { useQuery } from "@tanstack/react-query"
import { getAppMediaData, getMediaUrlById } from "../api/appMedia"

export const useAppMedia = () => {
    return useQuery({
        queryKey: ["app_media"],
        queryFn: getAppMediaData
    })
}

export const useMediaUrl = (media_id: string | null) => {
    return useQuery({
      queryKey: ["media_url", media_id],
      queryFn: () => (media_id ? getMediaUrlById(media_id) : null),
      enabled: !!media_id,
    });
  };