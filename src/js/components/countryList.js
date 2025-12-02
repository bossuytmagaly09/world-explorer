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

        const isFav = favorites.some(f => f.cca3 === country.cca3);

        body.innerHTML = `
            <img src="${country.flags?.png || ''}" class="mb-3 card-img-top" alt="Vlag ${country.name?.common || ''}">
            <h5 class="card-title mb-2">${country.name.common}</h5>
            <p class="fw-light mb-0">Regio: ${country.region}</p>
            <p class="fw-light">Populatie: ${country.population?.toLocaleString() ?? '0'}</p>

            <div class="d-grid gap-2 d-md-flex justify-content-between mt-2">
                <button class="btn btn-primary btn-sm details-btn">Details</button>
                <button class="btn ${isFav ? "btn-warning" : "btn-outline-warning"} btn-sm fav-btn">
                    ${isFav ? "★ Verwijder" : "☆ Favoriet"}
                </button>
            </div>
        `;

        card.appendChild(body);
        col.appendChild(card);
        container.appendChild(col);

        // events
        const detailsBtn = body.querySelector(".details-btn");
        const favBtn = body.querySelector(".fav-btn");

        detailsBtn?.addEventListener("click", () => {
            onCountryClick?.(country);
        });

        favBtn?.addEventListener("click", () => {
            onFavoriteToggle?.(country);
        });
    });
}