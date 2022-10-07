const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get('id');
let product, colorIsOk, qtyIsOk;

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
        if(!colors.value){
            alert('Veuillez choisir une couleur de canapé');
            return;
        } else {
            colorIsOk = true;
            enableAddBtn();
        }
    });


    // Listening for clicks on the "Add to cart" button
    addBtn.addEventListener("click", function(){
        // Create array containing information about the added sofa id=>[color=>[quantity]]
        // // Create the array
        // let kanapId = product._id;
        // // Create item to add to the cart [id: [color: quantity]]
        // let kanapColQty = [];
        //
        // if(qtyOk){
        //     kanapColQty[kanapColor] = kanapQty;
        // } else {
        //     alert(kanapQty);
        // }

        let kanap = {
            _id: product._id,
            colors: colors.value,
            quantity: Number(quantity.value)
        };

        processLocalStorage(kanap);

        // when adding to the cart, check if a similar article has been added
        // if same article but different color: add to the subarray
    });
})();

function processLocalStorage(object) {
    // Si l'objet n'existe pas dans le localStraoge, dans ce on le crée
    // A l'inverse, si l'objet existe déjà (id et couleur identiques), dans ce cas on l'ajoute

    // Avant ajout on vérifie l'existence d'un panier dans le localStorage
    if (!localStorage.getItem('kanapCart')){
        // Aucun panier trouvé, on en crée un et ajoute le kanap courant
        localStorage.setItem('kanapCart', JSON.stringify(object));
        console.log(kanapCart);
    } else {
        // Add in localStorage in the existing array
        // Get the array from the cart and convert it to JSON format
        let cart = JSON.stringify(localStorage.getItem('kanapCart'));
        let jsonCart = JSON.parse(cart);
        console.log(jsonCart.json());

        //run/loop through the cart and check if the ID we're trying to add isn't already in the cart

        //it exists: check if the color is the same
        // same color: we add to the quantity
        //  if qty > 100 display a warning and cap the maximum to 100
        //  else simply add the desired number to the sum
        // not the same color: add the object {color: qty}
        //it does not exist, add the whole thing
    }
}
