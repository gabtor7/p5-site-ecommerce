export default class Helpers{
    /**
     * Adds the whole tab of kanaps to the cart, usually with the new kanap
     * 
     * @param {Array} products - the tab containing all kanaps, will replace the current one
     */
    static saveToLocalStorage(products) {
        localStorage.setItem('kanapCart', JSON.stringify(products));
    }
    
    static getFromLocalStorage() {
        return localStorageHasKey() ? JSON.parse(localStorage.getItem('kanapCart')) : [];
    }
    
    static localStorageHasKey() {
        return localStorage.getItem('kanapCart');
    }

}