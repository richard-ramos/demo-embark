## Coding our DApp
Let's use our DReddit JS Object, and the `EmbarkJS` API to interact with our contract and IPFS. While we update oru files, notice how Embark watches and recompiles any asset we modify when we save the changes:

###### `Create.js`

1. Start by importing EmbarkJS, web3 and the contract object
```
import EmbarkJS from 'Embark/EmbarkJS';
import EtherPress from 'Embark/contracts/EtherPress';
import web3 from 'Embark/web3';
```

2. Update the `handleClick` event, that is triggered when you press the 'Publish' button. This will save the post on IPFS, and invoke our contract. We need to obtain a gas estimate and add our post using the contract's `create` function.


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

#### Check the DApp and hunt for bugs
Open a browser and navigate to http://localhost:8000. Admire your creation! and try to fix any bug we may have introduced.