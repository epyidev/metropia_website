import React from "react";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./Layout";
import { AnimatePresence } from "framer-motion";
import NotificationProvider from "./components/NotificationProvider";
import ImageHost from "./pages/ImageHost";
import WikiMain from "./pages/WikiMain";
import WikiPage from "./pages/WikiPage";
import WikiCreate from "./pages/WikiCreate";
import WikiAllPages from "./pages/WikiAllPages";

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
              <Route path="imagehost" element={<ImageHost />} />
              <Route path="wiki" element={<WikiMain />} />
              <Route path="wiki/:id" element={<WikiPage />} />
              <Route path="wiki-create" element={<WikiCreate />} />
              <Route path="wiki-all-pages" element={<WikiAllPages />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </NotificationProvider>
    </Router>
  );
};

export default App;
