## Pruebas unitarias
Ahora que nuestro contrato esta escrito, podemos usar el código generado por Embark para escribir pruebas unitarias para nuestros contratos. Embark generará el código necesario para crear un objeto de javascript de nuestro contrato `EtherPress` y hará que sea accesible tanto desde nuestras pruebas unitarias como desde nuestra DApp. 

Las pruebas que haremos seran las siguientes:
### Crear un artículo y recibir su resultado via un evento
```
    await create(web3.utils.fromAscii(ipfsHash)).send();

    EtherPress.events.NewPost({
      filter: {owner: accounts[0]},
      fromBlock: 0
    })
    .on('data', (event) => {
        postId = event.returnValues.postId;
        assert.equal(web3.utils.toAscii(event.returnValues.description), ipfsHash);
    });
```

### Debe existir al menos 1 artículo registrado
```
const n = await numPosts().call();
assert.equal(n, 1);
```

### La data de los artículos debe ser correcta
```
const post = await posts(postId).call();
assert.equal(web3.utils.toAscii(post.description), ipfsHash);
assert.equal(post.owner, accounts[0]);
```

### No se debe poder votar en un artículo inexistente
```
const userCanVote = await canVote(123).call();
assert.equal(userCanVote, false);
```

### Se debe poder votar por un artículo si no se ha votado anteriormente por el
```
const userCanVote = await canVote(postId).call();
assert.equal(userCanVote, true);
```

### Se debe poder votar por un artículo
```
const receipt = await vote(postId, 1).send();
const Vote = receipt.events.Vote;
assert.equal(Vote.returnValues.voter, accounts[0]);
```

### No se debe poder votar mas de una vez por el mismo artículo
```
try {
    const receipt = await vote(postId, 1).send();
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
  EtherPress contract
    ✓ should be able to create a post and receive it via contract event
    ✓ should return 1 post
    ✓ post should have correct data
    ✓ should not be able to vote in an unexisting post report
    ✓ should be able to vote in a post if account hasn't voted before
    ✓ should be able to vote in a post
    ✓ should't be able to vote twice

  7 passing (163ms)


 > All tests passed
```
