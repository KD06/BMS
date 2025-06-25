import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { useState } from "react";

import { useLoggedInUser, useSignin } from "../../hooks/auth.hooks";
import { useEffect } from "react";

const SigninPage = () => {
  const navigate = useNavigate();

  const { mutateAsync: signinAsync } = useSignin();
  const { data: loggedInUser } = useLoggedInUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (loggedInUser) navigate("/dashboard");
  }, [loggedInUser, navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await signinAsync({ email, password });
  };

  return (
    <div className="signup-page-container">
      <div>
        <Typography variant="h3">Sign In</Typography>
        <Box component="form" onSubmit={handleFormSubmit}>
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
            <Button type="submit" fullWidth variant="contained">
              Sign In
            </Button>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default SigninPage;
