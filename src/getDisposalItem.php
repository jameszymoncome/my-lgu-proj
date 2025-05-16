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

$sql = "SELECT item_table.item_id, item_table.description, item_table.date_acquisition, item_table.unit_price, ppe_entries.department, inspection_table.status FROM ppe_entries INNER JOIN item_table ON item_table.form_id = ppe_entries.form_id INNER JOIN inspection_table ON inspection_table.entity_id = item_table.item_id WHERE inspection_table.status = 'Unserviceable'";
$result = $conn->query($sql);

$data = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            'item_id' => $row['item_id'],
            'description' => $row['description'],
            'date_acquisition' => $row['date_acquisition'],
            'unit_price' => $row['unit_price'],
            'department' => $row['department'],
            'status' => $row['status'],
        ];
    }
    echo json_encode(["data" => $data]);
} else {
    echo json_encode(["data" => []]);
}

// Close connection
$conn->close();

?>