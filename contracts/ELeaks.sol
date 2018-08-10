pragma solidity ^0.4.24;

// @notice Contract to create whisteblower leaks
contract ELeaks {

    enum Ballot { NONE, UPVOTE, DOWNVOTE }

    struct Leak {
        uint creationDate;   
        bytes description;   
        address owner;
        uint upvotes;  
        uint downvotes;
        mapping(address => Ballot) voters;
    }

    Leak[] public leaks;

    event NewLeak (
        uint indexed leakId,
        address owner,
        bytes description
    );

    event Vote(
        uint indexed leakId,
        address voter,
        uint8 vote
    );

    // @notice Number of leaks created
    // @return Num of leaks
    function num()
        public
        view
        returns(uint)
    {
        return leaks.length;
    }

    // @notice Create Leak
    // @param _description IPFS hash of the content of the leak
    function create(bytes _description)
        public
    {
        uint leakId = leaks.length++;
        leaks[leakId] = Leak({
            /* solium-disable-next-line */
            creationDate: block.timestamp,
            description: _description,
            owner: msg.sender,
            upvotes: 0,
            downvotes: 0
        });

        emit NewLeak(leakId, msg.sender, _description);
    }

    // @notice Vote on a leak
    // @param _leakId Id of the report to up/downvote
    // @param _vote Vote selection: 0 -> none, 1 -> upvote, 2 -> downvote
    function vote(uint _leakId, uint8 _vote)
        public
    {
        Leak storage l = leaks[_leakId];

        require(l.creationDate != 0, "Report does not exist");
        require(l.voters[msg.sender] == Ballot.NONE, "You already voted on this report");

        Ballot b = Ballot(_vote);
        if (b == Ballot.UPVOTE) {
            l.upvotes++;
        } else {
            l.downvotes++;
        }

        l.voters[msg.sender] = b;

        emit Vote(_leakId, msg.sender, _vote);
    }

    // @notice Determine if the sender can vote on a leak
    // @param _leakId Id of the report
    // @return bool that indicates if the sender can vote or not
    function canVote(uint _leakId)
        public
        view
        returns (bool)
    {
        if(_leakId > leaks.length - 1) return false;
        
        Leak storage l = leaks[_leakId];
        
        return (l.creationDate != 0 && l.voters[msg.sender] == Ballot.NONE);
    }

    // @notice Obtain vote for specific report
    // @param _leakId Id of the report
    // @return uint that represents the vote: 0 -> none, 1 -> upvote, 2 -> downvote
    function getVote(uint _leakId)
        public
        view
        returns (uint8)
    {
        Leak storage l = leaks[_leakId];
        return uint8(l.voters[msg.sender]);
    }

}
