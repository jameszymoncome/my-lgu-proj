<?php
// filepath: c:\Users\James Zymon Come\Documents\my-lgu-proj\src\dh_department_home_details.php

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
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $conn->connect_error
    ]);
    exit;
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

// 2. Get total fixed assets for that department
$sql_assets = "
    SELECT COUNT(*) AS total_fixed_assets 
    FROM item_table 
    LEFT JOIN ppe_entries ON item_table.form_id = ppe_entries.form_id
    LEFT JOIN users ON ppe_entries.department = users.department
    WHERE users.user_id = ?
";
$stmt2 = $conn->prepare($sql_assets);
$stmt2->bind_param("s", $user_id);
$stmt2->execute();
$result2 = $stmt2->get_result();
$total_fixed_assets = 0;
if ($row2 = $result2->fetch_assoc()) {
    $total_fixed_assets = $row2['total_fixed_assets'];
}
$stmt2->close();

// 3. Get pending requests for the department
$sql_pending = "
    SELECT COUNT(*) AS pending_requests 
    FROM purch_request
    INNER JOIN users ON purch_request.process_by = users.user_id
    WHERE users.department = ? AND purch_request.status = 'Pending'
";
$stmt3 = $conn->prepare($sql_pending);
$stmt3->bind_param("s", $user_id);
$stmt3->execute();
$result3 = $stmt3->get_result();
$pending_requests = 0;
if ($row3 = $result3->fetch_assoc()) {
    $pending_requests = $row3['pending_requests'];
}
$stmt3->close();

echo json_encode([
    "success" => true,
    "department" => $department,
    "total_fixed_assets" => (int)$total_fixed_assets,
    "pending_requests" => (int)$pending_requests
]);

$conn->close();
?>