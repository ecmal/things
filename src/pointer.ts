import {Field} from "./field";
import {Member} from "runtime/reflect/member";
export class Pointer extends Field {

    public get names():string[]{
        return this.options.select;
    }

    public get fields():Field[]{
        var fields;
        if(this.entity) {
            if(this.entity.isModels){
                if(this.names && this.names.length){
                    fields = this.entity.itemType.fields.filter(f=>
                        this.names.indexOf(f.name) >= 0
                    );
                }else{
                    fields = this.entity.itemType.fields
                }

            }else
            if(this.entity.isModel){
                if(this.names && this.names.length) {
                    fields = this.entity.fields.filter(f=>
                        this.names.indexOf(f.name) >= 0
                    );
                }else{
                    fields = this.entity.fields
                }
            }
        }
        Object.defineProperty(this,'fields',{
            value:fields
        });
        return fields;
    }
    constructor(options?:any){
        super(options);
    }
    public decorate(member:Member){
        super.decorate(member);
    }

    public toJSON(){
        var json = super.toJSON();
        json.isPointer = true;
        json.pointing = this.names;
        return json;
    }
}