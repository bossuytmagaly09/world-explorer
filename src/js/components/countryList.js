import { clearElement, createElement } from "../utils/dom.js";

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
        const isFav = favorites.some(f => f.cca3 === country.cca3);

        const col = createElement("div", "col");
        const card = createElement("div", "card h-100 shadow-sm border-0");
        const body = createElement("div", "card-body d-flex flex-column");

        const countryName = country.name?.common ?? "Onbekend land";
        const flagSrc = country.flags?.png ?? "";
        const population = typeof country.population === "number" ? country.population.toLocaleString() : "0";
        const region = country.region ?? "_";

        const isFav = favorites.some(f => f.cca3 === country.cca3);

        body.innerHTML = `
                        <img src="${flagSrc}" class="mb-3 card-img-top" alt="Vlag ${countryName}">
                        <h5 class="card-title mb-2">${countryName}</h5>
                        <p class="fw-light mb-0">Regio: ${region}</p>
                        <p class="fw-light">Populatie: ${population}</p>
                        <div class="mt-auto">
                            <div class="d-grid gap-2 d-md-flex justify-content-between mt-2">
                                <button class="btn btn-primary btn-sm details-btn">Details</button>
                                <button class="btn ${isFav ? "btn-warning" : "btn-outline-warning"} btn-sm fav-btn">
                                ${isFav ? "★ Verwijder" : "☆ Favoriet"}</button>
                            </div>
                        </div>
                        `;

        const detailsBtn = body.querySelector(".details-btn");
        const favBtn = body.querySelector(".fav-btn");

        detailsBtn.addEventListener("click", () => onCountryClick(country));

        favBtn.addEventListener("click", () => {
            onFavoriteToggle(country);
        });

        card.appendChild(body);
        col.appendChild(card);
        container.appendChild(col);
    });
}
