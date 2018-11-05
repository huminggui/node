/*这是node中写一些小方法的文档  */

const myConcat=(list,totalLentth)=>{
    // - 1, 判断参数，长度是否传入，判断传入的集合里边是否全部是buffer对象，如list集合里边不是buffer对象，那么就返回并且报错。
    var leng=0;
    leng=list.reduce((prevalue,nextvalue)=>{return prevalue+nextvalue.length;},0);
    // 如果传入进来的totalLength过长，会浪费空间，所以我们重新创建一个大小符合存储数据的空间
    if(typeof totalLentth === "undefined" | totalLentth>leng){
        var buffer=Buffer.alloc(leng);
    }else{
        var buffer=Buffer.alloc(totalLentth);
    }
    // 如果长度没有传入则求出最大长度，并且创建这个长度的buffer对象，长度就是list结合buffer长度之和。
    // - 3，通过copy方法实现buffer的拷贝
    var offset=0;
    list.forEach(bf => {
        if(!Buffer.isBuffer(bf)){
            console.log("x");
            throw Error("not is buffer");
        }
        bf.copy(buffer,offset)
        offset+=bf.length;
    });
  
    // - 4，返回新的buffer
    return buffer;
}
module.exports=myConcat;

