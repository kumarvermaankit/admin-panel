import { supabaseClient } from "../../../utility/supabaseClient";
import { ICustomer, ICustomerVariables } from "../types/customerInterfaces";

export const fetchCustomers = async (): Promise<ICustomer[]> => {
  const { data, error } = await supabaseClient.from("customers").select("*").order("name", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  return data as ICustomer[];
};

export const createCustomer = async (
  customer: ICustomerVariables
): Promise<void> => {
  const { error } = await supabaseClient.from("customers").insert({
    name: customer.name,
  });
  if (error) {
    throw new Error(error.message);
  }
};

export const fetchCustomerById = async (id: number): Promise<ICustomer> => {
  const { data, error } = await supabaseClient
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data as ICustomer;
};

export const updateCustomer = async (
  id: number,
  customer: ICustomerVariables
): Promise<void> => {
  const { error } = await supabaseClient
    .from("customers")
    .update({
      name: customer.name,
    })
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
};

export const deleteCustomer = async (id: number): Promise<void> => {
  const { error } = await supabaseClient
    .from("customers")
    .delete()
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
};
