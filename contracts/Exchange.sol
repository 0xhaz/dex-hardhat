// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Exchange is Ownable {
    // State Variables
    bytes32[] public tokenList;
    address private immutable i_owner;
    address public immutable i_feeAccount;
    uint256 public immutable i_feePercent;
    bytes32 private constant c_DAI = bytes32("DAI");
    uint256 private s_nextOrderId;
    uint256 private s_nextTradeId;

    // Constructor
    constructor(address _feeAccount, uint256 _feePercent) {
        i_feeAccount = _feeAccount;
        i_feePercent = _feePercent;
        i_owner = msg.sender;
    }

    // Mapping
    mapping(bytes32 => Token) private m_tokens;

    // Modifiers

    // Events

    // Structs
    struct Token {
        bytes32 ticker;
        address tickerAddress;
    }

    // Functions
    function addToken(bytes32 _ticker, address _tickerAddress)
        external
        onlyOwner
    {
        m_tokens[_ticker] = Token(_ticker, _tickerAddress);
        tokenList.push(_ticker);
    }

    function getTokens() external view returns (Token[] memory) {
        Token[] memory _tokens = new Token[](tokenList.length);
        for (uint i = 0; i < tokenList.length; i++) {
            _tokens[i] = Token(
                m_tokens[tokenList[i]].ticker,
                m_tokens[tokenList[i]].tickerAddress
            );
        }
        return _tokens;
    }

    // Internal Functions
}
