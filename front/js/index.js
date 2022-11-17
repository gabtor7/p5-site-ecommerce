// Appel fetch pour récupérer les produits de l'api
fetch("http://localhost:3000/api/products")
.then(function(res) {
  if (res.ok) {
    return res.json();
  }
})
.then(function(products) {
  displayProducts(products);
})
.catch(function(err) {
  alert('Impossible d\'afficher les produits, veuillez réessayer ultérieurement.');
});

/**
 * Adds all products to the corresponding HTML element for display
 * @param {Array} products 
 */
function displayProducts(products){
  
  let items = document.getElementById('items');
  
  products.forEach(product => {
    
    items.appendChild(createProduct(product));

  })
}

/**
 * Creates an HTML fragment for a product with all its data 
 * @param {Object} product - the product to be displayed
 * @returns an HTML fragment for said product
 */
function createProduct(product){

  const articleFragment = document.createDocumentFragment();
  
  //création d'une node englobant le tout dans un lien
  const anchor = document.createElement('a');
  anchor.setAttribute('href', `product.html?id=${product._id}`);

  //création des enfants
  const article = document.createElement('article');
  anchor.appendChild(article);

  const img = document.createElement('img');
  img.setAttribute('src', product.imageUrl);
  img.setAttribute('alt', product.altTxt);

  const heading = document.createElement('h3');
  heading.classList.add('productName');
  heading.innerHTML = product.name;

  const pg = document.createElement('p');
  pg.classList.add('productDescription');
  pg.innerHTML = product.description;

  article.appendChild(img);
  article.appendChild(heading);
  article.appendChild(pg);

  return anchor;
}
