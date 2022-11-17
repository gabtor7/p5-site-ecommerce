import { getFromLocalStorage, saveToLocalStorage } from "./helpers.js";

const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get('id');
let product, colorIsOk, qtyIsOk;

const addBtn = document.getElementById('addToCart');
const quantity = document.getElementById('itemQuantity');
const colors = document.getElementById('color-select');

/**
 * Enables the Add to cart button
 */
function enableAddBtn(){
    if(qtyIsOk && colorIsOk){
        addBtn.disabled = false;
    }
}

/**
 * Creates a products and adds its data in the corresponding fields
 */
async function createProduct() {
    product = await fetch(`http://localhost:3000/api/products/${id}`).then(function(res){
        if (res.ok) {
            return res.json();
        }
    }).then(function(product){
        return product;
    });

    const img = document.createElement('img');
    img.setAttribute('src', product.imageUrl);
    img.setAttribute('alt', product.name);
    document.querySelector('.item__img').appendChild(img);

    const title = document.getElementById('title');
    const name = document.createTextNode(product.name);
    title.appendChild(name);

    document.getElementById('price').appendChild(document.createTextNode(product.price));
    document.getElementById('description').appendChild(document.createTextNode(product.description));

    // Pour les couleurs, faire une boucle
    for(let i = 0; i < product.colors.length; i++){
        let option = document.createElement('option');
        option.value = product.colors[i];
        option.label = product.colors[i];

        colors.add(option);
    }
}

/**
 * JSDOC
 */
(async function init() {
    await createProduct();

    /********** Event listeners **********/
    quantity.addEventListener('change', () => {
        const value = Number(quantity.value);

        if(value > 0 && value < 101){
            qtyIsOk = true;
            enableAddBtn();
        } else {
            alert('Merci de choisir une quantité entre 1 et 100.');
            quantity.value = 1;
        }
    });

    colors.addEventListener('change', () => {
        // Vérifier la selection d'une couleur par l'utilisateur
        if(colors.value){
            colorIsOk = true;
            enableAddBtn();
        } else {
            alert('Veuillez choisir une couleur de canapé');
        }
    });


    // Listening for clicks on the "Add to cart" button
    addBtn.addEventListener("click", function(){
        let kanap = {
            _id: product._id,
            color: colors.value,
            quantity: Number(quantity.value),
        };

        processLocalStorage(kanap);
    });
})();


/**
 * Processes localStorage to add a new kanap
 *
 * @param {Object} kanap - the kanap information to be added
 */
function processLocalStorage(kanap) {
    let products = getFromLocalStorage();
    let productCart = products.find(product => product._id === id && product.color === colors.value);
    //let totalWithProdInCart = quantityInCart(productCart._id, productCart.color)

    // Vérification et création d'un panier dans le localStorage s'il n'y en a pas, puis ajout du produit
    if (productCart) {
        productCart.quantity = productCart.quantity + kanap.quantity;
        if(productCart.quantity > 100){
            alert('La quantité totale de cet article dépasse 100. Les articles en trop seront ignorés.');
            productCart.quantity = 100;
        }
    } else {
        products.push(kanap);
    }

    saveToLocalStorage(products);
}
