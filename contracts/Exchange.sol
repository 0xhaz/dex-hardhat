// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

error Exchange__InvalidToken();
error Exchange__LowBalance();
error Exchange__LowDaiBalance();
error Exchange__TokenIsNotDai();
error Exchange__NotOwner();
error Exchange__InvalidId();

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
    mapping(bytes32 => mapping(uint256 => Order)) private s_orders;
    mapping(bytes32 => mapping(uint256 => bool)) public s_orderCancelled;
    mapping(address => mapping(bytes32 => uint256)) private s_traderBalances;

    // Modifiers
    modifier tokenExist(bytes32 _ticker) {
        if (s_tokens[_ticker].tickerAddress == address(0))
            revert Exchange__InvalidToken();
        _;
    }

    modifier tokenIsNotDai(bytes32 _ticker) {
        if (_ticker == c_DAI) {
            revert Exchange__TokenIsNotDai();
        }
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
    event NewTrade(
        uint256 tradeId,
        uint256 orderId,
        bytes32 indexed ticker,
        address indexed trader1,
        address indexed trader2,
        uint256 amount,
        uint256 price,
        uint256 date
    );
    event Cancel(
        uint256 tradeId,
        bytes32 indexed ticker,
        address indexed trader1,
        uint256 amount,
        uint256 price,
        uint256 date
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
        uint256 id;
        address trader;
        Status status;
        bytes32 ticker;
        uint256 amount;
        uint256 filled;
        uint256 price;
        uint256 date;
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
    ) external tokenIsNotDai(_ticker) tokenExist(_ticker) {
        if (status == Status.SELL) {
            if (s_traderBalances[msg.sender][_ticker] <= _amount)
                revert Exchange__LowBalance();
        } else {
            if (s_traderBalances[msg.sender][c_DAI] < _amount)
                revert Exchange__LowDaiBalance();
        }

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
    ) external tokenExist(_ticker) {
        if (status == Status.SELL) {
            if (s_traderBalances[msg.sender][_ticker] < _amount)
                revert Exchange__LowBalance();
        }

        Order[] storage orders = s_orderBook[_ticker][
            uint(status == Status.BUY ? Status.SELL : Status.BUY)
        ];
        uint256 i;
        uint256 remaining = _amount;

        while (i < orders.length && remaining > 0) {
            uint256 available = orders[i].amount - orders[i].filled;
            uint256 matched = (remaining > available) ? available : remaining;
            remaining -= matched;
            orders[i].filled += matched;
            uint256 _feeAmount = (orders[i].filled * i_feePercent) / 100;
            emit NewTrade(
                s_nextOrderId,
                orders[i].id,
                _ticker,
                orders[i].trader,
                msg.sender,
                matched,
                orders[i].price,
                block.timestamp
            );

            if (status == Status.SELL) {
                s_traderBalances[msg.sender][_ticker] -= matched;
                s_traderBalances[msg.sender][c_DAI] +=
                    matched *
                    orders[i].price;
                s_traderBalances[orders[i].trader][_ticker] += (matched -
                    _feeAmount);
                s_traderBalances[orders[i].trader][c_DAI] -=
                    matched *
                    orders[i].price;
                s_traderBalances[i_feeAccount][_ticker] += _feeAmount;
            }

            if (status == Status.BUY) {
                if (
                    s_traderBalances[msg.sender][c_DAI] <
                    matched * orders[i].price
                ) revert Exchange__LowDaiBalance();
                s_traderBalances[msg.sender][_ticker] += (matched - _feeAmount);
                s_traderBalances[msg.sender][c_DAI] -=
                    matched *
                    orders[i].price;
                s_traderBalances[orders[i].trader][_ticker] -= matched;
                s_traderBalances[orders[i].trader][c_DAI] +=
                    matched *
                    orders[i].price;
                s_traderBalances[i_feeAccount][_ticker] += _feeAmount;
            }
            s_nextTradeId++;
            i++;
        }
        i = 0;
        while (i < orders.length && orders[i].filled == orders[i].amount) {
            for (uint j = i; j < orders.length - 1; j++) {
                orders[j] = orders[j + 1];
            }
            orders.pop();
            i++;
        }
    }

    function cancelOrder(bytes32 _ticker, uint256 _id) external {
        Order storage orders = s_orders[_ticker][_id];

        if (address(orders.trader) != msg.sender) revert Exchange__NotOwner();
        if (orders.id == _id) revert Exchange__InvalidId();

        s_orderCancelled[_ticker][_id] = true;
    }

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

    function getOrders(bytes32 _ticker, Status status)
        external
        view
        returns (Order[] memory)
    {
        return s_orderBook[_ticker][uint256(status)];
    }
}
