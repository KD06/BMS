import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../api";

export const useCreateMovie = () => {
  const queryClient = useQueryClient();
  const movie = useMutation({
    mutationFn: async ({
      title,
      description,
      language,
      imageURL,
      durationInMinutes,
    }) => {
      const { data } = await apiInstance.post("/admin/movies", {
        title,
        description,
        language,
        imageURL,
        durationInMinutes,
      });
      return data.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
  return movie;
};

export const useGetAllMovies = () => {
  const movies = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const { data } = await apiInstance.get("/api/movies");
      return data.data;
    },
  });
  return movies;
};
