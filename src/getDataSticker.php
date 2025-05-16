<?php
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

$sql = "
WITH numbered_items AS (
  SELECT 
    item_table.item_id,
    ppe_entries.department,
    item_table.description,
    item_table.serial_no,
    item_table.unit_price,
    item_table.date_acquisition,
    ppe_entries.date AS original_date,
    users.role,
    users.lastname,
    users.firstname,
    users.middlename,
    users.department AS user_department,
    ROW_NUMBER() OVER (
      PARTITION BY item_table.description, item_table.form_id, item_table.serial_no 
      ORDER BY item_table.item_id
    ) AS row_num,
    COUNT(*) OVER (
      PARTITION BY item_table.description, item_table.form_id, item_table.serial_no 
    ) AS total_count
  FROM 
    ppe_entries
  INNER JOIN item_table ON item_table.form_id = ppe_entries.form_id
  INNER JOIN users ON users.user_id = ppe_entries.requested_by_id
  WHERE 
    ppe_entries.form_id = '$ids'
)

SELECT 
  ni.item_id,
  ni.department,
  ni.description,
  ni.serial_no,
  CONCAT(ni.row_num, ' of ', ni.total_count) AS quantity,
  ni.unit_price,
  ni.date_acquisition,
  COALESCE(latest_inspection.latest_date, ni.original_date) AS date,
  CASE 
    WHEN ni.role = 'DEPARTMENT HEAD' THEN (
      SELECT CONCAT(u.lastname, ', ', u.firstname, ' ', u.middlename)
      FROM users u
      WHERE u.role = 'CUSTODIAN' AND u.department = ni.user_department
      LIMIT 1
    )
    ELSE CONCAT(ni.lastname, ', ', ni.firstname, ' ', ni.middlename)
  END AS custodian_name
FROM 
  numbered_items ni
LEFT JOIN (
  SELECT entity_id, MAX(date) AS latest_date
  FROM inspection_table
  GROUP BY entity_id
) AS latest_inspection ON latest_inspection.entity_id = ni.item_id
";


$result = $conn->query($sql);

$data = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            'item_id' => $row['item_id'],
            'department' => $row['department'],
            'description' => $row['description'],
            'serial_no' => $row['serial_no'],
            'quantity' => $row['quantity'], // this is the "x of y" format
            'unit_price' => $row['unit_price'],
            'date_acquisition' => $row['date_acquisition'],
            'date' => $row['date'], // latest inspection or fallback to ppe_entries.date
            'custodian_name' => $row['custodian_name']
        ];
    }
    echo json_encode(["data" => $data]);
} else {
    echo json_encode(["data" => []]);
}

// echo json_encode(["data" => $requestId]);
?>