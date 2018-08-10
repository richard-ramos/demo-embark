## Pruebas unitarias
Ahora que nuestro contrato esta escrito, podemos usar el código generado por Embark para escribir pruebas unitarias para nuestros contratos. Embark generará el código necesario para crear un objeto de javascript de nuestro contrato `ELeaks` y hará que sea accesible tanto desde nuestras pruebas unitarias como desde nuestra DApp. 

Las pruebas que haremos seran las siguientes:
### Crear un reporte y recibir su resultado via un evento
```
    await create(web3.utils.fromAscii(ipfsHash)).send();

    ELeaks.events.NewLeak({
      filter: {owner: accounts[0]},
      fromBlock: 0
    })
    .on('data', (event) => {
        leakId = event.returnValues.leakId;
        assert.equal(web3.utils.toAscii(event.returnValues.description), ipfsHash);
    });
```

### Debe existir al menos 1 reporte registrado
```
const n = await num().call();
assert.equal(n, 1);
```

### La data de los reportes debe ser correcta
```
const leak = await leaks(leakId).call();
assert.equal(web3.utils.toAscii(leak.description), ipfsHash);
assert.equal(leak.owner, accounts[0]);
```

### No se debe poder votar en un reporte inexistente
```
const userCanVote = await canVote(123).call();
assert.equal(userCanVote, false);
```

### Se debe poder votar por un reporte si no se ha votado anteriormente por el
```
const userCanVote = await canVote(0).call();
assert.equal(userCanVote, true);
```

### Se debe poder votar por un reporte
```
const receipt = await vote(0, 1).send();
const Vote = receipt.events.Vote;
assert.equal(Vote.returnValues.voter, accounts[0]);
```

### No se debe poder votar mas de una vez por el mismo reporte
```
try {
    const receipt = await vote(0, 1).send();
    assert.fail('should have reverted before');
} catch (error){
    assert(error.message.search('revert') > -1, 'Revert should happen');
}
```

### Ejecutar las pruebas
Ejecutemos las pruebas para ver su resultado. En una terminal, escribe:
```
embark test
```
### Resultados
Los resultados de tus pruebas unitarias deben ser similares a los siguientes:
```
  ELeaks contract
    ✓ should be able to create a leak and receive it via contract event
    ✓ should return 1 leak
    ✓ leak should have correct data
    ✓ should not be able to vote in an unexisting leak report
    ✓ should be able to vote in a leak if account hasn't voted before
    ✓ should be able to vote in a leak
    ✓ should't be able to vote twice

  7 passing (163ms)


 > All tests passed
```
