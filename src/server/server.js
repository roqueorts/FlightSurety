import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';


let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
// web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
const TEST_ORACLES_COUNT = 20;
// Watch contract events
const STATUS_CODE_UNKNOWN = 0;
const STATUS_CODE_ON_TIME = 10;
const STATUS_CODE_LATE_AIRLINE = 20;
const STATUS_CODE_LATE_WEATHER = 30;
const STATUS_CODE_LATE_TECHNICAL = 40;
const STATUS_CODE_LATE_OTHER = 50;
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
    // await  setRegisterOracle(accounts[a], fee);
    // let result = await getGetMyIndexes(accounts[a]);
    flightSuretyApp.methods.registerOracle().call({ from: accounts[a], value: fee }).then(function(resultado){
      console.log(`Oracle Registrado : ${resultado[0]}, ${resultado[1]}, ${resultado[2]}`);
      // let result =   flightSuretyApp.methods.getMyIndexes().call({from: accounts[a]});
      // result.then(function(results){
      //            console.log(`Oracle Registrado : ${results[0]}, ${results[1]}, ${results[2]}`);
      //             });
     
       });
  
    // console.log('App:' + flightSuretyApp);
    // console.log(`Oracle Registrado : ${result[0]}, ${result[1]}, ${result[2]}`);
   }

}

)();

flightSuretyApp.events.OracleRequest({
  fromBlock: 0
},  function (error, event) {
  if (error) console.log(error)
  console.log('eeee' + event.returnValues.airline)
  // let getAccounts = async () => {
  //   let result = await web3.eth.getAccounts();
  //   return result;//.toString("binary");
  // } 
  let index = event.returnValues.index;
 //let accounts =  await getAccounts();
 //console.log('Cuenta: ' + accounts[2]);
 let oracleIndexes = [0,1,2];// await getGetMyIndexes(accounts[2]);
 web3.eth.getAccounts(function(err, accounts) {
 for(let a=1; a<TEST_ORACLES_COUNT; a++) { 
  //for(let idx=0;idx<3;idx++) {

    try {
      console.log('Airline: ' + event.returnValues.airline);
      // Submit a response...it will only be accepted if there is an Index match
       flightSuretyApp.methods.submitOracleResponse(index, event.returnValues.airline, event.returnValues.flight, event.returnValues.timestamp, STATUS_CODE_LATE_AIRLINE).call({ from: accounts[a] });

    }
    catch(e) {
      // Enable this when debugging
       console.log('\nError en el Submit Oracle', index, index, event.returnValues.flight, event.returnValues.timestamp, e); //oracleIndexes[idx].toNumber()
    }

  //}

  }
 });

// Borrar
//  web3.eth.getAccounts(function(err, res) {
//  for(let a=1; a<TEST_ORACLES_COUNT; a++) {  
  // Get oracle information
  // let result =  flightSuretyApp.methods.getMyIndexes().call({ from: res[a]});
  // result.then(function(oracleIndexes){
  //   console.log('Cuenta: ' + res[a]);
  //   console.log('Indexes: ' + oracleIndexes);
  // })
    
//  }

// })
 });

//  flightSuretyApp.events.FlightStatusInfo({
//   fromBlock: 0
// },  function (error, event) {
//   if (error) console.log(error)
//   console.log('EVENTOS de' + event)
// });

const app = express();
app.get('/api', (req, res) => {
    res.send({
      message: 'An API for use with your Dapp!'
    })
})

export default app;


