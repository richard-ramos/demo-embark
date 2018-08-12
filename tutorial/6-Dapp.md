## Coding: dApp
Usemos el objeto EtherPress creado en base a nuestro contrato y el API de `EmbarkJS` para interactuar con nuestro contrato desde la DApp. Mientras actualizamos los archivos, veamos como Embark vigila los cambios y los compila cada vez que guardamos.

###### `Create.js`

1. Importemos EmbarkJS, web3 y nuestro contrato
```
import EmbarkJS from 'Embark/EmbarkJS';
import EtherPress from 'Embark/contracts/EtherPress';
import web3 from 'Embark/web3';
```

2. Debemos actualizar el event `handleClick`, que se dispara cuando presionamos el botón 'Publicar'. Este se encargará de guardar la información en IPFS, invocar nuestro contrato. Necesitamos obtener un estimado del gas necesario, y llamar a la funcion `create` de nuestro contrato.


Guardemos el contenido del artículo en IPFS
```
const ipfsHash = await EmbarkJS.Storage.saveText(JSON.stringify(textToSave))
```

Luego, estimemos cuanto gas es necesario para ejecutar la función create del contrato

```
const {create} = EtherPress.methods;    
const toSend = await create(web3.utils.toHex(ipfsHash));
const estimatedGas = toSend.estimateGas();
```

Finalmente, invoquemos nuestro contrato
```
const receipt = await toSend.send({from: web3.eth.defaultAccount, 
                                   gas: estimatedGas + 1000});
console.log(receipt);
```

###### `App.js`
1. Importemos EmbarkJS, nuestro contrato
```
import EmbarkJS from 'Embark/EmbarkJS';
import EtherPress from 'Embark/contracts/EtherPress';
```

2. Llamemos a la funcion `this._loadPosts()` cuando Embark este inicializado, dentro de `componentDidMount`
```
EmbarkJS.onReady(() => {
    this._loadPosts();
});
```

3. Usemos las funciones `posts` y `numPosts` para extraer nuestros articulos del contrato.

```
const {posts, numPosts} = EtherPress.methods;
```

Con la funcion `numPosts` podemos extraer el total de artículos registrados
```
const total = await numPosts().call();
```

Y luego, dentro de un ciclo, llamaremos a `posts` para obtener cada articulo de forma individual.

```
const post = posts(i).call();
```
> Notese que aqui no utilizamos await. No es buena practica hacer await dentro de un ciclo. Es mejor cargar todas las promesas en un arreglo y llamar a `Promise.all`

###### `Post.js`

1. Importemos EmbarkJS, web3 y nuestro contrato
```
import EmbarkJS from 'Embark/EmbarkJS';
import EtherPress from 'Embark/contracts/EtherPress';
import web3 from 'Embark/web3';
```

2. Llamemos a la funcion `this._loadAttributes()` cuando Embark este inicializado, dentro de `componentDidMount`
```
EmbarkJS.onReady(() => {
    this._loadAttributes();
});
```
3. Edita la funcion `_loadAttributes`. Obten el contenido almacenado en IPFS, y conviertelo a un objeto JSON
```
const ipfsText = await EmbarkJS.Storage.get(ipfsHash);
const jsonContent = JSON.parse(ipfsText);
const title = jsonContent.title;
const content = jsonContent.content;
this.setState({title, content});
```

4. Determina si el usuario puede votar por este artículo
```
const {canVote} = EtherPress.methods;
const votingEnabled = await canVote(this.props.id).call();
this.setState({canVote: votingEnabled});
```

5. Edita la funcion `_vote`. Estimemos el costo de llamar a la funcion `vote` del contrato.
```
const {vote} = EtherPress.methods;
const toSend = vote(this.props.id, choice);
const estimatedGas = await toSend.estimateGas();
```

6. Crea la transacción
```
const receipt = toSend.send({gas: estimatedGas + 1000});
```

#### Evaluemos nuestra DApp y resolvamos cualquier error
Intentemos usar nuestra DApp a ver que tal nos quedo, y tratemos de solucionar cualquier error que hayamos introducido.