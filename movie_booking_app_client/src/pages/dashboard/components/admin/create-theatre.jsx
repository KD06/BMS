import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import {
  useCreateTheater,
  useGetAllTheaters,
} from "../../../../hooks/theatre.hook";

const CreateTheatreTab = () => {
  const { data: theatres } = useGetAllTheaters();
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "50%" }}>
        <CreateTheatreForm />
      </div>
      <div style={{ width: "50%", padding: "10px" }}>
        {theatres?.map((theatre) => (
          <li style={{ listStyle: "none" }} key={theatre._id}>
            <pre>{JSON.stringify(theatre, null, 2)}</pre>
          </li>
        ))}
      </div>
    </div>
  );
};

function CreateTheatreForm() {
  const [name, setName] = useState("");
  const [plot, setPlot] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pinCode, setPincode] = useState("");

  const { mutateAsync: createTheatreAsync } = useCreateTheater();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await createTheatreAsync({
      name,
      plot,
      street,
      city,
      state,
      country,
      pinCode: Number(pinCode),
    });
  };

  return (
    <div>
      <Box component="form" onSubmit={handleFormSubmit}>
        <div className="form-row">
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            label="Theatre Name"
            required
          />
          <TextField
            value={plot}
            onChange={(e) => setPlot(e.target.value)}
            fullWidth
            label="Plot Number"
            required
          />
          <TextField
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            fullWidth
            label="Street"
            required
          />
          <TextField
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
            label="City"
            required
          />
          <TextField
            value={state}
            onChange={(e) => setState(e.target.value)}
            fullWidth
            label="State"
            required
          />
          <TextField
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            fullWidth
            label="Country"
            required
          />
          <TextField
            value={pinCode}
            onChange={(e) => setPincode(e.target.value)}
            fullWidth
            label="Pincode"
            required
          />
        </div>
        <Button variant="outlined" type="submit">
          Submit
        </Button>
      </Box>
    </div>
  );
}

export default CreateTheatreTab;
