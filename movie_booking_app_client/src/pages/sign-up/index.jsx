import { Button, Box, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useNavigate, Link } from "react-router-dom";
import "./style.css";
import { useState, useEffect, useMemo } from "react";
import { useLoggedInUser, useSignup } from "../../hooks/auth.hooks";
import SnackbarMessage from "../snackbar";

const SignupPage = () => {
  const navigate = useNavigate();

  const { mutateAsync: signupAsync } = useSignup();
  const { data: loggedInUser } = useLoggedInUser();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  useEffect(() => {
    if (loggedInUser) navigate("/dashboard");
  }, [loggedInUser, navigate]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("at least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("one number");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("one special character");
    return errors;
  };

  const isConfirmPasswordMatch = useMemo(
    () => password === confirmPassword,
    [confirmPassword, password]
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSnackbar({ open: false, message: "", severity: "" });
    setFirstnameError("");
    setLastnameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    if (!firstname.trim()) {
      setFirstnameError("First name is required");
      hasError = true;
    } else if (firstname.length < 2 || firstname.length > 25) {
      setFirstnameError("First name must be 2–25 characters");
      hasError = true;
    }

    if (
      !lastname.trim() ||
      (lastname && (lastname.length < 2 || lastname.length > 25))
    ) {
      setLastnameError("Last name must be 2–25 characters");
      hasError = true;
    }

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
    } else {
      const pwdErrors = isValidPassword(password);
      if (pwdErrors.length > 0) {
        setPasswordError(`Password must contain ${pwdErrors.join(", ")}`);
        hasError = true;
      }
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirm Password is required");
      hasError = true;
    } else if (!isConfirmPasswordMatch) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }

    if (hasError) return;

    try {
      await signupAsync({ firstname, lastname, email, password });
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
          message: "Sign up failed. Please try again.",
          severity: "error",
        });
      }
    }
  };

  return (
    <div className="signup-page-container">
      <div>
        <Typography variant="h3">Sign Up</Typography>
        <Box component="form" onSubmit={handleFormSubmit} noValidate>
          <div className="form-row">
            <TextField
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              label="First Name"
              required
              error={!!firstnameError}
              helperText={firstnameError}
            />
            <TextField
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              label="Last Name"
              error={!!lastnameError}
              helperText={lastnameError}
            />
          </div>
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
            <TextField
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              label="Confirm Password"
              type="password"
              required
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
            />
          </div>
          <div className="form-row">
            <Button
              type="submit"
              disabled={!isConfirmPasswordMatch}
              fullWidth
              variant="contained"
            >
              Create Account
            </Button>
          </div>
        </Box>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? <Link to="/sign-in">Sign in</Link>
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

export default SignupPage;
