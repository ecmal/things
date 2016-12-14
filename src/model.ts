import {Entity} from "./entity";

export class Model {
    static new<T extends Model>(data?:any):T{
        return <T>new this(data);
    }
    static get<T extends Model>(query:any):T{
        return Entity.get(this).store.get(query);
    }
    static each<T extends Model>(cb?:(v,i?,m?)=>void):void{
        Entity.get(this).store.each(cb);
    }
    constructor(data?:any){
        return Entity.cast<this>(data||this,this);
    }
    public toBinary():Uint8Array{
        return Entity.cast<Uint8Array>(this,String);
    }
    public toSimple():any{
        return Entity.cast<any[]>(this,Object);
    }
    public remove(){
        Entity.get(this).store.remove(this)
    }
    public update(patch:any):this{
        return Entity.get(this).patch(this,patch);
    }
}


