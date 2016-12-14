import {Rest} from "http/rest";
import {QuickbaseService} from "../services/quickbase/service";

import server from "../server";

export class QuickbaseResource {
    protected query:any;
    protected get qb():QuickbaseService{
        return server.get<QuickbaseService>(QuickbaseService.class);
    }
}

@Rest('/qb/agent')
export class QuickbaseAgents extends QuickbaseResource {
    private get(){
        return this.qb.getAgents(this.query);
    }
}

@Rest('/qb/lead')
export class QuickbaseLeads extends QuickbaseResource {
    private get(){
        return this.qb.getLeads(this.query);
    }
}