import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';


let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
// web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
const TEST_ORACLES_COUNT = 10;
// ARRANGE
let getRegistrationFee = async () => {
  let result = await flightSuretyApp.methods.REGISTRATION_FEE().call();
  return result.toString("binary");
} 

let setRegisterOracle = async (account, fee) => {
  let result = await flightSuretyApp.methods.registerOracle().call({ from: account, value: fee });
  return result.toString("binary");
} 

let getGetMyIndexes = async (account) => {
  let result = await flightSuretyApp.methods.getMyIndexes().call({ from: account });
  return result.toString("binary");
} 

( async () => {
  const accounts = await web3.eth.getAccounts();
  const fee = await getRegistrationFee();
  console.log('fee: '+ fee);
  for(let a=1; a<TEST_ORACLES_COUNT; a++) {      
    // 
    console.log(accounts[a]);
    await  setRegisterOracle(accounts[a], fee);
    let result = await getGetMyIndexes(accounts[a]);
   // let result =   flightSuretyApp.methods.getMyIndexes().call({from: accounts[a]});
    // console.log('App:' + flightSuretyApp);
    // console.log(`Oracle Registrado : ${result[0]}, ${result[1]}, ${result[2]}`);
   }
}

)();
// ACT
for(let a=1; a<TEST_ORACLES_COUNT; a++) {      
 // 
 // await flightSuretyApp.methods.registerOracle().call({ from: web3.eth.accounts[a], value: fee2 });
 // let result = flightSuretyApp.methods.getMyIndexes().call({from: web3.eth.accounts[a]});
 // console.log('App:' + flightSuretyApp);
 // console.log(`Oracle Registrado : ${result[0]}, ${result[1]}, ${result[2]}`);
}

flightSuretyApp.events.OracleRequest({
    fromBlock: 0
  }, function (error, event) {
    if (error) console.log(error)
    console.log(event)
});

const app = express();
app.get('/api', (req, res) => {
    res.send({
      message: 'An API for use with your Dapp!'
    })
})

export default app;


