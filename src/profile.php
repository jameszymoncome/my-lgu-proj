<?php
// filepath: c:\Users\James Zymon Come\Documents\my-lgu-proj\src\profile.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
$host = "auth-db674.hstgr.io";
$user = "u792590767_zymon123";
$password = "Taetaeka123";
$database = "u792590767_lgu_db";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Get user_id from query parameters
$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(["success" => false, "message" => "User ID is required."]);
    exit();
}

// Fetch user profile data
$query = "SELECT lastname, firstname, middlename, suffix, email, contactNumber, username, role, department FROM users WHERE user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $profile = $result->fetch_assoc();
        echo json_encode(["success" => true, "data" => $profile]);
    } else {
        echo json_encode(["success" => false, "message" => "User not found."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Error fetching profile: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>