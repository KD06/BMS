import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate, Link } from "react-router-dom";
import "./style.css";
import { useState, useEffect } from "react";

import { useLoggedInUser, useSignin } from "../../hooks/auth.hooks";
import SnackbarMessage from "../snackbar";

const SigninPage = () => {
  const navigate = useNavigate();

  const { mutateAsync: signinAsync } = useSignin();
  const { data: loggedInUser } = useLoggedInUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  useEffect(() => {
    if (loggedInUser) navigate("/dashboard");
  }, [loggedInUser, navigate]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSnackbar({ open: false, message: "", severity: "" });
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError("Enter a valid email address");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) return;

    try {
      await signinAsync({ email, password });
    } catch (err) {
      if (err.response?.data?.message) {
        setSnackbar({
          open: true,
          message: err.response.data.message,
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Invalid email or password",
          severity: "error",
        });
      }
    }
  };

  return (
    <div className="signup-page-container">
      <div>
        <Typography variant="h3">Sign In</Typography>
        <Box component="form" onSubmit={handleFormSubmit} noValidate>
          <div className="form-row">
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              label="Email Address"
              type="email"
              required
              error={!!emailError}
              helperText={emailError}
            />
          </div>
          <div className="form-row">
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              label="Password"
              type="password"
              required
              error={!!passwordError}
              helperText={passwordError}
            />
          </div>
          <div className="form-row">
            <Button type="submit" fullWidth variant="contained">
              Sign In
            </Button>
          </div>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account? <Link to="/sign-up">Sign up</Link>
        </Typography>
      </div>
      <SnackbarMessage
        handleClose={() =>
          setSnackbar({ open: false, message: "", severity: "" })
        }
        message={snackbar.message}
        open={snackbar.open}
        severity={snackbar.severity}
      />
    </div>
  );
};

export default SigninPage;
