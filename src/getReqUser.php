<?php
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow specific HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow specific headers

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database connection and logic below
$host = 'localhost'; // Database host
$dbname = 'lgu_db'; // Replace with your database name
$username = 'root'; // Replace with your database username
$password = ''; // Replace with your database password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['requestedName'])) {
    $requestedName = $data['requestedName'];

    $response = [
        "success" => true,
        "message" => "Received requested name: $requestedName",
    ];
} else {
    $response = [
        "success" => false,
        "message" => "No requested name provided.",
    ];
}

echo json_encode($response);
?>