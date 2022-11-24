/**
 * Adds the whole tab of kanaps to the cart, usually with the new kanap
 *
 * @param {Array} products - the tab containing all kanaps, will replace the current one
 */
 export function saveToLocalStorage(products) {
    products.forEach((product) => delete product.altTxt);
    products.forEach((product) => delete product.description);
    products.forEach((product) => delete product.imageUrl);
    products.forEach((product) => delete product.name);
    localStorage.setItem('kanapCart', JSON.stringify(products));
}

/**
 * Gets the cart from LocalStorage
 * 
 * @return {any|*[]} - the cart in JSON format, if it exists
 */
export function getFromLocalStorage() {
    return localStorageHasKey() ? JSON.parse(localStorage.getItem('kanapCart')) : [];
}

/**
 * Checks if the cart we want to use exists
 * 
 * @return {string} - the cart, if it exists. Otherwise returns a null value.
 */
export function localStorageHasKey() {
    return localStorage.getItem('kanapCart');
}

/**
 * Clear the localStorage, used when the order has been passed
 */
export function clearLocalStorage(){
    localStorage.clear();
}
