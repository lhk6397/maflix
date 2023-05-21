import useSWR from "swr";
import fetcher from "@/libs/server/fetcher";
import { IProfile, IUser } from "@/types";

interface CurrentResult {
  user: IUser;
  profile: IProfile;
}

const useCurrentUser = () => {
  const { data, error, isLoading, mutate } = useSWR<CurrentResult>(
    "/api/current",
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useCurrentUser;
