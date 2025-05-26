import React from "react";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./Layout";
import { AnimatePresence } from "framer-motion";
import NotificationProvider from "./components/NotificationProvider";

const App: React.FC = () => {
  return (
    <Router>
      <NotificationProvider>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </NotificationProvider>
    </Router>
  );
};

export default App;
