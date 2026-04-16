window.presentationConfig = {
  meta: {
    title: "🧠 MIND – Mentale Klarheit & Fokus",
    description: "Workshop-Deck: Mentale Klarheit & Fokus – Ziele, Tools, Transfer.",
    date: "auto",
    locale: "de-DE",
    timezone: "Europe/Berlin"
  },
  brand: {
    name: "Zeit für Stärke GbR",
    showOnSlides: true,
    logo: {
      alt: "Zeit für Stärke Logo",
      src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%2300B5D8'/><stop offset='100%' stop-color='%237DF9B9'/></linearGradient></defs><rect width='120' height='120' rx='28' fill='%23081426'/><path d='M38 83c0-19 12-31 22-42l4-5c4-4 5-9 5-14 0-9-6-16-17-16-11 0-18 7-18 17h-13c0-18 13-30 31-30 18 0 31 11 31 28 0 11-5 19-12 27l-5 5c-8 9-16 17-16 30H38z' fill='url(%23g)'/></svg>"
    }
  },
  theme: {
    fonts: {
      heading: "'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif",
      body: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"
    },
    colors: {
      background: "#0b1020",
      surface: "#1d2a44",
      text: "#e6edf7",
      muted: "#94a3b8",
      primary: "#5bbad5",
      secondary: "#2f4368",
      accent: "#7df9b9",
      link: "#7dd3fc",
      hover: "#bae6fd",
      ok: "#22c55e",
      warn: "#f97316",
      danger: "#ef4444"
    },
    typography: {
      h1: { size: 88, weight: 800 },
      h2: { size: 46, weight: 700 },
      h3: { size: 30, weight: 700 },
      h4: { size: 22, weight: 700 },
      body: { size: 22, weight: 400 },
      small: { size: 16, weight: 500 },
      statLabel: { size: 18, weight: 600 },
      statValue: { size: 68, weight: 800 },
      statUnit: { size: 26, weight: 600 }
    }
  },
  toolbar: {
    filename: "MIND_Mentale-Klarheit-und-Fokus.html",
    showFullscreen: true,
    showExport: true,
    showPrint: true
  },
  help: {
    show: true,
    text: "Tasten: <span class=\"kbd\">←</span>/<span class=\"kbd\">→</span> · <span class=\"kbd\">f</span> Vollbild · <span class=\"kbd\">p</span> PDF · <span class=\"kbd\">e</span> Export"
  },
  footer: {
    left: "© <strong>Zeit für Stärke GbR</strong> – <span class=\"date\"></span>",
    right: "Seite {current}/{total}"
  },
  slides: [
    {
      type: "cover",
      ariaLabel: "Titel",
      tag: "Workshop-Deck",
      title: "🧠 <span class=\"primary\">MIND</span> – Mentale Klarheit & Fokus",
      subtitle: "Ziele: klar denken · Prioritäten setzen · Stress managen · Entscheidungen stärken",
      stats: [
        { "label": "Dauer", "value": "90", "unit": "Min" },
        { "label": "Teilnahme", "text": "aktiv · interaktiv · praxisnah" },
        { "label": "Ergebnis", "text": "Persönlicher Fokus-Plan in 3 Schritten" }
      ]
    },
    {
      type: "content",
      title: "Agenda · 90 Minuten",
      ariaLabel: "Agenda & Zeitplan",
      blocks: [
        {
          type: "grid",
          columns: 2,
          cards: [
            {
              title: "Teil 1 · Fundament (0–25')",
              list: {
                style: "check",
                items: [
                  "Mentale Klarheit: Begriffe & Prinzipien",
                  "Stresskompetenz & Resilienz: Muster erkennen",
                  "Tool-Kit: Achtsamkeit, Atem, Micro-Breaks"
                ]
              }
            },
            {
              title: "Teil 2 · Fokussiert arbeiten (25'–60')",
              list: {
                style: "check",
                items: [
                  "Mental Load vs. Produktivität",
                  "Deep Work & digitale Achtsamkeit",
                  "Übung: 6-Min Fokus-Sprint"
                ]
              }
            },
            {
              title: "Teil 3 · Zusammenarbeit (60'–80')",
              list: {
                style: "check",
                items: [
                  "Psychologische Sicherheit verstehen",
                  "Führung als Raumöffner: Leitfragen",
                  "Team-Rituale für Fokus"
                ]
              }
            },
            {
              title: "Transfer (80'–90')",
              list: {
                style: "check",
                items: [
                  "Ihr 3-Schritte Fokus-Plan",
                  "Nächste 72 Stunden: 1 Commitment"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      type: "content",
      title: "Was ist <span class=\"primary\">mentale Klarheit</span>?",
      ariaLabel: "Mentale Klarheit: Definition",
      blocks: [
        {
          type: "grid",
          columns: 2,
          cards: [
            {
              variant: "highlight",
              html: "<p><strong>Klarheit</strong> ist die Fähigkeit, Reize zu ordnen, Wichtiges von Dringendem zu unterscheiden und handlungsfähig zu bleiben.</p>",
              list: {
                style: "check",
                items: [
                  "Fokus statt Overload",
                  "Bewusste Prioritäten",
                  "Ruhige, schnelle Entscheidungen"
                ]
              }
            },
            {
              title: "Störfelder",
              list: {
                items: [
                  "Multitasking & ständige Unterbrechungen",
                  "Informationsflut & unklare Ziele",
                  "Innerer Kritiker & Perfektionismus"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      type: "content",
      title: "Stresskompetenz & Resilienz",
      blocks: [
        {
          type: "grid",
          columns: 3,
          cards: [
            {
              title: "Erkennen",
              list: {
                items: [
                  "Persönliche Stressmuster & Trigger",
                  "Körperliche Signale (z. B. Atem, Spannung)",
                  "Denkfallen (Alles-oder-Nichts, Katastrophisieren)"
                ]
              }
            },
            {
              title: "Regulieren",
              list: {
                items: [
                  "Achtsamkeits-Minipausen (60–120 s)",
                  "Box Breathing 4–4–4–4",
                  "Micro-Breaks mit Bewegung & Blickwechsel"
                ]
              }
            },
            {
              title: "Reflektieren",
              list: {
                items: [
                  "Was liegt in meinem Einfluss?",
                  "Neubewertung: „Was wäre hilfreicher?“",
                  "Peer-Support: 5-Min Check-in"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      type: "content",
      title: "🫁 3‑Min <span class=\"accent\">Atem-Reset</span>",
      ariaLabel: "Übung: Atem & Reset",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "Aufrecht sitzen, Füße am Boden. Schultern lösen.",
            "4 Sek. ein · 4 Sek. halten · 4 Sek. aus · 4 Sek. halten (3 Runden)",
            "Blick 10 Sek. in die Ferne · dann zum Notizpunkt zurück."
          ]
        },
        {
          type: "text",
          text: "Ziel: Nervensystem beruhigen, kognitive Bandbreite zurückholen.",
          muted: true
        }
      ]
    },
    {
      type: "content",
      title: "Mental Load <span class=\"muted\">vs.</span> Produktivität",
      blocks: [
        {
          type: "grid",
          columns: 2,
          cards: [
            {
              title: "Wenn es kippt",
              variant: "ghost",
              list: {
                style: "cross",
                items: [
                  "Ständige Gedankenschleifen",
                  "Ad-hoc-Arbeit verdrängt Fokus",
                  "Entscheidungen werden vertagt"
                ]
              }
            },
            {
              title: "Entlasten",
              list: {
                style: "check",
                items: [
                  "Brain Dump (5 Min) → <em>Externalisieren</em>",
                  "WIP-Limits (max. 3 parallele Tasks)",
                  "„Sagen statt Sammeln“: Delegation & klare Absprachen"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      type: "content",
      title: "Methoden zur <span class=\"accent\">mentalen Entlastung</span>",
      blocks: [
        {
          type: "grid",
          columns: 3,
          cards: [
            {
              title: "Externalisieren",
              list: {
                style: "check",
                items: [
                  "Capture-Tool (Notiz/App) definieren",
                  "Daily 2×: „Alles raus“ (3–5 Min)",
                  "Parkplatz für Ideen & Sorgen"
                ]
              }
            },
            {
              title: "Ordnen",
              list: {
                style: "check",
                items: [
                  "Kanban: To‑Do / In Arbeit / Erledigt",
                  "Nächste Aktion statt „Projekt“",
                  "Termine/Deadlines sofort eintragen"
                ]
              }
            },
            {
              title: "Begrenzen",
              list: {
                style: "check",
                items: [
                  "Benachrichtigungen bündeln (2–3 Slots/Tag)",
                  "„Nicht jetzt“-Liste",
                  "Office-Hours für Anfragen"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      type: "content",
      title: "Fokus & Zeitmanagement <span class=\"muted\">neu gedacht</span>",
      blocks: [
        {
          type: "grid",
          columns: 2,
          cards: [
            {
              title: "Prinzip",
              html: "<p>Nicht <em>mehr schaffen</em>, sondern <strong>sinnvoll arbeiten</strong>.</p>",
              list: {
                style: "check",
                items: [
                  "Wertbeitrag vor Auslastung",
                  "Qualität vor Geschwindigkeit",
                  "Schutzräume für Deep Work"
                ]
              }
            },
            {
              title: "Praxis",
              list: {
                style: "check",
                items: [
                  "2×90‑Min Fokusblöcke/Woche",
                  "Meeting‑Fasten: 1 Slot streichen",
                  "Digitale Achtsamkeit: App‑Diet (−3 Apps)"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      type: "content",
      title: "<span class=\"primary\">Deep Work</span> & digitale Achtsamkeit",
      blocks: [
        {
          type: "grid",
          columns: 3,
          cards: [
            {
              title: "Vorbereitung (5 Min)",
              list: {
                style: "check",
                items: [
                  "1 Zielsatz: <em>„Wenn X, dann Y“</em>",
                  "Alle Störer aus: Flugmodus, Tabs zu",
                  "Arbeitsfläche räumen"
                ]
              }
            },
            {
              title: "Durchführung (25–50 Min)",
              list: {
                style: "check",
                items: [
                  "Monotasking · Timer sichtbar",
                  "Notizzettel für „später“",
                  "Micro-Breaks nach Block"
                ]
              }
            },
            {
              title: "Review (3 Min)",
              list: {
                style: "check",
                items: [
                  "Ergebnis checken",
                  "Nächste kleinstmögliche Aktion",
                  "Kalender/Board aktualisieren"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      type: "content",
      title: "Übung: 6‑Min <span class=\"accent\">Fokus‑Sprint</span>",
      blocks: [
        {
          type: "list",
          ordered: true,
          items: [
            "Wählen Sie 1 Mikro‑Aufgabe (≤ 6 Min).",
            "Alle Störer aus · Timer starten.",
            "Monotasking · Ergebnis sichtbar machen."
          ]
        },
        {
          type: "text",
          text: "Ziel: Momentum spüren & Einstiegshürde senken.",
          muted: true
        }
      ]
    },
    {
      type: "content",
      title: "Psychologische Sicherheit im Team",
      blocks: [
        {
          type: "grid",
          columns: 2,
          cards: [
            {
              title: "Wirkprinzip",
              list: {
                style: "check",
                items: [
                  "Fehler & Fragen ohne Gesichtsverlust",
                  "Mut zum Widerspruch · Lernen vor Status",
                  "Mehr Ideen · schnellere Iteration"
                ]
              }
            },
            {
              title: "Rollen",
              list: {
                style: "check",
                items: [
                  "Führung: Rahmen & Schutz bieten",
                  "Team: Feedback geben/nehmen",
                  "Alle: Gesprächsregeln leben"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      type: "content",
      title: "Führung: <span class=\"accent\">Räume öffnen</span> statt Druck",
      blocks: [
        {
          type: "grid",
          columns: 2,
          cards: [
            {
              title: "Leitfragen",
              list: {
                style: "check",
                items: [
                  "„Wofür braucht ihr heute Schutz?“",
                  "„Was stoppen wir, um <em>X</em> möglich zu machen?“",
                  "„Was ist die kleinstmögliche nächste Entscheidung?“"
                ]
              }
            },
            {
              title: "Rituale",
              list: {
                style: "check",
                items: [
                  "Fokuszeiten teamweit sichtbar blocken",
                  "Debrief ohne Schuldzuweisung",
                  "1×/Woche: Lernrunde (15 Min)"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      type: "content",
      title: "Team‑Rituale für Fokus",
      blocks: [
        {
          type: "grid",
          columns: 3,
          cards: [
            {
              title: "Start",
              list: {
                style: "check",
                items: [
                  "Daily: 1 Fokusvorhaben (max. 1 Satz)",
                  "Störer sichtbar machen"
                ]
              }
            },
            {
              title: "Unterwegs",
              list: {
                style: "check",
                items: [
                  "Rot‑Gelb‑Grün‑Check: Fokus‑Ampel",
                  "Pair‑Focus: 2×25 Min gemeinsam"
                ]
              }
            },
            {
              title: "Ende",
              list: {
                style: "check",
                items: [
                  "Erfolge & Lernpunkte (3× W‑Fragen)",
                  "Board aktualisieren · WIP prüfen"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      type: "content",
      title: "Ihr 3‑Schritte <span class=\"accent\">Fokus‑Plan</span>",
      blocks: [
        {
          type: "grid",
          columns: 3,
          cards: [
            {
              title: "1 · Stoppen",
              html: "<p>Womit höre ich ab heute auf? <em>(1 Sache)</em></p>",
              list: { items: ["…"] }
            },
            {
              title: "2 · Schützen",
              html: "<p>Welche 2 Zeitfenster blocke ich diese Woche?</p>",
              list: { items: ["…"] }
            },
            {
              title: "3 · Starten",
              html: "<p>Welche kleinste Aktion setze ich in 24 h um?</p>",
              list: { items: ["…"] }
            }
          ]
        },
        {
          type: "text",
          text: "Tipp: Kalendereintrag + Accountability‑Partner:in.",
          muted: true
        }
      ]
    },
    {
      type: "content",
      title: "Zusammenfassung",
      blocks: [
        {
          type: "grid",
          columns: 3,
          cards: [
            {
              title: "Mindset",
              list: {
                style: "check",
                items: [
                  "Klarheit vor Geschwindigkeit",
                  "Wert vor Auslastung"
                ]
              }
            },
            {
              title: "Methoden",
              list: {
                style: "check",
                items: [
                  "Atem‑Reset & Micro‑Breaks",
                  "WIP‑Limits & Deep Work"
                ]
              }
            },
            {
              title: "Team",
              list: {
                style: "check",
                items: [
                  "Psychologische Sicherheit",
                  "Rituale für Fokus"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      type: "content",
      title: "Fragen? · Nächste Schritte",
      blocks: [
        {
          type: "list",
          style: "check",
          items: [
            "Teilen Sie 1 Erkenntnis & 1 Aktion (Chat/Plenum)",
            "Planen Sie 2 Fokusblöcke bis Freitag",
            "Optional: „Fokus-Partner:in“ für 2 Wochen"
          ]
        },
        {
          type: "text",
          text: "© Zeit für Stärke GbR · Dieses Deck ist drucktauglich (<span class=\"kbd\">p</span>) und als HTML exportierbar (<span class=\"kbd\">e</span>).",
          muted: true,
          small: true
        }
      ]
    }
  ]
};
