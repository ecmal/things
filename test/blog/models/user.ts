import {Model} from "things/model";
import {Entity} from "things/entity";
import {Index, Id} from "things/index";
import {Field} from "things/field";
import {Models} from "things/models";
import {Posts} from "./post";


@Entity
export class User extends Model {

    @Id
    public id:string;

    @Field
    public name:string;

    @Field
    public posts:Posts;

}

@Entity
export class Users extends Models<User> {}