import {Entity} from "./entity";
import {Model} from "./model";
import {Field} from "./field";
import {Emitter} from "runtime/events";

export class Change {
    static changed:boolean;
    static changes:Set<Change> = new Set<Change>();
    static KEY = Symbol('change');
    static get(model:any):Change{
        var change:Change = model[Change.KEY];
        if(!change){
            change = model[Change.KEY] = new Change(model);
        }
        this.changes.add(change);
        if(!this.changed){
            this.changed = true;
            setTimeout(()=>{
                this.commit();
                this.changed = false;
            });
        }
        return change;
    }
    static commit(){
        var changes = new Map<Model,Change>();
        this.changes.forEach(c=>{
            changes.set(c.model,c.commit());
        });
        this.changes.clear();
        Storage.events.emit('changes',changes);
    }
    public model:any;
    public action:"updated"|"created"|"removed";
    public fields:Set<Field>;
    constructor(model:any){
        this.model = model;
        this.fields = null;
        this.action = null;
    }
    public get entity():Entity{
        return Entity.get(this.model)
    }
    public updated(field:Field):this{
        if(!this.action){
            this.action = 'updated';
        }
        if(!this.fields){
            this.fields = new Set<Field>()
        }
        this.fields.add(field);
        if(this.model.onUpdate){
            this.model.onUpdate(this.fields);
        }
        return this;
    }
    public removed():this{
        this.action = 'removed';
        this.fields = null;
        if(this.model.onRemove){
            this.model.onRemove();
        }
        return this;
    }
    public created():this{
        this.action = 'created';
        this.fields = null;
        if(this.model.onCreate){
            this.model.onCreate();
        }
        return this;
    }
    public commit():this{
        delete this.model[Change.KEY];
        return this;
    }
    public get changes():string[]{
        let names:string[]=[];
        if(this.fields){
            this.fields.forEach((v)=>{
                names.push(v.name);
            })
        }
        return names;
    }
    public changed(name:string):boolean{
        return this.changes.indexOf(name)>=0;
    }
    public toJSON(){
        let model;
        if(this.action=='created'){
            model = Object.create(null);
            this.entity.fields.forEach(f=>{
                f.copy(this.model,model,true);
            })
        }else
        if(this.action=='updated'){
            model = Object.create(null);
            this.fields.forEach(f=>{
                f.copy(this.model,model,true);
            })
        }
        return {
            action  : this.action,
            alias   : this.entity.alias,
            index   : this.entity.index.get(this.model),
            model   : model
        }
    }
}

export class Store<T extends Model> {
    private map:Map<string,T>;
    private entity:Entity;
    constructor(entity:Entity){
        this.entity = entity;
        this.map = new Map<string,T>();
    }
    private key(model:any){
        var key:string = model;
        if(key && typeof key != 'string'){
           key = model[this.entity.index.name];
        }
        return key;
    }
    public has(value:T|string):boolean{
        var key = this.key(value);
        if(key){
            return this.map.has(key);
        }else{
            return false;
        }
    }
    public get(value:T):T{
        var key = this.key(value);
        if(key){
            return this.map.get(key);
        }
    }
    public set(value:T):T{
        if(value instanceof Model){
            var key = this.key(value);
            if(key){
                if(!this.has(key)){
                    this.map.set(key,value);
                    Change.get(value).created();
                }else{
                    //todo : update ?
                    this.map.set(key,value);
                }
            }
        }
        return value;
    }
    public remove(value:T):T{
        var key = this.key(value);
        if(key && this.has(key)){
            this.map.delete(key);
            Change.get(value).removed();
        }
        return value;
    }
    public clear(){
        this.map.forEach(value=>{
            Change.get(value).removed();
        });
        this.map.clear();
    }
    public find(cb?:(v,i)=>boolean):T[]{
        var list = [];
        this.map.forEach((v,i)=>{
            if(!cb || cb(v,i)){
                list.push(v)
            }
        });
        return list;
    }
    public each(cb?:(v,i?,m?)=>void):void{
        this.map.forEach(cb);
    }
}
export class Storage {
    static get events():Emitter {
        return Object.defineProperty(this,'events',{
            value:new Emitter()
        }).events;
    }
    static get storage():Map<Entity,Store<any>>{
        return Object.defineProperty(this,'storage',{
            value : new Map<Entity,Store<any>>()
        }).storage;
    }
    static store(index:Entity):Store<any>{
        if(!this.storage.has(index)){
            this.storage.set(index,new Store<any>(index))
        }
        return this.storage.get(index);
    }
    static get<T extends Model>(entity:Entity,query:any):T{
        return this.store(entity).get(query);
    }
    static set<T extends Model>(entity:Entity,value:T):T{
        return this.store(entity).set(value);
    }
}

system.globals.store = Storage;