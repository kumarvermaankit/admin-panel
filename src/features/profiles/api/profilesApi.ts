import { supabaseClient } from "../../../utility/supabaseClient";
import { IProfile } from "../types/profileInterfaces";

export const fetchProfiles = async () => {
  const { data, error } = await supabaseClient.from("profiles").select();
  if (error) {
    throw new Error(error.message);
  }
  return data as IProfile[];
};
