<?php
// filepath: c:\Users\James Zymon Come\Documents\my-lgu-proj\backend\retrieve_users.php

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
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

// Retrieve query parameters
$roles = isset($_GET['role']) ? explode(",", $_GET['role']) : [];
$search = isset($_GET['search']) ? $_GET['search'] : "";
$department = isset($_GET['department']) ? $_GET['department'] : "";

// Validate roles parameter
if (empty($roles)) {
    echo json_encode(["success" => false, "message" => "Invalid roles parameter"]);
    exit();
}

// Build the SQL query
$query = "
    SELECT user_id, CONCAT(lastname, ', ', firstname, ' ', middlename) AS full_name, department
    FROM users
    WHERE role IN ('" . implode("','", $roles) . "') 
    AND CONCAT(lastname, ' ', firstname, ' ', middlename) LIKE ?
    " . ($department ? "AND department = ?" : "") . "
";

$stmt = $conn->prepare($query);
if ($department) {
    $searchParam = "%$search%";
    $stmt->bind_param("ss", $searchParam, $department);
} else {
    $searchParam = "%$search%";
    $stmt->bind_param("s", $searchParam);
}

$stmt->execute();
$result = $stmt->get_result();

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

// Return the users as JSON
echo json_encode(["success" => true, "data" => $users]);

$conn->close();
?>