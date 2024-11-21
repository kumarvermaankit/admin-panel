import { supabaseClient } from "../../../utility/supabaseClient";
import { IVariant } from "../../products/types/productInterfaces";
import { IOrder, IOrderVariable } from "../types/orderInterfaces";

// Get Orders
export const fetchOrders = async (): Promise<IOrder[]> => {
  const { data, error } = await supabaseClient
    .from("orders")
    .select("*, customers(id, name)").order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as IOrder[];
};

// Fetch Product Variants for Order Line Items
export const fetchProductVariants = async (): Promise<IVariant[]> => {
  const { data, error } = await supabaseClient
    .from("product_variants")
    .select(
      "*, media:media!inner(id, url), product:products!inner(*, media:media!inner(id, url))"
    );

  if (error) {
    throw new Error(error.message);
  }

  return data as IVariant[];
};

// Get Order by Id
export const fetchOrderById = async (id: number): Promise<IOrder> => {
  const { data, error } = await supabaseClient
    .from("orders")
    .select(
      "*, customers(id, name), order_line_items(id, variant_id, quantity, rate, variant:product_variants(id, sku, media:media!inner(id, url)))"
    )
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as IOrder;
};

// Create Order
export const createOrder = async (order: IOrderVariable): Promise<void> => {
  const { data, error } = await supabaseClient
    .from("orders")
    .insert({
      created_at: order.created_at,
      delivery_date: order.delivery_date,
      customer_id: order.customer_id,
    })
    .select();

  if (error) {
    throw new Error(error.message);
  }

  if (data[0].id) {
    const orderLineItems = order.order_line_items.map((oli) => ({
      order_id: data[0].id,
      variant_id: oli.variant_id,
      quantity: oli.quantity,
      rate: oli.rate,
    }));

    await supabaseClient.from("order_line_items").insert(orderLineItems);
  }
};

// Update Order
export const updateOrder = async (
  order: IOrderVariable,
  deletedIds: number[]
): Promise<void> => {
  const { data, error } = await supabaseClient
    .from("orders")
    .update({
      created_at: order.created_at,
      delivery_date: order.delivery_date,
      customer_id: order.customer_id,
    })
    .eq("id", order.id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  if (data && data.length > 0 && data[0].id) {
    order.order_line_items.forEach(async (oli) => {
      if (oli.id) {
        await supabaseClient
          .from("order_line_items")
          .update({
            variant_id: oli.variant_id,
            quantity: oli.quantity,
            rate: oli.rate,
          })
          .eq("id", oli.id);
      } else {
        await supabaseClient.from("order_line_items").insert({
          order_id: order.id,
          variant_id: oli.variant_id,
          quantity: oli.quantity,
          rate: oli.rate,
        });
      }
    });
  }
  const { error: deleteError } = await supabaseClient
    .from("order_line_items")
    .delete()
    .in("id", deletedIds || []);
  if (deleteError) {
    throw new Error(deleteError.message);
  }
};

export const deleteOrder = async (id: number) => {
  const { error } = await supabaseClient.from("orders").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};
