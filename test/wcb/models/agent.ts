import {Field} from "things/field";
import {Model} from "things/model";
import {Models} from "things/models";
import {Id} from "things/index";
import {Lead} from "./lead";
import {Offers} from "./offer";
import {Entity} from "things/entity";


@Entity
export class Agent extends Model {
    @Id
    public id : string;
    @Field
    public name : string;
    @Field
    public lead : Lead;
    @Field
    public offers : Offers;
    @Field
    public created_at : Date;
    @Field
    public updated_at : Date;
    @Field
    public crm : AgentCrm;
    @Field
    public wdc : AgentWdc;
    @Field
    public idc : AgentIdc;

    private onCreate(){
        this.wdc = new AgentWdc({
            id          : this.id.hash(),
            is_online   : false
        });
        this.idc = new AgentIdc({
            id          : this.id.hash(),
            status      : 'Offline',
            is_online   : false,
            is_talking  : false
        });
    }
    private onUpdate(){}
    private onRemove(){}
}

@Entity
export class AgentCrm extends Model {
    @Field
    public id : string;
    @Field
    public type : string;
    @Field
    public available : boolean;
    @Field
    public team : string;
}

@Entity
export class AgentWdc extends Model {
    @Field
    public is_online : boolean;
}

@Entity
export class AgentIdc extends Model {
    @Field
    public status : string;
    @Field
    public notes : string;
    @Field
    public station : string;
    @Field
    public is_online : boolean;
    @Field
    public is_talking : boolean;
}

@Entity
export class Agents extends Models<Agent> {}