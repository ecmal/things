import {Field} from "things/field";
import {Model} from "things/model";
import {Models} from "things/models";
import {Id} from "things/index";
import {Agent} from "./agent";
import {Offers} from "./offer";
import {Tier, Tiers} from "./tier";
import {Entity} from "things/entity";

@Entity
export class Lead extends Model {
    @Id
    public id:string;
    @Field
    public type:string;
    @Field
    public color:string;
    @Field
    public name:string;
    @Field({
        get(v:string):string{
            if(v){
                return v.replace(/[^0-9]/g,'').substring(0,10);
            }
        },
        set(v:string):string{
            if(v){
                return v.replace(/[^0-9]/g,'').substring(0,10);
            }
        }
    })
    public phone:string;
    @Field
    public status:string;
    @Field
    public crm:LeadCrm;
    @Field
    public agent:Agent;
    @Field
    public offers:Offers;
    @Field
    public tier:Tier;
    @Field
    public tiers:Tiers;
    @Field
    public updated_at:Date;
    @Field
    public created_at:Date;
    @Field
    public offered_at:Date;
    @Field
    public expire_at:Date;
    @Field
    public landed_at:Date;
    @Field
    public taken_at:Date;
}

@Entity
export class Leads extends Models<Lead> {}

@Entity
export class LeadCrm extends Model {
    @Field
    public id:string;
    @Field
    public type:string;
    @Field
    public debt:number;
    @Field
    public campaign:string;
}


