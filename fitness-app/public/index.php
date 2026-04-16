<?php
?><!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#101418">
  <title>Fitness Log</title>
  <link rel="manifest" href="manifest.webmanifest">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="topbar">
    <h1>Fitness Log</h1>
    <button id="menuButton" class="burger" aria-label="Menü öffnen">☰</button>
  </header>

  <nav id="drawer" class="drawer hidden">
    <button data-section="analytics">Auswertungen</button>
    <button data-section="training">Training erfassen</button>
    <button data-section="profile">Profil</button>
    <button data-section="programs">Programme</button>
    <button data-section="editor">Editor-Backend</button>
    <button data-section="login">Login</button>
  </nav>

  <main>
    <section id="profile" class="card hidden">
      <h2>Ersteinrichtung</h2>
      <form id="profileForm">
        <label>Name <input name="display_name" required></label>
        <label>Geschlecht
          <select name="gender">
            <option value="unknown">Keine Angabe</option>
            <option value="male">Männlich</option>
            <option value="female">Weiblich</option>
            <option value="diverse">Divers</option>
          </select>
        </label>
        <label>Alter <input type="number" name="age" min="1" max="120"></label>
        <button type="submit">Speichern</button>
      </form>
    </section>

    <section id="training" class="card">
      <h2>Training erfassen</h2>
      <form id="workoutForm">
        <label>Übung
          <input list="exerciseList" name="exercise_title" id="exerciseInput" placeholder="z.B. Bench Press" required>
          <datalist id="exerciseList"></datalist>
        </label>
        <label>Gewicht (kg) <input type="number" step="0.5" name="weight_kg" required></label>
        <label>Wiederholungen <input type="number" name="reps" required></label>
        <label>Einschätzung
          <select name="effort" required>
            <option value="easy">Fiel leicht</option>
            <option value="ok">War ok</option>
            <option value="hard">War schwer</option>
            <option value="too_hard">Zu schwer</option>
          </select>
        </label>
        <label>Notiz
          <textarea name="note" rows="3" placeholder="Heute Fokus auf Technik"></textarea>
        </label>
        <button type="submit">Speichern (offlinefähig)</button>
      </form>
      <button id="syncButton" class="secondary">Jetzt synchronisieren</button>
      <p id="syncStatus"></p>
    </section>

    <section id="analytics" class="card hidden">
      <h2>Auswertungen</h2>
      <pre id="analyticsOutput">Noch keine Daten geladen.</pre>
    </section>

    <section id="programs" class="card hidden">
      <h2>Programme</h2>
      <form id="programForm">
        <label>Titel <input name="title" required></label>
        <label>Ziel
          <select name="goal">
            <option value="hypertrophy">Hypertrophie</option>
            <option value="max_strength">Maximalkraft</option>
            <option value="fat_loss">Fettverlust</option>
            <option value="conditioning">Conditioning</option>
            <option value="other">Sonstiges</option>
          </select>
        </label>
        <label>Beschreibung <textarea name="description" rows="3"></textarea></label>
        <button type="submit">Programm speichern</button>
      </form>
    </section>

    <section id="editor" class="card hidden">
      <h2>Übung anlegen (Editor)</h2>
      <form id="exerciseForm">
        <label>Titel <input name="title" required></label>
        <label>Beschreibung <textarea name="description" rows="3"></textarea></label>
        <label>Bild-URL <input name="media_image_url"></label>
        <label>Video-URL <input name="media_video_url"></label>
        <button type="submit">Übung speichern</button>
      </form>
    </section>

    <section id="login" class="card hidden">
      <h2>Login & Vergleich</h2>
      <form id="loginForm">
        <label>E-Mail <input type="email" name="email" required></label>
        <label>Passwort <input type="password" name="password" required></label>
        <button type="submit">Einloggen</button>
      </form>
      <pre id="loginOutput"></pre>
    </section>
  </main>

  <script src="app.js" defer></script>
</body>
</html>
