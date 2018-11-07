/*通过mkdir实现文件嵌套文件的创建 */
let fs=require("fs");
//2创建文件的方法为
function makeDir(path){
    let pathArr=path.split("/");
    let index=0;
   
    function makeAllDir(cratePath){
        if(pathArr.length<index-1){
            console.log("文件夹已经创建完毕了，函数到此结束");
            return;
        }
        fs.stat(cratePath,function(err,stats){
            //文件不存在则创建新的文件
            if(err){
                fs.mkdir(cratePath,function(err){
                    if(err)console.log(err);
                });
                index++;
                makeAllDir(pathArr.slice(0,index+1).join("/"));
            }else{
            //如果文件存在那么往下一层进行判断和创建 
                index++;
                makeAllDir(pathArr.slice(0,index+1).join("/")); 
            }
        })
    }
    makeAllDir(pathArr[index]);
    
};
module.exports=makeDir;