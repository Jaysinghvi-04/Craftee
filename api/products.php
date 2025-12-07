<?php
require_once 'database.php';

header("Content-Type: application/json; charset=UTF-8");

$database = new Database();
$conn = $database->getConnection();

if (isset($_GET['id'])) {
    // Get single product
    $query = "SELECT id, name, description, price, image FROM Products WHERE id = :id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":id", $_GET['id']);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        extract($row);
        $product_item = array(
            "id" => $id,
            "name" => $name,
            "description" => html_entity_decode($description),
            "price" => $price,
            "image" => $image
        );
        http_response_code(200);
        echo json_encode($product_item);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "Product not found."));
    }
} else {
    // Get all products
    $query = "SELECT id, name, description, price, image FROM Products";
    $stmt = $conn->prepare($query);
    $stmt->execute();

    $num = $stmt->rowCount();

    if ($num > 0) {
        $products_arr = array();
        $products_arr["records"] = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $product_item = array(
                "id" => $id,
                "name" => $name,
                "description" => html_entity_decode($description),
                "price" => $price,
                "image" => $image
            );
            array_push($products_arr["records"], $product_item);
        }

        http_response_code(200);
        echo json_encode($products_arr);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "No products found."));
    }
}
?>