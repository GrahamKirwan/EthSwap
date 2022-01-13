pragma solidity ^0.5.0;

// Import the Token smart contract
import "./Token.sol";

// Smart contract where we will build out the functionality to buy and sell tokens
contract EthSwap {
    
    string public name = "EthSwap Instant Exchange"; // name variable
    Token public token; // use our Token contract with 'token'
    uint public rate = 100; //uint cannot be negative or have decimels

    // Pass in the token address when contract is first ran, save as _token
    constructor(Token _token) public {
        token = _token;
    }

    // Function must be 'payable' to send Eth
    function buyTokens() public payable {
        // Calculate the number of tokens to buy
        uint tokenAmount = msg.value * rate;
        // msg is the person calling the function, so here they will receive the tokens
        token.transfer(msg.sender, tokenAmount);
    }
}

