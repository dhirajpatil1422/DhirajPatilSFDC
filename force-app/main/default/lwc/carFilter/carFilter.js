import { LightningElement,wire } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import CAR_OBJECT from '@salesforce/schema/Car__c';

//Car schema
import CATEGORY_FEILD from '@salesforce/schema/Car__c.Category__c';
import MAKE_FEILD from '@salesforce/schema/Car__c.Make__c';

const CATEGORY_ERROR = "Error loading categories";
const MAKE_ERROR = "Error loading make";

import {publish,MessageContext } from 'lightning/messageService';
import CARS_FILTERED_MESSAGE from "@salesforce/messageChannel/CarsFiltered__c"
export default class CarFilter extends LightningElement {

    timer

    filters = {
        searchKey:'',
        maxPrice:999999
    }

    categoryError = CATEGORY_ERROR
    makeError = MAKE_ERROR

    /** Load Contex for LMS */
    @wire(MessageContext)
    messageContext

    /*** fetching Category picklist */
    @wire(getObjectInfo, {objectApiName:CAR_OBJECT})
    carObjectInfo

    @wire(getPicklistValues,{
        recordTypeId:'$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName:CATEGORY_FEILD
    })categories

    /*** fetching Make picklist */
    @wire(getPicklistValues,{
        recordTypeId:'$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName:MAKE_FEILD
    })makeType

    /* Search Key handler */
    handleSearchKeyChange(event){
        console.log(event.target.value)
        this.filters = {...this.filters,"searchKey":event.target.value}
        this.sendDataToCarList()
    }

    /* Price range handler */
    handleMaxPriceChnage(event){
        console.log(event.target.value)
        this.filters = {...this.filters,"maxPrice":event.target.value}
        this.sendDataToCarList()
    }

    handleCheckBox(event){
        if(!this.filters.categories){
            const categories = this.categories.data.values.map(item=>item.value)
            const makeType = this.makeType.data.values.map(item=>item.value)
            this.filters = {...this.filters, categories, makeType}
        }
        const {name, value} = event.target.dataset
        // console.log('name',name)
        // console.log('value',value)
        if(event.target.checked){
            if(!this.filters[name].includes(value)){
                this.filters[name] = [...this.filters[name], value]
            }
        }else{
            this.filters[name] = this.filters[name].filter(item=>item !==value)
        }
        this.sendDataToCarList()
    }

    sendDataToCarList(){
        window.clearTimeout(this.timer)
        this.timer = window.setTimeout(()=>{
            publish(this.messageContext,CARS_FILTERED_MESSAGE,{
                filters:this.filters
            })
        }, 400)
        
    }
}