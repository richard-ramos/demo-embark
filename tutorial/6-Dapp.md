## Coding: dApp
Let’s use the code-generated `DTwitter` API and the `EmbarkJS` API to interact with our contact in our dApp. As we update the .js files, notice how Embark watches the files and compiles as we save.

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
