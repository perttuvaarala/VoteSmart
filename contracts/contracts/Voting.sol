// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PollContract {
    // Rakenne äänestyksen tiedoille
    struct Poll {
        uint256 id;
        string name;
        uint256 endTime;
        bool active;
    }

    // Rakenne äänestysvaihtoehdoille
    struct Option {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    // Tallennetaan äänestykset ja niihin liittyvät vaihtoehdot mapping rakenteen avulla
    mapping(uint256 => Poll) public polls;
    mapping(uint256 => Option[]) public pollOptions;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    uint256 public pollCount;

    // Lokeihin tallentuvat tapahtumat äänestyksen ja äänien rekisteröintiä varten
    event PollCreated(uint256 indexed pollId, string name, uint256 duration);
    event VoteCast(
        uint256 indexed pollId,
        uint256 indexed optionId,
        uint256 voteCount,
        string optionName,
        address indexed voter,
        uint256 timestamp
    );

    // Funktio äänestyksen luontia varten
    function createPoll(
        string memory _name,
        uint256 _duration,
        string[] memory _optionNames
    ) public {
        pollCount++;
        uint256 endTime = block.timestamp + _duration;
        polls[pollCount] = Poll(pollCount, _name, endTime, true);

        // Lisätään äänestysvaihtoehdot
        for (uint256 i = 0; i < _optionNames.length; i++) {
            pollOptions[pollCount].push(Option(i, _optionNames[i], 0));
        }

        emit PollCreated(pollCount, _name, _duration);
    }

    // Funktio äänestämiseen, joka tarkistaa äänestyksen voimassaolon ja estää uudelleenäänestämisen
    function vote(uint256 _pollId, uint256 _optionId) public {
        require(_pollId > 0 && _pollId <= pollCount, "Invalid poll ID");
        require(block.timestamp <= polls[_pollId].endTime, "Poll has ended");
        require(_optionId < pollOptions[_pollId].length, "Invalid option ID");
        require(!hasVoted[_pollId][msg.sender], "You have already voted");

        // Rekisteröidään ääni ja estetään uudelleenäänestäminen
        pollOptions[_pollId][_optionId].voteCount++;
        hasVoted[_pollId][msg.sender] = true;

        emit VoteCast(
            _pollId,
            _optionId,
            pollOptions[_pollId][_optionId].voteCount,
            pollOptions[_pollId][_optionId].name,
            msg.sender,
            block.timestamp
        );
    }

    // Palauttaa äänestyksen tiedot, mukaan lukien vaihtoehdot ja niiden äänimäärät
    function getPoll(
        uint256 _pollId
    ) public view returns (string memory, uint256, bool, Option[] memory) {
        require(_pollId > 0 && _pollId <= pollCount, "Poll does not exist");
        Poll memory poll = polls[_pollId];
        bool isActive = block.timestamp <= poll.endTime;
        return (poll.name, poll.endTime, isActive, pollOptions[_pollId]);
    }

    // Palauttaa viimeisimmän äänestyksen ID:n
    function getLatestPollId() public view returns (uint256) {
        return pollCount;
    }
}
