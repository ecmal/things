import {Field} from "things/field";
import {Model} from "things/model";
import {Models} from "things/models";
import {Id} from "things/index";
import {Lead} from "./lead";
import {Offers} from "./offer";
import {Entity} from "things/entity";

@Entity
export class Tier extends Model {
    @Id id:string;
    @Field rank:number;
    @Field number:number;
    @Field parachute:boolean;
    @Field lead:Lead;
    @Field offers:Offers;
    @Field reach_at:Date;
    @Field reach_in:number;
    @Field reached_at:Date;
    @Field reached_in:number;
}

@Entity
export class Tiers extends Models<Tier> {}