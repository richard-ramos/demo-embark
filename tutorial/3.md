## Ejecutando nuestra DApp por primera vez
Ahora ejecutemos nuestra aplicación rapidamente para ver que hace Embark por nosotros.
```
npm install
embark run
```
Luego de ejecutar esto podras ver la consola de Embark y sus componentes:
* *Contracts* - El area superior izquierda que muestra cuales contratos se han desplegado y su dirección.
* *Available Services* - Módulos cargados y ejecutandose, en la seccion superior derecha. Embark muestra el estado de estos módulos aquí
* *Log* - Muestra todos los mensajes generados a nivel de bitácora
* *Console* - en la parte inferior hay una consola que permite interactuar con `web3` y `ipfs` (intenta escribir `help` para ver los comandos disponibles).

### Embark 
Podras observar en los logs y modulos que Embark ha iniciado los procesos de Go-ethereum e IPFS, compilado y desplagado nuestro contrato, y procesado nuestro website con webpack. 
> El warning para el contrato desaparecera una vez actualicemos nuestro contrato.

### Tour por nuestra aplicación
El sitio web tiene varias caracteristicas que *no estan implementadas aun*, pero igualm veamos nuestra Dapp. Navega hacia la URL `http://localhost:8000` en tu navegador.