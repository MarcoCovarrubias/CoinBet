var web3 = new Web3(Web3.givenProvider);
var contractInstance //Basically we create a contract instance in javascript as well, this is meant to replicate the contract instance that is in the blockchain. We can call the contract function from our javascript code.

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){ //window.ethereum.enable() function calls the pop-up UI dialogue that asks the user’s permission to connect the dApp to MetaMask
    	contractInstance = new web3.eth.Contract(abi, "0xDa49faCFAB3EC9c5FAc0e00D180FA410C2aC5926", {from: accounts[0]});//abi object is the description of the contract itself (functions, variables, arguments etc). Address is the actual addres of the contract.
    	console.log(contractInstance);
    });
    $("#bet_button").click(bet); //The identifier of the botton, found in the html file. 
});


function bet(){

	var transactionParams = {//JSON object, defined by {}
		value: web3.utils.toWei($("#amount_input").val(), "ether")
	}

	contractInstance.methods.submitBet().send(transactionParams)
	.on('transactionHash', function(hash){ //.on is an event listener. Here we watch for 3 events. 
      console.log(hash);
    })
    .on('confirmation', function(confirmationNumber){//We will not get any confirmation as we are the only node adding blocks to the local blockchain
        console.log(confirmationNumber);
    })
    .on('receipt', function(receipt){
      console.log(receipt);
      $("#luck").text("Wait a little and then check your wallet");
    });

  //contractInstance.methods.bet().call().then(function(result){
      //console.log("Winner");
    //});

  contractInstance.events.betResultReady()
  .on('data', function(event){
    console.log(event); // same results as the optional callback above
    //contractInstance.events.betResultReady.returnValues['betResult']
    $("#luck").text("Check your wallet now");
  })
  .on('changed', function(event){
    // remove event from local database
  })
  .on('error', console.error);

}

//contract.events.Transfer()
//.on('data', (event) => {
//  console.log(event);
//})
//.on('error', console.error);


