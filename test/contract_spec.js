
// our contract object to test
const DReddit = require('Embark/contracts/DReddit');

// contract methods we'll be testing
const {numPosts, create, vote, posts, canVote, getVote} = DReddit.methods;

// variables that will be updated in the tests
let accounts;
let postId;

// set up our config test parameters
config({
  contracts: {
    DReddit: {
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
contract("DReddit contract", function () {
  this.timeout(0);

  it("should be able to create a post and receive it via contract event", async function () {    
    
  });

  it("should return 1 post", async function () {
    
  });

  it("post should have correct data", async function (){
    
  });

  it("should not be able to vote in an unexisting post", async function () {
    
  });

  it("should be able to vote in a post if account hasn't voted before", async function () {
    
  });

  it("should be able to vote in a post", async function () {
    
  });

  it("should't be able to vote twice", async function () {
      
  });

});