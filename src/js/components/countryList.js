import { clearElement, createElement } from "../utils/dom.js";

/**
 * Render de lijst van landen in #country_list.
 *
 * @param {Object} config
 * @param {Array} config.countries
 * @param {Array} config.favorites
 * @param {Function} config.onCountryClick  (country) => void
 * @param {Function} config.onFavoriteToggle (country) => void
 */
export function renderCountryList({ countries, favorites, onCountryClick, onFavoriteToggle }) {
    const container = document.querySelector("#country_list");
    if (!container) return;

    clearElement(container);

    if (!countries || countries.length === 0) {
        const empty = createElement(
            "div",
            "col-12 alert alert-light border text-center mb-0",
            "Geen landen gevonden voor deze filter."
        );
        container.appendChild(empty);
        return;
    }

    countries.forEach((country) => {
        const col = createElement("div", "col");
        const card = createElement("div", "card h-100 shadow-sm border-0");
        const body = createElement("div", "card-body d-flex flex-column");

        // TODO:
        // - vlag, naam, regio, populatie tonen
        // - knop "Details" die onCountryClick(country) oproept
        // - knop/icon voor favoriet (onFavoriteToggle(country))
        // - check of dit land in favorites zit (kleur/icoon aanpassen)
        const allCurrencies = Object.entries(country.currencies)
            .map(([code, info]) => `${code} - ${info.name}`)
            .join("<br>");

        const allLanguages = Object.entries(country.languages)
            .map(([code, language]) => `${language}`)
            .join(", ")

        body.innerHTML = `<img src="${country.flags.png}" class="mb-1">
                          <h5 class="card-title">${country.name.common}</h5>
                          <p class="fw-light mb-0">Regio: ${country.region}</p>
                          <p class="fw-light">Populatie: ${(country.population).toLocaleString()}</p>
                          <div class="d-grid gap-2 d-md-flex justify-content-between">
                                <button class="btn btn-primary btn-sm" type="button" data-bs-toggle="modal" data-bs-target="#detailsModal-${country.cca3}">Details</button>
                                <button class="btn btn-outline-warning btn-sm" type="button">☆ Favoriet</button>
                          </div>
                          
                        <!-- Modal -->
                        <div class="modal fade" id="detailsModal-${country.cca3}" tabindex="-1" aria-labelledby="detailsModalLabel" aria-hidden="true">
                          <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h1 class="modal-title fs-5" id="detailsModalLabel-${country.cca3}">${country.name.common}</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div class="modal-body d-flex">
                                <img src="${country.flags.png}" class="mb-1">
                                <div class="ms-4 me-5">
                                    <p class="fw-bold">Hoofdstad</p>
                                    <p class="fw-bold">Regio</p>
                                    <p class="fw-bold">Populatie</p>
                                    <p class="fw-bold">Talen</p>
                                    <p class="fw-bold">Valuta</p>
                                </div>
                                <div>
                                    <p>${country.capital}</p>
                                    <p>${country.region}</p>
                                    <p>${country.population.toLocaleString()}</p>
                                    <p>${allLanguages}</p>
                                    <p>${allCurrencies}</p>
                                    
                                </div>
                              </div>
                              <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary">Save changes</button>
                              </div>
                            </div>
                          </div>
                        </div>`;


        card.appendChild(body);
        col.appendChild(card);
        container.appendChild(col);

    });
}