import { supabaseClient } from "../../../utility/supabaseClient";

/**
 * Generic function to fetch the row count of a Supabase table.
 * @param {string} tableName - The name of the table to fetch the count for.
 * @returns {Promise<number | null>} - The count of rows or null if an error occurs.
 */
export const getTableCount = async (tableName: string): Promise<number | null> => {
  try {
    const { count, error } = await supabaseClient
      .from(tableName)
      .select("*", { count: "exact" });

    if (error) {
      console.error(`Error fetching count for table ${tableName}:`, error);
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error(`An unexpected error occurred while fetching count for ${tableName}:`, error);
    return null;
  }
};
