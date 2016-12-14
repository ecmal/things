import {Model} from "things/model";
import {Entity} from "things/entity";
import {Index, Id} from "things/index";
import {Field} from "things/field";
import {Models} from "things/models";
import {Pointer} from "things/pointer";
import {Post} from "./post";
import {User} from "./user";



@Entity
export class Comment extends Model {

    @Id
    public id:string;

    @Field
    public message:string;

    @Pointer({
        select:['id','title']
    })
    public post:Post;

    @Pointer({
        select:['id','name']
    })
    public owner:User;

}

@Entity
export class Comments extends Models<Comment> {

}