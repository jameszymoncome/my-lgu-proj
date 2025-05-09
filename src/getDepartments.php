<?php
// filepath: c:\Users\James Zymon Come\Documents\my-lgu-proj\src\getDepartments.php

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

// Query to fetch departments
$query = "SELECT `entity_id`, `entity_name`, `status` FROM `departmenttbl` WHERE 1";
$result = $conn->query($query);

if (!$result) {
    echo json_encode(["success" => false, "message" => "Error fetching departments: " . $conn->error]);
    exit();
}

$departments = [];
while ($row = $result->fetch_assoc()) {
    $departments[] = [
        "id" => $row["entity_id"],
        "name" => $row["entity_name"],
        "status" => $row["status"],
    ];
}

// Return the departments as JSON
echo json_encode(["success" => true, "departments" => $departments]);

$conn->close();
?>