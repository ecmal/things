import {Decorator} from "runtime/decorators";
import {Member} from "runtime/reflect/member";
import {Method} from "runtime/reflect/method";
import {Constructor} from "runtime/reflect/constructor";
import {Class} from "runtime/reflect/class";

export class Test extends Decorator {

    static get tests():Set<Class>{
        return Object.defineProperty(this,'tests',{
            value:new Set<Class>()
        }).tests;
    }

    static register(test:Class){
        if(!this.tests.has(test)){
            this.tests.add(test);
        }
    }

    static run(...test:Class[]){
        function runTest(test:Class){
            var instance = Object.create(test.value.prototype);
            test.value.apply(instance);
            if(console.group){
                console.group(test.id);
            }else{
                console.info(test.id);
            }
            test.getMembers(m=>m.metadata.test).forEach((method:Method)=>{
                try {
                    method.invoke(instance);
                    console.debug('PASSED',method.name);
                }catch(ex){
                    console.error('FAILED',method.name);
                    console.error(ex);
                }
            });
            if(console.group){
                console.groupEnd();
            }else{
                console.info('----');
            }
        }
        if(test.length){
            test.forEach(t=>runTest(t))
        }else{
            this.tests.forEach(t=>runTest(t));
        }
    }

    decorate(member:Member){
        if(member instanceof Constructor){
            Test.register(member.owner);
        }else
        if(member instanceof Method){
            member.metadata.test = true;
        }
    }
}

export class Assert {
    static is(a,c,message?){
        if(!(a instanceof c)){
            throw new Error(message||`Object is not an instance of ${c.name}`);
        }
    }
    static eq(a,b,message?){
        if(a!==b){
            throw new Error(message||`Objects is not an equal`);
        }
    }
}