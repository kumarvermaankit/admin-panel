import { supabaseClient } from "../../../utility/supabaseClient";
import { IOperation, IOperationVariables } from "../types/operationInterfaces";

export const fetchOperations = async (): Promise<IOperation[]> => {
  const { data, error } = await supabaseClient.from("operations").select("*").order("sequence");
  if (error) {
    throw new Error(error.message);
  }
  return data as IOperation[];
};

export const fetchOpertionById = async (id: number): Promise<IOperation> => {
  const { data, error } = await supabaseClient
    .from("operations")
    .select("*")
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return data[0] as IOperation;
};

export const createOperation = async (
  operation: IOperationVariables
): Promise<void> => {
  const { error } = await supabaseClient.from("operations").insert(operation);
  if (error) {
    throw new Error(error.message);
  }
};

export const updateOperation = async (
  operation: IOperationVariables
): Promise<void> => {
  const { error } = await supabaseClient
    .from("operations")
    .update(operation)
    .eq("id", operation.id);
  if (error) {
    throw new Error(error.message);
  }
}

export const deleteOperation = async (id: number): Promise<void> => {
  const { error } = await supabaseClient
    .from("operations")
    .delete()
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
};

