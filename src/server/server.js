import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';


let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
const TEST_ORACLES_COUNT = 10;
// ARRANGE
let getRegistrationFee = async () => {
  let result = await flightSuretyApp.methods.REGISTRATION_FEE().call();
  return result.toString("binary");
} 
// let getRegistrationFee = async () => {
//   let result = await flightSuretyApp.methods.REGISTRATION_FEE().call();
//   return result.toString("binary");
// } 

let setRegisterOracle = async (account, fee) => {
  let result = await flightSuretyApp.methods.registerOracle().call({ from: account, value: fee });
  return result.toString("binary");
} 

let getGetMyIndexes = async (account) => {
  let result = await flightSuretyApp.methods.getMyIndexes().call({ from: account });
  return result.toString("binary");
} 


( async () => {
  const fee = await getRegistrationFee();
  console.log('fee: '+ fee);
  for(let a=1; a<TEST_ORACLES_COUNT; a++) {      
    // 
    await  setRegisterOracle(web3.eth.accounts[a], fee);
    let result = await getGetMyIndexes( web3.eth.accounts[a]);
    //let result = await flightSuretyApp.methods.getMyIndexes().call({from: web3.eth.accounts[a]});
    // console.log('App:' + flightSuretyApp);
    // console.log(`Oracle Registrado : ${result[0]}, ${result[1]}, ${result[2]}`);
   }
}

)();
// let fee;
// flightSuretyApp.methods.REGISTRATION_FEE().call().then(function (res) { 
//   fee = res;
//   console.log('fee2: '+ fee); });
//   console.log('fee: '+ fee);
//   let fee2 = 1000000000000000000;
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


