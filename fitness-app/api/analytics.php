<?php
require __DIR__ . '/db.php';
$pdo = db();

$userId = (int)($_GET['user_id'] ?? 0);
if ($userId <= 0) {
    json_response(['error' => 'user_id required'], 422);
}

$benchStmt = $pdo->prepare(
    "SELECT DATE(trained_at) AS day, MAX(weight_kg) AS max_weight
     FROM workout_entries we
     JOIN exercises e ON e.id = we.exercise_id
     WHERE we.user_id = ? AND LOWER(e.title) LIKE '%bench%'
     GROUP BY DATE(trained_at)
     ORDER BY day ASC"
);
$benchStmt->execute([$userId]);

$deadliftStmt = $pdo->prepare(
    "SELECT MAX(weight_kg) AS max_deadlift
     FROM workout_entries we
     JOIN exercises e ON e.id = we.exercise_id
     WHERE we.user_id = ? AND LOWER(e.title) LIKE '%deadlift%'"
);
$deadliftStmt->execute([$userId]);

$weekdayStmt = $pdo->prepare(
    "SELECT DAYNAME(trained_at) AS weekday, AVG(weight_kg * reps) AS avg_volume
     FROM workout_entries
     WHERE user_id = ?
     GROUP BY DAYOFWEEK(trained_at)
     ORDER BY avg_volume DESC
     LIMIT 1"
);
$weekdayStmt->execute([$userId]);

json_response([
    'bench_development' => $benchStmt->fetchAll(),
    'max_deadlift' => $deadliftStmt->fetch()['max_deadlift'] ?? null,
    'best_weekday' => $weekdayStmt->fetch() ?: null,
]);
