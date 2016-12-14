import {Xml} from "../../../utils/xml";

const Https = system.node.require('https');
const Url = system.node.require('url');
const Qs = system.node.require('querystring');

export class Quickbase {
    static toDate(str){
        return new Date(parseInt(str));
    }
    static dateToString(date:Date){
        return date.toISOString().replace(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})(\.\d{3}Z)?/,'$1 $2');
    }
    static get debug():boolean{
        return false
    }

    static request(hostname,port,method,pathname,query,headers,body){
        var options:any = {protocol:'https:',method,pathname,hostname,port,headers};
        if(query){
            options.query = query;
            options.search = '?'+Qs.stringify(query);
            if(options.search=='?'){
                options.search='';
            }
        }
        options = Url.parse(Url.format(options));
        options.method = method;
        options.headers = headers;

        return new Promise((resolve,reject)=> {
            options.date = new Date();
            var request = Https.request(options);
            request.on('error', err=> {
                reject(err);
            });
            request.on('response',(response:any)=>{
                options.time = new Date().getTime()-options.date;
                var content:any = '';
                var stream = response;//response.pipe(Zlib.createGunzip());
                stream.on('data', chunk=>{
                    content+=chunk.toString();
                });
                stream.on('end',()=>{
                    try{
                        var date = new Date();
                        var time = date.getTime()-options.date.getTime();
                        if(this.debug){
                            console.info({
                                status   : response.statusCode,
                                message  : response.statusMessage,
                                headers  : response.headers
                            });
                            console.info(content?content.toString():'');
                        }
                        if(content && content.length){
                            content = String(content);
                            content = content.replace(/<BR\/>/gi,'\n');
                            content = Xml.parse(content).asObject(false);
                        }else{
                            content = null;
                        }
                        if(response.statusCode>=400 || parseInt(content.errcode)){
                            reject({
                                status   : response.statusCode,
                                message  : response.statusMessage,
                                headers  : response.headers,
                                request  : options,
                                response : {
                                    date        : date,
                                    time        : time,
                                    parseTime   : new Date().getTime()-date.getTime()
                                },
                                content  : content
                            });
                        }else{
                            resolve({
                                status   : response.statusCode,
                                message  : response.statusMessage,
                                headers  : response.headers,
                                request  : options,
                                response : {
                                    date : date,
                                    time : time,
                                    parseTime   : new Date().getTime()-date.getTime()
                                },
                                content  : content
                            });
                        }

                    }catch(error){
                        reject(error);
                    }
                });
                stream.on('error',error=>{
                    reject(error);
                });
            });
            if (body) {
                if(this.debug){
                    console.info(JSON.stringify(options,null,2));
                    console.info(body.toString());
                }
                request.end(body);
            } else {
                request.end();
            }
        });
    }

    public config:any;
    public headers:any;
    public session:any;
    public constructor(options?:any){
        if(options){
            this.configure(options)
        }
    }
    public configure(options:any){
        this.config  = options;
        this.session = {};
        this.headers = {
            'Accept-Encoding'   :'gzip,deflate',
            'Content-Type'      :'application/xml',
            'Accept-Language'   :'en'
        }.merge(options.headers);
    }
    public get(path,query?,headers?){
        return Quickbase.request(this.config.host,443,"GET",path,query,headers,null);
    }
    public post(path,body,headers?,query?){
        return Quickbase.request(this.config.host,443,"POST",path,query,headers,body);
    }
    public authenticate(){
        return this.get('/db/main',{
            a         : 'API_Authenticate',
            username  : this.config.username,
            password  : this.config.password,
            hours     : this.config.expiration
        }).then((r:any)=>{
            this.session = {
                hours    : this.config.hours,
                token    : r.content.ticket
            };
            return this.session;
        })
    }
}