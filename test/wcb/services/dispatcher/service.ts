import {Inject} from "edi/inject";
import {Injectable} from "edi/injectable";
import {Emitter} from "runtime/events";
import {Bound} from "runtime/decorators";
import {Storage,Change} from "things/storage";
import {Model} from "things/model";
import {Lead} from "../../models/lead";

@Injectable({singleton:true})
export class DispatcherService extends Emitter {

    @Bound
    public start():Promise<void>{
        Storage.events.on('changes',this.onChanges);
        return Promise.resolve();
    }
    @Bound
    private onChanges(changes:Map<Model,Change>){
        changes.forEach((v:Change)=>{
            this.emit(v.entity.alias+'-'+v.action,v.model,v.changes,v);
        });
    }
}