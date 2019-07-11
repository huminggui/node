/**
 * **简版promise实现
 * 功能直到then的实现
 * add2:返回值有可能还是一个promise或者是一个其他的值，我们需要还判断
 */

//设置常量
const PENDING="pending";//pending状态
const FULFILLED="fulfilled";//成功的状态
const REJECTED="rejected";
/**
 * 定义一个Promise类
 * @param {传递进来一个执行器} executor
 */
function Promise(executor){
    
    let self=this;//缓存this对象
    //设置状态
    self.status=PENDING;
    //定义存放成功的回调数组
    self.onResolvedCallbacks=[];
    //定义存放失败的回调数组
    self.onRejectedCallbacks=[];

    
    /**
     * 成功调取的函数
     * 如果status的状态是pending状态可以转成fulfilled状态，如果是fulfilled状态或者是rejected状态则status无法再改变状态。
     * fulfilled是成功的状态
     * rejected表示的是失败的状态
     */
    function resolve(value){
        //
        if(value instanceof Promise){
            return value.then(resolve,reject);
        }
        //如果执行这个里边的函数说明已经是成功的状态了
        if(self.status===PENDING){
            self.status=FULFILLED;
            //成功时会传递一个值，这个值还不能更改
            self.value=value;
            //调用所有成功的回调
            self.onResolvedCallbacks.forEach(cb=>cb(self.value));
        }
    }
    /**
     * 失败调取的函数
     * @param {*失败时传递的值} reason 
     * 
     */
    function reject(reason){
        //如果status为pending则改变状态
        if(self.status===PENDING){
            self.status=REJECTED;
            self.value=reason;
            self.onRejectedCallbacks.forEach(cb=>cb(slef.value))
        }
    }

    try{
        //如果不报错就执行传递进来的操作
        executor(resolve,reject);
    }catch(e){
        //如果出现异常就使用reject()来处理这个异常
        reject(e);
    }
}

/**
 * 解析x的方法
 * @param {*} promise2 
 * @param {*} x 
 * @param {*} resolve 
 * @param {*} reject 
 */
function resolvePromise(promise2,x,resolve,reject){
    //返回的不能是自己，因为自己无法调用自己。
    if(promise2===x){
        return reject(new TypeError("循环引用"));
    }
    //判断，只执行一次的变量
    let called=false;
    if(x!==null && (typeof x==="object") || (typeof x==="function")){
        try{
            let then=x.then;
            //这里表示的是有then方法的对象,这个then方法或许是别人写的Promise，但是我们可以进行交互，都有then方法进行执行。
            if(typeof then==="function"){
                then.call(x,function(y){
                    //如果promise2已经成功或者失败处理了则不用再操作了,都只执行一次。别人写的promise方法有可能成功和失败会同时调用，所以我们用这个变量进行控制只能调用一次。
                    if(called)return;
                    called=true;
                    /**
                     * 递归调用，因为y还有可能是promise，可以一直是这样的,
                     * 只有当y的值变成了普通值才会停止递归。
                     */
                    resolvePromise(promise2,y,resolve,reject);
                },function(err){
                    //如果promise2已经成功或者失败处理了则不用再操作了,都只执行一次。
                    if(called)return;
                    called=true;
                    reject(err);
                });
            }else{
                /*到此的话，如果不是一个thenable函数，但是是一个对象。例如我们在使用return {then:{}},返回的确实是一个对象，但是不是一个函数。
                */
                resolve(x);
            }
        }catch(e){
             //如果promise2已经成功或者失败处理了则不用再操作了,都只执行一次。
             if(called)return;
             called=true;
            reject(e);
        }
    }else{
         
        //如果x是一个普通的值，则直接resolve(x)
        resolve(x);
    }
}

/**
 * 开始写then方法，如果成功则是调取onFulfilled的方法失败调取的是onRejected的方法
 */
Promise.prototype.then=function(onFulfilled,onRejected){
    let self=this;
    let promise2;
    /**
     * 但是存在一种情况就是then里面没有写值的时候，这个时候我们就把这个值往后传递就可以
     * 如果是函数则就是自己本身，如果不是函数就说明没有传值或者是传值不正确，这个时候就给一个默认的函数把值往后传递。
     * 这里是用throw的方式来抛出错误，一定要用这个来抛出错误，因为只有这样后边catch才能抓错误。
     */
    onFulfilled=typeof onFulfilled==="function"?onFulfilled:value=>value;
    onRejected=typeof onRejected==="function"?onRejected:reason=>{throw reason};
    /**
     * 我们在执行then(函数)的时候函数是自己写的，函数的参数确实固定的。所以我们把这个成功的函数进行执行，参数是resolve传递的参数。但是需要确认下是否是成功的状态了。
     * 
     */
    if(self.status===FULFILLED){
        //状态的值只有成功，或者只有失败。从一开始就决定了的。
        return promise2=new Promise(function(resolve,reject){
            let x=onFulfilled(self.value);
            /**
             * 如果获取了返回值x则需要去解析x是什么类型的，有可能是别人写的promise或者是系统自带的。
             * 这里的resolve和reject是promise2的。
             * resolvePromise()方法是来解析返回值x的。
             */
            setTimeout(function(){
                try{
                    resolvePromise(promise2,x,resolve,reject);
                }catch(e){
                    //一旦出错了就是这个promise的reject
                    reject(e);
                }
            });
            
        });
        
    }
    if(self.status===REJECTED){
        return promise2=new Promise(function(resolve,reject){
            //状态的值只有成功，或者只有失败。从一开始就决定了的。
            setTimeout(function(){
                try{
                    let x=onRejected(self.value);
                    resolvePromise(promise2,x,resolve,reject);
                }catch(e){
                    reject(e);
                }
            });
        })
    }

    /**
     * 如果是pending的状态,说明还没有成功或者是失败，
     * pending状态改变后，就会去循环成功的数组或者是失败的数组。
     */
    if(self.status===PENDING){
        return promise2=new Promise(function(resolve,reject){
            self.onResolvedCallbacks.push(function(){
                setTimeout(function(){
                    try{
                        let x=onFulfilled(self.value);
                        resolvePromise(promise2,x,resolve,reject);
                    }catch(e){
                        reject(e);
                    }
                });
                
            });
    
            self.onRejectedCallbacks.push(function(){
                setTimeout(function(){
                    try{
                        let x=onRejected(self.value);
                        resolvePromise(promise2,x,resolve,reject);
                    }catch(e){
                        reject(e);
                    }
                })
            });
        });
    }
}

//最后实现catch的方法,这个方法的原理是只走失败的回调
Promise.prototype.catch=function(onRejected){
    this.then(null,onRejected);
}
//不懂什么意思，反正就是要写
Promise.deferred=Promise.defer=function(resolve,reject){
    let defer={};
    defer.resolve=resolve;
    defer.reject=reject;
    return defer;
}
module.exports=Promise;