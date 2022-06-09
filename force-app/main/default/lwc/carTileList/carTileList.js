import { LightningElement,wire } from 'lwc';
import getCars from '@salesforce/apex/CarController.getCars';

import {publish,subscribe,MessageContext ,unsubscribe} from 'lightning/messageService';
import CARS_FILTERED_MESSAGE from "@salesforce/messageChannel/CarsFiltered__c";
import CARS_SELECTED_MESSAGE from "@salesforce/messageChannel/CarSelected__c";

export default class CarTileList extends LightningElement {
    cars=[]
    error
    filters ={}
    carFilterSubscription

    @wire(getCars, {filters:'$filters'})
    carsHandler({data,error}){
        if(data){
            console.log(data)
            this.cars = data
        }else{
            console.error(error)
            this.error = error
        }
    }

    /** Load Contex for LMS */
    @wire(MessageContext)
    messageContext

    connectedCallback(){
        this.subscribeHandler()
    }
    subscribeHandler(){
        this.carFilterSubscription = subscribe(this.messageContext,CARS_FILTERED_MESSAGE,(message)=>this.handleFiletrChanges(message))
    }

    handleFiletrChanges(message){
        console.log(message.filters)
        this.filters = {...message.filters}
    }

    handleSelectedCar(event){
        console.log('selected car id',event.detail)
        publish(this.messageContext,CARS_SELECTED_MESSAGE,{
            carId:event.detail
        })
    }

    disconnectedCallback(){
        unsubscribe(this.carFilterSubscription)
        this.carFilterSubscription = null
    }
}