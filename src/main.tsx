import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./styles/global.css";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { RoleProvider } from "./context/RoleContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RoleProvider>
          <BrowserRouter>
            <App />

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 2500,
              }}
            />
          </BrowserRouter>
        </RoleProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);