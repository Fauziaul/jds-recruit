<?php
require 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['nik']) || !isset($input['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'NIK and Password are required']);
        exit;
    }

    $nik = $input['nik'];
    $password = $input['password'];

    $validNik = "1304012111010001";
    $validPassword = "Password!";

    if ($nik !== $validNik || $password !== $validPassword) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        exit;
    }

    $role = "user"; 
    $payload = [
        'id' => 1,
        'nik' => $nik,
        'role' => $role,
        'iat' => time(),
        'exp' => time() + (60 * 60), 
    ];

    $jwtSecret = 'your_jwt_secret_key'; 
    $token = JWT::encode($payload, $jwtSecret, 'HS256');

    echo json_encode([
        'id' => $payload['id'],
        'nik' => $nik,
        'role' => $role,
        'access_token' => $token,
    ]);
}
