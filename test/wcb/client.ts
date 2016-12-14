import data from  "./data/agents";
import {Agent,Agents} from "./models/agent";
import {Entity} from "things/entity";
import {Offer} from "./models/offer";


system.globals.createAgents = ()=>{
    return new Agents(data()).toSimple();
};
system.globals.removeAgents = ()=>{
    Entity.get(Agent.class).store.clear();
    Entity.get(Offer.class).store.clear();
};