## Despliegue en Testnet
Ahora que ya hemos concluido con el desarrollo, lo que nos queda es desplegar nuestro proyecto. Procederemos a realizar esta actividad instalando automaticamente los archivos con IPFS y desplegando los contratos en Ropsten

### Configurando la cuenta para los contratos
Edita el archivo `./config/contracts.js` para agregar una seccion de testnet que te permita definir la direccion que se usara para el despliege. Embark soporta muchos tipos de configuración, siendo el mas simple el especificar el private key.
```
"testnet": {
    dappConnection: ["$WEB3"],
        accounts: [{
            privateKey: "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        }]
}
```
> Observa que en dappConnection solo especificamos $WEB3. Esto es porque nos interesa utilizar el provider de web3 que inyecta automaticamente Status. Esto cambiara en el futuro cercano con el [EIP-1102](https://eips.ethereum.org/EIPS/eip-1102)

### Configurando el almacenamiento.
Usaremos el gateway de IPFS de Infura para cargar nuestros archivos. Esto lo haremos configurando el archivo `./config/storage.js`. En este archivo tenemos que configurar la seccion de `upload` para cargar los archivos y la sección `dappConnection` para manejar como nuestra DApp usara IPFS durante su ejecución

```
  testnet: {
    upload: {
      host: "ipfs.infura.org",
      port: 5001,
      protocol: "https"
    },
    dappConnection: [
      {
        provider: "ipfs",
        protocol: "https",
        host: "ipfs.infura.io",
        port: 5001,
        getUrl: "https://ipfs.infura.io/ipfs/"
      }
    ]
  }
```

### Realizando el despliegue.
Una vez realizadas las configuraciones, procederemos a ejecutar `embark blockchain testnet` en una terminal, y en otra, `embark upload testnet`. Embark procedera a compilar nuestros contratos, desplegarlos y cargar los archivos de la DApp.

Una vez concluido el proceso de carga, procede a ejecutar `ipfs daemon` para compartir los archivos via IPFS y ve hacia la URL que te indicó el proceso de carga de Embark. Cuando IPFS termine de sincronizar, podras visualizar tu DApp e interactuar con ella (a traves de Status, o usando Metamask o Mist).