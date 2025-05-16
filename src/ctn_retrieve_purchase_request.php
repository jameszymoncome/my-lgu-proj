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
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

// Get user_id from GET parameter
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

// 2. Get purchase requests for the department
$sql = "SELECT 
    pr.req_id, 
    pr.date, 
    CONCAT(u2.lastname, ', ', u2.firstname, ' ', u2.middlename) AS requestedBy, 
    u2.department, 
    SUM(pi.unit_price * pi.quantity) AS total_amount, 
    pr.status 
FROM 
    purch_request pr 
INNER JOIN 
    purch_item pi ON pr.req_id = pi.req_id 
INNER JOIN 
    users u1 ON u1.user_id = pr.process_by 
INNER JOIN 
    users u2 ON u2.user_id = pr.requested_by 
WHERE 
    u2.user_id = ?
GROUP BY 
    pr.req_id, pr.date, u2.lastname, u2.firstname, u2.middlename, u2.department, pr.status";

$stmt2 = $conn->prepare($sql);
$stmt2->bind_param("s", $user_id);
$stmt2->execute();
$result2 = $stmt2->get_result();

$data = [];

if ($result2->num_rows > 0) {
    while ($row = $result2->fetch_assoc()) {
        $data[] = [
            'req_id' => $row['req_id'],
            'date' => $row['date'],
            'requestedBy' => $row['requestedBy'],
            'department' => $row['department'],
            'total_amount' => $row['total_amount'],
            'status' => $row['status'],
        ];
    }
    echo json_encode(["data" => $data]);
} else {
    echo json_encode(["data" => []]);
}

// Close connection
$stmt2->close();
$conn->close();
?>