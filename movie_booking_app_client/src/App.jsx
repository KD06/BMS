import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { Routes, Route } from "react-router-dom";

import Homepage from "./pages/homepage";
import SigninPage from "./pages/sign-in";
import SignupPage from "./pages/sign-up";
import DashboardPage from "./pages/dashboard";

import "./App.css";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/sign-in" element={<SigninPage />} />
      <Route path="/sign-up" element={<SignupPage />} />
    </Routes>
  );
}

export default App;
