// === DOM-Griffe ===
const mySelect = document.getElementById("mySelect");
const tbody = document.getElementById("ergebnis-body");
const distanceKm = document.getElementById("distanceKm");
const consumptionPer100 = document.getElementById("consumptionPer100");
const duration = document.getElementById("duration");
const hintEl = document.getElementById("consumptionHint");
const fuelTypeEl = document.getElementById("fuelType");
const labelDuration = document.querySelector('label[for="duration"]');
const labelDistance = document.querySelector('label[for="distanceKm"]');
const labelConsumption = document.querySelector('label[for="consumptionPer100"]');
const labelFuel = document.querySelector('label[for="fuelType"]');
const powerWatts = document.getElementById("powerWatts");
const labelPower = document.querySelector('label[for="powerWatts"]');
const totalEl = document.getElementById("totalCo2");
const diffEl = document.getElementById("diffCo2");
const goalInput = document.getElementById("goal");
const goalEl = document.getElementById("goalCo2");
const langSelect = document.getElementById("langSelect");
const form = document.querySelector(".form");

let totalCo2 = 0;     // in kg
let totalCo2_g = 0;   // in g
let currentLang = "en";

const num = el => Number((el?.value ?? "").trim());

// === Übersetzungen ===
const translation = {
  de: {
    "form.duration": "Zeit:",
    "form.power": "Leistung (W):",
    "form.distance": "Distanz (km):",
    "form.consumption": "Verbrauch pro 100 km:",
    "form.fuel": "Treibstoff:",
    "form.category": "Kategorie:",
    "btn.calculate": "Berechnen",

    "ph.duration": "z. B. 2",
    "ph.power": "z. B. 100",
    "ph.distance": "z. B. 12.5",
    "ph.consumption": "z. B. 6.5",

    "form.consumption_hint_liquid": "Einheit: L/100 km (z. B. 4–10)",
    "form.consumption_hint_electric": "Einheit: kWh/100 km (z. B. 16–22)",

    "fuel.petrol": "Benzin",
    "fuel.diesel": "Diesel",
    "fuel.electricity": "Strom",
    "cat.car": "Auto",
    "cat.washingMachine": "Waschmaschine",
    "cat.tv": "TV",

    "section.dashboard.title": "Dein CO₂-Fußabdruck",
    "section.transport.title": "Emissionen berechnen",
    "section.goals.title": "Dein Ziel-Tracker",
    "section.settings.title": "Einstellungen",
  
    "card.total": "Gesamt:",
    "card.goal": "Ziel:",
    "card.diff": "Differenz:",
  
    "progress.text": "Du hast {percent}% deines Ziels erreicht!",

    "settings.language": "Sprache:",
    "settings.unit": "Einheit:",
    "settings.darkmode": "Dunkelmodus:",
    "tbl.Emission": "CO₂ Emissionen",
    "tbl.Action": "Aktion",

    "dashboard.dashboard": "Übersicht",
    "dashboard.goal" : "Ziel",
    "dashboard.transport": "Transport",
    "dashboard.settings": "Einstellungen",
    
  },
  en: {
    "form.duration": "Time:",
    "form.power": "Power (W):",
    "form.distance": "Distance (km):",
    "form.consumption": "Consumption per 100 km:",
    "form.fuel": "Fuel:",
    "form.category": "Category:",
    "btn.calculate": "Calculate",

    "ph.duration": "e.g. 2",
    "ph.power": "e.g. 100",
    "ph.distance": "e.g. 12.5",
    "ph.consumption": "e.g. 6.5",

    "form.consumption_hint_liquid": "Unit: L/100 km (e.g. 4–10)",
    "form.consumption_hint_electric": "Unit: kWh/100 km (e.g. 16–22)",

    "fuel.petrol": "Petrol",
    "fuel.diesel": "Diesel",
    "fuel.electricity": "Electricity",
    "cat.car": "Car",
    "cat.washingMachine": "Washing machine",
    "cat.tv": "TV",

    "section.dashboard.title": "Your CO₂ footprint",
    "section.transport.title": "Calculate emissions",
    "section.goals.title": "Your goal tracker",
    "section.settings.title": "Settings",
  
    "card.total": "Total:",
    "card.goal": "Goal:",
    "card.diff": "Difference:",
  
    "progress.text": "You have reached {percent}% of your goal!",

    "settings.language": "Language:",
    "settings.unit": "Unit:",
    "settings.darkmode": "Dark mode:",
    "tbl.Emission": "CO₂ Emission",
    "tbl.Action": "Action",

    "dashboard.dashboard": "Dashboard",
    "dashboard.goal" : "Goal",
    "dashboard.transport": "Transport",
    "dashboard.settings": "Settings",
  }
};

// === Emissionsfaktoren ===
const EMISSION_FACTORS = {
  Petrol: 2.31,      // kg CO2 / Liter
  Diesel: 2.65,      // kg CO2 / Liter
  Electricity: 0.4   // kg CO2 / kWh
};

// === Helper: Show/Hide/Clear ===
function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }
function clearValue(el) { if (el) el.value = ""; }

// === Sichtbare Felder je nach Kategorie ===
function updateVisibleFields() {
  const cat = mySelect.value; // "Car" | "Washing machine" | "TV"

  if (cat === "Car") {
    show(distanceKm);
    show(consumptionPer100);
    show(fuelTypeEl);
    show(labelDistance);
    show(labelConsumption);
    show(labelFuel);
    show(hintEl);

    hide(duration);
    hide(labelDuration);
    hide(powerWatts);
    hide(labelPower);

    clearValue(duration);
    clearValue(powerWatts);
  } else {
    show(duration);
    show(labelDuration);
    show(powerWatts);
    show(labelPower);

    hide(distanceKm);
    hide(consumptionPer100);
    hide(fuelTypeEl);
    hide(labelDistance);
    hide(labelConsumption);
    hide(labelFuel);
    hide(hintEl);

    clearValue(distanceKm);
    clearValue(consumptionPer100);
    fuelTypeEl.selectedIndex = 0;
  }
}

// === Sprache/Übersetzungen anwenden ===
function setLanguage(lang) {
  const dict = translation[lang] || translation.en;
  currentLang = lang;

  // statische Texte
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] != null) el.textContent = dict[key];
  });

  // Platzhalter
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key] != null) el.placeholder = dict[key];
  });

  // Fuel-Select sichtbare Optionstexte updaten
  fuelTypeEl.querySelectorAll("option").forEach(opt => {
    const key = opt.getAttribute("data-i18n");
    if (key && dict[key] != null) opt.textContent = dict[key];
  });

  // Kategorie-Select sichtbare Optionstexte updaten
  mySelect.querySelectorAll("option").forEach(opt => {
    const key = opt.getAttribute("data-i18n");
    if (key && dict[key] != null) opt.textContent = dict[key];
  });

  // Hinweis unter Verbrauch neu synchronisieren
  updateConsumptionHint();
}

// === Dynamischer Hinweis je nach Treibstoff ===
function updateConsumptionHint() {
  const dict = translation[currentLang] || translation.en;
  const fuel = fuelTypeEl.value; // "Petrol" | "Diesel" | "Electricity"
  const hintKey = (fuel === "Electricity")
    ? "form.consumption_hint_electric"
    : "form.consumption_hint_liquid";
  hintEl.textContent = dict[hintKey] || "";
}

// === Rechnen ===
function calculateCarCO2(distanceKmValue, consumptionPer100Value, fuelType) {
  const factor = EMISSION_FACTORS[fuelType];
  return (distanceKmValue / 100) * consumptionPer100Value * factor; // kg
}

function updateTotals(addedKg) {
  if (Number.isFinite(addedKg)) {
    totalCo2 += addedKg;
    if (totalCo2 < 0) totalCo2 = 0;
    totalCo2_g += Math.round(addedKg * 1000); // kg -> g
  }

  const totalKg = Math.max(0, totalCo2_g / 1000);
  totalEl.textContent = `${totalKg.toFixed(2)} kg`;

  // Ziel (t) -> kg und Differenz
  const goalTons = Number(goalInput.value);
  if (goalTons > 0) {
    const goalKg = goalTons * 1000;
    goalEl.textContent = `${goalKg.toFixed(0)} kg`;
    const diffKg = goalKg - totalKg;
    diffEl.textContent = `${diffKg.toFixed(2)} kg`;
  } else {
    goalEl.textContent = "-";
    diffEl.textContent = "-";
  }
}

// === Submit ===
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const selected = mySelect.value; // "Car" | "Washing machine" | "TV"
  if (!selected) return;

  switch (selected) {
    case "Car": {
      const distanceKmValue = num(distanceKm);
      const consumptionPer100Value = num(consumptionPer100);
      const fuelType = fuelTypeEl.value;

      if (!(distanceKmValue > 0) || !(consumptionPer100Value > 0) || !EMISSION_FACTORS[fuelType]) {
        console.warn("Bitte gültige Werte für Auto eingeben.");
        return;
      }

      const co2 = calculateCarCO2(distanceKmValue, consumptionPer100Value, fuelType);

      const row = tbody.insertRow();
      row.insertCell(0).textContent = "Car";
      row.insertCell(1).textContent = `${distanceKmValue} km @ ${consumptionPer100Value} ${fuelType === "Electricity" ? "kWh" : "L"}/100km`;
      row.insertCell(2).textContent = `${co2.toFixed(2)} kg`;
      row.dataset.co2 = String(co2);
      const actionCell = row.insertCell(3);
      actionCell.innerHTML = '<button class="row-delete" type="button">x</button>';
      updateTotals(co2);
      clearVisibleInputs();
      break;
    }
    case "Washing machine": {
      const durationValue = num(duration);
      const powerValue = num(powerWatts);
      if (!(durationValue > 0) || !(powerValue > 0)) {
        console.warn("Bitte eine gültige Zeit und Leistung eingeben.");
        return;
      }
      const kwh = (powerValue * durationValue) / 1000;
      const co2 = kwh * EMISSION_FACTORS.Electricity;

      const row = tbody.insertRow();
      row.insertCell(0).textContent = "Washing machine";
      row.insertCell(1).textContent = `${durationValue} h @ ${powerValue} W`;
      row.insertCell(2).textContent = `${co2.toFixed(2)} kg`;
      row.dataset.co2 = String(co2);
      const actionCell = row.insertCell(3);
      actionCell.innerHTML = '<button class="row-delete" type="button">x</button>';
      updateTotals(co2);
      clearVisibleInputs();
      break;
    }
    case "TV": {
      const durationValue = num(duration);
      const powerValue = num(powerWatts);
      if (!(durationValue > 0) || !(powerValue > 0)) {
        console.warn("Bitte eine gültige Zeit und Leistung eingeben.");
        return;
      }
      const kwh = (powerValue * durationValue) / 1000;
      const co2 = kwh * EMISSION_FACTORS.Electricity;

      const row = tbody.insertRow();
      row.insertCell(0).textContent = "TV";
      row.insertCell(1).textContent = `${durationValue} h @ ${powerValue} W`;
      row.insertCell(2).textContent = `${co2.toFixed(2)} kg`;
      row.dataset.co2 = String(co2);
      const actionCell = row.insertCell(3);
      actionCell.innerHTML = '<button class="row-delete" type="button">x</button>';
      updateTotals(co2);
      clearVisibleInputs();
      break;
    }
    default:
      console.warn("Bitte eine gültige Auswahl treffen.");
  }
});

// Nach Submit Eingabefelder der sichtbaren Gruppe leeren
function clearVisibleInputs() {
  const cat = mySelect.value;
  if (cat === "Car") {
    distanceKm.value = "";
    consumptionPer100.value = "";
  } else {
    duration.value = "";
    powerWatts.value = "";
  }
}

// === Löschen (robuster Delegations-Handler) ===
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button.row-delete");
  if (!btn) return;

  const row = btn.closest("tr");
  if (!row) return;

  const co2 = Number(row.dataset.co2 || "0");
  if (Number.isFinite(co2) && co2 > 0) {
    updateTotals(-co2);
  }
  row.remove();
});

// === Live-Update Ziel ===
updateTotals(0);
goalInput.addEventListener("input", () => updateTotals(0));

// === Initialisierung ===
fuelTypeEl.addEventListener("change", updateConsumptionHint);
mySelect.addEventListener("change", updateVisibleFields);

if (langSelect) {
  // initiale Sprache aus Dropdown
  const initLang = (langSelect.value === "Deutsch") ? "de" : "en";
  setLanguage(initLang);

  // Wechsel der Sprache
  langSelect.addEventListener("change", () => {
    const lang = (langSelect.value === "Deutsch") ? "de" : "en";
    setLanguage(lang);
  });
} else {
  setLanguage("en");
}

// Anfangszustand Felder & Hinweis
updateVisibleFields();
updateConsumptionHint();





