const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get('id');
let product, colorIsOk, qtyIsOk;
let allKanaps = [];
let jsonCart;

const addBtn = document.getElementById('addToCart');
addBtn.disabled = true;
const quantity = document.getElementById('itemQuantity');
const colors = document.getElementById('color-select');

function enableAddBtn(){
    if(qtyIsOk && colorIsOk){
        addBtn.disabled = false;
    }

    if(addBtn.disabled === true){
        addBtn.style.opacity = '0.7';
        addBtn.style.pointerEvents = 'none';
    } else {
        addBtn.style.opacity = null;
        addBtn.style.pointerEvents = null;
    }
}

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
    enableAddBtn();
}

(async function init() {
    await createProduct();

    /********** Event listeners **********/
    quantity.addEventListener('change', () => {
        if(1 <= quantity.value <= 100){
            qtyIsOk = true;
            enableAddBtn();
        } else {
            alert('Merci de choisir une quantité entre 1 et 100.');
            return;
        }
    });

    colors.addEventListener('change', () => {
        // Vérifier la selection d'une couleur par l'utilisateur
        if(colors.value){
            colorIsOk = true;
            enableAddBtn();
        } else {
            alert('Veuillez choisir une couleur de canapé');
            return;
        }
    });


    // Listening for clicks on the "Add to cart" button
    addBtn.addEventListener("click", function(){       
        let kanap = {
            _id: product._id,
            color: colors.value,
            quantity: Number(quantity.value)
        };

        processLocalStorage(kanap);

        // when adding to the cart, check if a similar article has been added
        // if same article but different color: add to the subarray
    });
})();

function processLocalStorage(kanap) {

    // Ajout du kanap au tableau/panier de kanaps
    addToTab(kanap);

    // Vérification et création d'un panier dans le localStorage si il n'y en a pas, puis ajout du produit
    addToCart('kanapCart', allKanaps);
}

/**
 * Adds the desired kanap to a tab containing all kanaps in the cart
 * @param {Object} kanap - the kanap to be added
 */
function addToTab(kanap){
    
    if(canBeAdded(kanap)){
        allKanaps.push(kanap);
        jsonCart = {
            'products': allKanaps,
        };
        console.log('Produit ajouté au panier.');
    }
}

function canBeAdded(kanap){
    let addToTab = false;
    if(!jsonCart){
        addToTab = true;
    }else{
        jsonCart['products'].forEach(prod => {
            if(kanap._id == prod._id){
                if(kanap.color == prod.color){
                    // id et couleur existants (sum de quantité), pas d'ajout, modification du total du kanap existant
                    checkQtyKanap(kanap, prod);
                } else {
                    // id existe dans le panier mais pas la couleur, on ajoute
                    addToTab = true;
                }
            } else {
                // id non existant dans le panier, on ajoute
                addToTab = true;
            }
        });
    }
    return addToTab;
}

/**
 * Adds the whole tab of kanaps to the cart, usually with the new kanap
 * @param {String} cartName - name of the cart in localStorage
 * @param {Array} tabAllKanap - the tab containing all kanaps, will replace the current one
 */
function addToCart(cartName, tabAllKanap){
    localStorage.setItem(cartName, JSON.stringify(tabAllKanap));
    
}

function checkQtyKanap(kanapToAdd, kanapInCart){
    // On attribuera la somme total au kanapInCart
    if((kanapToAdd.quantity + kanapInCart.quantity) > 100){
        kanapInCart.quantity = 100;
        alert('Vous ne pouvez pas avoir plus de 100 kanap. Les kanap en trop seront ignorés.')
    } else {
        kanapInCart.quantity += kanapToAdd.quantity;
    }
}