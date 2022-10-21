//récupération du panier sous forme de json
const localStorageCart = getFromLocalStorage() ? getFromLocalStorage() : null;
let products;

createAll();

async function createAll(){

    products = await fetch(`http://localhost:3000/api/products/`).then(function(res){
        if (res.ok) {
            return res.json();
        }
        }).then(function(products){
            return products;
    });

    const productsInCart = getFromLocalStorage();

    productsInCart.forEach(productInCart => {
        //let product = getProductAsObject(productInCart._id);
        let product = products.find(product => product._id === productInCart._id);

        // product pour les infos "fixes" (url d'image, etc)
        // productInCart pour infos sur l'élément précis qui a été ajouté (couleur, quantité)
        displayCartProduct(product, productInCart); 


    });
    
}

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
    const fragment = productImageFragment.appendChild(imageDiv);

    return fragment;
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
    productPrice.innerHTML = product.price;

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
function createItemQuantitySettings(productInCart){
    const cartItemQuantitySettings = document.createElement('div');
    cartItemQuantitySettings.classList.add('cart__item__content__settings__quantity');

    const itemQuantity = document.createElement('p');
    itemQuantity.innerHTML = "Qté : ";

    const itemQuantityInput = document.createElement('input');
    itemQuantityInput.type = "number";
    itemQuantityInput.classList.add('itemQuantity');
    itemQuantityInput.name = "iteemQuantity";
    itemQuantityInput.value = productInCart.quantity;
    itemQuantityInput.setAttribute('min', 1);
    itemQuantityInput.setAttribute('max', 100);

    cartItemQuantitySettings.appendChild(itemQuantity);
    cartItemQuantitySettings.appendChild(itemQuantityInput);

    return cartItemQuantitySettings;
}

/**
 * Adds the whole tab of kanaps to the cart, usually with the new kanap
 * 
 * @param {Array} products - the tab containing all kanaps, will replace the current one
 */
 function saveToLocalStorage(products) {
    localStorage.setItem('kanapCart', JSON.stringify(products));
}

function getFromLocalStorage() {
    return localStorageHasKey() ? JSON.parse(localStorage.getItem('kanapCart')) : [];
}

function localStorageHasKey() {
    return localStorage.getItem('kanapCart');
}