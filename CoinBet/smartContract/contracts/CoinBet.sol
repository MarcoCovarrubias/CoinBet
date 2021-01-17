import "./Ownable.sol"; 
import "./provableAPI.sol";
pragma solidity 0.5.12;

contract CoinBet is Ownable, usingProvable{

  constructor() public {
      bettingBalance = 0;   
  }

  mapping (bytes32 => bet) private bets;
  struct bet {
    address payable userAddress;
    uint value;
  }

  uint bettingBalance;
  uint256 constant NUM_RANDOM_BYTES_REQUESTED = 1;

  event randomNumberRequested(bytes32 queryId, string description);
  event betResultReady(address userAddress, uint betResult);

  function deposit() public payable returns(uint){
    return(address(this).balance);
  }

  function submitBet() public payable{

    require(msg.value > 0, "Amount can not be 0");
    require(msg.value <= (address(this).balance - bettingBalance), "CoinBet has not enough funds for this bet :(");
    bettingBalance += msg.value;
    
    bytes32 newQuery = requestRandomNumber();
    bet memory newBet;
    newBet.userAddress = msg.sender;
    newBet.value = msg.value;
    bets[newQuery] = newBet;
  }

  function __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public { //Functions that returns the random number
    require(msg.sender == provable_cbAddress());

    uint256 randomNumber = uint256(keccak256(abi.encodePacked(_result))) % 2;
    processBet(_queryId, randomNumber);
  }

  function requestRandomNumber() public payable returns(bytes32){ //Function that request the random number value to the provable API
    uint256 QUERY_EXECUTION_DELAY = 0;
    uint256 GAS_FOR_CALLBACK = 200000;
    bytes32 queryID = 0;
    queryID = provable_newRandomDSQuery(QUERY_EXECUTION_DELAY, NUM_RANDOM_BYTES_REQUESTED, GAS_FOR_CALLBACK);
    emit randomNumberRequested(queryID, "Random number was requested");
    return queryID;
  }

  function processBet(bytes32 _queryId, uint256 _randomNumber) public{
    if (_randomNumber == 1){
      bets[_queryId].userAddress.transfer(bets[_queryId].value * 2);
      bettingBalance -= bets[_queryId].value;
    }
    else{
      //Do nothing
    }
    emit betResultReady(bets[_queryId].userAddress, _randomNumber);
    delete bets[_queryId];
  }
}
