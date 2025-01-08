<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['nik']) || !isset($input['role'])) {
        http_response_code(400);
        echo json_encode(['error' => 'NIK and Role are required']);
        exit;
    }

    $nik = $input['nik'];
    $role = $input['role'];
    $password = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 6);

    echo json_encode([
        'nik' => $nik,
        'role' => $role,
        'password' => $password,
    ]);
}
