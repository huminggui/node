/***************************2019.5.31 实现es6中数组的reduce方法*********/

Array.prototype.hreduce=function(cb,inital){

    //初始值为start，如果初始值存在则正常循环，start为传入进来的初始值，i为0；如果初始值不存在，那么我们需要少循环一轮，初始值为this的第一项，i则得从第二项开始循环。
    let start;
    let i;
    if(inital!==undefined){
        start=inital;
        i=0;
    }else{
        start=this[0];
        i=1;
    }
    for(;i<this.length;i++){
        start=cb(start,this[i]);
    }
    
   return start;

}


/***************************2019.5.31 实现深拷贝*********/
//这个是针对json的深拷贝，如果判断还是对象的话，就再调用自己本身，再通过判断把自己本身进行循环然后进行每个值的赋值。
function hcopy(json){
    let newJson={};
    for(let attr in json){
        if(typeof json[attr]=="object"){
            newJson[attr]=hcopy(json[attr]);
        }else{
            newJson[attr]=json[attr];
        }
    }
    return newJson;
}

/***************************2019.6.3 filter的实现*************/

Array.prototype.hfilter=function(cb){
    //把每一项都放入到函数里边，如果符合条件的就返回，把符合条件的返回
    let arr=[];
    for(let i=0;i<this.length;i++){
        let newCb=cb(this[i]);
        if(newCb){//满足条件返回为true时,添加当前的值
            arr.push(this[i]);
        }
    }
    return arr;
}



/***************************2019.6.3 find方法的实现*************/
//如果满足条件就返回一个元素，否则就返回false。

Array.prototype.hfind=function(cb){
    let values=null;
    for(let i=0;i<this.length;i++){
        let newBoolean=cb(this[i]);
        //如果存在就是返回，return是结束函数的
        if(newBoolean){
            values=this[i];
            return values;
        }
    }
    return false;
}




/***************************2019.6.3 some方法的实现*************/
//返回的只要一个是为true，则所有的都为true

Array.prototype.hsome=function(cb){
    for(let i=0;i<this.length;i++){
        let newValue=cb(this[i]);
        if(newValue){
            return true;
        }
    }
    return false;
}




/***************************2019.6.3 手写一个简单的生成器 ***********/
//生成器确实需要好好的思考一下了
//生成器的原理是：我点击一步就会执行一步
 Array.prototype.hit=function(){
    //hit函数创建的作用域，只有当返回的函数或者是返回的对象中含有函数不执行了才会释放，否则这个作用域会一直存在。
    let i=0;
    isDone=true;
    return {
       next:()=>{
           //判断这个函数是否继续往下执行,每执行一次就往数组里边获取一个值。
           if(i>=(this.length-1)){
                isDone=false;
           }else{
                isDone=true;
           }
           return{
               done:isDone,
               value:this[i++]
           }
       }
    }
}


