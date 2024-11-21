import { supabaseClient } from "../../../utility/supabaseClient";
import { ICategory, ICategoryVariables } from "../types/categoryInterfaces";

export const fetchCategories = async (): Promise<ICategory[]> => {
  const { data, error } = await supabaseClient
    .from("categories")
    .select(
      `
      id,
      title,
      parent:parent_id (
        id,
        title
      )
    `
    )
    .order("id", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  
  const categories: ICategory[] = data.map((category: any) => ({
    id: category.id,
    title: category.title,
    parent: category.parent
      ? {
          id: category.parent.id,
          title: category.parent.title,
        }
      : null,
  }));
  return categories;
};

export const fetchCategoryById = async (id: number): Promise<ICategory> => {
  const { data, error } = await supabaseClient
    .from("categories")
    .select(
      `
      id,
      title,
      parent:parent_id (
        id,
        title
      )
    `
    )
    .eq("id", id)
    .single();
  console.log(data);
  if (error) {
    throw new Error(error.message);
  }

  const parentData = Array.isArray(data.parent) ? data.parent[0] : data.parent;

  return {
    id: data.id,
    title: data.title,
    parent: parentData
      ? {
          id: parentData.id,
          title: parentData.title,
        }
      : null,
  };
};

export const createCategory = async (category: ICategoryVariables) => {
  const { error } = await supabaseClient
    .from("categories")
    .insert(category)
    .single();
  if (error) {
    throw new Error(error.message);
  }
};

export const updateCategory = async (
  category: ICategoryVariables & { id: number }
) => {
  const { error } = await supabaseClient
    .from("categories")
    .update({
      title: category.title,
      parent_id: category.parent_id || null,
    })
    .eq("id", category.id);
  if (error) {
    throw new Error(error.message);
  }
};

export const deleteCategory = async (id: number) => {
  const { error } = await supabaseClient
    .from("categories")
    .delete()
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
};
