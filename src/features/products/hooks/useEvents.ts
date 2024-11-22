import { useQuery } from "@tanstack/react-query"
import { getEventsData } from "../api/eventApi"


export const useEvents = () => {
    return useQuery({
        queryKey: ["event_schedule"],
        queryFn: getEventsData
    })
}