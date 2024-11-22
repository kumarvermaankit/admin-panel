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

export const addEvents = async (params: object) => {
  try {
    const { data, error } = await supabaseClient
      .from("event_schedule")
      .insert([{ ...params }]); // Insert the event data with id and other params

    if (error) {
      console.error("Error adding event data:", error);
      return { error };
    }

    console.log("Event data added successfully:", data);
    return { data };
  } catch (err) {
    console.error("Unexpected error while adding event data:", err);
    return { error: err };
  }
};

export const getEventNames = async ()=> {
  try {
    const { data, error } = await supabaseClient
      .from("event_name")
      .select("*")
    if (error) {
      console.error("Error fetching event name data:", error);
      return { error };
    }

    return data.length === 0 ? [] : data;
  } catch (err) {
    console.log(err);
  }
} 

export const getLocationNames = async ()=> {
  try {
    const { data, error } = await supabaseClient
      .from("locations")
      .select("*")
    if (error) {
      console.error("Error fetching loations data:", error);
      return { error };
    }

    return data.length === 0 ? [] : data;
  } catch (err) {
    console.log(err);
  }
} 

export const editEvents = async (id: number, params: { start_time?: string; end_time?: string }) => {
  try {
    const { data, error } = await supabaseClient
      .from("event_schedule")
      .update(params) // Update the given fields
      .eq("id", id); // Match the event by ID

    if (error) {
      console.error("Error updating event data:", error);
      return { error };
    }

    console.log("Event data updated successfully:", data);
    return { data };
  } catch (err) {
    console.error("Unexpected error while updating event data:", err);
    return { error: err };
  }
};
