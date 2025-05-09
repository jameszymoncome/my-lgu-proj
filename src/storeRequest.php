<?php
// filepath: c:\Users\James Zymon Come\Documents\my-lgu-proj\src\storeRequest.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Accept only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Only POST requests allowed."]);
    exit();
}

// Get posted data
$data = json_decode(file_get_contents("php://input"), true);
$items = $data['items'] ?? [];
$purpose = $data['purpose'] ?? "";
$userRoles = $data['userRoles'] ?? "";
$userLogRole = $data['userLogRole'] ?? "";
$userId = $data['userId'] ?? "";
$requestNo = $data['requestNo'] ?? ""; // Request No. from the frontend

if (empty($purpose)) {
    echo json_encode(["success" => false, "message" => "Purpose is required."]);
    exit();
}

// Check if the Request No. already exists
$query = "SELECT COUNT(*) AS total FROM purch_request WHERE req_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $requestNo);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if ($row['total'] > 0) {
    echo json_encode(["success" => false, "message" => "Request No. already exists."]);
    exit();
}

// Insert the purchase request
$status = ($userLogRole === "ADMIN") ? "Approved" : "Pending";
$sql = "INSERT INTO purch_request (req_id, purpose, status, procces_by) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $requestNo, $purpose, $status, $userId);

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Error inserting purchase request: " . $stmt->error]);
    exit();
}

// Insert the items associated with the request
foreach ($items as $item) {
    $description = $conn->real_escape_string($item['description'] ?? '');
    $quantity = (int)($item['quantity'] ?? 0);
    $unit_price = (float)($item['unitPrice'] ?? 0);

    if ($description !== '' && $quantity > 0) {
        $sql1 = "INSERT INTO purch_item (req_id, quantity, description, unit_price) 
                 VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql1);
        $stmt->bind_param("sids", $requestNo, $quantity, $description, $unit_price);

        if (!$stmt->execute()) {
            echo json_encode(["success" => false, "message" => "Error inserting purchase item: " . $stmt->error]);
            exit();
        }
    }
}

// Return success response with the generated request ID
echo json_encode(["success" => true, "custom_id" => $requestNo]);

$conn->close();
?>