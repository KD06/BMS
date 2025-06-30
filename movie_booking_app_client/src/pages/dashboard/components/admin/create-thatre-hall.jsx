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
  useCreateTheaterHall,
  useGetAllTheaters,
  useGetTheaterHall,
} from "../../../../hooks/theatre.hook";
import "./../../user.styles.css";

const CreateTheatreHallTab = () => {
  const [theatreId, setTheatreId] = useState(null);
  const { data: halls } = useGetTheaterHall(theatreId);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "50%" }}>
        <CreateTheatreHallForm
          theatreId={theatreId}
          setTheatreId={setTheatreId}
        />
      </div>
      <div style={{ width: "50%", padding: "10px" }}>
        {halls?.map((hall) => (
          <div style={{ marginTop: "10px" }} key={hall._id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {hall.number}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {hall.seatingCapacity}
                </Typography>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
function CreateTheatreHallForm({ theatreId, setTheatreId }) {
  const { data: theatres } = useGetAllTheaters();

  const [number, setNumber] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState("");

  const [numberError, setNumberError] = useState("");
  const [capacityError, setCapacityError] = useState("");

  const { mutateAsync: createTheatreHallAsync } = useCreateTheaterHall();

  useEffect(() => {
    if (theatres && theatres.length > 0 && !theatreId) {
      setTheatreId(theatres[0]._id);
    }
  }, [setTheatreId, theatres, theatreId]);

  const validate = () => {
    let hasError = false;
    setNumberError("");
    setCapacityError("");

    const numberValue = Number(number);
    const capacityValue = Number(seatingCapacity);

    if (!number || isNaN(numberValue) || numberValue <= 0) {
      setNumberError("Enter a valid positive number");
      hasError = true;
    }

    if (!seatingCapacity || isNaN(capacityValue) || capacityValue <= 0) {
      setCapacityError("Enter a valid seating capacity");
      hasError = true;
    }

    return !hasError;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!theatreId) {
      alert("Please select a theatre");
      return;
    }

    if (!validate()) return;

    try {
      await createTheatreHallAsync({
        number: Number(number),
        seatingCapacity: Number(seatingCapacity),
        theatreId,
      });

      // Reset form
      setNumber("");
      setSeatingCapacity("");
    } catch (err) {
      console.error("Error creating theatre hall:", err);
    }
  };

  return (
    <div>
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <FormControl marginNormal>
          <InputLabel id="movie-select-label">Select Theatre</InputLabel>
          <Select
            labelId="movie-select-label"
            value={theatreId || ""}
            label="Select Theatre"
            onChange={(e) => setTheatreId(e.target.value)}
          >
            {theatres?.map((e) => (
              <MenuItem key={e._id} value={e._id}>
                {e.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box
        style={{ marginTop: "20px" }}
        component="form"
        onSubmit={handleFormSubmit}
        noValidate
      >
        <div className="form-row">
          <TextField
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            fullWidth
            label="Number"
            required
            error={!!numberError}
            helperText={numberError}
            sx={{ mb: 2 }}
          />
          <TextField
            value={seatingCapacity}
            onChange={(e) => setSeatingCapacity(e.target.value)}
            fullWidth
            label="Seating Capacity"
            required
            error={!!capacityError}
            helperText={capacityError}
            sx={{ mb: 2 }}
          />
        </div>
        <Button
          disabled={!theatreId}
          variant="outlined"
          type="submit"
          sx={{ mt: 1 }}
        >
          Submit
        </Button>
      </Box>
    </div>
  );
}

export default CreateTheatreHallTab;
