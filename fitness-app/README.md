# Fitness-App (PWA) – PHP + MySQL/MariaDB

Diese Referenz-Implementierung deckt deinen gewünschten Funktionsumfang als MVP ab:

- **PWA-Frontend** mit „Zum Home-Bildschirm hinzufügen“ (Manifest + Service Worker).
- **Training erfassen** mit Übungsauswahl via Eingabefeld + Autovervollständigung (`datalist`), Gewicht, Wiederholungen, Einschätzung und Notiz.
- **Burger-Menü** oben rechts für Auswertungen, Training, Profil, Programme, Editor und Login.
- **Offline-Speicherung** im `localStorage` plus manuelle/automatische Synchronisierung bei Online-Status.
- **Backend in PHP** mit Endpunkten für Übungen, Programme, Profile, Login, Workouts und Analytics.
- **MySQL/MariaDB-Schema** für Nutzer, Übungen, Programme und Workout-Einträge.

## Start

1. Datenbank anlegen und `schema.sql` importieren.
2. DB-Zugang via Environment setzen (`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`).
3. Projekt im Webserver bereitstellen, z. B.:

```bash
php -S localhost:8080 -t fitness-app/public
```

> Hinweis: API und Frontend liegen im selben Projekt. Für Produktion solltest du Auth, Rollen, Validierung, Rate-Limits und CSRF/JWT sauber ergänzen.
