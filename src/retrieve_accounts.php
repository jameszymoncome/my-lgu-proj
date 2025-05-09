<?php
// filepath: c:\Users\James Zymon Come\Documents\my-lgu-proj\backend\retrieve_accounts.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$host = "auth-db674.hstgr.io";
$user = "u792590767_zymon123";
$password = "Taetaeka123";
$database = "u792590767_lgu_db";

// Connect to the database
$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

// SQL query to fetch accounts
$sql = "SELECT user_id, lastname, firstname, middlename, role, department FROM users";

$result = $conn->query($sql);

if ($result === false) {
    echo json_encode(["success" => false, "message" => "Error fetching accounts"]);
    exit();
}

$accounts = [];
while ($row = $result->fetch_assoc()) {
    $accounts[] = $row;
}

// Return the accounts as JSON
echo json_encode(["success" => true, "data" => $accounts]);

$conn->close();
?>