import { LightningElement ,api} from 'lwc';

export default class CarTile extends LightningElement {
    @api car={}

    handleCarSelection(){
        this.dispatchEvent(new CustomEvent('carselected',{
            detail:this.car.Id
        }))
    }
}