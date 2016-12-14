import {Bound} from "runtime/decorators";
import {Inject} from "edi/inject";
import {Injectable} from "edi/injectable";
import {Storage,Change} from "things/storage";
import {Model} from "things/model";
import {ScoringService} from "../scoring/service";
import {DispatcherService} from "../dispatcher/service";
import {Lead} from "../../models/lead";
import {Offer} from "../../models/offer";
import {Tier,Tiers} from "../../models/tier";
import {Config} from "../../config";


@Injectable({singleton:true})
export class DistributionService {

    @Inject
    private config:Config;

    @Inject
    private scoring:ScoringService;

    @Inject
    private dispatcher:DispatcherService;

    private ticker:any;

    @Bound
    public start():Promise<void>{
        this.dispatcher.on('lead-created',this.onLeadCreate);
        this.dispatcher.on('lead-updated',this.onLeadUpdate);
        this.dispatcher.on('lead-removed',this.onLeadRemove);
        this.ticker = setInterval(this.onTick,500);
        return Promise.resolve();
    }
    private distribute(lead:Lead){
        let channel,product;
        channel = this.config.distribution[lead.type];
        if(channel){
            product = channel[lead.crm.type];
            if(product){
                let timeout = 0;
                let expiration = product.expiration||0;
                let landed_at = lead.offered_at.getTime();
                lead.expire_at = new Date(landed_at+expiration*1000);
                lead.tiers = new Tiers(product.tiers.map((t,i)=>{
                    let reach_at = new Date(landed_at+timeout*1000);
                    let reach_in = timeout;
                    timeout = timeout + t[1];
                    return new Tier({
                        id          : `${lead.id}-${i+1}`,
                        number      : i+1,
                        rank        : parseFloat((t[0]).toFixed(3)),
                        parachute   : false,
                        reach_in    : reach_in,
                        reach_at    : reach_at
                    })
                }));
                lead.tiers.push(new Tier({
                    id          : `${lead.id}-${product.tiers.length+1}`,
                    number      : product.tiers.length+1,
                    rank        : 1,
                    parachute   : true,
                    reach_in    : timeout,
                    reach_at    : new Date(landed_at+timeout*1000)
                }));
                lead.tier = lead.tiers.get(0);
            }
        }
    }

    @Bound
    private onTick(){
        let time = Date.now();
        Lead.each((lead:Lead)=>{
            if(lead.status=='offering'){
                if(lead.expire_at.getTime()<time){
                    lead.status = 'expired';
                }
                if(lead.tiers){
                    lead.tiers.each((t:Tier)=>{
                        if(t.number>lead.tier.number){
                            if(t.reach_at.getTime() < time){
                                lead.tier = t;
                            }
                        }
                    });
                }
            }
        })
    }
    @Bound
    private onLeadCreate(lead:Lead){
        console.info("DistributionService.onLeadCreate");
    }
    @Bound
    private onLeadUpdate(lead:Lead,changes:string[]){
        console.info("DistributionService.onLeadUpdate",lead.id,changes);
        if(lead.status == 'landed'){
            lead.status = 'scoring';
            this.scoring.score(lead).then(offers=>{
                offers.sort((a:Offer,b:Offer)=>{
                    return b.score-a.score;
                });
                lead.offers = offers;
                lead.offered_at = new Date();
                this.distribute(lead);
                lead.status = 'offering';
            });
        }
        //console.info(lead.toSimple());
    }
    @Bound
    private onLeadRemove(lead:Lead){
        console.info("DistributionService.onLeadRemove",lead.id);
    }
}