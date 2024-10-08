import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./Pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PageNotFound from "./Pages/PageNotFound";
import ProblemDetails from "./Pages/ProblemDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problem-details"
          element={
            <ProtectedRoute>
              <ProblemDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems/:id"
          element={
            <ProtectedRoute>
              <ProblemDetails />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
