export class Objects {
    static toString(object):string {
        return JSON.stringify(object,null,2)
    }
    static toObject(string):any{
        return JSON.parse(string);
    }
    static merge(source,...patches):any{
        return this.patch({},source,...patches)
    }
    static patch<T>(source:T,...patches:any[]):T{
        for(var patch of patches){
            if(typeof patch == 'object'){
                for (var k in patch) {
                    source[k] = patch[k];
                }
            }
        }
        return source;
    }
}

declare global {
    interface Object {
        merge(patch,...patches:any[]):this;
        patch(patch,...patches:any[]):this;
    }
    interface String {
        hash():string;
        code():number;
        pad(count:number,char?:string,right?:boolean):string;
    }
    interface StringConstructor {
        hash();
    }
}

Object.defineProperty(Object.prototype,'merge',{
    configurable:true,
    value : function merge(...params) {
        return Objects.merge(this,...params)
    }
});
Object.defineProperty(Object.prototype,'patch',{
    configurable:true,
    value : function patch(...params) {
        return Objects.patch(this,...params)
    }
});
Object.defineProperty(String.prototype,'code',{
    configurable:true,
    value : function code() {
        var hash = 0, i, chr, len;
        if (this.length === 0) return hash;
        for (i = 0, len = this.length; i < len; i++) {
            chr   = this.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
});
Object.defineProperty(String.prototype,'hash',{
    configurable:true,
    value : function hash() {
        return (this.code()>>>0).toString(16).pad(8,'0');
    }
});
Object.defineProperty(String.prototype,'pad',{
    configurable:true,
    value : function pad(count,char=' ',right:boolean=false):string {
        var str = this;
        while(str.length<count){
            str = right?str+char:char+str;
        }
        return str;
    }
});
Object.defineProperty(String,'hash',{
    configurable:true,
    value : function pad(count,char=' ',right:boolean=false):string {
        return String(Math.random()).hash();
    }
});
