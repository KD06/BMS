import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiInstance } from "../api";

export const useSignup = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ firstname, lastname, email, password }) => {
      const { data } = await apiInstance.post("/auth/sign-up", {
        firstname,
        lastname,
        email,
        password,
      });
      const token = data.data.token;
      if (token) localStorage.setItem("token", token);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
  return mutation;
};

export const useSignin = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await apiInstance.post("/auth/sign-in", {
        email,
        password,
      });
      const token = data.data.token;
      if (token) localStorage.setItem("token", token);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
  return mutation;
};

export const useLoggedInUser = () => {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await apiInstance.get("/auth/me");
      if (!data.isLoggedIn) return false;
      return data.data.user;
    },
  });
  return query;
};
