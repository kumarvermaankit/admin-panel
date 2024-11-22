import { useQuery } from "@tanstack/react-query";
import { getEmployeesLocationAccessData } from "../api/employeeApi";


export const useEmployeeLocation = (ids: number[]) => {
    return useQuery({
        queryKey: ["employee_location", ids],
        queryFn: () => getEmployeesLocationAccessData(ids),
        enabled: ids.length > 0,
        staleTime: 5 * 60 * 1000,
        retry: 1,
      });
}