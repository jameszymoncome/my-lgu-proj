<?php
// filepath: c:\Users\James Zymon Come\Documents\my-lgu-proj\src\inspection_scanner.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
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

// Handle GET requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['action'])) {
        $action = $_GET['action'];

        // Fetch all scanned items
        if ($action === 'item-scanned' && isset($_GET['id'])) {
            $id = $_GET['id'];
            $sql = "
                SELECT
                    COALESCE(par.property_id, ics.inventory_id) AS itemIds,
                    ppe_entries.form_id,
                    ppe_entries.description,
                    ppe_entries.quantity
                FROM
                    ppe_entries
                LEFT JOIN
                    par ON par.PAR_id = ppe_entries.form_id
                LEFT JOIN
                    ics ON ics.ICS_id = ppe_entries.form_id
                WHERE
                    COALESCE(par.property_id, ics.inventory_id) = ?
            ";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $data = $result->fetch_assoc();
                echo json_encode(["success" => true, "data" => $data]);
            } else {
                echo json_encode(["success" => false, "message" => "No PPE entry found."]);
            }
            $stmt->close();
        }

        // Fetch backup data
        elseif ($action === 'item-check') {
            $sql = "SELECT item_id FROM backupinspection";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $itemIds = [];
                while ($row = $result->fetch_assoc()) {
                    $itemIds[] = $row['item_id'];
                }

                $data = [];
                foreach ($itemIds as $itemId) {
                    $sql2 = "
                        SELECT
                            COALESCE(par.property_id, ics.inventory_id) AS itemIds,
                            ppe_entries.form_id,
                            ppe_entries.description,
                            ppe_entries.quantity,
                            backupinspection.status
                        FROM
                            ppe_entries
                        LEFT JOIN
                            par ON par.PAR_id = ppe_entries.form_id
                        LEFT JOIN
                            ics ON ics.ICS_id = ppe_entries.form_id
                        LEFT JOIN
                            backupinspection ON backupinspection.item_id = COALESCE(ics.inventory_id, par.property_id)
                        WHERE
                            COALESCE(par.property_id, ics.inventory_id) = ?
                    ";

                    $stmt = $conn->prepare($sql2);
                    $stmt->bind_param("s", $itemId);
                    $stmt->execute();
                    $result2 = $stmt->get_result();

                    if ($result2->num_rows > 0) {
                        $data[] = $result2->fetch_assoc();
                    }
                    $stmt->close();
                }

                echo json_encode(["success" => true, "data" => $data]);
            } else {
                echo json_encode(["success" => false, "message" => "No backup data found."]);
            }
        }
    }
}

// Handle POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Save to backup
    if (isset($_POST['action']) && $_POST['action'] === 'save-backup') {
        $itemId = $_POST['item_id'];
        $date = $_POST['date'];
        $time = $_POST['time'];
        $status = $_POST['status'];

        // Check if the item already exists in the backup
        $sql = "SELECT * FROM backupinspection WHERE item_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $itemId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Update the existing backup entry
            $sql2 = "UPDATE backupinspection SET status = ?, date = ?, time = ? WHERE item_id = ?";
            $stmt2 = $conn->prepare($sql2);
            $stmt2->bind_param("ssss", $status, $date, $time, $itemId);
            if ($stmt2->execute()) {
                echo json_encode(["success" => true, "message" => "Backup updated successfully."]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to update backup."]);
            }
            $stmt2->close();
        } else {
            // Insert a new backup entry
            $sql3 = "INSERT INTO backupinspection (item_id, date, time, status) VALUES (?, ?, ?, ?)";
            $stmt3 = $conn->prepare($sql3);
            $stmt3->bind_param("ssss", $itemId, $date, $time, $status);
            if ($stmt3->execute()) {
                echo json_encode(["success" => true, "message" => "Backup saved successfully."]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to save backup."]);
            }
            $stmt3->close();
        }
        $stmt->close();
    }
}

// Handle DELETE requests
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $data);
    $itemId = $data['id'] ?? null;

    if ($itemId) {
        $sql = "DELETE FROM backupinspection WHERE item_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $itemId);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Item deleted successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to delete item."]);
        }

        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Item ID is required."]);
    }
}

$conn->close();
?>