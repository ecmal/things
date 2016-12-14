import {Field} from "things/field";
import {Model} from "things/model";
import {Models} from "things/models";
import {Id} from "things/index";
import {Lead} from "./lead";
import {Agent} from "./agent";
import {Entity} from "things/entity";
import {Pointer} from "things/pointer";

@Entity
export class Offer extends Model {
    @Id
    public id:number;
    @Field
    public score:number;
    @Field
    public allowed_tier:number;
    @Field
    public reached_tier:number;
    @Field
    public taken_tier:number;
    @Field
    public rank:number;
    @Field
    public index:number;
    @Field
    public position:number;
    @Pointer({
        select:['id','name']
    })
    public agent:Agent;
    @Pointer({
        select:['id','name']
    })
    public lead:Lead;

}

@Entity
export class Offers extends Models<Offer> {}
