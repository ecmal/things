import {Rest} from "http/rest";
import {Entity} from "things/entity";

@Rest('/schema')
export class StorageSchema {
    get(){
        return Entity;
    }
}

@Rest('/schema/:type')
export class StorageSchemaType {
    get(type){
        return Entity.schema.get(type);
    }
}