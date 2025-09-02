const consumptionInput = document.getElementById("consumptionPer100");
const mySelect = document.getElementById("mySelect");
const distanceKm = document.getElementById("distanceKm");
const consumptionPer100 = document.getElementById("consumptionPer100");
const duration =document.getElementById("duration");
const hintEl = document.getElementById("consumptionHint");
const fuelTypeEl = document.getElementById("fuelType");
const labelDuration = document.querySelector('label[for="duration"]');
const labelDistance = document.querySelector('label[for="distanceKm"]');
const labelConsumption = document.querySelector('label[for="consumptionPer100"]');
const labelFuel = document.querySelector('label[for="fuelType"]');


const EMISSION_FACTORS = {
  Petrol: 2.31,      // kg CO2 / Liter
  Diesel: 2.65,      // kg CO2 / Liter
  Electricity: 0.4   // kg CO2 / kWh
};

document.getElementById("berechnen").addEventListener("click", () => {
  const selected = document.getElementById("mySelect").value;       // "Auto" | "Waschmaschine" | "TV"
  const tbody = document.getElementById("ergebnis-body");

  if (!selected) {
    console.warn("Bitte eine Kategorie wählen.");
    return;
  }

  switch (selected) {
    case "Auto": {
      const distanceKm = Number(document.getElementById("distanceKm").value);
      const consumptionPer100 = Number(consumptionInput.value);     // aktuellen Wert holen
      const fuelType = fuelTypeEl.value;

      if (!(distanceKm > 0) || !(consumptionPer100 > 0) || !EMISSION_FACTORS[fuelType]) {
        console.warn("Bitte gültige Werte für Auto eingeben.");
        return;
      }

      const co2 = calculateCarCO2(distanceKm, consumptionPer100, fuelType);

      const row = tbody.insertRow();
      row.insertCell(0).textContent = "Auto";
      row.insertCell(1).textContent = `${distanceKm} km`;
      row.insertCell(2).textContent = `${co2.toFixed(2)} kg`;
      break;
    }

    case "Waschmaschine": {
      const duration = Number(document.getElementById("duration").value);
      if (!(duration > 0)) {
        console.warn("Bitte eine gültige Zeit eingeben.");
        return;
      }
      const row = tbody.insertRow();
      row.insertCell(0).textContent = "Waschmaschine";
      row.insertCell(1).textContent = `${duration} h`;
      row.insertCell(2).textContent = "—"; // später berechnen
      break;
    }

    case "TV": {
      const duration = Number(document.getElementById("duration").value);
      if (!(duration > 0)) {
        console.warn("Bitte eine gültige Zeit eingeben.");
        return;
      }
      const row = tbody.insertRow();
      row.insertCell(0).textContent = "TV";
      row.insertCell(1).textContent = `${duration} h`;
      row.insertCell(2).textContent = "—"; // später berechnen
      break;
    }

    default:
      console.log("Bitte eine gültige Auswahl treffen.");
  }
});

function calculateCarCO2(distanceKm, consumptionPer100, fuelType) {
  const factor = EMISSION_FACTORS[fuelType];
  return (distanceKm / 100) * consumptionPer100 * factor;
}

function updateConsumptionHint() {
  const fuel = fuelTypeEl.value; // "Petrol" | "Diesel" | "Electricity"
  if (fuel === "Electricity") {
    hintEl.textContent = "Einheit: kWh/100 km (z. B. 16–22)";
    consumptionInput.placeholder = "z. B. 18";
  } else {
    hintEl.textContent = "Einheit: L/100 km (z. B. 4–10)";
    consumptionInput.placeholder = "z. B. 6.5";
  }
}

function show(el) {el.classList.remove("hidden");}
function hide(el) {el.classList.add("hidden"); }

function updateVisibleFields() {
  const cat = mySelect.value; // die Select Box

  if (cat === "Auto") {
    show(distanceKm);
    show(consumptionPer100);
    show(fuelTypeEl);
    show(labelDistance);
    show(labelConsumption);
    show(labelFuel);

    hide(duration);
    hide(labelDuration);

  } else {
    show(duration);
    show(labelDuration);

    hide(distanceKm);
    hide(consumptionPer100);
    hide(fuelTypeEl);
    hide(labelDistance);
    hide(labelConsumption);
    hide(labelFuel);


  }
}

// beim Laden + bei jeder Änderung aktualisieren
updateConsumptionHint();
fuelTypeEl.addEventListener("change", updateConsumptionHint);
updateVisibleFields();
mySelect.addEventListener("change", updateVisibleFields);



