<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'database.php';

header("Content-Type: application/json; charset=UTF-8");

$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (isset($data->username) && isset($data->password)) {
    if (isset($data->email)) {
        // Registration
        $query = "INSERT INTO users (username, email, password) VALUES (:username, :email, :password)";
        
        $stmt = $conn->prepare($query);
        
        $username = htmlspecialchars(strip_tags($data->username));
        $email = htmlspecialchars(strip_tags($data->email));
        $password = password_hash($data->password, PASSWORD_BCRYPT);
        
        $stmt->bindParam(":username", $username);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password", $password);
        
        try {
            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(array("message" => "User created successfully."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create user.", "error" => $stmt->errorInfo()));
            }
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) {
                http_response_code(409);
                echo json_encode(array("message" => "Username or email already exists."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create user.", "error" => $e->getMessage()));
            }
        }
    } else {
        // Login
        $query = "SELECT id, username, password FROM users WHERE username = :username";
        
        $stmt = $conn->prepare($query);
        
        $username = htmlspecialchars(strip_tags($data->username));
        $stmt->bindParam(":username", $username);
        
        $stmt->execute();
        
        $num = $stmt->rowCount();
        
        if ($num > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $id = $row['id'];
            $username = $row['username'];
            $password_hash = $row['password'];
            
            if (password_verify($data->password, $password_hash)) {
                http_response_code(200);
                echo json_encode(array(
                    "message" => "Login successful.",
                    "user" => array(
                        "id" => $id,
                        "username" => $username
                    )
                ));
            } else {
                http_response_code(401);
                echo json_encode(array("message" => "Login failed. Incorrect password."));
            }
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Login failed. User not found."));
        }
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data."));
}
?>
