import {getFromLocalStorage, localStorageHasKey, saveToLocalStorage} from "./helpers.js";

// Récupération du panier sous forme de json
const productsInCart = localStorageHasKey() ? getFromLocalStorage() : null;
let productsInAPI;
let totalNbItems = 0;

(async function createAll() {
    if (!productsInCart) return;
    
    const arrayIds = productsInCart.map(product => product._id);
    
    // Promise.all permet de faire de multiples requêtes asynchrones en même temps et se résout en un tableau de résultats
    productsInAPI = await Promise.all(
        arrayIds.map(id => fetch(`http://localhost:3000/api/products/${id}`).then(response => response.json()))
    );
    
    productsInAPI.forEach((product, index) => displayCartProduct(productsInAPI[index], productsInCart[index]));
    displayAllItems();
    displayTotalPrice();
    
    const allDeleteBtns = document.querySelectorAll('.deleteItem');
    const itemQuantityBtns = document.querySelectorAll('.itemQuantity');
    
    allDeleteBtns.forEach(deleteBtn => {
            deleteBtn.addEventListener('click', () => {
                const article = deleteBtn.closest('article');
                let productIdToDelete = article.dataset.id;
                let productColorToDelete = article.getAttribute('data-color');
    
                deleteProductFromCart(productIdToDelete, productColorToDelete);
                article.remove();
                displayAllItems();
                displayTotalPrice();
            });
        }
    );
    
    itemQuantityBtns.forEach(itemQuantityBtn => {
        itemQuantityBtn.addEventListener('change', () => {
            // update de localStorage, on obtient le tableau
            let allCartItems = getFromLocalStorage();
            // trouver l'article le plus proche, get l'id du produit
            let productId = itemQuantityBtn.closest('article').dataset.id;
            // on trouve le porduit correspondant dans la tableau
            let itemToUpdate = allCartItems.find(product => product._id === productId);
            // on change la quantité 
            itemToUpdate.quantity = itemQuantityBtn.value;
            // on remet le tableau dans le localStorage
            saveToLocalStorage(allCartItems);
            
            // displayAllItems();
            // displayTotalPrice();
            location.reload();
            
        })
        
    });
})();

/**
 * Function displaying a product and its data on the page
 * 
 * @param {Object} product - product to be displayed
 * @param {Object} productInCart - see above
 */
function displayCartProduct(product, productInCart){
    // Création du fragment pour l'article à afficher
    const articleFragment = document.createDocumentFragment();
    const article = document.createElement('article');
    article.classList.add('cart__item');
    article.setAttribute('data-id', productInCart._id);
    article.setAttribute('data-color', productInCart.color);
    
    // Fragment contenant la partie image
    const productImageFragment = createImageFragment(product);
    article.appendChild(productImageFragment);
    
    // Fragment de contenu du produit
    const cartItemContent = document.createElement('div');
    cartItemContent.classList.add('cart__item__content');
    
    // Fragment de description du contenu
    const cartItemContentDescription = createItemDescriptionFragment(product, productInCart);
    cartItemContent.appendChild(cartItemContentDescription);
    
    // Fragment de contenu du produit - couleur
    const cartItemContentSettings = document.createElement('div');
    cartItemContentSettings.classList.add('cart__item__content__settings');
    
    // Fragment de contenu du produit - quantité
    const cartItemQuantitySettings = createItemQuantitySettings(productInCart);
    cartItemContentSettings.appendChild(cartItemQuantitySettings);
    
    // Bouton de suppression (inactif pour l'instant)
    const cartItemDelete = document.createElement('div');
    cartItemDelete.classList.add('cart__item__content__settings__delete');
    const deleteTxt = document.createElement('p');
    deleteTxt.classList.add('deleteItem');
    deleteTxt.innerHTML = "Supprimer";
    cartItemDelete.appendChild(deleteTxt);
    
    cartItemContentSettings.appendChild(cartItemDelete);
    
    cartItemContent.appendChild(cartItemContentSettings);
    
    article.appendChild(cartItemContent);
    articleFragment.appendChild(article);
    
    const cartItemsSection = document.getElementById('cart__items');
    cartItemsSection.appendChild(articleFragment);
}

/**
 * Function creating a fragment that will contain the image part of the product to be displayed in tha cart
 *
 * @param {Object} product - the product whose image will be displayed
 * @returns an HTML fragment of the image section
 */
function createImageFragment(product){
    const productImageFragment = document.createDocumentFragment();
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('cart__item__img');
    const img = document.createElement('img');
    img.setAttribute('src', product.imageUrl);
    img.setAttribute('alt', product.altTxt);
    
    imageDiv.appendChild(img);
    return productImageFragment.appendChild(imageDiv);
}

/**
 * Creates the item description fragment for the product to be displayed in the cart
 *
 * @param {Object} product - contains static information about the product
 * @param {Object} productInCart - contains non-static information about the product (the chosen color and the quantity)
 * @returns an HTML fragment containing a description of the product to be displayed
 */
function createItemDescriptionFragment(product, productInCart){
    const cartItemContentDescription = document.createElement('div');
    cartItemContentDescription.classList.add('cart__item__content__description');
    
    const productName = document.createElement('h2');
    productName.innerHTML = product.name;
    
    const productInCartColor = document.createElement('p');
    productInCartColor.innerHTML = productInCart.color;
    
    const productPrice = document.createElement('p');
    productPrice.innerHTML = product.price + " €";
    
    cartItemContentDescription.appendChild(productName);
    cartItemContentDescription.appendChild(productInCartColor);
    cartItemContentDescription.appendChild(productPrice);
    
    return cartItemContentDescription;
}

/**
 * Creates a fragment containing the color of the product to be displayed
 *
 * @param {Object} productInCart - contains the information about the color for the object of interest
 * @returns - and HTML fragment with the chosen color for the product
 */
function createItemQuantitySettings(productInCart) {
    const cartItemQuantitySettings = document.createElement('div');
    cartItemQuantitySettings.classList.add('cart__item__content__settings__quantity');
    
    const itemQuantity = document.createElement('p');
    itemQuantity.innerHTML = "Qté : ";
    
    const itemQuantityInput = document.createElement('input');
    itemQuantityInput.type = "number";
    itemQuantityInput.classList.add('itemQuantity');
    itemQuantityInput.name = "iteemQuantity";
    itemQuantityInput.value = productInCart.quantity;
    itemQuantityInput.setAttribute('min', '1');
    itemQuantityInput.setAttribute('max', '100');
    
    cartItemQuantitySettings.appendChild(itemQuantity);
    cartItemQuantitySettings.appendChild(itemQuantityInput);
    
    return cartItemQuantitySettings;
}

/**
 * Function updating the number of items in the cart, used when deleting an item or changing its quantity
 */
function displayAllItems() {
    totalNbItems = 0;
    
    if(productsInCart.length > 0){
         productsInCart.forEach(product => {
            totalNbItems = Number(totalNbItems) + Number(product.quantity);
        }); 
    } else {
        totalNbItems = 0;
    }
    
    document.getElementById('totalQuantity').innerHTML = totalNbItems;
}

function displayTotalPrice(){
    let totalCartPrice = 0;

    if(productsInCart.length > 0){
        productsInCart.forEach(product => {
            totalCartPrice += getProductPrice(product._id) * product.quantity;
       }); 
   } else {
       totalCartPrice = 0;
   }
    
    document.getElementById('totalPrice').innerHTML = totalCartPrice;
}

// Getter pour prix de kanap
function getProductPrice(productId){
    return productsInAPI.find(product => product._id === productId).price;
}

function deleteProductFromCart(productId, productColor) {
    // Aussi supprimer l'élément du localStorage (utiliser id)
    const productToDelete = productsInCart.find(product => product._id === productId && product.color === productColor);
    const index = productsInCart.indexOf(productToDelete);
    
    productsInCart.splice(index, 1);
    productsInAPI.splice(index, 1);
    
    saveToLocalStorage(productsInCart);
}
