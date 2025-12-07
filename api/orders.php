<?php
require_once 'database.php';

header("Content-Type: application/json; charset=UTF-8");

$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (isset($data->user_id) && isset($data->total) && isset($data->items)) {
    $conn->beginTransaction();

    try {
        // Insert into Orders table
        $query = "INSERT INTO Orders (user_id, total) VALUES (:user_id, :total)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":user_id", $data->user_id);
        $stmt->bindParam(":total", $data->total);
        $stmt->execute();
        $order_id = $conn->lastInsertId();

        // Insert into Order_Items table
        $query = "INSERT INTO Order_Items (order_id, product_id, quantity, price) VALUES (:order_id, :product_id, :quantity, :price)";
        $stmt = $conn->prepare($query);

        foreach ($data->items as $item) {
            $stmt->bindParam(":order_id", $order_id);
            $stmt->bindParam(":product_id", $item->id);
            $stmt->bindParam(":quantity", $item->quantity);
            $stmt->bindParam(":price", $item->price);
            $stmt->execute();
        }

        $conn->commit();

        http_response_code(201);
        echo json_encode(array("message" => "Order created successfully."));

    } catch (Exception $e) {
        $conn->rollBack();
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create order.", "error" => $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data."));
}
?>
