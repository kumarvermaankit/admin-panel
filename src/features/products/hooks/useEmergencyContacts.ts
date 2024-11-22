import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editEmergencyContact, getEmergencyContactsData  } from "../api/contactsApi";

export const useGetEmergencyContacts = () => {
    return useQuery({
      queryKey: ["emergency_contacts"],
      queryFn: getEmergencyContactsData,
    });
  };

  type EditContactParams = {
    id: number;
    updates: {
      name?: string;
      phone_numbers?: string[];
    };
  };
  
  export const useEditEmergencyContact = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({ id, updates }: EditContactParams) => editEmergencyContact(id, updates),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["emergency_contacts"] }); // Refetch updated contacts
      },
    });
  };