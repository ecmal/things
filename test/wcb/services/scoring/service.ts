import {Bound} from "runtime/decorators";
import {Storage} from "things/storage";
import {Entity} from "things/entity";
import {Lead} from "../../models/lead";
import {Agent} from "../../models/agent";
import {Offer,Offers} from "../../models/offer";


export class ScoringService {
    @Bound
    public start():Promise<void>{
        return Promise.resolve();
    }
    public score(lead:Lead):Promise<Offers>{
        return this.getScores(lead).then(scores=>{
            return new Offers(this.getAgents(lead).map(agent=>{
                return new Offer({
                    id      : `${lead.id}-${agent.id}`,
                    lead    : lead,
                    agent   : agent,
                    score   : scores.get(agent.id)
                });
            }));
        });
    }
    protected getScores(lead:Lead):Promise<Map<string,number>>{
        let map = new Map<string,number>();
        Entity.get(Agent).store.each((agent:Agent)=>{
            if(lead.crm.type == agent.crm.type){
                map.set(agent.id,Math.random());
            }
        });
        return Promise.resolve(map)
    }
    protected getAgents(lead:Lead){
        return Entity.get(Agent).store.find((agent:Agent)=>{
            return lead.crm.type == agent.crm.type;
        })
    }
}