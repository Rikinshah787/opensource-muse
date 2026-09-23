const seeds = {
  cinematic: [
    "Use contrast like a scene change: one intimate detail, one sweeping promise.",
    "Anchor the work around a recurring object people can remember.",
    "Let the first interaction feel like opening a sealed reel."
  ],
  quiet: [
    "Remove the loudest claim and make the remaining detail more exact.",
    "Design for slower reading, fewer choices, and one gentle reveal.",
    "Treat empty space as evidence that the idea can breathe."
  ],
  playful: [
    "Give the audience a small rule to bend within the first thirty seconds.",
    "Turn a boring label into a tiny invitation.",
    "Make one result feel delightfully earned instead of automatically given."
  ],
  archival: [
    "Surface provenance: dates, fragments, rough edges, and human fingerprints.",
    "Pair every polished moment with a trace of how it was found.",
    "Let browsing feel like following a thread through a box of notes."
  ],
  electric: [
    "Compress the idea into a sharp command people can repeat.",
    "Use motion, tempo, and decisive contrast to make the concept feel live.",
    "Make the first card feel like a signal that just came through."
  ]
};

const formats = {
  campaign: ["launch hook", "audience ritual", "share trigger"],
  product: ["core loop", "empty state", "upgrade path"],
  story: ["opening beat", "turning point", "closing image"],
  exhibit: ["entry wall", "artifact logic", "visitor takeaway"],
  prototype: ["first tap", "feedback moment", "next test"]
};

const palettes = [
  ["#101619", "#f5c76b", "#7bd3c6", "#e98f81", "#edf2ea"],
  ["#12131c", "#c7f26b", "#6bb7f5", "#ff8da1", "#f4efe5"],
  ["#17130f", "#ffcf5c", "#4fb286", "#d86f45", "#f7f0df"],
  ["#0e171f", "#96e6b3", "#f1a66a", "#7aa2ff", "#f0f5f2"]
];

const moodBanks = [
  ["Attic radio", "Warm static", "Hand-labeled tapes"],
  ["Night train", "Passing windows", "Soft urgency"],
  ["Back room gallery", "Pinned receipts", "Curator notes"],
  ["After-hours studio", "Blue monitors", "Fresh edits"]
];

const state = {
  ideas: [],
  pinned: [],
  paletteIndex: 0,
  moodIndex: 0
};

const brief = document.querySelector("#brief");
const tone = document.querySelector("#tone");
const format = document.querySelector("#format");
const ideaGrid = document.querySelector("#ideaGrid");
const moodList = document.querySelector("#moodList");
const palette = document.querySelector("#palette");
const pinnedList = document.querySelector("#pinnedList");
const pinCount = document.querySelector("#pinCount");
const saveState = document.querySelector("#saveState");
const paletteStatus = document.querySelector("#paletteStatus");

function load() {
  const saved = JSON.parse(localStorage.getItem("museopensource") || "null");
  if (!saved) {
    generateIdeas();
    return;
  }

  Object.assign(state, saved.state);
  brief.value = saved.brief || brief.value;
  tone.value = saved.tone || tone.value;
  format.value = saved.format || format.value;
  render();
}

function persist() {
  localStorage.setItem(
    "museopensource",
    JSON.stringify({
      brief: brief.value,
      tone: tone.value,
      format: format.value,
      state
    })
  );
  saveState.textContent = "Saved just now";
  window.clearTimeout(persist.timer);
  persist.timer = window.setTimeout(() => {
    saveState.textContent = "Saved on this device";
  }, 1600);
}

function briefNoun() {
  const words = brief.value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 4);
  return words.at(-1) || "idea";
}

function generateIdeas() {
  const selectedTone = tone.value;
  const selectedFormat = format.value;
  const noun = briefNoun();
  const sparks = seeds[selectedTone];
  const lenses = formats[selectedFormat];

  state.ideas = sparks.map((spark, index) => ({
    id: crypto.randomUUID(),
    title: `${capitalize(noun)} ${lenses[index]}`,
    body: spark,
    chips: [selectedTone, selectedFormat, lenses[index]]
  }));
  state.paletteIndex = (state.paletteIndex + 1) % palettes.length;
  render();
  persist();
}

function render() {
  ideaGrid.innerHTML = state.ideas
    .map(
      (idea) => `
        <article class="idea-card">
          <div>
            <strong>${escapeHtml(idea.title)}</strong>
            <p>${escapeHtml(idea.body)}</p>
          </div>
          <div class="chip-row">
            ${idea.chips.map((chip) => `<span class="chip">${escapeHtml(chip)}</span>`).join("")}
          </div>
          <div class="card-actions">
            <button class="small-button" data-pin="${idea.id}">Pin</button>
            <button class="small-button" data-remix="${idea.id}">Remix</button>
          </div>
        </article>
      `
    )
    .join("");

  const mood = moodBanks[state.moodIndex];
  moodList.innerHTML = mood
    .map(
      (item, index) => `
        <div class="mood-lane">
          <strong>${escapeHtml(item)}</strong>
          <span>${["texture", "pace", "signal"][index]}</span>
        </div>
      `
    )
    .join("");

  const colors = palettes[state.paletteIndex];
  palette.innerHTML = colors
    .map((color) => `<span class="swatch" style="background:${color}">${color}</span>`)
    .join("");

  pinCount.textContent = state.pinned.length;
  pinnedList.innerHTML = state.pinned.length
    ? state.pinned
        .map(
          (item) => `
          <div class="pinned-item">
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(item.body)}</span>
          </div>
        `
        )
        .join("")
    : '<p class="empty">Pin the ideas worth carrying into the next draft.</p>';

  bindCardActions();
}

function bindCardActions() {
  document.querySelectorAll("[data-pin]").forEach((button) => {
    button.addEventListener("click", () => {
      const idea = state.ideas.find((item) => item.id === button.dataset.pin);
      if (idea && !state.pinned.some((item) => item.id === idea.id)) {
        state.pinned.unshift(idea);
        render();
        persist();
      }
    });
  });

  document.querySelectorAll("[data-remix]").forEach((button) => {
    button.addEventListener("click", () => {
      const idea = state.ideas.find((item) => item.id === button.dataset.remix);
      if (!idea) return;
      idea.title = `${idea.title.split(" ")[0]} signal ${Math.floor(Math.random() * 90 + 10)}`;
      idea.body = seeds[tone.value][Math.floor(Math.random() * seeds[tone.value].length)];
      render();
      persist();
    });
  });
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char];
  });
}

document.querySelector("#sparkButton").addEventListener("click", generateIdeas);
document.querySelector("#shuffleMood").addEventListener("click", () => {
  state.moodIndex = (state.moodIndex + 1) % moodBanks.length;
  render();
  persist();
});
document.querySelector("#copyPalette").addEventListener("click", async () => {
  const colors = palettes[state.paletteIndex].join(", ");
  await navigator.clipboard.writeText(colors);
  paletteStatus.textContent = "Palette copied.";
});
document.querySelector("#clearButton").addEventListener("click", () => {
  localStorage.removeItem("museopensource");
  state.pinned = [];
  state.paletteIndex = 0;
  state.moodIndex = 0;
  generateIdeas();
});

[brief, tone, format].forEach((input) => input.addEventListener("change", persist));

load();
