<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

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

// DB connection
$conn = new mysqli("localhost", "root", "", "lgu_db");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed."]);
    exit();
}

// Get posted data
$data = json_decode(file_get_contents("php://input"), true);
$items = $data['items'] ?? [];
$purpose = $data['purpose'] ?? "";
$userRoles = $data['userRoles'] ?? "";
$userLogRole = $data['userLogRole'] ?? "";
$userId = $data['userId'] ?? "";

if (empty($purpose)) {
    echo json_encode(["success" => false, "message" => "Purpose is required."]);
    exit();
}

// Generate unique request ID
$year = date("Y");
$query = "SELECT COUNT(*) AS total FROM purch_request WHERE req_id LIKE 'Request-$year-%'";
$res = $conn->query($query);
$row = $res->fetch_assoc();
$next_number = $row['total'] + 1;
$req_id = "Request-$year-$next_number";

// Insert only once
if ($userLogRole === "ADMIN"){
    $sql = "INSERT INTO purch_request (req_id, purpose, status, procces_by) VALUES ('$req_id', '$purpose', 'Approved', '$userId')";
    $conn->query($sql);
}
else{
    $sql3 = "INSERT INTO purch_request (req_id, purpose, status, procces_by) VALUES ('$req_id', '$purpose', 'Pending', '$userId')";
    $conn->query($sql3);
}
    

foreach ($items as $item) {
    $description = $conn->real_escape_string($item['description'] ?? '');
    $quantity = (int)($item['quantity'] ?? 0);
    $unit_price = (float)($item['unitPrice'] ?? 0);

    if ($description !== '' && $quantity > 0) {
        $sql1 = "INSERT INTO purch_item (req_id, quantity, description, unit_price) 
                 VALUES ('$req_id', $quantity, '$description', $unit_price)";
        $conn->query($sql1);
    }
}

echo json_encode(["success" => true, "custom_id" => $req_id]);

$conn->close();
?>