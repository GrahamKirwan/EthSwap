pragma solidity ^0.5.0;

// Import the Token smart contract
import "./Token.sol";

// Smart contract where we will build out the functionality to buy and sell tokens
contract EthSwap {
    
    string public name = "Eth-Swap Instant Exchange"; // name variable
    Token public token; // use our Token contract with 'token'
    uint public rate = 100; //uint cannot be negative or have decimels

    event TokenPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    // Pass in the token address when contract is first ran, save as _token
    constructor(Token _token) public {
        token = _token;
    }

    // Function must be 'payable' to send Eth
    function buyTokens() public payable {
        // Calculate the number of tokens to buy
        uint tokenAmount = msg.value * rate;

        // Check that ethswap has enough tokens for this trade (require will act as a break if false)
        require(token.balanceOf(address(this)) >= tokenAmount, "dex needs liquidy for trade");

        // msg is the person calling the function, so here they will receive the tokens
        token.transfer(msg.sender, tokenAmount);

        // Emit an event (trigger when something happens)
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }
}

