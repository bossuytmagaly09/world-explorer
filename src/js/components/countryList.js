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
        // FAVORIET
        const isFavorirte = favorites.some(fav => fav.cca3 === country.cca3);
        // VLAG
        const flag = createElement("img", {
            src: country.flags?.png || "",
            alt: `Vlag van ${country.name?.common ?? "land"}`,
            class: "border mb-3 img-fluid",
            style: "max-height: 120px; object-fit: cover"
        })
        //NAAM + REGIO + POPULATIE
        const title = createElement(
            "h5",
            "card-title mb-1",
            country.name?.common ?? "Onbekend land"
        );

        const region = createElement(
            "p",
            "text-muted small mb-1",
            country.region ?? "_"
        );

        const population = createElement(
            "p",
            "small mb-3",
            `Bevolking ${country.population?.toLocaleString("nl-NL") ?? "_"}`
        );

        //BUTTON
        const detailsBtn = createElement(
            "button",
            "btn btn-sm btn-primary mt-auto",
            "Details"
        );
        detailsBtn.addEventListener("click", () => onCountryClick(country));

        const favBtn = createElement(
            "button",
            `btn btn-sm mt-2 ${isFavorirte ? "btn-warning" : "btn-outline-warning"}`,
            isFavorirte ? "★ Favoriet" : "☆ Favoriet"
        );
        favBtn.addEventListener("click", () => onFavoriteToggle(country));

        //OPBOUW CARD
        body.appendChild(flag);
        body.appendChild(title);
        body.appendChild(region);
        body.appendChild(population);
        body.appendChild(detailsBtn);
        body.appendChild(favBtn);

        card.appendChild(body);
        col.appendChild(card);
        container.appendChild(col);
    });
}