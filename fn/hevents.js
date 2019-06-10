function HeventEmitter (){
    //首先定义一个专门存放方法的容器，之后如果有触发的时候就执行这个里边的方法就可以。
    //这个是类的私有属性，如果要继承这个类的私有属性，需要这么操作，把HeventEmitter.call(this);把这个父类指向子类的对象
    this.container={};
    //maxLength是事件绑定方法的最大的个数
    this.maxLength=10;
}


HeventEmitter.prototype.on=HeventEmitter.prototype.addListener=function(type,fn){
    if(this.container[type]){
        //如果这个事件存在则这个事件所值的方法的数组中再添加一个方法
        this.container[type].push(fn);
        //绑定事件的方法个数的限制,如果设置为0就不会有其他的限制
        if(this.container[type].length>this.maxLength && this.maxLength!=0){
            console.error(`警告：事件绑定的个数不能大于最大值${this.maxLength}，当前是第${this.container[type].length}个,您可以设置setMaxLength来改变这个现状`);
        }
    }else{
        //如果这个事件所指的方法是不存在的那么说明这个方法是第一次添加
        this.container[type]=[fn];
    }
}


HeventEmitter.prototype.emit=function(type,...rist){
    //如果emit传进来的事件是存在的，则执行这个事件所对应的所有的方法
    this.container[type] && this.container[type].map(item=>{
        item(...rist);
    });
}

//解绑方法的实现
/**
 * 数组中都是方法，如何解绑数组中所有方法中的其中一个方法
 * 用filter(item=>item) item就是方法名和作为参数传进来的方法名是否相等来进行判断
 * @params:指的是要删除这个事件中的某个方法的事件
 * @params:这个事件中要删除的某个方法
 */

 HeventEmitter.prototype.removeListener=function(type,fn){
    if(this.container[type]){
        this.container[type]=this.container[type].filter(f=>f!=fn);
    }
 }


/**
 * once方法的实现，就是绑定的方法只执行一次
 * @params:type参数是绑定的事件类型
 * @params:fn绑定的是事件的方法
 */
 HeventEmitter.prototype.onece=function(type,fn){
     let This=this;
    // this.on(type,fn);//这样是不可以的，因为还没有执行就移出掉了，这里只是把方法放到了数组里边，但是并没有执行。
    // this.removeListener(type,fn);
    let wrapper=function(...rist){
        //新增一个不干用的方法，等这个方法执行之后再把自己移出掉就可以了
        fn(...rist);
        //执行完目标方法之后，就把传入到数组中的wrapper的方法移出掉。
        This.removeListener(type,wrapper);
    }
    this.on(type,wrapper);

 }


 /**
  * 设置事件绑定最大的方法的个数的实现
  * 首选需要给类设置一个私有的并且是默认的绑定方法的最大个数的值
  */
 HeventEmitter.prototype.setMaxLength=function(num){
    this.maxLength=num;
 }
module.exports = HeventEmitter;