import { supabaseClient } from "../../../utility/supabaseClient";
import {
  IProduct,
  IProductVariables,
  IVariant,
} from "../types/productInterfaces";

// Get Products
export const fetchProducts = async (): Promise<IProduct[]> => {
  const { data, error } = await supabaseClient
    .from("products")
    .select(
      "*, categories(id,title), media(id, url), variants:product_variants(*)"
    )
    .order("created_at", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return data as IProduct[];
};

// Fetch Product by Id
export const fetchProductById = async (id: number): Promise<IProduct> => {
  const { data, error } = await supabaseClient
    .from("products")
    .select(
      "id, category_id, categories(id,title), media!media_id(id, url),variants:product_variants(id, price, sku, media(id, url))"
    )
    .eq("id", id)
    .single();
  console.log(data);
  if (error) {
    throw new Error(error.message);
  }
  return data as unknown as IProduct;
};

// Create Product
export const createProduct = async (
  product: IProductVariables
): Promise<void> => {
  const { data, error } = await supabaseClient
    .from("products")
    .insert({
      category_id: product.category_id,
      media_id: product.media.id,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (data) {
    const variantInsertions = product.variants.map((variant) =>
      supabaseClient.from("product_variants").insert({
        sku: variant.sku,
        price: variant?.price,
        product_id: data.id,
        media_id: variant.media?.id ?? product.media.id,
      })
    );

    const variantResults = await Promise.all(variantInsertions);

    for (const result of variantResults) {
      if (result.error) {
        console.log(result.error.message);
        throw new Error(result.error.message);
      }
    }

    console.log(variantResults);
  }
};

// Update Product
export const updateProduct = async (
  product: IProductVariables,
  deletedIds: number[]
): Promise<void> => {
  const { error } = await supabaseClient
    .from("products")
    .update({
      category_id: product.category_id,
      media_id: product.media.id,
    })
    .eq("id", product.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  product.variants.forEach(async (variant) => {
    console.log(variant.media);
    if (variant.id === undefined || variant.id === null) {
      const { error } = await supabaseClient.from("product_variants").insert({
        sku: variant.sku,
        price: variant.price,
        product_id: product.id,
        media_id: variant.media?.id,
      });
      if (error) {
        throw new Error(error.message);
      }
    } else if (variant.id) {
      const { error } = await supabaseClient
        .from("product_variants")
        .update({
          sku: variant.sku,
          price: variant.price,
          media_id: variant.media?.id,
        })
        .eq("id", variant.id);
      if (error) {
        throw new Error(error.message);
      }
    }
  });
  const { error: deleteError } = await supabaseClient
    .from("product_variants")
    .delete()
    .in("id", deletedIds || []);
  if (deleteError) {
    throw new Error(deleteError.message);
  }
};

// Delete Product
export const deleteProduct = async (id: number) => {
  const { error } = await supabaseClient.from("products").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
};

// Fetch Variant by SKU
export const fetchVariantBySku = async (
  sku: string
): Promise<IVariant | null> => {
  const { data, error } = await supabaseClient
    .from("product_variants")
    .select("*")
    .eq("sku", sku)
    .limit(1); // Limit to 1 result to avoid errors with multiple rows

  if (error && error.code !== "PGRST116") {
    // Throw an error for anything other than no rows returned
    throw new Error(error.message);
  }

  // Return null if no rows found
  if (!data || data.length === 0) {
    return null;
  }

  return data[0] as IVariant; // Return the first result
};
