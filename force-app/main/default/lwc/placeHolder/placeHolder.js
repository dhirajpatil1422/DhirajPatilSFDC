import { LightningElement,api } from 'lwc';
/** Static resource */
import CAR_EXPO_PLACEHOLDER from '@salesforce/resourceUrl/placeholder'
export default class PlaceHolder extends LightningElement {
    @api message
    placeholderUrl = CAR_EXPO_PLACEHOLDER
}