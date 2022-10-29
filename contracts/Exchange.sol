// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error Exchange__InvalidToken();
error Exchange__LowBalance();

contract Exchange is Ownable {
    // State Variables
    bytes32[] private tokenList;
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
    mapping(bytes32 => Token) private s_tokens;
    mapping(bytes32 => mapping(uint256 => Order[])) private s_orderBook;
    mapping(address => mapping(bytes32 => uint256)) private s_traderBalances;

    // Modifiers
    modifier tokenExist(bytes32 _ticker) {
        if (s_tokens[_ticker].tickerAddress != s_tokens[_ticker].tickerAddress)
            revert Exchange__InvalidToken();
        _;
    }

    // Events
    event Deposit(
        bytes32 indexed ticker,
        address indexed user,
        uint256 amount,
        uint256 balance
    );
    event Withdraw(
        bytes32 indexed ticker,
        address indexed user,
        uint256 amount,
        uint256 balance
    );
    event Trade(
        uint256 id,
        address user,
        bytes32 ticker,
        uint256 amount,
        uint256 filled,
        address creator,
        uint256 timestamp
    );

    // Enum
    enum Status {
        BUY,
        SELL
    }

    // Structs
    struct Token {
        bytes32 ticker;
        address tickerAddress;
    }

    struct Order {
        uint256 id; // unique identifier for order
        address trader; // user who made order
        Status status;
        bytes32 ticker; // Address of the token they receive (tokenGive)
        uint256 amount; // Amount they receive (amountGive)
        uint256 filled; // Amount they receive (amountGet)
        uint256 price; // Amount they give (amountGive)
        uint256 date; // when order was created
    }

    // Functions
    function addToken(bytes32 _ticker, address _tickerAddress)
        external
        onlyOwner
    {
        s_tokens[_ticker] = Token(_ticker, _tickerAddress);
        tokenList.push(_ticker);
    }

    function depositToken(bytes32 _ticker, uint256 _amount)
        external
        tokenExist(_ticker)
    {
        IERC20(s_tokens[_ticker].tickerAddress).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        s_traderBalances[msg.sender][_ticker] += _amount;

        emit Deposit(
            _ticker,
            msg.sender,
            _amount,
            s_traderBalances[msg.sender][_ticker]
        );
    }

    function withdrawToken(bytes32 _ticker, uint256 _amount)
        external
        tokenExist(_ticker)
    {
        if (s_traderBalances[msg.sender][_ticker] > _amount)
            revert Exchange__LowBalance();
        s_traderBalances[msg.sender][_ticker] -= _amount;
        IERC20(s_tokens[_ticker].tickerAddress).transfer(msg.sender, _amount);

        emit Withdraw(
            _ticker,
            msg.sender,
            _amount,
            s_traderBalances[msg.sender][_ticker]
        );
    }

    function createLimitOrder(
        bytes32 _ticker,
        uint256 _amount,
        uint256 _price,
        Status status
    ) external {
        Order[] storage orders = s_orderBook[_ticker][uint(status)];

        orders.push(
            Order(
                s_nextOrderId,
                msg.sender,
                status,
                _ticker,
                _amount,
                0,
                _price,
                block.timestamp
            )
        );

        uint i = orders.length > 0 ? orders.length - 1 : 0;
        while (i > 0) {
            if (status == Status.BUY && orders[i - 1].price > orders[i].price) {
                break;
            }
            if (
                status == Status.SELL && orders[i - 1].price < orders[i].price
            ) {
                break;
            }

            Order memory order = orders[i - 1];
            orders[i - 1] = orders[i];
            orders[i] = order;
            i--;
        }
        s_nextOrderId++;
    }

    function createMarketOrder(
        bytes32 _ticker,
        uint256 _amount,
        Status status
    ) external tokenExist(_ticker) {}

    function getTokens() external view returns (Token[] memory) {
        Token[] memory _tokens = new Token[](tokenList.length);
        for (uint i = 0; i < tokenList.length; i++) {
            _tokens[i] = Token(
                s_tokens[tokenList[i]].ticker,
                s_tokens[tokenList[i]].tickerAddress
            );
        }
        return _tokens;
    }

    function getBalance(bytes32 _ticker) external view returns (uint256) {
        return s_traderBalances[msg.sender][_ticker];
    }

    // Internal Functions
    function _trade(
        uint256 _id,
        address _trader,
        bytes32 _ticker,
        uint256 _amount,
        uint256 _filled
    ) internal {
        // fee is paid by the user who filled the order(msg.sender)
        uint256 _feeAmount = (_filled * i_feePercent) / 100;

        // msg.sender is the user who filled the order while _trader is who created the order
        s_traderBalances[msg.sender][_ticker] -= (_filled + _feeAmount);
        s_traderBalances[_trader][_ticker] += _filled;

        // charge fees
        s_traderBalances[i_feeAccount][_ticker] += _feeAmount;
        s_traderBalances[_trader][_ticker] -= _amount;
        s_traderBalances[msg.sender][_ticker] += _amount;

        emit Trade(
            _id,
            msg.sender,
            _ticker,
            _amount,
            _filled,
            _trader,
            block.timestamp
        );
    }
}
