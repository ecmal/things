import {Entity} from "things/entity";
import {Users} from "./models/user";
import {Store} from "things/storage";
import {Model} from "things/model";
import {Server} from "http/server";
import {Rest} from "http/rest";

import "http/handlers/rest";
import "http/handlers/files";
import "http/handlers/favicon";


@Rest('/schema')
export class StorageSchema {
    get(){
        return Entity;
    }
}

@Rest('/data/:type')
export class StorageResources {
    private entity(type){
        return Entity.schema.get(type);
    }
    private store(type):Store<any>{
        return Entity.schema.get(type).store;
    }
    private get(type){
        return this.store(type).find();
    }
    private post(type:string,data:any):any{
        if(Array.isArray(data)){
            return data.map(item=>this.entity(type).decode(data));
        }else{
            return this.entity(type).decode(data);
        }
    }
}

@Rest('/data/:type/:id')
export class StorageResource {
    private store(type):Store<Model>{
        return Entity.schema.get(type).store;
    }
    private get(type,id){
        return this.store(type).get(id);
    }
    private put(type,id,data){
        return this.store(type).get(id).update(data);
    }
    private delete(type,id){
        return this.store(type).get(id).remove();
    }
}

new Server({
    host        : '0.0.0.0',
    port        : 3000,
    favicon     : true,
    rest        : {
        path    : '/api'
    },
    files       : {
        path    : '.'
    }
}).start();


system.on('load',()=>{
    var users = new Users([{
        id                    : 'sergey',
        name                  : 'Sergey Mamyan',
        posts                 : [{
            id                : "P1",
            title             : "Sergey's First Post",
            content           : "Sergey's First Post Content",
            owner             : {
                id            : 'sergey',
                name          : 'Sergey Mamyan'
            },
            comments          : [{
                id            : 'C1',
                message       : 'First Comment',
                post          : {
                    id        : "P1",
                    title     : "Sergey's First Post",
                },
                owner         : {
                    id        : 'lyov',
                    name      : 'Levon Gevorgyan'
                }
            },{
                id            : 'C2',
                message       : 'Second Comment',
                post          : {
                    id        : "P1",
                    title     : "Sergey's First Post",
                },
                owner         : {
                    id        : 'sergey',
                    name      : 'Sergey Mamyan'
                }
            }]
        },{
            id                : "P2",
            title             : "Sergey's Second Post",
            content           : "Sergey's Second Post Content",
            owner             : {
                id            : 'sergey',
                name          : 'Sergey Mamyan'
            },
            comments          : [{
                id            : 'C3',
                message       : 'First Comment',
                post          : {
                    id        : "P2",
                    title     : "Sergey's First Post",
                },
                owner         : {
                    id        : 'lyov',
                    name      : 'Levon Gevorgyan'
                }
            },{
                id            : 'C4',
                message       : 'Second Comment',
                post          : {
                    id        : "P2",
                    title     : "Sergey's First Post",
                },
                owner         : {
                    id        : 'sergey',
                    name      : 'Sergey Mamyan'
                }
            }]
        }]
    },{
        id                    : 'lyov',
        name                  : 'Levon Gevorgyan',
        posts                 : [{
            id                : "P3",
            title             : "Levon's First Post",
            content           : "Levon's First Post Content",
            owner             : {
                id            : 'lyov',
                name          : 'Levon Gevorgyan'
            },
            comments          : [{
                id            : 'C5',
                message       : 'First Comment',
                post          : {
                    id        : "P3",
                    title     : "Sergey's First Post",
                },
                owner         : {
                    id        : 'lyov',
                    name      : 'Levon Gevorgyan'
                }
            },{
                id            : 'C6',
                message       : 'Second Comment',
                post          : {
                    id        : "P3",
                    title     : "Sergey's First Post",
                },
                owner         : {
                    id        : 'sergey',
                    name      : 'Sergey Mamyan'
                }
            }]
        },{
            id                : "P4",
            title             : "Levon's Second Post",
            content           : "Levon's Second Post Content",
            owner             : {
                id            : 'lyov',
                name          : 'Levon Gevorgyan'
            },
            comments          : [{
                id            : 'C7',
                message       : 'First Comment',
                post          : {
                    id        : "P4",
                    title     : "Sergey's First Post",
                },
                owner         : {
                    id        : 'lyov',
                    name      : 'Levon Gevorgyan'
                }
            },{
                id            : 'C8',
                message       : 'Second Comment',
                post          : {
                    id        : "P4",
                    title     : "Sergey's First Post",
                },
                owner         : {
                    id        : 'sergey',
                    name      : 'Sergey Mamyan'
                }
            }]
        }]
    }]);
});


