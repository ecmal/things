import {Bound} from "runtime/decorators";
import {Inject} from "edi/inject";
import {Injectable} from "edi/injectable";
import {Server} from "http/server";
import {Config} from "../../config";


import "http/handlers/rest";
import "http/handlers/files";
import "http/handlers/favicon";

import "../../api/schema";
import "../../api/data";
import "../../api/quickbase";

@Injectable({singleton:true})
export class HttpService {

    @Inject
    private config:Config;

    @Inject
    private server:Server;

    @Bound
    public start():Promise<void> {
        this.server = new Server(this.config.http).start();
        return Promise.resolve();
    }
}