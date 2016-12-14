import {Rest} from "http/rest";
import {Entity} from "things/entity";
import {Model} from "things/model";
import {Store} from "things/storage";

@Rest('/data/:type')
export class StorageResources {
    private entity(type){
        return Entity.schema.get(type);
    }
    private store(type):Store<any>{
        return Entity.schema.get(type).store;
    }
    private get(type){
        return this.store(type).find();
    }
    private post(type:string,data:any):any{
        if(Array.isArray(data)){
            return data.map(item=>this.entity(type).decode(data));
        }else{
            return this.entity(type).decode(data);
        }
    }
}

@Rest('/data/:type/:id')
export class StorageResource {
    private store(type):Store<Model>{
        return Entity.schema.get(type).store;
    }
    private get(type,id){
        return this.store(type).get(id);
    }
    private put(type,id,data){
        return this.store(type).get(id).update(data);
    }
    private delete(type,id){
        return this.store(type).get(id).remove();
    }
}