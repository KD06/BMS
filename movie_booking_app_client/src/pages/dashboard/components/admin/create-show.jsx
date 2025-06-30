import {
  Button,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import {
  useCreateShow,
  useGetAllTheaters,
  useGetShowsByMovieId,
  useGetTheaterHall,
} from "../../../../hooks/theatre.hook";
import { useGetAllMovies } from "../../../../hooks/movie.hooks";
import "./../../user.styles.css";

const CreateShowTab = () => {
  const [movieId, setMovieId] = useState(null);
  const { data: shows } = useGetShowsByMovieId(movieId);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "50%" }}>
        <CreateShowForm movieId={movieId} setMovieId={setMovieId} />
      </div>
      {/* <div style={{ width: "50%", padding: "10px" }}>
        {shows?.map((show) => (
          <li style={{ listStyle: "none" }} key={show._id}>
            <pre>{JSON.stringify(show, null, 2)}</pre>
          </li>
          <div style={{ marginTop: "10px" }} key={show._id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {show?.theatreHallId?.theatreId?.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Seating Capacity: {show?.theatreHallId?.seatingCapacity}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Price: {show?.price}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Total seats Booked: {show?.selectedSeats.length}
                </Typography>
              </CardContent>
            </Card>
          </div>
        ))}
      </div> */}
    </div>
  );
};

function CreateShowForm({ movieId, setMovieId }) {
  const [theatreId, setTheatreId] = useState(null);
  const [hallId, setHallId] = useState(null);

  const [price, setPrice] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [errors, setErrors] = useState({});

  const { data: theatres } = useGetAllTheaters();
  const { data: movies } = useGetAllMovies();
  const { data: halls } = useGetTheaterHall(theatreId);

  const { mutateAsync: createShowAsync } = useCreateShow();

  useEffect(() => {
    if (movies && movies.length > 0) setMovieId(movies[0]._id);
  }, [movies, setMovieId]);

  useEffect(() => {
    if (theatres && theatres.length > 0) setTheatreId(theatres[0]._id);
  }, [theatres]);

  useEffect(() => {
    if (halls && halls.length > 0) setHallId(halls[0]._id);
  }, [halls]);

  const validate = () => {
    const newErrors = {};
    if (!price.trim()) newErrors.price = "Price is required";
    else if (isNaN(price) || Number(price) <= 0)
      newErrors.price = "Price must be a number greater than 0";

    if (!startTime) newErrors.startTime = "Start time is required";
    if (!endTime) newErrors.endTime = "End time is required";

    if (startTime && endTime && new Date(endTime) <= new Date(startTime)) {
      newErrors.endTime = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await createShowAsync({
      movieId,
      theatreHallId: hallId,
      startTimestamp: new Date(startTime).getTime(),
      endTimestamp: new Date(endTime).getTime(),
      price: Number(price),
    });

    setPrice("");
    setStartTime("");
    setEndTime("");
    setErrors({});
  };

  return (
    <div>
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="movie-select-label">Movie</InputLabel>
          <Select
            labelId="movie-select-label"
            value={movieId || ""}
            label="Movie"
            onChange={(e) => setMovieId(e.target.value)}
          >
            {movies?.map((movie) => (
              <MenuItem key={movie._id} value={movie._id}>
                {movie.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="theatre-select-label">Theatre</InputLabel>
          <Select
            labelId="theatre-select-label"
            id="theatre-select"
            value={theatreId || ""}
            label="Theatre"
            onChange={(e) => setTheatreId(e.target.value)}
          >
            {theatres?.map((theatre) => (
              <MenuItem key={theatre._id} value={theatre._id}>
                {theatre.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {theatreId && (
          <FormControl fullWidth>
            <InputLabel id="hall-select-label">Hall</InputLabel>
            <Select
              labelId="hall-select-label"
              value={hallId || ""}
              label="Hall"
              onChange={(e) => setHallId(e.target.value)}
            >
              {halls?.map((hall) => (
                <MenuItem key={hall._id} value={hall._id}>
                  Hall {hall.number} ({hall.seatingCapacity} seats)
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      <Box component="form" onSubmit={handleFormSubmit} noValidate>
        <TextField
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          label="Price"
          required
          error={!!errors.price}
          helperText={errors.price}
          sx={{ mb: 2 }}
        />
        <TextField
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          fullWidth
          type="datetime-local"
          label="Start Time"
          required
          error={!!errors.startTime}
          helperText={errors.startTime}
          sx={{ mb: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          fullWidth
          type="datetime-local"
          label="End Time"
          required
          error={!!errors.endTime}
          helperText={errors.endTime}
          sx={{ mb: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button
          disabled={!theatreId || !hallId || !movieId}
          variant="outlined"
          type="submit"
        >
          Submit
        </Button>
      </Box>
    </div>
  );
}

export default CreateShowTab;
