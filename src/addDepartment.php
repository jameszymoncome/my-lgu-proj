<?php
// filepath: c:\Users\James Zymon Come\Documents\my-lgu-proj\src\addDepartment.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
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

// Get the POST data
$data = json_decode(file_get_contents("php://input"), true);
$name = $data['name'] ?? '';
$status = $data['status'] ?? 'Active';

if (empty($name)) {
    echo json_encode(["success" => false, "message" => "Department name is required."]);
    exit();
}

// Insert the new department
$query = "INSERT INTO `departmenttbl` (`entity_name`, `status`) VALUES (?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("ss", $name, $status);

if ($stmt->execute()) {
    $departmentId = $stmt->insert_id;
    echo json_encode([
        "success" => true,
        "message" => "Department added successfully.",
        "department" => ["id" => $departmentId, "name" => $name, "status" => $status],
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Error adding department: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>