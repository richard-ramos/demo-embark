## Unit testing
Now that we finished coding our contract, we can proceed to build unit testing for it. Embark generates javascript code for interacting with the contract `DReddit` and will make it possible to use it from both our unit tests and our DApp. There are some tests already implemented in `./test/contract_spec.js`, but we will add a couple that illustrate the most common test case scenarios

### We should be able to create a post and receive it via contract event
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

### The post should have correct data
```
const post = await posts(postId).call();
assert.equal(web3.utils.toAscii(post.description), ipfsHash);
assert.equal(post.owner, accounts[0]);
```

### We should't be able to vote twice for the same post
```
try {
    const receipt = await vote(postId, 1).send();
    assert.fail('should have reverted before');
} catch (error){
    assert(error.message.search('revert') > -1, 'Revert should happen');
}
```

### Running the tests
To execute the tests and see their result, on a terminal session run:
```
embark test
```
### Results
The results of your test unit should be similar to the following:
```
  DReddit contract
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
