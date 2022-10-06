const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get('id');
// chercher l'url 
fetch(`http://localhost:3000/api/products/${id}`).then(function(res){
    if (res.ok) {
        return res.json();
    }
}).then(function(product){
    // récupérer id depuis l'url
    // --- dans fn --- >>
    console.log(product);
    
    // afficher les éléments aux bons endroits
    const img = document.createElement('img');
    img.setAttribute('src', product.imageUrl);
    img.setAttribute('alt', product.name);
    document.querySelector('.item__img').appendChild(img);

    const title = document.getElementById('title');
    const name = document.createTextNode(product.name);
    title.appendChild(name);
    
    document.getElementById('price').appendChild(document.createTextNode(product.price));
    document.getElementById('description').appendChild(document.createTextNode(product.description));
    
    // -- pour les couleurs, faire une boucle
    let productColors = document.getElementById('colors');
    for(let i = 0; i < product.colors.length; i++){
        let option = document.createElement('option');
        option.value = product.colors[i];
        option.label = product.colors[i];

        productColors.add(option);
    }

    //vérifier si click sur addToCart
    const addBtn = document.getElementById('addToCart');

    //listening for clicks on the "Add to cart" button
    addBtn.addEventListener("click", function(){
        //create array containing information about the added sofa id=>[color=>[quantity]]
        //get the quantity, check if amount is correct (between 1 and 100)
        let kanapQty = parseInt(document.getElementById('quantity').value);
        let qtyOk = false; //product won't be added to cart as long as this is false

        if(kanapQty > 100){

            alert('Vous ne pouvez pas commander plus de 100 canapés. 100 canapés seront ajoutés à votre panier.');
            kanapQty = 100;
            qtyOk = true;

        } else if(kanapQty < 1) {

            alert('Merci de bien vouloir saisir une quantité valide.');

        } else {
            qtyOk = true;
        }

        //check if a color has been selected
        let kanapColor = document.getElementById('colors').value;

        if( !kanapColor ){
        
            alert('Veuillez choisir une couleur de canapé');
        
        }

        //create the array
        let kanapId = product._id;

        //create item to add to the cart [id: [color: quantity]]
        let kanapColQty = {};

        if( qtyOk ){
        
            kanapColQty[kanapColor] = kanapQty;
        
        }

        let kanapToAdd = {};
        kanapToAdd[kanapId] = kanapColQty;
        
        //before adding, check if there is an existing cart in localStorage
        if ( !localStorage.getItem('kanapCart') ){
            
            //no existing cart was found, so one is created with the current kanap being its first item
            localStorage.setItem('kanapCart', JSON.stringify(kanapToAdd));
            console.log('Produit ajouté au panier');

        } else {
            
            //add in localStorage in the existing array

            //get the array from the cart and convert it to JSON format
            let cart = localStorage.getItem('kanapCart');
            let jsonCart = JSON.parse(cart);

            //check if the ID we're trying to add isn't already in the cart
            if(  product._id in jsonCart ){
                console.log('id existant' + jsonCart);

                //it exists: check if the color is the same
                
                if( jsonCart[kanapId].hasOwnProperty(kanapColor) ){
                    let qty = parseInt(jsonCart[kanapId][kanapColor]);
                    qty += kanapQty;
                    jsonCart[kanapId][kanapColor] = qty;
                    console.log(jsonCart);
                    // same color: we add to the quantity
                    //  if qty > 100 display a warning and cap the maximum to 100
                    //  else simply add the desired number to the sum

                } else {
                    
                }
                // not the same color: add the object {color: qty}

            }

            //it does not exist, add the whole thing

        }
        


        //when adding to the cart, check if a similar article has been added
        //if same article but different color: add to the subarray 
        
    });

});