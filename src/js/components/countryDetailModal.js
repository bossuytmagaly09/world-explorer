import * as bootstrap from "bootstrap";
import { clearElement, createElement } from "../utils/dom.js";
import { focusCountry } from "../services/mapService.js";
import { fetchRateToEuro } from "../services/statsService.js";

let modalInstance = null;
let currentCountry = null;
let onFavoriteToggleCallback = null;

/**
 * Initialiseert de modal (één keer aanroepen in main.js)
 */
export function initCountryModal(onFavoriteToggle) {
    const modalElement = document.querySelector("#country_modal");
    if (!modalElement) return;
    modalInstance = new bootstrap.Modal(modalElement);
    onFavoriteToggleCallback = onFavoriteToggle;

    const favBtn = document.querySelector("#favorite_toggle_btn");
    if (favBtn) {
        favBtn.addEventListener("click", () => {
            if (currentCountry && typeof onFavoriteToggleCallback === "function") {
                onFavoriteToggleCallback(currentCountry);
            }
        });
    }
}

/**
 * Toon de modal voor een bepaald land.
 * @param {Object} country
 * @param {boolean} isFavorite
 */
export async function showCountryDetail(country, isFavorite) {
    if (!modalInstance || !country) return;
    currentCountry = country;

    const title = document.querySelector("#country_modal_label");
    const flagImg = document.querySelector("#country_flag");
    const detailsDl = document.querySelector("#country_details");
    const alertBox = document.querySelector("#country_modal_alert");
    const currencyInfo = document.querySelector("#currency_info");
    const favBtn = document.querySelector("#favorite_toggle_btn");


    // TODO:
    // - titel invullen (country.name.common)
    // - vlag src/alt instellen
    // - detailsDl leegmaken en opnieuw vullen met dt/dd voor:
    //   hoofdstad, regio, populatie, talen, valuta
    clearElement(detailsDl);
    clearElement(currencyInfo);

    title.textContent = country.name?.common ?? "Onbekend land";
    flagImg.src = country.flags?.png || "";
    flagImg.alt = `Vlag van ${country.name?.common ?? "land"}`;

    function addDetail(label, value){
        const dt = createElement("dt", {class: "col-sm-4 fw-bold"}, label);
        const dd = createElement("dd", {class: "col-sm-!"}, value);
        detailsDl.appendChild(dt);
        detailsDl.appendChild(dd);
    }

    const capital = country.capital?.[0] ?? "_";
    const region = country.region ?? "_";
    const population = country.population?.toLocaleString("nl-NL") ?? "_";

    const languages = country.languages
        ? Object.entries(country.languages).join(", ")
        : "_";

    const currencyEntries = country.currencies
        ? Object.entries(country.currencies).map(([code, obj]) => `${obj.name} (${code})` ).join(", ")
        : "_";

    addDetail("Hoofdstad", capital);
    addDetail("Regio", region);
    addDetail("Bevolking", population);
    addDetail("Talen", languages);
    addDetail("Valuta", currencyEntries);



    // TODO: alertBox verbergen of tonen afhankelijk van geodata (lat/lng)
    // - lat/lng zoeken in country.latlng
    // - als aanwezig: focusCountry(lat, lng, name)
    // - anders: nette melding tonen en map eventueel "disable"-stijl geven
    const lat = country.latlng?.[0];
    const lng = country.latlng?.[1];

    if (lat != null && lng != null){
        alertBox.classList.add("d-none");
        alertBox.textContent = "";

        focusCountry(lat, lng, country.name.common);
    }else{
        alertBox.classList.remove("d-none");
        alertBox.textContent = "Geen geografische data beschikbaar voor dit land.";
    }


    // TODO: wisselkoers-info ophalen
    // - eerste currency-code bepalen uit country.currencies
    // - fetchRateToEuro(code) aanroepen
    // - resultaat tonen in currencyInfo
    // - foutmeldingen netjes afhandelen

    if (country.currencies){
        const firstCurrencyCode = Object.keys(country.currencies)[0];

        try{
            const rate = await fetchRateToEuro(firstCurrencyCode);
            currencyInfo.textContent = `1 ${firstCurrencyCode} = ${rate} EUR`;
        }catch (err){
            currencyInfo.textContent = `Wisselkoers niet beschikbaar.`
        }
    }else{
        currencyInfo.textContent = `Geen valuta_informatie beschikbaar.`
    }

    // TODO: tekst/appearance van favBtn aanpassen op basis van isFavorite

    if (isFavorite){
        favBtn.textContent = `★ Verwijder uit favorieten`;
        favBtn.classList.add("btn-warning");
        favBtn.classList.add("btn-outline warning");
    }else{
        favBtn.textContent = `★ Toevoegen aan favorieten`;
        favBtn.classList.add("btn-warning");
        favBtn.classList.add("btn-outline-warning");
    }

    modalInstance.show();
}