export class Private {
    static KEY = Symbol('private');
    static get<T>(model:any,cn?:{new():T}){
        if(!model[Private.KEY]){
            model[Private.KEY] = Object.create(cn?cn.prototype:null);
        }
        return <T>model[Private.KEY];
    }
}

export class Helpers {
    static getConstructorName(any:any):string {
        if(!this.isUndefined(any)){
            if(any.constructor){
                return any.constructor.name;
            }else
            if(typeof any=='object'){
                return 'object';
            }
        }
        return 'unknown';
    }
    static isUndefined(any:any):boolean {
        return any === null || any === void 0;
    }
}