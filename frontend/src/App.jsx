import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";

const Home = () => (
  <div className="p-10 text-center text-3xl font-bold text-dark-purple-300">
    HOME
  </div>
);
const Register = () => (
  <div className="p-10 text-center text-2xl text-gray-400">PAGE REGISTER</div>
);
const Login = () => (
  <div className="p-10 text-center text-2xl text-gray-400">PAGE LOGIN</div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-purple-900 text-white font-sans selection:bg-dark-purple-500 selection:text-white">
        <Navbar />

        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
