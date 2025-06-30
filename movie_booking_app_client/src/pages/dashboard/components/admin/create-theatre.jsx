import { Button, Card, CardContent, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import {
  useCreateTheater,
  useGetAllTheaters,
} from "../../../../hooks/theatre.hook";
import "./../../user.styles.css";

const CreateTheatreTab = () => {
  const { data: theatres } = useGetAllTheaters();
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "50%" }}>
        <CreateTheatreForm />
      </div>
      <div style={{ width: "50%", padding: "10px" }}>
        {theatres?.map((theatre) => (
          <div style={{ marginTop: "10px" }} key={theatre._id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {theatre.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {`${theatre.plot || ""},${theatre.street || ""}, ${
                    theatre.city || ""
                  }, ${theatre.state || ""}, ${theatre.country || ""} - ${
                    theatre.pinCode || ""
                  }`}
                </Typography>
              </CardContent>
            </Card>
          </div>
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

  const [errors, setErrors] = useState({});

  const { mutateAsync: createTheatreAsync } = useCreateTheater();

  const validate = () => {
    const newErrors = {};
    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = "Theatre name must be at least 2 characters";
    }
    if (!plot.trim()) newErrors.plot = "Plot is required";
    if (!street.trim()) newErrors.street = "Street is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!state.trim()) newErrors.state = "State is required";
    if (!country.trim()) newErrors.country = "Country is required";

    if (!pinCode.trim()) {
      newErrors.pinCode = "Pincode is required";
    } else if (!/^\d{6}$/.test(pinCode)) {
      newErrors.pinCode = "Pincode must be a 6-digit number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createTheatreAsync({
        name,
        plot,
        street,
        city,
        state,
        country,
        pinCode: Number(pinCode),
      });

      // Reset form on success
      setName("");
      setPlot("");
      setStreet("");
      setCity("");
      setState("");
      setCountry("");
      setPincode("");
      setErrors({});
    } catch (err) {
      console.error("Error creating theatre:", err);
    }
  };

  return (
    <div>
      <Box component="form" onSubmit={handleFormSubmit} noValidate>
        <div className="form-row">
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            label="Theatre Name"
            required
            error={!!errors.name}
            helperText={errors.name}
            sx={{ mb: 2 }}
          />
          <TextField
            value={plot}
            onChange={(e) => setPlot(e.target.value)}
            fullWidth
            label="Plot Number"
            required
            error={!!errors.plot}
            helperText={errors.plot}
            sx={{ mb: 2 }}
          />
          <TextField
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            fullWidth
            label="Street"
            required
            error={!!errors.street}
            helperText={errors.street}
            sx={{ mb: 2 }}
          />
          <TextField
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
            label="City"
            required
            error={!!errors.city}
            helperText={errors.city}
            sx={{ mb: 2 }}
          />
          <TextField
            value={state}
            onChange={(e) => setState(e.target.value)}
            fullWidth
            label="State"
            required
            error={!!errors.state}
            helperText={errors.state}
            sx={{ mb: 2 }}
          />
          <TextField
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            fullWidth
            label="Country"
            required
            error={!!errors.country}
            helperText={errors.country}
            sx={{ mb: 2 }}
          />
          <TextField
            value={pinCode}
            onChange={(e) => setPincode(e.target.value)}
            fullWidth
            label="Pincode"
            required
            error={!!errors.pinCode}
            helperText={errors.pinCode}
            sx={{ mb: 2 }}
          />
        </div>
        <Button variant="outlined" type="submit" sx={{ mt: 1 }}>
          Submit
        </Button>
      </Box>
    </div>
  );
}

export default CreateTheatreTab;
