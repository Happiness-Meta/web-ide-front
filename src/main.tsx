import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RepoPage from "./pages/RepoPage/RepoPage";
import CodePage from "./pages/CodePage/CodePage";
import Dashboard from "./pages/RepoPage/Page/dashboard/Dashboard";
import Settings from "./pages/RepoPage/Page/settings/Settings";
import Projects from "./pages/RepoPage/Page/projects/Projects";
import Repositories from "./pages/RepoPage/Page/repositories/Repositories";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/RepoPage" element={<RepoPage />} />
        <Route path="/codePage" element={<CodePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/repositories" element={<Repositories />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
