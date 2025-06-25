import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../api";

export const useGetAllTheaters = () => {
  const query = useQuery({
    queryKey: ["theaters"],
    queryFn: async function () {
      const { data } = await apiInstance.get("/admin/theatres");
      return data.data;
    },
  });
  return query;
};

export const useCreateTheater = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async function ({
      name,
      plot,
      street,
      city,
      state,
      country,
      pinCode,
    }) {
      const { data } = await apiInstance.post("/admin/theatres", {
        name,
        plot,
        street,
        city,
        state,
        country,
        pinCode,
      });

      return data;
    },
    onSuccess: async function () {
      await queryClient.invalidateQueries({ queryKey: ["theaters"] });
    },
  });
  return mutation;
};

export const useCreateTheaterHall = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async function ({ number, seatingCapacity, theatreId }) {
      const { data } = await apiInstance.post("/admin/theatres/halls", {
        number,
        seatingCapacity,
        theatreId,
      });

      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["theatre-halls"] });
    },
  });
  return mutation;
};

export const useGetTheaterHall = (theatreId) => {
  const query = useQuery({
    queryKey: ["theatre-halls", theatreId],
    enabled: !!theatreId,
    queryFn: async function () {
      const { data } = await apiInstance.get(
        `/admin/theatres/${theatreId}/halls`
      );

      return data.data;
    },
  });
  return query;
};

export const useGetShowsByMovieId = (movieId) => {
  const query = useQuery({
    queryKey: ["shows", movieId],
    enabled: !!movieId,
    queryFn: async function () {
      const { data } = await apiInstance.get(`/api/shows/${movieId}`);

      return data.data;
    },
  });
  return query;
};

export const useCreateShow = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async function ({
      movieId,
      theatreHallId,
      startTimestamp,
      endTimestamp,
      price,
    }) {
      const { data } = await apiInstance.post("/admin/shows", {
        movieId,
        theatreHallId,
        startTimestamp,
        endTimestamp,
        price,
      });

      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["shows"] });
    },
  });
  return mutation;
};
