let myPromise=require("./Promise");
let p1=new myPromise(function(resolve,reject){
    let num=Math.random();
   
    if(num>0.5){
        resolve(num);
    }else{
        reject("reject err:比0.5小");
    }
})
/**正常测试 */
// p1.then(function(res){
//     console.log("res:"+res);
// },function(err){
//     console.log("err:"+err);
// });

/**传递空的reject进行测试一下 */
let xxx=p1.then(function(res){
    //输出res的同时，返回一个promise
    console.log(res);
    return new myPromise(function(resolve,reject){
        resolve(new myPromise(function(resolve,reject){
            resolve("我是你二大爷");
        }));
    });
},function(err){
    console.log(err);
})
.then(function(res2){
    console.log("res2:"+res2);//输出我是你二大爷
    return new myPromise(function(resolve,reject){
        resolve(res2);
    });
},function(err2){
    console.log("err2:"+err2);
})
.then(function(res3){
    console.log("res3:"+res3);//我是你二大爷
},function(err3){
    console.log("err3:"+err3);
});
