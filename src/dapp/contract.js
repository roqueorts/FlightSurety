import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
       // this.fetchEvents();
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
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner}, (error, result) => {
                // callback(error, payload);
                console.log('Resultado: ', result);
                self.flightSuretyApp.getPastEvents('FlightStatusInfo', {
                    fromBlock: 0
                }, function(error, events){ console.log(events); })
                .then(function(events){
                    console.log(events) // same results as the optional callback above
                });
            });
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