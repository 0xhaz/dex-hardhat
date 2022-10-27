// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Bat is ERC20 {
    constructor() ERC20("Brave Token", "BAT") {
        _mint(msg.sender, 1000 * 10**18);
    }

    function faucet(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }
}
