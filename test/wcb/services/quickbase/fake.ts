import {Bound} from "runtime/decorators";
import {Inject} from "edi/inject";
import {Injectable} from "edi/injectable";
import {Config} from "../../config";
import {QuickbaseService} from "./service";
import {Agents} from "../../../wcb/models/agent";
import {Leads} from "../../models/lead";
import agents from "../../../wcb/data/agents";

@Injectable({singleton:true})
export class FakeQuickbaseService extends QuickbaseService {

    @Inject
    private config:Config;

    @Bound
    public start():Promise<void> {
        console.info(this);
        return Promise.resolve();
    }
    @Bound
    public getLeads(query?:any):Promise<Leads> {
        return Promise.resolve(new Leads([]));
    }
    @Bound
    public getAgents(query?:any):Promise<Agents> {
        return Promise.resolve(new Agents(agents()));
    }
}