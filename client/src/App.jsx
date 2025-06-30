import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import UploadPage from "./pages/uploadPage";
import Dashboard from "./pages/Dashboard";
import SignPage from "./pages/SignPage";
import RequestSignature from "./pages/requestSignature";
import IncomingRequests from "./pages/incomingRequest";
import OutgoingRequests from "./pages/outgoingRequest";
import PrivateRoute from "./pages/privateRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ Secure these routes */}
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <UploadPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/sign/:docId"
          element={
            <PrivateRoute>
              <SignPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/request-signature"
          element={
            <PrivateRoute>
              <RequestSignature />
            </PrivateRoute>
          }
        />
        <Route
          path="/incoming-requests"
          element={
            <PrivateRoute>
              <IncomingRequests />
            </PrivateRoute>
          }
        />
        <Route
          path="/outgoing-requests"
          element={
            <PrivateRoute>
              <OutgoingRequests />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
