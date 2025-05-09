<?php
// filepath: c:\Users\James Zymon Come\Documents\my-lgu-proj\src\getRequestNo.php

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

// Generate unique Request No.
$year = date("Y");
$query = "SELECT COUNT(*) AS total FROM purch_request";
$res = $conn->query($query);

if (!$res) {
    echo json_encode(["success" => false, "message" => "Error fetching request count: " . $conn->error]);
    exit();
}

$row = $res->fetch_assoc();
$next_number = $row['total'] + 1;
$requestNo = "Request-$year-" . str_pad($next_number, 4, "0", STR_PAD_LEFT);

// Return the generated Request No.
echo json_encode(["success" => true, "requestNo" => $requestNo]);

$conn->close();
?>