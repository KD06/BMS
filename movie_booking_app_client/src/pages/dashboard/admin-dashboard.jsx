import { useState } from "react";

// Tabs
import CreateTheatreTab from "./components/admin/create-theatre";

import "./admin.styles.css";
import CreateMovieTab from "./components/admin/create-movie";
import CreateTheatreHallTab from "./components/admin/create-thatre-hall";
import CreateShowTab from "./components/admin/create-show";

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("create-theatre");

  const selectTab = (id) => setSelectedTab(id);

  return (
    <div className="admin-dashboard-container">
      <div className="sidebar">
        <div className="sidebar-item">
          <h6>Create</h6>
          <ul>
            <li onClick={() => selectTab("create-theatre")}>Theatre</li>
            <li onClick={() => selectTab("create-theatre-halls")}>
              Theatre Halls
            </li>
            <li onClick={() => selectTab("create-movie")}>Movies</li>
          </ul>
        </div>
        <div className="sidebar-item">
          <h6>Manage</h6>
          <ul>
            <li onClick={() => selectTab("create-show")}>Create Show</li>
          </ul>
        </div>
      </div>
      <div className="main-content">
        {selectedTab === "create-theatre" && <CreateTheatreTab />}
        {selectedTab === "create-theatre-halls" && <CreateTheatreHallTab />}
        {selectedTab === "create-movie" && <CreateMovieTab />}
        {selectedTab === "create-show" && <CreateShowTab />}
      </div>
    </div>
  );
};

export default AdminDashboard;
