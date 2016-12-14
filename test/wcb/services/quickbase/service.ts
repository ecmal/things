import {Agents} from "../../models/agent";
import {Leads} from "../../models/lead";

export abstract class QuickbaseService {
    public abstract start():Promise<void>;
    public abstract getAgents(query?:any):Promise<Agents>;
    public abstract getLeads(query?:any):Promise<Leads>;
}