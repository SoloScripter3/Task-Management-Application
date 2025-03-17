import SignUp from "./pages/SignUp";
import Landing from "./Landing";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
