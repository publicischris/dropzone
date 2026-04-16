<?php
require __DIR__ . '/db.php';
$pdo = db();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'method not allowed'], 405);
}

$in = body();
$userId = (int)($in['user_id'] ?? 0);
$items = $in['items'] ?? [];

if ($userId <= 0 || !is_array($items)) {
    json_response(['error' => 'invalid payload'], 422);
}

$stmt = $pdo->prepare('INSERT INTO workout_entries (user_id, exercise_id, weight_kg, reps, effort, note, trained_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
$count = 0;

foreach ($items as $item) {
    $exerciseId = (int)($item['exercise_id'] ?? 0);
    if ($exerciseId <= 0) {
        continue;
    }

    $stmt->execute([
        $userId,
        $exerciseId,
        (float)($item['weight_kg'] ?? 0),
        (int)($item['reps'] ?? 0),
        $item['effort'] ?? 'ok',
        $item['note'] ?? null,
        $item['trained_at'] ?? date('Y-m-d H:i:s'),
    ]);
    $count++;
}

json_response(['ok' => true, 'inserted' => $count]);
