import { clearElement, createElement } from "../utils/dom.js";

/**
 * Render statistieken in #stats_panel.
 * @param {Object} stats
 * @param {number} stats.totalCountries
 * @param {number} stats.averagePopulation
 * @param {number} stats.favoritesPopulation
 */
export function renderStats(stats) {
    const panel = document.querySelector("#stats_panel");
    if (!panel) return;

    clearElement(panel);

    const { totalCountries, averagePopulation, favoritesPopulation } = stats;

    // Kaarten met cijfers
    const cardsRow = createElement("div", "row gy-3 mb-3");

    const card1 = createStatCard("Aantal landen", totalCountries.toString());
    const card2 = createStatCard(
        "Gemiddelde populatie",
        averagePopulation.toLocaleString("nl-BE")
    );
    const card3 = createStatCard(
        "Totale populatie favorieten",
        favoritesPopulation.toLocaleString("nl-BE")
    );
    cardsRow.appendChild(card1);
    cardsRow.appendChild(card2);
    cardsRow.appendChild(card3);
    panel.appendChild(cardsRow);
// Eenvoudige bar chart
  //  const barRow = createElement("div", "row bar-chart-row");
// TODO:
// - bereken relatieve hoogtes (bijv. in procent)
// - maak voor elk stat een "bar" div
  //  panel.appendChild(barRow);

    // ---------- Bar chart ----------
    const barRow = createElement("div", "row text-center mt-1 bar-chart-row");

// Bepaal max-waarde voor schaal
    const maxValue = Math.max(totalCountries, averagePopulation, favoritesPopulation);

// Helper om bar te maken
    function createBar(label, value, colorClass) {
        const col = createElement("div", "col-md-4 text-center");

        // Kaart met alleen de bar
        const wrapper = createElement("div", "border rounded p-2 bar-wrapper", "");

        const bar = createElement("div", `bar ${colorClass}`);
        bar.style.height = `${(value / maxValue) * 100}%`;

        const barContainer = createElement("div", "bar-container");
        barContainer.appendChild(bar);
        wrapper.appendChild(barContainer);

        // Label ONDER de kaart
        const labelEl = createElement("div", "mt-2 text-muted", label);

        col.appendChild(wrapper);   // eerst de container
        col.appendChild(labelEl);   // dan de tekst eronder

        return col;
    }

// Bars aanmaken
    barRow.appendChild(
        createBar("Aantal landen", totalCountries, "bar-blue")
    );
    barRow.appendChild(
        createBar("Gem. populatie", averagePopulation, "bar-green")
    );
    barRow.appendChild(
        createBar("Populatie favorieten", favoritesPopulation, "bar-yellow")
    );

    panel.appendChild(barRow);

}
function createStatCard(label, valueText) {
    const col = createElement("div", "col-md-4");
    const card = createElement("div", "border rounded p-3 h-100");
    const labelEl = createElement("div", "small text-muted mb-1", label);
    const valueEl = createElement("div", "h5 mb-0", valueText);
    card.appendChild(labelEl);
    card.appendChild(valueEl);
    col.appendChild(card);
    return col;
}
