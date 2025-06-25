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
      <div style={{ width: "50%", padding: "10px" }}>
        {halls?.map((hall) => (
          <li style={{ listStyle: "none" }} key={hall._id}>
            <pre>{JSON.stringify(hall, null, 2)}</pre>
          </li>
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

  const { mutateAsync: createTheatreHallAsync } = useCreateTheaterHall();

  useEffect(() => {
    if (theatres && theatres.length > 0) setTheatreId(theatres[0]._id);
  }, [setTheatreId, theatres]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!theatreId) {
      alert(`Please select a theatre`);
      return;
    }
    await createTheatreHallAsync({
      number: Number(number),
      seatingCapacity: Number(seatingCapacity),
      theatreId,
    });
  };

  return (
    <div>
      <select value={theatreId} onChange={(e) => setTheatreId(e.target.value)}>
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
      >
        <div className="form-row">
          <TextField
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            fullWidth
            label="Number"
            required
          />
          <TextField
            value={seatingCapacity}
            onChange={(e) => setSeatingCapacity(e.target.value)}
            fullWidth
            label="Seating Capacity"
            required
          />
        </div>
        <Button disabled={!theatreId} variant="outlined" type="submit">
          Submit
        </Button>
      </Box>
    </div>
  );
}

export default CreateTheatreHallTab;
