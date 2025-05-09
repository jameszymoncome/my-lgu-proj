<?php
// filepath: c:\Users\James Zymon Come\Documents\my-lgu-proj\src\deleteDepartment.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
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

// Get the department ID from the query string
parse_str(file_get_contents("php://input"), $data);
$departmentId = $data['id'] ?? null;

if (!$departmentId) {
    echo json_encode(["success" => false, "message" => "Department ID is required."]);
    exit();
}

// Query to deactivate the department (set status to 'Inactive')
$query = "UPDATE `departmenttbl` SET `status` = 'Inactive' WHERE `entity_id` = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $departmentId);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Department deactivated successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "No department found with the given ID."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Error deactivating department: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>