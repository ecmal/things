import {Injectable} from "edi/injectable";

@Injectable({singleton:true})
export class Config {
    public http = {
        enabled : true,
        host    : '0.0.0.0',
        port    : 3000,
        rest    : {
            path : '/api'
        },
        files   : {
            path : '.'
        }
    };
    public quickbase = {
        enabled         : true,
        host            : 'ffn.quickbase.com',
        port            : 443,
        username        : "EngineeringWCB",//EngineeringWCB,EngineeringAccountWCB
        password        : "Yqh6B2nPWJaHgyeK",//Yqh6B2nPWJaHgyeK,p2N4WcRaoitdXsTe
        expiration      : 24,
        agents          : {
            table       : "bjxzgkz4q", //bjxzgkz4q,9s8xgfy2
            timeout     : 3000
        },
        leads           : {
            table       : "bjxzgks6c",//bjxzgks6c,9s8xgfy2
            timeout     : 3000
        }
    };
    public distribution = {
        enabled             : true,
        web                 : {
            fdr             : {
                expiration  : 80,
                tiers       : [[0.1,5],[0.2,10],[0.5,20],[1,20]]
            },
            fplus           : {
                expiration  : 80,
                tiers       : [[0.1,5],[0.2,10],[0.5,20],[1,20]]
            }
        },
        phone               : {
            fdr             : {
                tiers       : [[0.1,5],[0.2,10],[0.5,20],[1,20]]
            },
            fplus           : {
                tiers       : [[0.1,5],[0.2,10],[0.5,20],[1,20]]
            }
        }
    };
    public load():Promise<Config>{
        console.info(this);
        return Promise.resolve(this);
    }
}