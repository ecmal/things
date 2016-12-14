import {Decorator} from "runtime/decorators";
import {Property} from "runtime/reflect/property";
import {Type} from "runtime/reflect/type";
import {Entity} from "./entity";
import {Member} from "runtime/reflect/member";
import {Pointer} from "./pointer";
import {Change} from "./storage";
import {Model} from "./model";

export class Field extends Decorator {
    public target:Property;
    public options:any;
    public index:number;
    public constructor(options?){
        super();
        this.options = options||{};
    }
    public get id(){
        return this.target.id;
    }
    public get name(){
        return this.target.name;
    }
    public get type():Type{
        return this.target.type;
    }
    public get entity():Entity{
        return Entity.get(this.type.class);
    }
    public get isEntity(){
        return !!this.entity
    }
    public get isModel(){
        return this.isEntity && this.entity.isModel;
    }
    public get isModels():boolean{
        return this.isEntity && this.entity.isModels;
    }
    public get key(){
        return Object.defineProperty(this,'key',{
            value:Symbol(this.name)
        }).key;
    }
    public get(model:any){
        if(model instanceof Model){
            if(typeof this.options.get=='function'){
                return this.options.get.call(model,model[this.key]);
            }else{
                return model[this.key];
            }
        }else{
            return model[this.name];
        }
    }
    public set(model:any,value:any){
        if(model instanceof Model){
            var previous = this.get(model);
            if(previous!==value){
                if(this.type.class==Date.class && previous && value){
                    if(previous.getTime()!==value.getTime()){
                        Change.get(model).updated(this);
                    }
                }else{
                    Change.get(model).updated(this);
                }
            }
            if(typeof this.options.set=='function'){
                model[this.key]=this.options.set.call(model,value);
            }else{
                model[this.key]=value;
            }
        }else{
            model[this.name]=value;
        }
    }
    public copy(source:any,target:any,ref:boolean=false){
        if(ref){
            if(this.isPointer()){
                let value = this.get(source);
                if(value){
                    if(this.isModels){
                        value = value.map(e=>{
                            return this.entity.itemType.index.get(e)
                        })
                    }else
                    if(this.isModel){
                        value = this.entity.index.get(value);
                    }
                }
                target[this.name] = value;
            }else{
                target[this.name] = this.get(source);
            }
        }else{
            this.set(target,this.get(source));
        }
    }
    public isPointer():this is Pointer {
        return this instanceof Pointer
    }
    public decorate(member:Member){
        console.info(this.constructor.name,member.toString());
        var self = this;
        if(member instanceof Property){
            member.metadata.field = this;
            this.target = member;
            this.target.descriptor = {
                enumerable   : true,
                configurable : true,
                get(){
                    return self.get(this)
                },
                set(v){
                    self.set(this,v);
                }
            }
        }else{
            throw new Error(`Invalid ${this.constructor.name} target "${member}"`);
        }
    }
    public toJSON(){
        return {
            id          : this.id,
            name        : this.name,
            isEntity    : this.isEntity,
            isModel     : this.isModel,
            isModels    : this.isModels,
            type        : this.type.class.id,
            isPointer   : false,
            isIndex     : false,
            isId        : false,
            pointing    : void 0
        }
    }
}