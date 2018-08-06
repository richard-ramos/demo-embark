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
        uint indexed pollId,
        bytes description
    );

    event Vote(
        uint indexed pollId,
        address voter,
        uint8 vote
    );

    // @notice Number of reports created
    // @return Num of reports
    function numReports()
        public
        view
        returns(uint)
    {
        return reports.length;
    }

    // @notice Create report
    // @param _description IPFS hash of the content of the report
    function create(bytes _description)
        public
    {
        uint reportId = reports.length++;
        reports[reportId] = Report({
            /* solium-disable-next-line */
            creationDate: block.timestamp,
            description: _description,
            owner: msg.sender,
            upvotes: 0,
            downvotes: 0
        });

        emit NewReport(reportId, _description);
    }

    // @notice Vote on a report
    // @param _reportId Id of the report to up/downvote
    // @param _vote Vote selection: 0 -> none, 1 -> upvote, 2 -> downvote
    function vote(uint _reportId, uint8 _vote)
        public
    {
        Report storage r = reports[_reportId];

        require(r.creationDate != 0, "Report does not exist");
        require(r.voters[msg.sender] == Ballot.NONE, "You already voted on this report");

        Ballot b = Ballot(_vote);

        if (b == Ballot.UPVOTE) {
            r.upvotes++;
        } else {
            r.downvotes++;
        }

        r.voters[msg.sender] = b;

        emit Vote(_reportId, msg.sender, _vote);
    }

    // @notice Determine if the sender can vote on a report
    // @param _reportId Id of the report
    // @return bool that indicates if the sender can vote or not
    function canVote(uint _reportId)
        public
        view
        returns (bool)
    {
        Report storage r = reports[_reportId];
        
        return (r.creationDate != 0 && r.voters[msg.sender] == Ballot.NONE);
    }

    // @notice Obtain vote for specific report
    // @param _reportId Id of the report
    // @return uint that represents the vote: 0 -> none, 1 -> upvote, 2 -> downvote
    function getVote(uint _reportId)
        public
        view
        returns (uint8)
    {
        Report storage r = reports[_reportId];
        return uint8(r.voters[msg.sender]);
    }

}
