
const config = {
    username: '', //机密
    password: '', //机密
    token: '', //机密
    uuid: 'this-is-a-fucking-uuid' //随便起个就行了
}

const tongji = require('./index').getInstance(config);

function test(){
    "use strict";
    //首先要登录
    tongji.login()
        .then((res)=>{
            console.log("登录成功",res);
            tongji.getSiteList().then((data)=>{
                console.log(data);
            })
        })
        .catch((err)=>{
            console.log('登录失败',err);
        })
}

test();