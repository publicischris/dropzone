<?php
require __DIR__ . '/db.php';
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'method not allowed'], 405);
}

$in = body();
$email = trim($in['email'] ?? '');
$password = $in['password'] ?? '';

$stmt = $pdo->prepare('SELECT id, name, email, password_hash, gender, age, city, country, studio, role FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    json_response(['error' => 'invalid credentials'], 401);
}

unset($user['password_hash']);
json_response(['ok' => true, 'user' => $user]);
