import * as bootstrap from "bootstrap";
import { clearElement, createElement } from "../utils/dom.js";
import { focusCountry } from "../services/mapService.js";
import { fetchRateToEuro } from "../services/statsService.js";

let modalInstance = null;
let currentCountry = null;
let onFavoriteToggleCallback = null;

export function initCountryModal(onFavoriteToggle) {
    const modalElement = document.querySelector("#country_modal");
    if (!modalElement) return;

    modalInstance = new bootstrap.Modal(modalElement);
    onFavoriteToggleCallback = onFavoriteToggle;

    const favBtn = document.querySelector("#favorite_toggle_btn");
    if (favBtn) {
        favBtn.addEventListener("click", () => {
            if (!currentCountry) return;

            const newStatus = onFavoriteToggleCallback(currentCountry);
            updateFavoriteButton(newStatus);
        });
    }
}

function updateFavoriteButton(isFavorite) {
    const favBtn = document.querySelector("#favorite_toggle_btn");
    if (!favBtn) return;

    if (isFavorite) {
        favBtn.textContent = "★ Verwijder uit favorieten";
        favBtn.className = "btn btn-warning w-100";
    } else {
        favBtn.textContent = "☆ Toevoegen aan favorieten";
        favBtn.className = "btn btn-outline-warning w-100";
    }
}

export async function showCountryDetail(country, isFavorite) {
    if (!modalInstance || !country) return;
    currentCountry = country;

    const title = document.querySelector("#country_modal_label");
    const flagImg = document.querySelector("#country_flag");
    const detailsDl = document.querySelector("#country_details");
    const alertBox = document.querySelector("#country_modal_alert");
    const currencyInfo = document.querySelector("#currency_info");

    clearElement(detailsDl);
    clearElement(currencyInfo);

    const name = country.name?.common ?? "Onbekend land";
    title.textContent = name;
    flagImg.src = country.flags?.png ?? "";
    flagImg.alt = `Vlag van ${name}`;

    function addDetail(label, value) {
        const dt = createElement("dt", "col-sm-4 fw-bold", label);
        const dd = createElement("dd", "col-sm-8", value);
        detailsDl.appendChild(dt);
        detailsDl.appendChild(dd);
    }

    addDetail("Hoofdstad", country.capital?.[0] ?? "_");
    addDetail("Regio", country.region ?? "_");
    addDetail("Bevolking", typeof country.population === "number" ? country.population.toLocaleString("nl-NL") : "_");
    addDetail("Talen", country.languages ? Object.values(country.languages).join(", ") : "_");
    addDetail(
        "Valuta",
        country.currencies
            ? Object.entries(country.currencies).map(([c, obj]) => `${obj.name} (${c})`).join(", ")
            : "_"
    );

    const lat = country.latlng?.[0];
    const lng = country.latlng?.[1];

    if (lat != null && lng != null) {
        alertBox.classList.add("d-none");
        focusCountry(lat, lng, name);
    } else {
        alertBox.classList.remove("d-none");
        alertBox.textContent = "Geen geografische data beschikbaar voor dit land.";
    }

    if (country.currencies) {
        const firstCurrencyCode = Object.keys(country.currencies)[0];
        try {
            const rate = await fetchRateToEuro(firstCurrencyCode);
            currencyInfo.textContent = `1 ${firstCurrencyCode} = ${rate} EUR`;
        } catch {
            currencyInfo.textContent = "Wisselkoers niet beschikbaar.";
        }
    } else {
        currencyInfo.textContent = "Geen valuta-informatie beschikbaar.";
    }

    updateFavoriteButton(Boolean(isFavorite));
    modalInstance.show();
}
