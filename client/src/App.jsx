import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Billing from "./pages/Billing";
import Products from "./pages/Products";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectRoute";
import SalesHistory from "./pages/SalesHistory";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Register from "./pages/Register";
import {ToastContainer} from "react-toastify";



const App = () => {
  return (
    <>
    <ToastContainer/>
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />

        
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
              } 
            />
            <Route 
            path="/billing" 
            element={
              <ProtectedRoute>
                <Billing />
              </ProtectedRoute>
              } 
            />
            <Route 
            path="/product" 
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
              } 
            />
            <Route 
            path="/sales-history" 
            element={
              <ProtectedRoute>
                <SalesHistory />
              </ProtectedRoute>
              } 
            />

            <Route 
            path="/report" 
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
              } 
            />

            <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
              } 
            />
    
      </Routes>
    </BrowserRouter>
    </AuthProvider>
    </>
    
  )
}

export default App
