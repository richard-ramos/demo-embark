## Creando una DApp usando Embark

### Introducción
En este taller, exploraremos como podemos usar Embark para simplificar el desarrollod de una aplicación descentralizada. Usaremos web3 y el api de `EmbarkJS` para interactuar con nuestro contrato, y almacenar archivos en el sistema de archivos descentralizado `IPFS`

Par enfocarnos en estos aspectos del desarrollo de DApps, el codigo para el frontend ya esta listo, por lo que no tendremos que preocuparnos por la parte visual.

El codigo final de este proyecto se puede encontrar en el [repositorio](https://github.com/status-im/dappcon-workshop-dapp/blob/master/instructions/1%20Installation.md), sin embargo, utilizaremos el branch [`inicio`] (https://github.com/status-im/dappcon-workshop-dapp/tree/start-here) como punto de arranque para este taller. Este branch le "falta" codigo, que desarrollaremos en vivo.

Esta DApp utiliza [React](https://reactjs.org/), aunque no es necesario saber como usarlo, asi que no te preocupes, ya que nos enfocaremos nada mas en las partes que Embark nos ayuda a construir. En realidad, cualquier framework de JS puede ser utilizado con Embark.

## ¿Que es Embark?
Embark es un framework poderoso, rapido y simple que te permitira desarrollar y desplegar aplicaciones completamente descentralizadas. Embark permite a los desarrolladores aprovechar las tecnologias descentaralizadas para la construccion de DApps, auto-generar codigo, y provee un API de javasscript para ser utilizada dentro de tu DApp. Embark es completamente configurable, y puede aprovechar tantas tecnologias descentralizadas se requieran. Embark puede::
* Automaticamente ejecutar un nodo de Ethereum.
* Automaticamente ejecutar un nodo de IPFS o Swarm, y acceder a ellos via el API de `EmbarkJS`. Embark puede tambien cargar tu DApp a estos dos sistemas de archivo.
* Compilar y desplegar Smart Contracts (programados en solidity, vyper, o bamboo). Embark tambien generara codigo en base a tus contratos y podras acceder a estos via un objeto de JS.
* Usar webpack y desplegar los recursos de tu DApp mientras los codificas.
* Integrar tu DApp con `ENS`, disponible via el API (a partir de la version 3.2).
* Escribir y ejecutar pruebas unitarias