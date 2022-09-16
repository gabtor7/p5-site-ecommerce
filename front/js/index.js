
fetch("http://localhost:3000/api/products/").then(function(res){//res = resultat du fetch (liste/tableau des canapés)
  if(res.ok){
    return res.json();//resultat converti en tableau depuis le json
  }
}).then(function(products){//value = tableau des canapés (un canapé = un objet)
    
  var displaySection = document.getElementById("items");

  products.forEach(product => {

    var article = `<a href="product.html?id=` + product._id + `">
                      <article>
                        <img src="` + product.imageUrl + `" alt="` + product.altTxt + `">
                        <h3 class="productName">` + product.name + `</h3>
                        <p class="productDescription">` + product.description + `</p>
                      </article>
                    </a>`;

    displaySection.innerHTML += article;
    //pour référence ci-dessus
    /*<a href="./product.html?id=42">
          <article>
            <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
            <h3 class="productName">Kanap name1</h3>
            <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
          </article>
        </a> */
    });
});