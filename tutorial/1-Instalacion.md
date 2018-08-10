# Instalación
## Verifica tu ambiente
Antes de instalar Embark, debes cumplir los siguiente prerequisitos:
#### NodeJS 8.10+
```
node version
> 8.10+
```
Si necesitas actualizar Node, por favor [instala `nvm`](https://github.com/creationix/nvm#installation) e instala/utiliza la version LTS. Los comandos para macOS/Linux son los siguientes:
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
nvm install --lts
nvm use lts
```
#### IPFS 0.4.15+
```
ipfs version
> 0.4.15+
```
[Instrucciones de instalación de IPFS](https://ipfs.io/docs/install/#installing-from-a-prebuilt-package), Los comandos para macOS/Linux son los siguientes:
```
tar xvfz go-ipfs.tar.gz
cd go-ipfs
./install.sh
ipfs init
```

#### Go-ethereum 1.8.11+
```
geth version
> 1.8.11+
```
Si necesitas [instalar `geth`](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum)

## Instalando Embark 3.1.7
Si ya tienes Embark instalado, por favor ejecuta: 
```
embark version
```

Asegurate que la versión es la `3.1.7`. Si no lo es, reinstala Embark. Embark puede ser instalado ejecutando el comando:
```
npm install -g embark
```
> No utilices sudo cuando instales Embark
