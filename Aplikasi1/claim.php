// private-data.php
<?php
require 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header('Content-Type: application/json');

$jwtSecret = getenv('JWT_KEY_SECRET');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!$authHeader || substr($authHeader, 0, 7) !== 'Bearer ') {
        http_response_code(401);
        echo json_encode(['error' => 'Token is required']);
        exit;
    }

    $token = str_replace('Bearer ', '', $authHeader);

    try {
        $decoded = JWT::decode($token, new Key($jwtSecret, 'HS256'));

        echo json_encode([
            'message' => 'Private claim data retrieved successfully',
            'data' => $decoded,
        ]);
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired token']);
    }
}
