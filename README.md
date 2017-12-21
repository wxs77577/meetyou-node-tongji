# meetyou-node-tongji
百度统计数据导出API的node-js版本，支持node.js 6+ 版本；

非常感谢luventa的开源项目https://github.com/luventa/node-tongji，我在此工程的基础上做了兼容node.js 6+，luventa的版本用到了es7的await，async新语法，需要node.js 7.6+。

## 使用
npm i meetyou-node-tongji -save-d

### 测试（及使用）
test.js

```
//配置下参数
const config = {
    username: '', //百度统计账号
    password: '', //密码（不会盗号，可看具体实现）
    token: '', //token
    uuid: '' //无用字段，随便填写
}

const tongji = require('./index').getInstance(config);

function test(){
    "use strict";
    //登录
    tongji.login()
        .then((res)=>{
            console.log("登录成功",res);
            //调用
            tongji.getSiteList().then((data)=>{
                console.log(data);
            })
        })
        .catch((err)=>{
            console.log('登录失败',err);
        })
}

test();
```

node test.js 会看到日志成功or失败
具体可根据百度统计API文档调用相关接口
