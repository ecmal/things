import {User,Users} from './models/user';
import {Post,Posts} from './models/post';
import {Comment,Comments} from './models/comment';

import {Test,Assert} from '../utils/tests';

import USERS from './data/users';
import {Storage,Change} from "things/storage";
import {getUsersRaw} from "./data/dynamic";


@Test
class Temp {
    @Test
    public temp(){
        var user = new Users(USERS);
        console.info(user);
        console.info(user.toSimple());
    }
}

@Test
class model_serializations {

    @Test
    public users_serialization(){
        var users = new Users(USERS);
        Assert.is(users,Users);
        users.each(user=>{
            Assert.is(user,User);
            Assert.is(user.posts,Posts);
            user.posts.each(post=>{
                Assert.is(post,Post);
                Assert.is(post.comments,Comments);
                post.comments.each(comment=>{
                    Assert.is(comment,Comment);
                    Assert.is(comment.owner,User);
                });
            });
        });
    }

    @Test
    public users_relations(){
        var users = new Users(USERS);
        Assert.eq(users.get(0),users.get(0).posts.get(0).owner);
        Assert.eq(users.get(0),users.get(0).posts.get(1).owner);
        Assert.eq(users.get(1),users.get(1).posts.get(0).owner);
        Assert.eq(users.get(1),users.get(1).posts.get(1).owner);
        Assert.eq(users.get(0),User.get('sergey'));
        Assert.eq(users.get(0),User.get({id:'sergey'}));
    }

    @Test
    public users_deserialization(){
        Assert.eq(JSON.stringify(USERS),JSON.stringify(new Users(USERS)));
    }

}



function testPerformance(){
    var i,s=0,t=Date.now();
    for(i=0;i<10000;i++){
        var time = Date.now();
        var users = new Users(getUsersRaw());
        time = (Date.now()-time)/1000;
        s+=time;
    }
    console.info('TIME',s/i,(Date.now()-t)/1000);
}

system.on('load',()=>{
    Storage.events.on('changes',(changes:Change[])=>{
        //var models = {};
        var models = {};
        changes.forEach(change=>{
            var changes = models[change.model['id']] = {};
            change.fields.forEach(field=>{
                changes[field.name] = field.get(change.model);
            });
        });
        console.info(changes);
        console.info(models);
    });
    Test.run();
    /*
    setInterval(()=>{
        User.get<User>('sergey').name = String(Math.random());
        Post.get<Post>('P1').title = String(Math.random());
    },1000);*/
});