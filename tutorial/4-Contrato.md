## Coding: Nuestro contrato
Empezaremos por modificar `./contracts/EtherPress.sol` y ver como Embark recompila todo por nosotros mientras realizamos cambios.

### Funciones
Empecemos por escribir funciones para nuestro contrato:

#### Crear un artículo
La funcion `create` sera utilizada para crear nuestros artículos. Necesitamos agregar un nuevo post al arreglo `posts[]` y emitir un evento indicando que un nuevo artículo fue creado.

1. Agregamos un `Post` al arreglo, ingresando sus detalles. Para la fecha de creacion usa `block.timestamp`
```
uint postId = posts.length++;
posts[postId] = Post({
    creationDate: block.timestamp,
    description: _description,
    owner: msg.sender,
    upvotes: 0,
    downvotes: 0
});
```
2. Generamos un evento
```
emit NewPost(postId, msg.sender, _description);
```

#### Votar por un artículo
Queremos poder asignarle una puntuación a nuestro artículo. Para eso, trabajemos en la funcion `vote()` donde los usuarios podran sumar o restar puntos a cada registro. NOTA: este sistema de puntuación es muy inocente y no recomendado para usarse en la vida real.

1. Determinemos si el artículo existe y si ya hemos votado anteriormente
```
Post storage p = posts[_postId];
require(p.creationDate != 0, "Post does not exist");
require(p.voters[msg.sender] == Ballot.NONE, "You already voted on this post");
```

2. Guardemos nuestro voto y actualicemos el score del artículo
```
Ballot b = Ballot(_vote);
if (b == Ballot.UPVOTE) {
    p.upvotes++;
} else {
    p.downvotes++;
}
l.voters[msg.sender] = b;
```

3. Generemos un evento
````
emit Vote(_postId, msg.sender, _vote);
````

#### Determinar si podemos votar en un artículo
Necesitamos poder indicarle a los usuarios si ellos pueden votar o no por un artículo. Hay dos escenarios en los cuales un usuario no puede votar: a) El artículo no existe, y b) Ya se votó anteriormente. Trabajemos en la funcion `canVote`

1. Podemos determinar si el artículo existe si el Id del mismo es valido
```
if(_postId > posts.length - 1) return false;
```

2. Si el artículo existe, es cuestion de ver la dirección que invoca el contrato ya votó
```    
Post storage p = posts[_postId];    
return (p.voters[msg.sender] == Ballot.NONE);
```

#### Determinar cual fue nuestro voto
En caso de que el usuario ya haya votado, es posible que tenga interés en saber cual fue su decisión. Implementemos esto en `getVote`.
```
Post storage p = posts[_postId];
return uint8(p.voters[msg.sender]);
```
> Observa que en las ultimas dos funciones los valores de entrada y salida relacionados con el voto son uint8 en vez de un enum. Esto se debe a que web3js no soporta aun el uso de enums.
