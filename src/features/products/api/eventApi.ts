import { supabaseClient } from "../../../utility/supabaseClient";

export const getEventsData = async () => {
    try {
        const { data, error } = await supabaseClient
          .from("event_schedule")
          .select("*")
        if (error) {
          console.error("Error fetching event schedule data:", error);
          return { error };
        }
    
        return data.length === 0 ? [] : data;
      } catch (err) {
        console.log(err);
      }
}