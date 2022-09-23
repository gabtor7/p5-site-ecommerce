// chercher l'url 
fetch("http://localhost:3000/api/products/").then(function(res){
    if (res.ok) {
        return res.json();
    }
}).then(function(products){
    // récupérer id depuis l'url
    var searchParams = new URLSearchParams( (window.location.search) );
    var prodId = searchParams.getAll('id');
    // avec l'id, récupérer le produit correspondant dans le tableau
    var product = null;

    products.every(prod => {
        if(prod._id == prodId){
            product = prod;
            return false;
        }

        return true;
    })
    
    // afficher les éléments aux bons endroits
    document.querySelector('.item__img').innerHTML += "<img src=" + product.imageUrl + " alt=" + product.name + ">";

    document.getElementById('title').innerHTML += product.name;
    document.getElementById('price').innerHTML += product.price;
    document.getElementById('description').innerHTML += product.description;
    
    // -- pour les couleurs, faire une boucle
    var prodColors= "";
    for(i=0; i<product.colors.length; i++){
        prodColors += "<option value=" + product.colors[i] + ">" + product.colors[i] + "</option>";
    }
    
    document.getElementById('colors').innerHTML += prodColors;

    //vérifier si click sur addToCart
    const addBtn = document.getElementById('addToCart');

    //listening for clicks on the "Add to cart" button
    addBtn.addEventListener("click", function(){
        //create array containing information about the added sofa id=>[color=>[quantity]]
        //get the quantity, check if amount is correct (between 1 and 100)
        let kanapQty = document.getElementById('quantity').value;
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

        //create the array
        let kanapId = product._id;

        //let strKanapColor = kanapColor.toString();
        //let strKanapQty = kanapQty.toString(); 

        //create item to add to the cart [id: [color: quantity]]
        let kanapColQty = {kanapColor: kanapQty};
        let kanapToAdd = {kanapId: kanapColQty};

        //before adding, check if there is an existing cart in localStorage
        if ( !localStorage.getItem('kanapCart') ){
            //no existing cart was found, so one is created with the current kanap being its first item
            localStorage.setItem('kanapCart', JSON.stringify(kanapToAdd));
        } else {
            //add in localStorage in the existing array
            //get the array from the cart and convert it to JSON format
            let cart = JSON.stringify(localStorage.getItem('kanapCart'));

            //run/loop through the cart and check if the ID we're trying to add isn't already in the cart
            //it exists: check if the color is the same
            // same color: we add to the quantity
            //  if qty > 100 display a warning and cap the maximum to 100
            //  else simply add the desired number to the sum
            // not the same color: add the object {color: qty}
            //it does not exist, add the whole thing

        }
        


        //when adding to the cart, check if a similar article has been added
        //if same article but different color: add to the subarray 
        
    });

});