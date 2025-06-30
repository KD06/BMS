import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  CardMedia,
} from "@mui/material";
import { useState } from "react";
import { useCreateMovie, useGetAllMovies } from "../../../../hooks/movie.hooks";
import "./../../user.styles.css";

const CreateMovieTab = () => {
  const { data: movies } = useGetAllMovies();
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "50%" }}>
        <CreateMovieForm />
      </div>
      <div style={{ width: "50%", padding: "10px" }}>
        {movies &&
          movies.map((movie) => (
            <div style={{ marginTop: "10px" }} key={movie._id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="194"
                  image={movie.imageURL}
                  alt="Image not Available"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {movie.description}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          ))}
      </div>
    </div>
  );
};

const CreateMovieForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [durationInMinutes, setDurationInMinutes] = useState("");
  const [errors, setErrors] = useState({});

  const { mutateAsync: createMovieAsync } = useCreateMovie();

  const validate = () => {
    const newErrors = {};
    if (!title.trim() || title.length < 2)
      newErrors.title = "Title must be at least 2 characters";
    if (!language.trim() || language.length < 2)
      newErrors.language = "Language must be at least 2 characters";
    if (!imageURL.trim()) {
      newErrors.imageURL = "Image URL is required";
    } else {
      try {
        new URL(imageURL);
      } catch {
        newErrors.imageURL = "Enter a valid URL";
      }
    }
    const duration = Number(durationInMinutes);
    if (!durationInMinutes.trim()) {
      newErrors.durationInMinutes = "Duration is required";
    } else if (isNaN(duration) || duration <= 0) {
      newErrors.durationInMinutes = "Duration must be a number greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await createMovieAsync({
        title,
        description,
        language,
        imageURL,
        durationInMinutes: Number(durationInMinutes),
      });

      // Reset form
      setTitle("");
      setDescription("");
      setLanguage("");
      setImageURL("");
      setDurationInMinutes("");
      setErrors({});
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box component="form" onSubmit={handleCreateMovie} noValidate>
      <TextField
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        label="Title"
        required
        error={!!errors.title}
        helperText={errors.title}
        sx={{ mb: 2 }}
      />
      <TextField
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        label="Description"
        multiline
        minRows={2}
        sx={{ mb: 2 }}
      />
      <TextField
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        fullWidth
        label="Language"
        required
        error={!!errors.language}
        helperText={errors.language}
        sx={{ mb: 2 }}
      />
      <TextField
        value={imageURL}
        onChange={(e) => setImageURL(e.target.value)}
        fullWidth
        label="Image URL"
        required
        error={!!errors.imageURL}
        helperText={errors.imageURL}
        sx={{ mb: 2 }}
      />
      <TextField
        value={durationInMinutes}
        onChange={(e) => setDurationInMinutes(e.target.value)}
        fullWidth
        label="Duration In Minutes"
        required
        error={!!errors.durationInMinutes}
        helperText={errors.durationInMinutes}
        sx={{ mb: 2 }}
      />
      <Button fullWidth variant="contained" type="submit" sx={{ mt: 1 }}>
        Create Movie
      </Button>
    </Box>
  );
};

export default CreateMovieTab;
