import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Email Sent!",
          text: "A password reset link has been sent to your email.",
          confirmButtonText: "Okay",
          confirmButtonColor: "#0F1D9F",
        }).then(() => {
          navigate("/"); // Redirect to login page
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to send reset email. Please try again.",
          confirmButtonText: "Retry",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred. Please try again later.",
        confirmButtonText: "Okay",
      });
    }
  };

  return (
    <div className="forgot-password-container">
      <Typography variant="h4" style={{ fontWeight: "bold", marginBottom: "1rem" }}>
        Forgot Password
      </Typography>
      <Typography variant="subtitle1" style={{ marginBottom: "2rem" }}>
        Enter your email address to receive a password reset link.
      </Typography>
      <form onSubmit={handleForgotPassword}>
        <TextField
          label="Email Address"
          placeholder="Enter your email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          style={{
            backgroundColor: "#0F1D9F",
            color: "#FFF",
            textTransform: "none",
            marginTop: "1rem",
            borderRadius: "25px",
            padding: "15px",
            fontWeight: "bold",
          }}
        >
          Send Reset Link
        </Button>
      </form>
    </div>
  );
}

export default ForgotPassword;