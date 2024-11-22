/* eslint-disable no-debugger */
import { RcFile } from "antd/es/upload";
import { supabaseClient } from "../../../utility/supabaseClient";
import { IMedia } from "../types/mediaInterfaces";

const BUCKET_NAME = "maruti_family_day_1";
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

export const insertMedia = async (file: RcFile): Promise<void> => {
  const { error: uploadError } = await supabaseClient.storage
    .from(BUCKET_NAME)
    .upload(`assets/${file.name}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicUrlData } = await supabaseClient.storage
    .from(BUCKET_NAME)
    .getPublicUrl(`assets/${file.name}`);

  if (!publicUrlData) {
    throw new Error("Failed to retrieve public URL");
  }

  const { error } = await supabaseClient
    .from("media")
    .insert({ url: publicUrlData.publicUrl, file_name: file.name })
    .single();

  if (error) {
    throw new Error(error.message);
  }
};

// Delete Media
export const deleteMedia = async (media: IMedia): Promise<void> => {
  if (!media?.url) {
    throw new Error("Media URL is required");
  }

  try {
    const fileUrl = new URL(media.url);
    const fileName = fileUrl.pathname.split("/").pop();
    console.log(` File Name ${fileName}`);

    if (!fileName) {
      throw new Error("Invalid file name in URL");
    }

    // Delete from storage
    const { error: storageError } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .remove([`assets/${fileName}`]);

    if (storageError) {
      throw new Error(`Storage deletion failed: ${storageError.message}`);
    }

    // Delete from database
    const { error: dbError } = await supabaseClient
      .from("media")
      .delete()
      .eq("id", media.id);

    if (dbError) {
      throw new Error(`Database deletion failed: ${dbError.message}`);
    }
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("An unknown error occurred");
  }
};
