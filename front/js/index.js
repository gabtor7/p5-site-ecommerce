fetch("http://localhost:3000/api/products/").then(function(res){//res = resultat du fetch (liste/tableau des canapés)
              if(res.ok){
                return res.json();//resultat converti au format json
              }
            }).then(function(value){//value = tableau des canapés (un canapé = un objet)
                value.forEach(product => console.log(product.name));
            });