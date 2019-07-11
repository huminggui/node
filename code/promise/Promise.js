//常量
const PEDING="pending";
const FULFILLED="fulfilled";
const REJECT="reject";

function Promise(executor){
    //避免this混乱
    let self=this;
   //设置状态，通过状态来判断promise是成功了还是失败了
   self.status=PEDING;
   //定义两个数组，当resolve或者reject之前的方法存储起来，一边到了后一次性执行。
   let onFulfilleds=[];
   let onRejects=[];
   function resolve(value){
       //说明状态还没有改变，成功回调
        if(self.status===PEDING){
            self.status=FULFILLED;
            self.value=value;
            onFulfilleds.forEach(cb=>cb(self.value));
        }
   }
   function reject(reason){
       //状态还没有改变的时候
        if(self.status=PEDING){
            self.status=REJECT;
            self.reason=reason;
            
            onRejects.forEach(cb=>cb(self.reason));
        }
   }
   /**
    * 这里需要捕获，因为在使用new Promise时里边代码有错误的话是需要捕获的，否则直到错误在哪里
    */
    try{
        executor(resolve,reject);
    }catch(e){
        //捕获到错误之后把错误传递给reject函数。
        reject(e);
    }
}
/**
 * 如果返回的再是一个promise该如何处理。如果是promsie就按照promise处理，如果不是就按照正常来处理。
 * promise如果没有resolve或者是reject那么会一直是pedding状态不会有任何的输出
 * @param {*} promise2 
 * @param {*} x 
 * @param {*} resolve 
 * @param {*} reject 
 */
function resolvePromise(promise2,x,resolve,reject){
    /**
     * 如果x不等于空，或者是等于对象或者是函数
     */
    if(x!==null && (typeof x==="object") || (typeof x==="function")){
        //是否具备then 方法来判断是否是promise
        let then=x.then;
        if(typeof then==="function"){
            //如果是一个函数的话，说明是有then方法的，基本上判定是一个promise了。下边是变样的then方法。
            then.call(x,function(y){
                /**
                 * 一直往深处判断，直到是基本数据类型再用最外边的resovle或者是reject进行输出。其他的promise都在里边的then方法里边实现了。
                 */
                resolvePromise(promise2,y,resolve,reject);
            },function(err){
                reject(err);
            })
        }else{
            //对象里边有一个then的属性的一种情况
            resolve(x);
        }
    }else{
        //基础类型的时候直接resolve就可以
        resolve(x);
    }
}
//then方法的实现
Promise.prototype.then=function(onResolve,onReject){
    let self=this;
    let promise2;
    /**
     * 有可能resolve和reject不传进来或者传递进来的东西不认识，所以我们需要做一个初始化的操作。
     */
    onResolve=typeof onResolve==="function"?onResolve:value=>value;
    //为何这里抛出一个错误：当执行onReject抛出错误时reason进行接收。
    onReject=typeof onReject==="function"?onReject:reason=>{throw reason};

    //状态为fulfilled下
    if(self.status===FULFILLED){
        return promise2=new Promise(function(resolve,reject){
            try{
                /*如果这个函数的执行返回的是一个promise呢，该怎么操作呢？
                    而这个x的值完全是调用它的人操作的,完全可以是promise.
                    所以我们要处理的是多个promise该如何操作
                */
                let x=onResolve(self.value);
                resolvePromise(promise2,x,resolve,reject);
            }catch(e){
                reject(e);
            }
        });
    }
    //在状态reject下
    if(self.status===REJECT){
        return promise2=new Promise(function(resolve,reject){
            try{
                onReject(self.reason);
            }catch(e){
               reject(e);
            }
        });
    }

    //如果状态是pedding的时候，我们先把不能执行的函数保存起来。
    if(self.status===PEDING){
        return promise2=new Promise(function(resolve,reject){

            self.onFulfilleds.push(function(){
                try{
                    let x=onResolve(self.value);
                }catch(e){
                    reject(e);
                }
            });

            self.onRejects.push(function(){
                try{
                    let x=onReject(self.reason);
                }catch(e){
                    reject(e);
                }
            });

        });
       
    }
   
}

module.exports=Promise;