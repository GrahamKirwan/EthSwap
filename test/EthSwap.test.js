const { assert } = require('chai');
const { default: Web3 } = require('web3');

// Require our two smart contracts so we can run tests on them
const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

// Configuration code to use Chai testing library
require('chai')
    .use(require('chai-as-promised'))
    .should()

// Helper function so we can express 1 million tokens without the 18 decimels
function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}


// Tests
contract('EthSwap',  ([deployer, investor]) => {

    let token, ethSwap

    // Use this before() to put any code that gets repeated
    before(async () => {
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)
        await token.transfer(ethSwap.address, tokens('1000000'))
    })

    // Check that the smart contract has a name variable equal to 'DApp Token'
    describe('Token deployment', async () => {
        it('contract has a name', async () => {
            const name = await token.name()
            assert.equal(name, 'DApp Token')
        })
    })

    // Check that the smart contract has a name variable equal to 'EthSwap Instant Exchange'
    describe('EthSwap deployment', async () => {
        it('contract has a name', async () => {
            const name = await ethSwap.name()
            assert.equal(name, 'EthSwap Instant Exchange')
        })

        // Check that the same smart contract as above has tokens
        it('contract has tokens', async() => {
            let balance = await token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })

    })

    describe('buyTokens()', async () => {
        let result;

        before(async () => {
            // Purchase tokens before each example is done
            result = await ethSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether')})
        })

        it('Allows user to instantly purchase tokens from ethswap for a fixed price', async () => {
            // Check investor token balance after purchase 
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'))

            // Check ethSwap balance after purchase
            let ethSwapBalance
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('999900'))
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'Ether'))
        
        
            const event = result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')
        })
    })
})