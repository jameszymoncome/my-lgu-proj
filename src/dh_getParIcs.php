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
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Get user_id from GET parameter (or use session/cookie as appropriate)
$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;

if (!$user_id) {
    echo json_encode([
        "success" => false,
        "message" => "No user_id provided."
    ]);
    exit;
}

// 1. Get department of the currently logged-in user
$sql_dept = "SELECT department FROM users WHERE id = ?";
$stmt = $conn->prepare($sql_dept);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$department = "";
if ($row = $result->fetch_assoc()) {
    $department = $row['department'];
} else {
    echo json_encode([
        "success" => false,
        "message" => "User not found."
    ]);
    exit;
}
$stmt->close();

$sql_assets = "
    SELECT ppe_entries.form_id, CONCAT(users.lastname, ', ', users.firstname, ' ', users.middlename) AS requestedby, users.department, ppe_entries.date 
    FROM ppe_entries 
    INNER JOIN users ON users.user_id = ppe_entries.requested_by_id
    WHERE users.department = ?;
";
$stmt2 = $conn->prepare($sql_assets);
$stmt2->bind_param("s", $department);
$stmt2->execute();
$result2 = $stmt2->get_result();

$data = [];

if ($result2->num_rows > 0) {
    while ($row = $result2->fetch_assoc()) {
        $data[] = [
            'form_id' => $row['form_id'],
            'requestedby' => $row['requestedby'],
            'department' => $row['department'],
            'date' => $row['date'],
        ];
    }
    echo json_encode(["data" => $data]);
} else {
    echo json_encode(["data" => []]);
}
$stmt2->close();

// Close connection
$conn->close();

?>