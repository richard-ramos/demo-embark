pragma solidity ^0.4.24;

// @notice Contract to create whisteblowing reports
contract ReportManager {

    enum Ballot { NONE, UPVOTE, DOWNVOTE }

    struct Report {
        uint creationDate;   
        bytes description;   
        address owner;
        uint upvotes;  
        uint downvotes;
        mapping(address => Ballot) voters;
    }

    Report[] public reports;

    event NewReport(
        uint indexed reportId,
        address owner,
        bytes description
    );

    event Vote(
        uint indexed reportId,
        address voter,
        uint8 vote
    );

    // @notice Number of reports created
    // @return Num of reports
    function numReports()
        public
        view
        returns(uint){
            return 1;
        }

    // @notice Create report
    // @param _description IPFS hash of the content of the report
    function create(bytes _description)
        public {

        }

    // @notice Vote on a report
    // @param _reportId Id of the report to up/downvote
    // @param _vote Vote selection: 0 -> none, 1 -> upvote, 2 -> downvote
    function vote(uint _reportId, uint8 _vote)
        public {

        }

    // @notice Determine if the sender can vote on a report
    // @param _reportId Id of the report
    // @return bool that indicates if the sender can vote or not
    function canVote(uint _reportId)
        public
        view
        returns (bool){
            return false;
        }

    // @notice Obtain vote for specific report
    // @param _reportId Id of the report
    // @return uint that represents the vote: 0 -> none, 1 -> upvote, 2 -> downvote
    function getVote(uint _reportId)
        public
        view
        returns (uint8){
            return 1;
        }

}
