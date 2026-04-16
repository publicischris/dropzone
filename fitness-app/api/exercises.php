<?php
require __DIR__ . '/db.php';
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $q = trim($_GET['q'] ?? '');
    if ($q === '') {
        $stmt = $pdo->query('SELECT id, title, description, media_image_url, media_video_url FROM exercises ORDER BY title ASC LIMIT 200');
    } else {
        $stmt = $pdo->prepare('SELECT id, title, description, media_image_url, media_video_url FROM exercises WHERE title LIKE ? ORDER BY title ASC LIMIT 50');
        $stmt->execute(["%{$q}%"]);
    }

    json_response(['items' => $stmt->fetchAll()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $in = body();
    if (empty($in['title'])) {
        json_response(['error' => 'title is required'], 422);
    }

    $stmt = $pdo->prepare('INSERT INTO exercises (title, description, media_image_url, media_video_url) VALUES (?, ?, ?, ?)');
    $stmt->execute([
        trim($in['title']),
        $in['description'] ?? null,
        $in['media_image_url'] ?? null,
        $in['media_video_url'] ?? null,
    ]);

    json_response(['ok' => true, 'id' => (int)$pdo->lastInsertId()], 201);
}

json_response(['error' => 'method not allowed'], 405);
