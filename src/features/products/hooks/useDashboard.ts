import { useQuery } from "@tanstack/react-query"
import { getTableCount } from "../api/dashboardApi";

export const useTableCount = (queryKey: string, tableName: string) => {
    return useQuery<number | null>({
      queryKey: [queryKey],
      queryFn: () => getTableCount(tableName),
    });
  };

  export const useRegistrationsCount = () => {
    return useTableCount("employee_registrations_count", "employee_registrations");
  };
  
  export const useLoginCount = () => {
    return useTableCount("employee_login_count", "employee_logins");
  };

  export const useSpinWheelQuizCount = () => {
    return useTableCount("employee_quiz_count", "employee_quiz_answers");
  };

  export const useBusesArrivalCount = () => {
    return useTableCount("buses_arrival_count", "buses_arrival");
  };
  
  export const useFeedbackCount = () => {
    return useTableCount("feedback_submissions_count", "feedback_submissions");
  };
  