import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useCreateMovie, useGetAllMovies } from "../../../../hooks/movie.hooks";

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
            <div key={movie._id}>
              <pre>{JSON.stringify(movie, null, 2)}</pre>
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

  const { mutateAsync: createMovieAsync } = useCreateMovie();

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      const movieData = {
        title,
        description,
        language,
        imageURL,
        durationInMinutes: Number(durationInMinutes),
      };
      const filteredMovieData = Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(movieData).filter(([_, value]) => value)
      );
      await createMovieAsync(filteredMovieData);
      setTitle("");
      setDescription("");
      setLanguage("");
      setImageURL("");
      setDurationInMinutes("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleDescription = (e) => {
    setDescription(e.target.value);
  };
  const handleLanguage = (e) => {
    setLanguage(e.target.value);
  };
  const handleImageURL = (e) => {
    setImageURL(e.target.value);
  };
  const handleDurationInMinutes = (e) => {
    setDurationInMinutes(e.target.value);
  };

  return (
    <div>
      <Box component="form" onSubmit={handleCreateMovie}>
        <div className="form-row">
          <TextField
            value={title}
            onChange={handleTitle}
            fullWidth
            label="Title"
            required
          ></TextField>
        </div>
        <div className="form-row">
          <TextField
            value={description}
            onChange={handleDescription}
            fullWidth
            label="Description"
          ></TextField>
        </div>
        <div className="form-row">
          <TextField
            value={language}
            onChange={handleLanguage}
            fullWidth
            label="Language"
          ></TextField>
        </div>
        <div className="form-row">
          <TextField
            value={imageURL}
            onChange={handleImageURL}
            fullWidth
            label="Image URL"
          ></TextField>
        </div>
        <div className="form-row">
          <TextField
            value={durationInMinutes}
            onChange={handleDurationInMinutes}
            fullWidth
            label="Duration In Minutes"
          ></TextField>
        </div>
        <div className="form-row">
          <Button fullWidth variant="contained" type="submit">
            Create Movie
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default CreateMovieTab;
