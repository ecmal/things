import {Inject} from "edi/inject";
import {Injectable} from "edi/injectable";
import {HttpService} from "./services/http/service";
import {QuickbaseService} from "./services/quickbase/service";
import {Config} from "./config";
import {DistributionService} from "./services/distribution/service";
import {ScoringService} from "./services/scoring/service";
import {DispatcherService} from "./services/dispatcher/service";


@Injectable
export class Bootstrap {

    @Inject
    private config:Config;
    @Inject
    private http:HttpService;
    @Inject
    private scoring:ScoringService;
    @Inject
    private dispatcher:DispatcherService;
    @Inject
    private distribution:DistributionService;
    @Inject
    private quickbase:QuickbaseService;

    public start():Promise<void>{
        console.info("Bootstrap");
        let promise:Promise<any> = this.config.load();
        promise = promise.then(this.dispatcher.start);
        promise = promise.then(this.scoring.start);
        promise = promise.then(this.distribution.start);
        promise = promise.then(this.http.start);
        promise = promise.then(this.quickbase.start);

        return promise;
    }
}