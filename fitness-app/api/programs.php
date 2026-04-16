<?php
require __DIR__ . '/db.php';
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query('SELECT id, title, goal, description FROM programs ORDER BY created_at DESC LIMIT 200');
    json_response(['items' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $in = body();
    if (empty($in['title'])) {
        json_response(['error' => 'title is required'], 422);
    }

    $stmt = $pdo->prepare('INSERT INTO programs (title, goal, description) VALUES (?, ?, ?)');
    $stmt->execute([
        trim($in['title']),
        $in['goal'] ?? 'other',
        $in['description'] ?? null,
    ]);

    json_response(['ok' => true, 'id' => (int)$pdo->lastInsertId()], 201);
}

json_response(['error' => 'method not allowed'], 405);
