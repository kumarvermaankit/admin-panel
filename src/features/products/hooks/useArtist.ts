import { useQuery } from "@tanstack/react-query"
import { getArtistApi } from "../api/artistApi"

export const useArtist = () => {
    return useQuery({
        queryKey: ["artist"],
        queryFn: getArtistApi
    })
}
