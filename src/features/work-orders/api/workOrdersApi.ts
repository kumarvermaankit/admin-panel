import { supabaseClient } from "../../../utility/supabaseClient";
import { IWorkOrder, IWorkOrderVariables } from "../types/workOrderInterfaces";

export const fetchWorkOrders = async (
  page: number,
  limit: number = 100
): Promise<{ data: IWorkOrder[]; total: number }> => {
  const from = (page - 1) * limit;
  const to = page * limit - 1;

  // Fetch the data and total count in one call
  const { data, error, count } = await supabaseClient
    .from("work_orders")
    .select(
      `*, 
       profile:profiles(*), 
       order_line_item:order_line_items(id, order_id, variant_id, quantity, rate, 
         variant:product_variants(id, sku, 
           media:media(id, url)
         )
       ), 
       operation:operations(name, sequence)`,
      { count: "exact" }
    )
    .range(from, to)
    .order("order_line_item_id", { ascending: true })

  if (error) {
    throw new Error(error.message);
  }

  return { data: data as IWorkOrder[], total: count || 0 };
};

export const updateWorkOrderById = async (
  workOrder: IWorkOrderVariables
): Promise<void> => {
  console.log("workOrder api", workOrder);
  const { error } = await supabaseClient
    .from("work_orders")
    .update({
      updated_at: new Date(),
      profile_id: workOrder.profile.id,
      status: workOrder.status,
    })
    .eq("id", workOrder.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
};
