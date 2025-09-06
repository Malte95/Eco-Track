const mySelect = document.getElementById("mySelect");
const tbody = document.getElementById("ergebnis-body");
const distanceKm = document.getElementById("distanceKm");
const consumptionPer100 = document.getElementById("consumptionPer100");
const duration =document.getElementById("duration");
const hintEl = document.getElementById("consumptionHint");
const fuelTypeEl = document.getElementById("fuelType");
const labelDuration = document.querySelector('label[for="duration"]');
const labelDistance = document.querySelector('label[for="distanceKm"]');
const labelConsumption = document.querySelector('label[for="consumptionPer100"]');
const labelFuel = document.querySelector('label[for="fuelType"]');
const powerWatts = document.getElementById("powerWatts");
const labelPower = document.querySelector('label[for="powerWatts"]');
let totalCo2 = 0;
let totalCo2_g = 0;
const totalEl = document.getElementById("totalCo2");
const diffEl = document.getElementById("diffCo2");
const goalInput = document.getElementById("goal");
const goalEl = document.getElementById("goalCo2");
const num = el => Number((el?.value ?? "").trim());

const EMISSION_FACTORS = {
  Petrol: 2.31,      // kg CO2 / Liter
  Diesel: 2.65,      // kg CO2 / Liter
  Electricity: 0.4   // kg CO2 / kWh
};

const form = document.querySelector(".form"); 

form.addEventListener("submit", (e) => {
  e.preventDefault(); // kein Reload

  const selected = mySelect.value;       // "Auto" | "Waschmaschine" | "TV"

  if (!selected) {
    console.warn("Bitte eine Kategorie wählen.");
    return;
  }

  switch (selected) {
    case "Auto": {
      const distanceKmValue = num(distanceKm);
      const consumptionPer100Value = num(consumptionPer100);    // aktuellen Wert holen
      const fuelType = fuelTypeEl.value;

      if (!(distanceKmValue > 0) || !(consumptionPer100Value > 0) || !EMISSION_FACTORS[fuelType]) {
        console.warn("Bitte gültige Werte für Auto eingeben.");
        return;
      }

      const co2 = calculateCarCO2(distanceKmValue, consumptionPer100Value, fuelType);

      const row = tbody.insertRow();
      row.insertCell(0).textContent = "Auto";
      row.insertCell(1).textContent = `${distanceKmValue} km @ ${consumptionPer100Value} L`;
      row.insertCell(2).textContent = `${co2.toFixed(2)} kg`;
      row.dataset.co2 = co2.toString();
      const actionCell = row.insertCell(3);
      actionCell.innerHTML = '<button class="row-delete" type="button">x</button>';
      updateTotals(co2); 
      clearVisibleInputs();
      break;
    }

    case "Waschmaschine": {
      const durationValue = num(duration);
      const powerValue = num(powerWatts);

      if (!(durationValue > 0) || !(powerValue > 0)) {
        console.warn("Bitte eine gültige Zeit  und Leistung eingeben.");
        return;
      }

      const kwh = (powerValue * durationValue) / 1000;
      const co2 = kwh * EMISSION_FACTORS.Electricity;

      const row = tbody.insertRow();
      row.insertCell(0).textContent = "Waschmaschine";
      row.insertCell(1).textContent = `${durationValue} h @ ${powerValue} W`;
      row.insertCell(2).textContent = `${co2.toFixed(2)} kg`; 
      row.dataset.co2 = co2.toString();  
      const actionCell = row.insertCell(3);
      actionCell.innerHTML = '<button class="row-delete" type="button">x</button>';
      updateTotals(co2); 
      clearVisibleInputs();
      break;
    }

    case "TV": {
      const durationValue = Number(duration.value);
      const powerValue = Number(powerWatts.value);

      if (!(durationValue > 0) || !(powerValue > 0)) {
        console.warn("Bitte eine gültige Zeit  und Leistung eingeben.");
        return;
      }

      const kwh = (powerValue * durationValue) / 1000;
      const co2 = kwh * EMISSION_FACTORS.Electricity;

      const row = tbody.insertRow();
      row.insertCell(0).textContent = "TV";
      row.insertCell(1).textContent = `${durationValue} h @ ${powerValue} W`;
      row.insertCell(2).textContent = `${co2.toFixed(2)} kg`;
      row.dataset.co2 = co2.toString();  
      const actionCell = row.insertCell(3);
      actionCell.innerHTML = '<button class="row-delete" type="button">x</button>';
      updateTotals(co2); 
      clearVisibleInputs();
      break;
    }

    default:
      console.log("Bitte eine gültige Auswahl treffen.");
  }
});

function calculateCarCO2(distanceKmValue, consumptionPer100Value, fuelType) {
  const factor = EMISSION_FACTORS[fuelType];
  return (distanceKmValue / 100) * consumptionPer100Value * factor;
}

function updateConsumptionHint() {
  const fuel = fuelTypeEl.value; // "Petrol" | "Diesel" | "Electricity"
  if (fuel === "Electricity") {
    hintEl.textContent = "Einheit: kWh/100 km (z. B. 16–22)";
    consumptionPer100.placeholder = "z. B. 18";
  } else {
    hintEl.textContent = "Einheit: L/100 km (z. B. 4–10)";
    consumptionPer100.placeholder = "z. B. 6.5";
  }
}

function show(el) {el.classList.remove("hidden");}
function hide(el) {el.classList.add("hidden"); }
function clearValue(el) { if (el) el.value = ""; }

function clearVisibleInputs() {
  const cat = mySelect.value;
  if(cat === "Auto") {
    distanceKm.value = "";
    consumptionPer100.value = "";
  } else {
    duration.value = "";
    powerWatts.value = "";
  }
}

function updateVisibleFields() {
  const cat = mySelect.value; // die Select Box

  if (cat === "Auto") {
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

function updateTotals(addedKg) {
  if (Number.isFinite(addedKg)) {
    totalCo2 += addedKg;
    if(totalCo2 <0) totalCo2 = 0;
  }
    
    totalCo2_g += Math.round(addedKg * 1000); //kg -> g
  
  const totalKg = totalCo2_g / 1000;
  totalEl.textContent = `${totalKg.toFixed(2)} kg`;

  // Ziel und Differenz aktualisieren (falls Ziel angegeben)
  const goalTons = Number(goalInput.value); //Ziel in t CO2
  if (goalTons > 0) {
    const goalKg = goalTons * 1000; // t -> kg
    goalEl.textContent = `${goalKg.toFixed(0)} kg`;
    const diffKg = goalKg -totalCo2;
    diffEl.textContent = `${diffKg.toFixed(2)} kg`;
  } else {
    goalEl.textContent = "-";
    diffEl.textContent = "-";

  }
}
// Ziel-Änderungen live berücksichtigen
updateTotals(0); 
goalInput.addEventListener("input", () => updateTotals(0));
goalInput.dispatchEvent(new Event("input"));

// beim Laden + bei jeder Änderung aktualisieren
updateConsumptionHint();
fuelTypeEl.addEventListener("change", updateConsumptionHint);
updateVisibleFields();
mySelect.addEventListener("change", updateVisibleFields);

tbody.addEventListener("click", (e) => {
  const btn = e.target.closest(".row-delete");
  if (!btn) return; // kein Delete-Button geklickt

  const row = btn.closest("tr");
  if (!row) return;

  // CO₂-Wert aus dataset holen und von den Totals abziehen
  const co2 = Number(row.dataset.co2 || "0");
  if (Number.isFinite(co2) && co2 > 0) {
    updateTotals(-co2);
  }

  // Zeile entfernen
  row.remove();
});




