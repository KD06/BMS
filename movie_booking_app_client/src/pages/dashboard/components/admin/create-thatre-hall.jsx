import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import {
  useCreateTheaterHall,
  useGetAllTheaters,
  useGetTheaterHall,
} from "../../../../hooks/theatre.hook";

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
      {/* <div style={{ width: "50%", padding: "10px" }}>
        {halls?.map((hall) => (
          <li style={{ listStyle: "none" }} key={hall._id}>
            <pre>{JSON.stringify(hall, null, 2)}</pre>
          </li>
        ))}
      </div> */}
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
      <select
        value={theatreId || ""}
        onChange={(e) => setTheatreId(e.target.value)}
      >
        <option value="" disabled>
          Select Theatre
        </option>
        {theatres?.map((e) => (
          <option key={e._id} value={e._id}>
            {e.name}
          </option>
        ))}
      </select>

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
