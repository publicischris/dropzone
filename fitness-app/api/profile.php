<?php
require __DIR__ . '/db.php';
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'method not allowed'], 405);
}

$in = body();
$userId = (int)($in['user_id'] ?? 0);

if ($userId <= 0 || empty($in['display_name'])) {
    json_response(['error' => 'missing values'], 422);
}

$stmt = $pdo->prepare(
    'INSERT INTO user_profiles (user_id, display_name, gender, age)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), gender = VALUES(gender), age = VALUES(age)'
);
$stmt->execute([
    $userId,
    trim($in['display_name']),
    $in['gender'] ?? 'unknown',
    isset($in['age']) ? (int)$in['age'] : null,
]);

json_response(['ok' => true]);
