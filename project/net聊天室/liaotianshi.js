/**
 * 简单说一下使用的规则
 * 如果不写任何的后缀则会报错提示重新输入提示码
 * b:内容，表示的是广播，所有在线的客户端都是能够受到这个广播的
 * c:用户名:内容 表示的对某一个人发私信
 * l: 会先显示所有的人的在线的列表
 * n:新的名字  这个是重命名的一i是
 */

 let net =require("net");
 //设置用户接入的数组存储的对象
 let clients={};
 //这个是只有在客户端连接的时候才会执行的
 let server =net.createServer({},function(socket){
     //提示客户进入房间
    console.log("客户进入房间");
    //设置客户字符编码
    socket.setEncoding("utf8");
    //监听在线客户的人数的提示
    server.getConnections(function(err,count){
        if(err)return console.log(err);
        console.log(`房间在线人数->${count}`);
    });
    //客户进入房间的默认设置操纵
    //设置用户的key值，由ip+端口号+随机数组成
    let key=socket.remoteAddress+socket.remotePort+Math.random().toFixed(2);
    console.log(key);
    clients[key]={
        name:"匿名"+Math.random().toFixed(2)*1000,
        socket
    }
    //监听客户端的操作
    socket.on("data",function(data){
        data=data.replace(/\r\n/,"");
        //通过客户输入的内容进行判断是属于什么类型的操纵
        let Type=data.slice(0,1);
        //回车的时候会把\r\n输入到客户端,所以派出这种情况
        if(Type==""){return;}
        switch(Type){
            case "b"://广播
                //获取用户输入的内容且作为参数传递给函数
                let broadText=data.slice(2);
                let b_name=clients[key].name;
                broadcast(key,`${b_name}说:${broadText}\r\n`);
                break;
            case "c"://私聊某个用户
                let arrData=data.split(":");
                let cName=arrData[1];
                let cText=arrData[2];
                console.log(arrData);
                sendTo(key,cName,cText);
                break;
            case "l"://显示所有的在线用户
                showList(key);
                break;
            case "n"://重名命
                let newName=data.slice(2);
                rename(key,newName);
                break;
            default:
                socket.write("输入有误请重新输入\r\n");
        }

    })
    //离开时提示谁离开了
    socket.on("end",function(){
        let clientName=clients[key].name;
        broadcast(key,`${clientName}离开了房间`);
        clients[key].socket.destory();
        delete clients[key];
    })
 });
 /**
  * 
  * @param {*当前客户端的key值} key 
  * @param {*广播的信息} msg 
  */
 function broadcast(key,msg){
    //除了自己以外其他的在线用户都应该接收到信息
    for(attr in clients){
        if(attr!=key){
            clients[attr].socket.write(msg);
        }
    }
 }
 function sendTo(key,cname,msg){
     let _name=clients[key].name;
     let _socket=clients[key].socket;
     for(let attr in clients){
         console.log("clients[attr].name:",clients[attr].name);
         console.log("cname:",cname);
        if(clients[attr].name==cname){
            console.log("我是进来了的");
            clients[attr].socket.write(`${_name}对你说:${msg}`);
        }
     }

 }
/**
 * 显示所有的在线客户列表的姓名
 * @param{*当前客户端的key值}key
 */
 function showList(key){
    let keySocket=clients[key].socket;
    for(let attr in clients){
        //除了自己本身以外其他的客户都显示来
        if(attr!=key){
            let clientName=clients[attr].name;
            //在自己的流里边写上别人的姓名
            keySocket.write(clientName+"\r\n");
        }
    }
 }
 /**
  * @param{*把当前的名字改成新的名字就可以}newName
  */
 function rename(key,newName){
    clients[key].name=newName;
    let new_name=clients[key].name;
    clients[key].socket.write(`重命名成功,您的新名字是:${new_name}`);
 }
 server.listen(8001,function(){
     console.log("服务器启动成功::",server.address());
 });