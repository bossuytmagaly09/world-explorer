// components/statsPanel.js
import { clearElement, createElement } from "../utils/dom.js";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

let statsChart = null;

export function renderStats(stats = {}) {
    const container = document.querySelector("#stats_panel");
    if (!container) return;

    clearElement(container);

    const cardsWrapper = createElement("div", "row g-3 mb-3");
    container.appendChild(cardsWrapper);

    const total = stats.totalCountries ?? 0;
    const avg = stats.averagePopulation ?? 0;
    const fav = stats.favoritesPopulation ?? 0;

    function createStatCard(title, value){
        const col = createElement("div", "col-md-4");
        col.innerHTML = `
            <div class="card">
                <div class="card-body text-center">
                    <h6>${title}</h6>
                    <div class="display-6 fw-bold">${value.toLocaleString()}</div>
                </div>
            </div>
        `;
        return col;
    }

    cardsWrapper.appendChild(createStatCard("Aantal landen", total));
    cardsWrapper.appendChild(createStatCard("Gem. populatie", avg));
    cardsWrapper.appendChild(createStatCard("Populatie favorieten", fav));

    // grafiek
    const chartRow = createElement("div", "mt-3");
    const card = createElement("div", "card");
    const cardBody = createElement("div", "card-body");
    const canvas = createElement("canvas");
    canvas.id = "stats_chart";
    canvas.style.maxHeight = "300px";

    cardBody.appendChild(canvas);
    card.appendChild(cardBody);
    chartRow.appendChild(card);
    container.appendChild(chartRow);

    if (statsChart) statsChart.destroy();

    statsChart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: ["Aantal landen", "Gem. populatie", "Favorieten populatie"],
            datasets: [{
                label: "Statistieken",
                data: [total, avg, fav],
                backgroundColor: ["#0d6efd", "#6c757d", "#ffc107"],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}
