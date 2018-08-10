
// our contract object to test
const ELeaks = require('Embark/contracts/ELeaks');

// contract methods we'll be testing
const {num, create, vote, leaks, canVote, getVote} = ELeaks.methods;

// variables that will be updated in the tests
let accounts;
let leakId;

// set up our config test parameters
config({
  contracts: {
    ELeaks: {
      // would pass constructor args here if needed
    }
  }
}, (err, theAccounts) => {
  // this is the list of accounts our node / wallet controls.
  accounts = theAccounts;
});

// other test parameters
const ipfsHash = 'Qmc5gCcjYypU7y28oCALwfSvxCBskLuPKWpK4qpterKC7z';

// Embark exposes a global contract method as an alias
// for Mocha.describe
contract("ELeaks contract", function () {
  this.timeout(0);

  it("should be able to create a leak and receive it via contract event", async function () {    
    await create(web3.utils.fromAscii(ipfsHash)).send();

    ELeaks.events.NewLeak({
      filter: {owner: accounts[0]},
      fromBlock: 0
    })
    .on('data', (event) => {
        leakId = event.returnValues.leakId;
        assert.equal(web3.utils.toAscii(event.returnValues.description), ipfsHash);
    });
  });

  it("should return 1 leak", async function () {
    const n = await num().call();
    assert.equal(n, 1);
  });

  it("leak should have correct data", async function (){
    const leak = await leaks(leakId).call();
    assert.equal(web3.utils.toAscii(leak.description), ipfsHash);
    assert.equal(leak.owner, accounts[0]);
  });

  it("should not be able to vote in an unexisting leak report", async function () {
    const userCanVote = await canVote(123).call();
    assert.equal(userCanVote, false);
  });

  it("should be able to vote in a leak if account hasn't voted before", async function () {
    const userCanVote = await canVote(0).call();
    assert.equal(userCanVote, true);
  });

  it("should be able to vote in a leak", async function () {
    const receipt = await vote(0, 1).send();
    const Vote = receipt.events.Vote;
    assert.equal(Vote.returnValues.voter, accounts[0]);
  });

  it("should't be able to vote twice", async function () {
      try {
        const receipt = await vote(0, 1).send();
        assert.fail('should have reverted before');
      } catch (error){
        assert(error.message.search('revert') > -1, 'Revert should happen');
      }
  });

});