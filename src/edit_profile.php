<?php
// filepath: c:\Users\James Zymon Come\Documents\my-lgu-proj\src\edit_profile.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
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

// Get the PUT data
$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(["success" => false, "message" => "User ID is required."]);
    exit();
}

$lastname = $data['lastname'] ?? '';
$firstname = $data['firstname'] ?? '';
$middlename = $data['middlename'] ?? '';
$suffix = $data['suffix'] ?? '';
$email = $data['email'] ?? '';
$contactNumber = $data['contactNumber'] ?? '';
$username = $data['username'] ?? '';
$role = $data['role'] ?? '';
$department = $data['department'] ?? '';

// Validate required fields
if (empty($lastname) || empty($firstname) || empty($email) || empty($username)) {
    echo json_encode(["success" => false, "message" => "All required fields must be filled."]);
    exit();
}

// Update user profile data
$query = "UPDATE users SET lastname = ?, firstname = ?, middlename = ?, suffix = ?, email = ?, contactNumber = ?, username = ?, role = ?, department = ? WHERE user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("sssssssssi", $lastname, $firstname, $middlename, $suffix, $email, $contactNumber, $username, $role, $department, $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Profile updated successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating profile: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>