import { supabaseClient } from "../../../utility/supabaseClient";

export const getArtistApi = async () => {
    try {
        const { data, error } = await supabaseClient
          .from("artists")
          .select("*,locations(*)")
        if (error) {
          console.error("Error fetching artist data:", error);
          return { error };
        }
    
        return data.length === 0 ? [] : data;
      } catch (err) {
        console.log(err);
      }
}