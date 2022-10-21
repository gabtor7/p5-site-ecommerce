/**
 * Adds the whole tab of kanaps to the cart, usually with the new kanap
 *
 * @param {Array} products - the tab containing all kanaps, will replace the current one
 */
 export function saveToLocalStorage(products) {
    localStorage.setItem('kanapCart', JSON.stringify(products));
}

/**
 *
 * @return {any|*[]}
 */
export function getFromLocalStorage() {
    return localStorageHasKey() ? JSON.parse(localStorage.getItem('kanapCart')) : [];
}

/**
 *
 * @return {string}
 */
export function localStorageHasKey() {
    return localStorage.getItem('kanapCart');
}
