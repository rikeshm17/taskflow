import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./styles/global.css";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#172A39",
                color: "#E9E4E0",
                border: "1px solid #FC563C",
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);