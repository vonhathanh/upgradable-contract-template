pragma solidity 0.8.4;

import "./utils/Ownable.sol";
import "./utils/IERC20.sol";

contract Vote is Ownable {
    
    mapping(address => bool) private voted;

    mapping(address => uint) public voteCounter;

    IERC20 public rewardToken;

    // only called one time
    constructor(address _token) payable {
        rewardToken = IERC20(_token);
    }   

    function vote(address voter) external {
        require(!voted[msg.sender], "you voted");
        voteCounter[voter] += 1;
        voted[msg.sender] = true;
    }

    function getVoteCount(address user) external view returns(uint) {
        return voteCounter[user];
    }    

    function claimReward() external {
        require(voteCounter[msg.sender] > 1, "not enough vote");

        rewardToken.transfer(msg.sender, 1 ether);

        if (rewardToken.balanceOf(msg.sender) < 1 ether) {
            revert("not enought token");
        }

        (bool success, ) = msg.sender.call{ value: 1 ether }("");

        require(success, "not enough ether");
    }

    function withdraw() external onlyOwner {
       payable(owner()).transfer(address(this).balance);
    }

    receive () external payable {}
}