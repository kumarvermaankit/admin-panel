import { supabaseClient } from "../../../utility/supabaseClient";

// Function to fetch all emergency contacts
export const getAppMediaData = async () => {
  try {
    const { data, error } = await supabaseClient
      .from("creative_assets")
      .select("*,locations(*)");
    if (error) {
      console.error("Error fetching App Media data:", error);
      return { error };
    }
    return data || [];
  } catch (err) {
    console.log("Unexpected error while fetching App Media:", err);
    return { error: err };
  }
};

export const getMediaUrlById = async (media_id: string) => {
    try {
      const { data, error } = await supabaseClient
        .from("media")
        .select("url")
        .eq("id", media_id)
        .single();
  
      if (error) {
        console.error(`Error fetching media URL for ID ${media_id}:`, error);
        return null;
      }
      return data?.url || null; // Return the URL or null if not found
    } catch (err) {
      console.error("Unexpected error while fetching media URL:", err);
      return null;
    }
  };

  export const updateAppMedia = async (id: string, updates: { name?: string; media_id?: string; language?: string }) => {
    try {
      const { data, error } = await supabaseClient
        .from("creative_assets")
        .update(updates)
        .eq("id", id);
  
      if (error) {
        console.error("Error updating app media:", error);
        throw error;
      }
  
      return data;
    } catch (err) {
      console.error("Unexpected error while updating app media:", err);
      throw err;
    }
  };