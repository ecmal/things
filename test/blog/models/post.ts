import {Model} from "things/model";
import {Entity} from "things/entity";
import {Index, Id} from "things/index";
import {Field} from "things/field";
import {Models} from "things/models";
import {Pointer} from "things/pointer";
import {User} from "./user";
import {Comments} from "./comment";

@Entity
export class Post extends Model {

    @Id
    public id:string;

    @Field
    public title:string;

    @Field
    public content:string;

    @Pointer({
        select:['id','name']
    })
    public owner:User;

    @Pointer({
        select:['id','message','owner','post']
    })
    public comments:Comments;

}

@Entity
export class Posts extends Models<Post> {
    public getSomething(){
        return this[0].constructor.name;
    }
}
