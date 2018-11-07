# 这是node中写一些小方法的文档 #
<br>
- <a href="#myConcat">myConcat(list,totalLength)方法</a>
- <a href="#createPDir">循环创建文件的createPDir(path)方法</a>


<br><br><br><br><br><br><br><br><br><br><br>
## <div name="myConcat">myConcat(list,totalLength)方法</div> ##

``` 实现的功能是：通过buffer实现buffer之间数据的拼接。```

list指的buffer的集合，totalLength是传递进来拼接后的长度。

``` 步骤的实现 ```：
- 1, 判断参数，长度是否传入，判断传入的集合里边是否全部是buffer对象，如果不是list集合里边不是buffer对象，那么就返回并且报错。
如果长度没有传入则求出最大长度，并且创建这个长度的buffer对象，长度就是list结合buffer长度之和。
- 2，传入的长度totalLenth大于list集合的长度，那么多余的长度我们也要去掉，因为占用资源。所以还是自己创建。
- 3，通过copy方法实现buffer的拷贝
- 4，返回新的buffer

## <div name="createPDir">创建嵌套的文件createPDir(path)</div> ##

``` 通过这个函数实现文件的循环创建，通过mkdir一次性创建a/b/c/d/e等 ```

-   参数：path 是一个路径
-   使用的方法分别是：mkdir 以及 fs.stat(...)方法
-   使用的是递归的原理实现的：通过fs.stat方法判断文件是否存在，如果不存在创建，如果存在则继续调用创建的文件的函数。
