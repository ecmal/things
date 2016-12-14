import {Bound} from "runtime/decorators";
import {Inject} from "edi/inject";
import {Injectable} from "edi/injectable";
import {Config} from "../../config";
import {QuickbaseService} from "./service";
import {Quickbase} from "./api";
import {Agent,Agents} from "../../models/agent";
import {Lead,Leads} from "../../models/lead";


@Injectable({singleton:true})
export class RealQuickbaseService extends QuickbaseService {

    @Inject
    private config:Config;

    @Inject
    private api:Quickbase;
    private polling:any;

    @Bound
    public start():Promise<void> {
        this.api.configure(this.config.quickbase);
        return this.api.authenticate().then(()=> {
            return this.doPollAgents().then(r=>{
                return this.doPollLeads('queued').then(r=>{
                    console.info("Quickbase Started");
                    return this.startPoll();
                });
            });
        });
    }

    @Bound
    public getLeads(query?:any):Promise<Leads> {
        query = {size:10,status:'pending'}.merge(query);
        return this.api.get('/db/'+this.config.quickbase.leads.table,{
            a       : 'API_DoQuery',
            udata   : 'wcb-leads',
            clist   : '1.2.3.6.7.36.68.119.833.834.1032',
            query   : `{'1032'.EX.'${query.status}'}`,
            options : `num-${query.size}`,
            ticket  : this.api.session.token
        }).then((r:any)=>{
            if(r.content && r.content.record) {
                let list:any[] = r.content.record;
                if (!Array.isArray(list)) {
                    list = [list];
                }
                return new Leads(list.map((a:any)=>{
                    return new Lead({
                        id              : String.hash(),
                        type            : 'web',
                        color           : '#000000',
                        name            : [a.client_first,a.client_last].join(' '),
                        phone           : a.day_phone,
                        status          : a.wcb_status,
                        crm             : {
                            id          : a.record_id_,
                            type        : 'fdr',
                            debt        : Number(a.unsecured_debt_estimate),
                            state       : a.state,
                            campaign    : a.campaign,
                        },
                        updated_at      : Quickbase.toDate(a.date_modified),
                        created_at      : Quickbase.toDate(a.date_modified)
                    });
                }));
            }else{
                return new Leads([]);
            }
        });
    }

    @Bound
    public getAgents(query?:any):Promise<Agents> {
        return this.api.get('/db/'+this.config.quickbase.agents.table,{
            a       : 'API_DoQuery',
            udata   : 'wcb-agents',
            clist   : '1.2.3.6.15.32.37.161.264',
            query   : "{'37'.GT.'0'}AND{'32'.SW.'Team'}",
            ticket  : this.api.session.token
        }).then((r:any):Agents=>{
            if(r.content && r.content.record) {
                let list:any[] = r.content.record;
                if (!Array.isArray(list)) {
                    list = [list];
                }
                return new Agents(list.map((a:any)=>{
                    return new Agent({
                        id              : a.username,
                        name            : a.legal_name,
                        crm             : {
                            id          : a.record_id_,
                            type        : 'fdr',
                            available   : Boolean(a.agent_available),
                            team        : a.team,
                        },
                        created_at      : Quickbase.toDate(a.date_created),
                        updated_at      : Quickbase.toDate(a.date_modified)
                    });
                }));
            }else{
                return new Agents([]);
            }
        });
    }

    public saveLead(l:Lead){
        let query:any = {
            a          : 'API_EditRecord',
            udata      : 'wcb-leads',
            ticket     : this.api.session.token,
            rid        : l.crm.id,
            _fid_1032  : l.status,
        };
        if(l.agent){
            query._fid_82    = l.agent.id,                           // sales agent
            query._fid_548   = l.agent.id,                           // wcb assigned user
            query._fid_547   = true,                                 // wbc
            query._fid_846   = Quickbase.dateToString(l.taken_at),   // wcb time accepted
            query._fid_843   = Quickbase.dateToString(l.landed_at),  // wcb received by wcb
            query._fid_844   = l.tier.number
        }
        return this.api.get('/db/'+this.config.quickbase.leads.table,query).then((r:any)=>{
            l.updated_at = Quickbase.toDate(r.content.update_id);
            return l;
        })
    }

    @Bound
    private doPollAgents(){
        return this.getAgents().then(r=>{
            if(this.polling){
                setTimeout(this.doPollAgents,this.config.quickbase.agents.timeout);
            }
        })
    }

    @Bound
    private doPollLeads(status:string='pending'){
        return this.getLeads({status}).then(leads=>{
            if (leads.length > 0) {
                console.info(`NEW LEADS: ${leads.length}`);
                return Promise.all(leads.map(l=>{
                    l.status = 'queued';
                    return this.saveLead(l).then(l=>{
                        l.status = 'landed';
                        l.landed_at = new Date();
                    });
                }));
            }else{
                return [];
            }
        }).then(r=>{
            if(this.polling){
                setTimeout(this.doPollLeads,this.config.quickbase.leads.timeout);
            }
        })
    }

    private startPoll(){
        this.polling = true;
        this.doPollAgents();
        this.doPollLeads();
    }

    private stopPoll(){
        this.polling = false;
    }
}