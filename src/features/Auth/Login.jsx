import React, { useState } from "react";
import { TextField, Button, Checkbox, FormControlLabel, Typography, Link } from "@mui/material";
import "./Login.css"; // Custom CSS for additional styles
import Logo from "/ppe_logo.png";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://ppemanagement.andrieinthesun.com/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      console.log("Response:", data);
  
      if (data.success) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userRole", data.accessLevel); // Store user role
        localStorage.setItem("firstName", data.firstName); // Store user's first name
        localStorage.setItem("userFullName", data.firstName + " " + data.lastname); // Store user's full name
        localStorage.setItem("userId", data.userId); // Store user's ID
        localStorage.setItem("userDepartment", data.department); // Store user's department
  
        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Welcome Back!",
          text: `Hello, ${data.firstName}! \n Your role is ${data.accessLevel}!`,
          confirmButtonText: "Continue",
          background: "#f9f9f9", // Light background
          color: "#333", // Dark text color for contrast
          confirmButtonColor: "#0F1D9F", // Button color matching your theme
          customClass: {
            popup: "minimal-popup", // Add a custom class for further styling
          },
        }).then(() => {
          // Navigate based on user role after the alert is closed
          if (data.accessLevel === "ADMIN") {
            navigate("/home-1");
          } else if (data.accessLevel === "DEPARTMENT HEAD") {
            navigate("/dh-home-1");
          } else if (data.accessLevel === "CUSTODIAN") {
            navigate("/ctn-home-1");
          }
        });
      } else {
        setErrorMessage(data.message);
  
        // Show error alert
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: data.message || "Something went wrong. Please try again.",
          confirmButtonText: "Retry",
          background: "#fff5f5", // Light red background for error
          color: "#d32f2f", // Red text color
          confirmButtonColor: "#d32f2f", // Button color matching the error theme
          customClass: {
            popup: "minimal-popup", // Add a custom class for further styling
          },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again later.");
  
      // Show error alert for unexpected issues
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred. Please try again later.",
        confirmButtonText: "Okay",
      });
    }
  };
  
  

  return (
    <div className="login-container">
      {/* Left Section */}
      <div className="left-section">
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
        </div>
        <Typography variant="h6" className="system-title" style={{ fontSize: "1.7rem" }}>
          Property, Plant and Equipment <br /> Management System
        </Typography>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <Typography variant="h4" className="login-title" style={{ fontWeight: "bold" }}>
          LOG IN
        </Typography>
        <Typography variant="subtitle1" className="welcome-text">
          Welcome back!
        </Typography>
        <form className="login-form" onSubmit={handleLogin}>
          {/* Email Field */}
          <TextField
            label="Username*"
            placeholder="Enter your username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Password Field */}
          <TextField
            label="Password*"
            placeholder="Minimum 8 characters"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Error Message */}
          {errorMessage && <Typography color="error">{errorMessage}</Typography>}

          {/* Remember Me and Forgot Password */}
          <div className="form-options">
            <FormControlLabel
              control={<Checkbox style={{ color: "#0F1D9F" }} />}
              label="Remember me"
            />
            <Link
              href="#"
              className="forgot-password"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
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
              width: "25rem",
              padding: "15px",
              fontWeight: "bold",
              marginLeft: "15rem",
            }}
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
