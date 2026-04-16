const state = {
  exercises: [],
  exerciseMap: new Map(),
  user: JSON.parse(localStorage.getItem('fitness_user') || 'null'),
  queue: JSON.parse(localStorage.getItem('fitness_queue') || '[]'),
};

const menuButton = document.getElementById('menuButton');
const drawer = document.getElementById('drawer');
const sections = [...document.querySelectorAll('main section')];
const syncStatus = document.getElementById('syncStatus');

menuButton.addEventListener('click', () => drawer.classList.toggle('hidden'));
drawer.addEventListener('click', (event) => {
  if (event.target.dataset.section) {
    showSection(event.target.dataset.section);
    drawer.classList.add('hidden');
  }
});

function showSection(id) {
  sections.forEach((s) => s.classList.toggle('hidden', s.id !== id));
}

async function loadExercises(query = '') {
  const res = await fetch(`../api/exercises.php?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  state.exercises = data.items || [];
  state.exerciseMap = new Map(state.exercises.map((e) => [e.title.toLowerCase(), e]));

  const list = document.getElementById('exerciseList');
  list.innerHTML = state.exercises.map((e) => `<option value="${e.title}"></option>`).join('');
}

document.getElementById('exerciseInput').addEventListener('input', async (e) => {
  if (e.target.value.length >= 2) {
    await loadExercises(e.target.value);
  }
});

document.getElementById('workoutForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const title = String(formData.get('exercise_title')).trim().toLowerCase();
  const exercise = state.exerciseMap.get(title);

  if (!exercise) {
    alert('Bitte Übung aus Vorschlägen wählen oder zuerst im Editor anlegen.');
    return;
  }

  const entry = {
    exercise_id: exercise.id,
    weight_kg: Number(formData.get('weight_kg')),
    reps: Number(formData.get('reps')),
    effort: formData.get('effort'),
    note: formData.get('note'),
    trained_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
  };

  state.queue.push(entry);
  localStorage.setItem('fitness_queue', JSON.stringify(state.queue));
  e.target.reset();
  syncStatus.textContent = `Offline gespeichert. Warteschlange: ${state.queue.length}`;
});

async function syncQueue() {
  if (!state.user?.id) {
    syncStatus.textContent = 'Bitte zuerst einloggen, damit synchronisiert werden kann.';
    return;
  }

  if (state.queue.length === 0) {
    syncStatus.textContent = 'Keine offenen Datensätze.';
    return;
  }

  try {
    const res = await fetch('../api/workouts.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: state.user.id, items: state.queue }),
    });
    const out = await res.json();

    if (out.ok) {
      state.queue = [];
      localStorage.setItem('fitness_queue', '[]');
      syncStatus.textContent = `Synchronisiert: ${out.inserted} Einträge.`;
    } else {
      syncStatus.textContent = 'Synchronisierung fehlgeschlagen.';
    }
  } catch {
    syncStatus.textContent = 'Offline: Synchronisierung wird später wiederholt.';
  }
}

document.getElementById('syncButton').addEventListener('click', syncQueue);
window.addEventListener('online', syncQueue);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

document.getElementById('profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!state.user?.id) {
    alert('Bitte zuerst einloggen, dann Profil speichern.');
    return;
  }

  const formData = new FormData(e.target);
  const payload = Object.fromEntries(formData.entries());
  payload.user_id = state.user.id;

  await fetch('../api/profile.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  alert('Profil gespeichert.');
});

document.getElementById('exerciseForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = Object.fromEntries(new FormData(e.target).entries());

  await fetch('../api/exercises.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  await loadExercises();
  e.target.reset();
  alert('Übung gespeichert.');
});

document.getElementById('programForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = Object.fromEntries(new FormData(e.target).entries());

  await fetch('../api/programs.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  e.target.reset();
  alert('Programm gespeichert.');
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = Object.fromEntries(new FormData(e.target).entries());
  const res = await fetch('../api/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const out = await res.json();
  const loginOutput = document.getElementById('loginOutput');
  if (!out.ok) {
    loginOutput.textContent = 'Login fehlgeschlagen.';
    return;
  }

  state.user = out.user;
  localStorage.setItem('fitness_user', JSON.stringify(out.user));
  loginOutput.textContent = `Eingeloggt als ${out.user.name}.`;

  const analytics = await fetch(`../api/analytics.php?user_id=${out.user.id}`).then((r) => r.json());
  document.getElementById('analyticsOutput').textContent = JSON.stringify(analytics, null, 2);
});

(async function init() {
  await loadExercises();
  if (!localStorage.getItem('fitness_profile_seen')) {
    showSection('profile');
    localStorage.setItem('fitness_profile_seen', '1');
  }
})();
