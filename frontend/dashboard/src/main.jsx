import "@fontsource/geist"
import "@fontsource/fira-code" 

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from "sonner"
import './index.css'
import App from './App.jsx'
import {
  BrowserRouter, 
  Routes,
  Route,
} from "react-router-dom";
import "./index.css"
import Dashboard from "@/pages/Dashboard.jsx"
import Login from '@/pages/Login.jsx'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { AuthProvider } from "@/context/AuthContext.jsx"
ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/*" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
    </AuthProvider>
  </>,
);
