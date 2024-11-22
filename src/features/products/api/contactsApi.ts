import { supabaseClient } from "../../../utility/supabaseClient";

// Function to fetch all emergency contacts
export const getEmergencyContactsData = async () => {
  try {
    const { data, error } = await supabaseClient
      .from("emergency_contacts")
      .select("*");
    if (error) {
      console.error("Error fetching emergency contacts data:", error);
      return { error };
    }

    return data || [];
  } catch (err) {
    console.log("Unexpected error while fetching emergency contacts:", err);
    return { error: err };
  }
};


export const editEmergencyContact = async (
  id: number,
  updates: { name?: string; phone_numbers?: string[] }
) => {
  try {
    const { data, error } = await supabaseClient
      .from("emergency_contacts")
      .update(updates)
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error("Error updating emergency contact:", err);
    throw err;
  }
};
