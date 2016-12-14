import {Entity} from "./entity";
import {Model} from "./model";
import {Private} from "./helpers";

export class Models<T extends Model> extends Array<T>{
    public constructor(data?:any[]){
        super();
        return Entity.cast<this>(data||this,this);
    }
    public has(value:T):boolean{
        return this.indexOf(value)>0;
    }
    public get(index:number):T{
        return this[index];
    }
    public set(index:number,value:T):T{
        return this[index]=value;
    }
    public add(value: T):this{
        this.push(value);
        return this;
    }
    public clear():this{
        this.splice(0,this.length);
        return this;
    }
    public remove(index:number):this{
        this.splice(index,1);
        return this;
    }
    public delete(value:T):this{
        this.remove(this.indexOf(value));
        return this;
    }
    public each(cb:(value:T,index:number)=>void): void{
        this.forEach((v,i)=>cb(v,i));
    }
    public toBinary():Uint8Array{
        return Entity.cast<Uint8Array>(this,String);
    }
    public toSimple():any[]{
        return Entity.cast<any[]>(this,Array);
    }
}

