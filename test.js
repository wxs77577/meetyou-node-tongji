
const config = {
    username: '', //你登录百度统计时候用的账号
    password: '', //你的密码，放心我不会盗号
    token: '', //你的token，在百度统计你的控制台页面里能找到
    uuid: '' //随便起个就行了
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