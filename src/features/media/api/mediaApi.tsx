import { RcFile } from "antd/es/upload";
import { supabaseClient } from "../../../utility/supabaseClient";
import { IMedia } from "../types/mediaInterfaces";

// Fetch Media
export const fetchMediaGallery = async (
  page: number,
  limit: number = 16
): Promise<{ data: IMedia[]; total: number }> => {
  const from = (page - 1) * limit;
  const to = page * limit - 1;

  // Fetch the total count
  const { count, error: countError } = await supabaseClient
    .from("media")
    .select("*", { count: "exact", head: true });

  if (countError) {
    throw new Error(countError.message);
  }

  // Fetch the actual data
  const { data, error } = await supabaseClient
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return { data: data as IMedia[], total: count || 0 };
};

// Insert Media

// Insert Media
export const insertMedia = async (file: RcFile): Promise<void> => {
  // Step 1: Upload file to Supabase storage
  const { error: uploadError } = await supabaseClient.storage
    .from("mrp")
    .upload(`products/${file.name}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  // If upload fails, throw the error
  if (uploadError) {
    throw uploadError;
  }

  // Step 2: Get the public URL of the uploaded file
  const { data: publicUrlData } = await supabaseClient.storage
    .from("mrp")
    .getPublicUrl(`products/${file.name}`);

  // If public URL retrieval fails, throw an error
  if (!publicUrlData) {
    throw new Error("Failed to retrieve public URL");
  }

  // Step 3: Insert the public URL into the media table
  const { error } = await supabaseClient
    .from("media")
    .insert({ url: publicUrlData.publicUrl, file_name: file.name })
    .single();

  // If insertion fails, throw a new error
  if (error) {
    throw new Error(error.message);
  }
};

// Delete Media
export const deleteMedia = async (media: IMedia): Promise<void> => {
  // Step 1: Delete file from Supabase storage
  const { error: deleteError } = await supabaseClient.storage
    .from("mrp")
    .remove([`products/${media.file_name}`]);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const { error } = await supabaseClient
    .from("media")
    .delete()
    .eq("id", media.id);

  if (error) {
    throw new Error(error.message);
  }
};
