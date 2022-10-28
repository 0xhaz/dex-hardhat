// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Dai is ERC20 {
    constructor() ERC20("Dai Stablecoin", "DAI") {
        _mint(msg.sender, 1000 * 10**18);
    }

    function faucet(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }
}
