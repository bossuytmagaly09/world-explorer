const STORAGE_KEY = "world-explorer-favorites";
/**
 * Lees favorieten uit localStorage.
 * @returns {Array} lijst van favoriete landen (of lege array)
 */
export function loadFavorites() {
// TODO:
// - lees uit localStorage met STORAGE_KEY
// - parse JSON
// - ga veilig om met null / parse errors
    try{
        const json = localStorage.getItem(STORAGE_KEY);
        if(!json) return [];

        const data = json.parse(json);

        return array.isArray(data) ? data : [];
    }catch (err){
        console.error("Fout bij het lezen van favorieten.", err);
        return [];
    }

}
/**
 * Schrijf favorieten naar localStorage.
 * @param {Array} favorites
 */
export function saveFavorites(favorites) {
// TODO:
// - stringify favorites
// - schrijf naar localStorage
    export function saveFavorites(favorites) {
        try {
            const json = JSON.stringify(favorites);
            localStorage.setItem(STORAGE_KEY, json);
        } catch (err) {
            console.error("Fout bij opslaan van favorieten:", err);
        }
    }
}