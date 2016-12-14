import {Field} from "./field";
import {Member} from "runtime/reflect/member";

export class Index extends Field {
    public decorate(member:Member){
        super.decorate(member);
    }
    public toJSON(){
        var json = super.toJSON();
        json.isIndex = true;
        return json;
    }
}
export class Id extends Index {
    public decorate(member:Member){
        super.decorate(member);
    }
    public toJSON(){
        var json = super.toJSON();
        json.isId = true;
        json.isIndex = true;
        return json;
    }
}