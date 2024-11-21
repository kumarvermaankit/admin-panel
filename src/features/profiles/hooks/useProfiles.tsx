import { QueryKey, useQuery, UseQueryResult } from "@tanstack/react-query";
import { IProfile } from "../types/profileInterfaces";
import { fetchProfiles } from "../api/profilesApi";

export const useProfiles = (): UseQueryResult<IProfile[], Error> => {
  return useQuery<unknown, Error, IProfile[], QueryKey>({
    queryKey: ["profiles"],
    queryFn: fetchProfiles,
  });
};
