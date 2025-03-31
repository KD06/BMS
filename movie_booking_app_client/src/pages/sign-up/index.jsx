import { Button, Box, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { useState } from "react";
import { useMemo } from "react";
import { useEffect } from "react";
import { useLoggedInUser, useSignup } from "../../hooks/auth.hooks";

const SignupPage = () => {
  const navigate = useNavigate();

  const { mutateAsync: signupAsync } = useSignup();
  const { data: loggedInUser } = useLoggedInUser();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (loggedInUser) navigate("/dashboard");
  }, [loggedInUser, navigate]);

  const isConfirmPasswordMatch = useMemo(
    () => password === confirmPassword || confirmPassword === "",
    [confirmPassword, password]
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isConfirmPasswordMatch) return;
    await signupAsync({ firstname, lastname, email, password });
  };

  return (
    <div className="signup-page-container">
      <div>
        <Typography variant="h3">Sign Up</Typography>
        <Box component="form" onSubmit={handleFormSubmit}>
          <div className="form-row">
            <TextField
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              label="First Name"
              required
            />
            <TextField
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              label="Last Name"
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
            />
          </div>
          <div className="form-row">
            <TextField
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!isConfirmPasswordMatch}
              helperText={
                !isConfirmPasswordMatch ? "Password do not match" : undefined
              }
              fullWidth
              label="Confirm Password"
              type="password"
              required
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
      </div>
    </div>
  );
};

export default SignupPage;
