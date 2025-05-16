<?php
// filepath: c:\Users\James Zymon Come\Documents\my-lgu-proj\backend\retrieve_users.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
$host = "localhost";
$user = "root";
$password = "";
$database = "lgu_db";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

$ids = $_GET['ids'] ?? '';

$sql = "SELECT ppe_entries.form_id, COUNT(*) AS quantity, item_table.serial_no, item_table.description, CONCAT( MIN(item_table.item_id), ' to ', MAX(item_table.item_id) ) AS propertyNo, item_table.date_acquisition, item_table.unit_price, (COUNT(*) * item_table.unit_price) AS total_price, ppe_entries.date AS datess FROM ppe_entries INNER JOIN item_table ON item_table.form_id = ppe_entries.form_id WHERE ppe_entries.form_id = '$ids' GROUP BY item_table.description, item_table.serial_no, item_table.unit_price, item_table.date_acquisition
";
$result = $conn->query($sql);

$data = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            'form_id' => $row['form_id'],
            'quantity' => $row['quantity'],
            'serial_no' => $row['serial_no'],
            'description' => $row['description'],
            'propertyNo' => $row['propertyNo'],
            'date_acquisition' => $row['date_acquisition'],
            'unit_price' => $row['unit_price'],
            'total_price' => $row['total_price'],
            'datess' => $row['datess'],
        ];
    }
    echo json_encode(["data" => $data]);
    
} else {
    echo json_encode(["data" => []]);
}

// Close connection
$conn->close();

?>