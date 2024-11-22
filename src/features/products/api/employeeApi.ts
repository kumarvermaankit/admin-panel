import { supabaseClient } from "../../../utility/supabaseClient";

export const getEmployeesLocationAccessData = async (ids: number[]) => {
  try {
    const { data, error } = await supabaseClient
      .from("employee_locations")
      .select("*,locations(*)")
      .in("employee_id", ids);
    if (error) {
      console.error("Error fetching employee location data:", error);
      return { error };
    }

    return data.length === 0 ? [] : data;
  } catch (err) {
    console.log(err);
  }
};

export const editEmployeesData = async (
  employeeId: number,
  locationId: number,
  updates: { registration_count_access?: boolean; bus_arrival_access?: boolean }
) => {
  try {
    const { data, error } = await supabaseClient
      .from("employee_locations")
      .update(updates)
      .match({ employee_id: employeeId, location_id: locationId });

    if (error) {
      console.error("Error updating employee data:", error);
      return { error };
    }

    console.log("Employee data updated successfully:", data);
    return { data };
  } catch (err) {
    console.error("Unexpected error while updating employee data:", err);
    return { error: err };
  }
};
