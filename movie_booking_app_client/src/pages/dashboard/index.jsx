import { useEffect } from "react";
import { useLoggedInUser } from "../../hooks/auth.hooks";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./admin-dashboard";
import UserDashboard from "./user-dashboard";
import { Button } from "@mui/material";

const DashboardPage = () => {
  const { data: user, isLoading } = useLoggedInUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      console.log("Please go away"); // Todo: Debug this and make this work!
      navigate("/sign-in");
    }
  }, [isLoading, navigate, user]);

  if (isLoading) return <h1>Loading...</h1>;
  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <Button
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            navigate("/sign-in");
          }}
          variant="contained"
        >
          Logout
        </Button>
      </div>
      {user.role === "admin" && <AdminDashboard />}
      {user.role === "user" && <UserDashboard />}
    </div>
  );
};

export default DashboardPage;
