import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import AppLayout from "./pages/Home"
import { AuthProvider } from "./context/AuthContext"

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
    
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
       <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}