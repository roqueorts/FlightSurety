import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        //this.web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws'))); 
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
        

        
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {

            // let result =   this.flightSuretyApp.methods.getMyIndexes().call({from: accts[1]})
            //       .then(function(result){
            //         console.log(`Oracle Registrado : ${result[0]}, ${result[1]}, ${result[2]}`);
            //          });
                     console.log('fdfdfdfd');
           
            this.owner = accts[0];

            let counter = 1;
            
            while(this.airlines.length < 5) {
                this.airlines.push(accts[counter++]);
            }

            while(this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            callback();
        });
    }

    isOperational(callback) {
       let self = this;
       self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner}, callback);
    }

    

    fetchFlightStatus(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        } 
        console.log("Vuelo: " + payload.flight);
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner}, (error, result) => {
                // callback(error, payload);
                console.log('Resultado: ', result);
                // this.fetchEvents();
                
            });
            self.flightSuretyApp.getPastEvents('FlightStatusInfo', {
                fromBlock: 1
            }, function(error, events){ console.log(events[0]); 
            
                payload.airline = events[0].returnValues.airline;
                payload.flight = events[0].returnValues.flight;
                payload.timestamp = events[0].returnValues.timestamp;
                payload.status = events[0].returnValues.status;
                callback(error, payload);
            
            })
            .then(function(events){
                console.log('EO'+ events) // same results as the optional callback above . allEvents
            });
// Events Listeners
// self.flightSuretyApp.events.FlightStatusInfo({fromBlock: 0}, function (error, event) {
//     console.log('Oracle event reported from processFlightStatus function of app contract')
//     console.log(event);
//     //console.log('Event Emitted = '+event.event);
//     //console.log(event.returnValues.result);
//     console.log(error,event);
//     // console.log('Flight = '+event.returnValues.flight);
//     // console.log('statusCode ='+event.returnValues.statusCode);
//     let statusError = error;
//     let statusResult = event;
//     // callback(statusError, statusResult);
// });

        // self.flightSuretyApp.events.FlightStatusInfo({
        //         fromBlock: 0
        //       },  function (error, event) {
        //         if (error) console.log('Error recibido' + error)
        //         console.log('EVENTOS' + event)
        //         // payload.airline = event.returnValues.airline;
        //         // payload.flight = event.returnValues.flight;
        //         // payload.timestamp = event.returnValues.timestamp;
        //         // payload.statusCode = event.returnValues.statusCode;
        //         callback(error, payload);
        //         // event.returnValues.firstAirline, event.returnValues.flight, event.returnValues.timestamp, event.returnValues.statusCode
                
        //       });

        
        //  filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
         //   fromBlock: 0,
          //  toBlock: 'latest'
        
    }

    async fetchEvents (){

       let result = await this.flightSuretyApp.getPastEvents('FlightStatusInfo', {
                    fromBlock: 0
                }, function(error, events){ console.log(events); })

                console.log('Nuevo resultado: ' + result);
                return result;

    };

    // fetchEvents() {
    //     let self = this;
    //     self.flightSuretyApp.getPastEvents('FlightStatusInfo', {
    //         fromBlock: 0
    //     }, function(error, events){ console.log(events); })
    //     .then(function(events){
    //         console.log(events) // same results as the optional callback above
    //     });
    // }
    
}