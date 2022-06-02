pragma solidity ^0.8.0;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import "./utils/IERC20.sol";

contract VoteUpgradable is OwnableUpgradeable {

    mapping(address => bool) private voted;

    mapping(address => uint) public voteCounter;

    IERC20 public rewardToken;

    uint x;

    function initialize(address _token) payable public initializer {
        __Ownable_init_unchained();
        rewardToken = IERC20(_token);
    }

    function vote(address voter) external {
        require(!voted[msg.sender], "you voted");
        voteCounter[voter] += 1;
        voted[msg.sender] = true;
    }


}