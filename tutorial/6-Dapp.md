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

```
const {create} = EtherPress.methods;
    
let toSend;

EmbarkJS.Storage.saveText(JSON.stringify(textToSave))
.then(ipfsHash => {
    toSend = create(web3.utils.toHex(ipfsHash));
    return toSend.estimateGas();
})
.then(estimatedGas => {
    return toSend.send({from: web3.eth.defaultAccount, 
                        gas: estimatedGas + 1000});
})
.then(receipt => {
    console.log(receipt);
    this.setState({
        content: '',
        title: ''
    });
})
.catch((err) => {
    console.error(err);
})
.finally(() => {
    this.setState({isSubmitting: false});
    this.props.afterPublish();
});
```