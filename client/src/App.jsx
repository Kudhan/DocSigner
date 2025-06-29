import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import UploadPage from "./pages/uploadPage";
import Dashboard from "./pages/Dashboard"; // ✅ Add this line
import SignPage from "./pages/SignPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sign/:docId" element={<SignPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
