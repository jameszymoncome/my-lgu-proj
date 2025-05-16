<?php
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

// Query 1: Total Fixed Assets
$sql1 = "SELECT COUNT(*) AS total_fixed_assets FROM item_table";
$result1 = $conn->query($sql1);
$total_fixed_assets = $result1 ? $result1->fetch_assoc()['total_fixed_assets'] : 0;

// Query 2: Total Departments
$sql2 = "SELECT COUNT(*) AS total_department FROM departmenttbl";
$result2 = $conn->query($sql2);
$total_department = $result2 ? $result2->fetch_assoc()['total_department'] : 0;

// Query 3: Pending Requests
$sql3 = "SELECT COUNT(*) AS pending_requests FROM purch_request WHERE status = 'Pending'";
$result3 = $conn->query($sql3);
$pending_requests = $result3 ? $result3->fetch_assoc()['pending_requests'] : 0;

echo json_encode([
    "success" => true,
    "total_fixed_assets" => (int)$total_fixed_assets,
    "total_department" => (int)$total_department,
    "pending_requests" => (int)$pending_requests
]);

$conn->close();
?>