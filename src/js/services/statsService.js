const EXCHANGE_API_BASE = "https://open.er-api.com/v6/latest";
/**
 * Haal wisselkoers op van EUR naar currencyCode.
 * @param {string} currencyCode bijv. "USD"
 * @returns {Promise<number|null>} wisselkoers of null bij fout
 */
export async function fetchRateToEuro(currencyCode) {

    try{
        const url = `${EXCHANGE_API_BASE}/EUR?symbols=${currencyCode}`;

        const resp = await fetch(url);
        if (!resp.ok) return null

        const data = await resp.json();

        const rate = data.rates?.[currencyCode];
        return typeof rate === "number" ? rate : null;

    }catch(err){
        console.error("Fout bij wisselkoers:", err)
        return null;
    }

}
/**
 * Bereken statistieken op basis van gefilterde landen en favorieten.
 * @param {Array} countries huidige gefilterde landen
 * @param {Array} favorites lijst van favorieten
 */
export function calculateStats(countries, favorites) {
    const totalCountries = countries.length;

    const averagePopulation = totalCountries > 0
        ? Math.round(
            countries.reduce((sum, c) => sum + (c.population ?? 0), 0) /
            totalCountries
        )
        : 0;
    const favoritesPopulation = favorites.reduce((sum, fav) => sum + (fav.population ?? 0),0);

    return {
        totalCountries,
        averagePopulation,
        favoritesPopulation
    };
}