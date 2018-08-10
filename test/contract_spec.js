
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
    
  });

  it("should return 1 leak", async function () {
    
  });

  it("leak should have correct data", async function (){
    
  });

  it("should not be able to vote in an unexisting leak report", async function () {
    
  });

  it("should be able to vote in a leak if account hasn't voted before", async function () {
    
  });

  it("should be able to vote in a leak", async function () {
    
  });

  it("should't be able to vote twice", async function () {
      
  });

});