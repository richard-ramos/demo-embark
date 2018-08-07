
// our Reports contract object to test
const ReportManager = require('Embark/contracts/ReportManager');

// contract methods we'll be testing
const {numReports, create, vote, reports, canVote, getVote} = ReportManager.methods;

// variables that will be updated in the tests
let accounts;
let reportId;

// set up our config test parameters
config({
  contracts: {
    ReportManager: {
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
contract("Reports contract", function () {
  this.timeout(0);

  it("should be able to create a report and receive it via contract event", async function () {    
    await create(web3.utils.fromAscii(ipfsHash)).send();

    ReportManager.events.NewReport({
      filter: {owner: accounts[0]},
      fromBlock: 0
    })
    .on('data', (event) => {
        reportId = event.returnValues.reportId;
        assert.equal(web3.utils.toAscii(event.returnValues.description), ipfsHash);
    });
  });

  it("should return 1 report", async function () {
    const num = await numReports().call();
    assert.equal(num, 1);
  });

  it("report should have correct data", async function (){
    const report = await reports(reportId).call();
    assert.equal(web3.utils.toAscii(report.description), ipfsHash);
    assert.equal(report.owner, accounts[0]);
  });

  it("should not be able to vote in an unexisting report", async function () {
    const userCanVote = await canVote(123).call();
    assert.equal(userCanVote, false);
  });

  it("should be able to vote in a report if account hasn't voted before", async function () {
    const userCanVote = await canVote(0).call();
    assert.equal(userCanVote, true);
  });

  it("should be able to vote in a report", async function () {
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