const CoinBet = artifacts.require("CoinBet");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(CoinBet).then(function (instance){
  	instance.deposit({value: web3.utils.toWei("2", "ether"), from: accounts[0]}).then(function(balance){
  		console.log(" Contract deployed ");
  	});
  });
};
