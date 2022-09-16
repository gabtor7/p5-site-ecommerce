// chercher l'url 
fetch("http://localhost:3000/api/products/").then(function(res){
    if (res.ok) {
        return res.json();
    }
}).then(function(products){
    // récupérer id depuis l'url
    var searchParams = new URLSearchParams( (window.location.search) );
    var prodId = searchParams.getAll('id');
    console.log(prodId);
    // avec l'id récupérer le produit correspondant dans le tableau
    //Ataoyyyy gimme produit in the FUKEN tableau ples.
    var product = null;

    console.log(products);

    

    products.every(prod => {
        if(prod._id == prodId){
            product = prod;
            return false;
        }

        return true;
    })
    
    document.querySelector('.item__img').innerHTML += "<img src=" + product.imageUrl + " alt=" + product.name + ">";

    document.getElementById('title').innerHTML += product.name;
    document.getElementById('price').innerHTML += product.price;
    document.getElementById('description').innerHTML += product.description;
    
    var prodColors= "";
    for(i=0; i<product.colors.length; i++){
        prodColors += "<option value=" + product.colors[i] + ">" + product.colors[i] + "</option>";
    }
    
    document.getElementById('colors').innerHTML += prodColors;
    // afficher les éléments aux bons endroits
    // -- pour les couleurs, faire une boucle

});