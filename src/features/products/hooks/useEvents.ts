import { useQuery } from "@tanstack/react-query"
import { getEventNames, getEventsData, getLocationNames } from "../api/eventApi"


export const useEvents = () => {
    return useQuery({
        queryKey: ["event_schedule"],
        queryFn: getEventsData
    })
}

export const useGetEventsName = () => {
    return useQuery({
        queryKey: ["event_name"],
        queryFn: getEventNames
    })
}

export const useGetLocations = () => {
    return useQuery({
        queryKey: ["locations"],
        queryFn: getLocationNames
    })
}

