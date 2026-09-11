const fs = require('fs');

const createPhpFile = (name, tableName, primaryKey, fields) => {
  const code = `<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM ${tableName}");
        $data = $stmt->fetchAll();
        echo json_encode(["status" => "success", "data" => $data]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    try {
        $fields = [${fields.map(f => `'${f}'`).join(', ')}];
        $insertFields = [];
        $placeholders = [];
        $params = [];
        foreach ($fields as $field) {
            if (isset($input[$field])) {
                $insertFields[] = $field;
                $placeholders[] = ":$field";
                $params[":$field"] = $input[$field];
            }
        }
        $sql = "INSERT INTO ${tableName} (" . implode(", ", $insertFields) . ") VALUES (" . implode(", ", $placeholders) . ")";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode(["status" => "success", "data" => ["id" => $pdo->lastInsertId()]]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['${primaryKey}'])) {
        echo json_encode(["status" => "error", "message" => "ID required"]);
        exit;
    }
    try {
        $updates = [];
        $params = [":id" => $input['${primaryKey}']];
        $fields = [${fields.map(f => `'${f}'`).join(', ')}];
        foreach ($fields as $field) {
            if (isset($input[$field])) {
                $updates[] = "$field = :$field";
                $params[":$field"] = $input[$field];
            }
        }
        $sql = "UPDATE ${tableName} SET " . implode(", ", $updates) . " WHERE ${primaryKey} = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode(["status" => "success"]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} elseif ($method === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['${primaryKey}'])) {
        echo json_encode(["status" => "error", "message" => "ID required"]);
        exit;
    }
    try {
        $stmt = $pdo->prepare("DELETE FROM ${tableName} WHERE ${primaryKey} = :id");
        $stmt->execute([":id" => $input['${primaryKey}']]);
        echo json_encode(["status" => "success"]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}
?>`;
  fs.writeFileSync(`C:/xampp/htdocs/merakiliving_backend/${name}.php`, code);
};

createPhpFile('api_coupons', 'coupons', 'coupon_id', ['code', 'discount_percentage', 'status']);
createPhpFile('api_gallery', 'gallery', 'image_id', ['image_url', 'category']);
createPhpFile('api_reviews', 'reviews', 'review_id', ['guest_name', 'rating', 'review_text', 'visibility']);
createPhpFile('api_settings', 'settings', 'setting_id', ['global_gst_percentage', 'contact_phone', 'contact_email', 'physical_address', 'privacy_policy_text', 'terms_conditions_text', 'cancellation_policy_text']);
createPhpFile('api_notifications', 'notifications', 'id', ['title', 'message']);

console.log("Created PHP files.");
