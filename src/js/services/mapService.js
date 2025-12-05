import L from "leaflet";
import "leaflet/dist/leaflet.css";

let map;
let marker;
let invalidateTimeout;

/**
 * Initialiseert de Leaflet-kaart in #country_map.
 */
export function initMap() {
    const mapContainer = document.querySelector("#country_map");
    if (!mapContainer) return;

    map = L.map(mapContainer).setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // fallback om kaart te refreshen als container later zichtbaar wordt
    setTimeout(() => {
        if (map) map.invalidateSize();
    }, 300);
}

/**
 * Zoomt in op een bepaald land en toont een marker met naam.
 * @param {number} lat
 * @param {number} lng
 * @param {string} name
 */
export function focusCountry(lat, lng, name) {
    if (!map) return;
    if (typeof lat !== "number" || typeof lng !== "number") {
        console.warn("Ongeldige coördinaten voor focusCountry");
        return;
    }

    clearTimeout(invalidateTimeout);

    const container = document.querySelector("#country_map");
    let attempts = 0;
    const maxAttempts = 20;
    const pollInterval = 100;

    function doFocus() {
        try {
            map.invalidateSize();
            map.setView([lat, lng], 6);

            if (marker) map.removeLayer(marker);

            marker = L.marker([lat, lng]).addTo(map);
            marker.bindPopup(`<strong>${name}</strong>`).openPopup();


            setTimeout(() => {
                if (map) map.invalidateSize();
            }, 200);

        } catch (e) {
            console.error("Map focus error:", e);
        }
    }

    function attempt() {
        attempts += 1;
        const w = container ? container.clientWidth : 0;
        const h = container ? container.clientHeight : 0;

        if (w > 20 && h > 20) {
            doFocus();
        } else if (attempts <= maxAttempts) {
            invalidateTimeout = setTimeout(attempt, pollInterval);
        } else {
            console.warn("Map container niet zichtbaar na wachten, probeer alsnog te focussen");
            doFocus();
        }
    }
    attempt();
}
