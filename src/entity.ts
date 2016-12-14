import {Decorator} from "runtime/decorators";
import {Class} from "runtime/reflect/class";
import {Member} from "runtime/reflect/member";
import {Constructor} from "runtime/reflect/constructor";
import {Modifier} from "runtime/reflect/modifier";
import {Type} from "runtime/reflect/type";

import {Field} from "./field";
import {Index} from "./index";
import {Model} from "./model";
import {Models} from "./models";
import {Storage} from "./storage";
import {Store} from "./storage";
import {Helpers} from "./helpers";
import {Id} from "./index";
import {Pointer} from "./pointer";

export class Entity extends Decorator {
    static provider:(type:Class)=>Model;
    static create(type:Class):any{
        if(this.provider){
            return this.provider(type);
        }else{
            return Object.create(type.value.prototype);
        }
    }
    static get schema():Map<String,Entity>{
        return Object.defineProperty(this,'schema',{
            enumerable  : true,
            value       : new Map<String,Entity>()
        }).schema;
    }

    static toJSON(){
        var entities = Object.create(null);
        this.schema.forEach((e,k:string)=>{
            entities[k] = e;
        });
        return entities;
    }

    static cast<T>(source,target):T{
        if(Helpers.isUndefined(source) || Helpers.isUndefined(target)){
            throw new Error(`Invalid cast from "${Helpers.getConstructorName(source)}" to "${Helpers.getConstructorName(source)}"`);
        }
        if(typeof source == 'function'){
            throw new Error('Invalid cast instance');
        }
        var sClass  = this.getClassOf(source);
        var tClass  = this.getClassOf(target);
        var sEntity = this.getEntityOf(sClass);
        var tEntity = this.getEntityOf(tClass);
        if(tEntity){
            if(sEntity==tEntity){
                //todo: check inheritance
                return source;
            }else{
                return tEntity.decode(source,sClass);
            }
        }else
        if(sEntity){
            return sEntity.encode(source,tClass);
        }
    }

    private static getClassOf(type:any):Class {
        if(type instanceof Class){
            return type;
        }else
        if(typeof type=='function'){
            return type.class
        }else
        if(type.constructor){
            return type.constructor.class;
        }else{
            return Object.class;
        }
    }
    private static getEntityOf(type:any):Entity {
        let cls = this.getClassOf(type);
        let entity = cls.metadata.entity;
        if(!entity){
            let parent=cls.parent;
            while(parent){
                if(entity = parent.metadata.entity){
                    cls.metadata.entity = entity;
                    break;
                }else{
                    parent=parent.parent;
                }
            }
        }
        return entity;
    }

    static get(type):Entity{
        return this.getEntityOf(type);
    }

    public class:Class;

    public get id():string {
        return this.class.id
    }
    public get alias():string {
        return this.class.name.replace(/([a-z])([A-Z])/,'$1-$2').toLowerCase();
    }
    public get type():Type {
        return this.class.type
    }
    public get isModel(){
        return Object.defineProperty(this,'isModel',{
            value:Type.get(this.class).is(Model.class)
        }).isModel
    }
    public get isModels():boolean{
        return Object.defineProperty(this,'isModels',{
            value:!!this.itemType
        }).isModels;
    }
    public get itemType():Entity {
        var parent = this.class,entity:Entity;
        while(parent){
            if(parent.inheritance && parent.inheritance.class.id == Models.class.id){
                if(parent.inheritance && parent.inheritance.isParametrized){
                    var ItemType = parent.inheritance.parameters[0];
                    if(entity = ItemType.class.metadata.entity){
                        break;
                    }
                }
            }
            parent = parent.parent;
        }
        Object.defineProperty(this,'itemType',{
            value : entity
        });
        return entity;
    }
    public get fields():Field[]{
        let value=[];
        if(this.isModels){
            value = this.itemType.fields;
        } else
        if(this.isModel){
            value = this.class.getAllMembers((m:Member)=>{
                return (m.metadata.field instanceof Field);
            }).map((f,i)=>{
                let field = f.metadata.field;
                Object.defineProperty(field,'index',{value:i});
                return field;
            })
        }
        Object.defineProperty(this,'fields',{
            value : value
        });
        return value;
    }
    public get indexes():Index[]{
        var value = this.fields.filter(f=>(f instanceof Index));
        Object.defineProperty(this,'indexes',{
            value : value
        });
        return value;
    }
    public get index():Index{
        var value = this.indexes.filter(f=>(f instanceof Id));
        return Object.defineProperty(this,'index',{
            value : value[0] || this.indexes[0]
        }).index;
    }
    public get store():Store<any>{
        return Object.defineProperty(this,'store',{
            value : Storage.store(this)
        }).store;
    }
    public get isDocument(){
        return Object.defineProperty(this,'isDocument',{
            value : !!this.indexes.length
        }).isDocument;
    }

    public decode(model:any,type:Class=Entity.getClassOf(model)){
        if(type == Object.class || type == Array.class){
            return this.decodeSimple(model);
        }else{
            return this.decodeBinary(model);
        }
    }
    public encode(model:any,type:Class=Object.class){
        if(type == Object.class || type == Array.class){
            return this.encodeSimple(model,this.fields);
        }else{
            return this.encodeBinary(model,this.fields,new Uint8Array(64));
        }
    }
    public decorate(member:Member){
        if(member instanceof Constructor){
            this.class = member.owner;
            member.owner.metadata.entity = this;
            system.globals[this.class.name]=this.class.value;
            Entity.schema.set(this.alias,this);
            this.class.getMember('toJSON',Modifier.PUBLIC,{
                value : function toJSON(){
                    return Entity.cast(this,Object);
                }
            });
        }else{
            throw new Error(`Invalid entity target "${member}"`);
        }
    }
    public patch(model,patch){
        this.fields.forEach(field=>{
            var value = field.get(patch);
            if(!Helpers.isUndefined(value)){
                if(field.entity){
                    value = field.entity.decodeSimple(value);
                }
                if(!Helpers.isUndefined(value)){
                    field.set(model,value);
                }
            }
        });
        return model;
    }
    public toJSON(){
        return {
            id          : this.id,
            isModel     : this.isModel,
            isModels    : this.isModels,
            itemType    : this.isModels?this.itemType.id:void 0,
            fields      : this.fields.length
                ? this.fields.reduce((p,f)=>(p[f.name]=f.toJSON(),p),Object.create(null))
                : void 0
        }
    }
    private decodeBinary(source:Uint8Array){
        return Object.create(this.class.value.prototype);
    }
    private decodeSimple(source:any):Model|Models<Model>{
        var self = this;
        function toModels(source:any[]){
            if(Array.isArray(source)){
                var model:Models<Model> = Entity.create(self.class);
                source.forEach(value=>{
                    if(!Helpers.isUndefined(value)) {
                        model.add(<Model>self.itemType.decodeSimple(value));
                    }
                });
                return model;
            }
        }
        function toModel(source:any){
            var model:Model;
            if(self.isDocument){
                model = Storage.get(self,source);
                if(!model){
                    model = Entity.create(self.class);
                    self.index.copy(source,model);
                    Storage.set(self,model);
                }
            }else {
                model = Entity.create(self.class);
            }
            self.fields.forEach(field=>{
                var value = field.get(source);
                if(!Helpers.isUndefined(value)){
                    if(field.entity){
                        value = field.entity.decodeSimple(value);
                    }
                    if(!Helpers.isUndefined(value)){
                        field.set(model,value);
                    }
                }
            });
            return model;
        }
        if(!Helpers.isUndefined(source)){
            if(this.isModels){
                return toModels(source);
            }else
            if(this.isModel){
                return toModel(source);
            }
        }
    }
    private encodeBinary(model:any, fields:Field[], target:Uint8Array):Uint8Array{
        return target;
    }
    private encodeSimple(model:any, fields:Field[], target?:any):any{
        var self = this;
        function toArray(model:Models<any>,fields:Field[],target:any[]){
            model.each((e)=>{
                if(!Helpers.isUndefined(e)){
                    target.push(self.itemType.encodeSimple(e,fields));
                }
            });
            return target;
        }
        function toObject(model:any,fields:Field[],target:any){
            fields.forEach(field=>{
                var value = field.get(model);
                if(!Helpers.isUndefined(value)){
                    if(field.entity){
                        var select:Field[];
                        if(field.isPointer()){
                            select = (<Pointer>field).fields
                        }else{
                            select = field.entity.fields;
                        }
                        value = field.entity.encodeSimple(value,select)
                    }
                    field.set(target,value);
                }
            });
            return target;
        }
        if(this.isModels){
            target = target||[];
            return toArray(model,fields,target);
        } else
        if(this.isModel){
            target = target||{};
            return toObject(model,fields,target);
        }
        return target;
    }
}