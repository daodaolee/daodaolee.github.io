---
title: 重学JS【函数的进阶】
date: 2021-02-23 00:33:41
tags:
 - js
---
[[toc]]

本篇主要复习一下函数的内部对象，只有更好的了解函数的内部结构，才可以更好的封装方法。

## arguments

`arguments` 表示一个函数传入的参数，不管有没有传参，arguments 都存在。

```js
function fn(){
  console.log(arguments);
}
fn(1, 2, 3);
// Arguments [1, 2, 3, callee: fn(), Symbol(Symbol.iterator)]
fn();
// undefined
```

可以看出有参数传入的话，arguments就是一个类数组，保存了传入的值，如果没有参数，就是undefined。既然arguments可以获得参数，那当然可以使用arguments操作参数了，如果赋值了arguments再传参呢？

```js
function fn(){
  arguments[1] = 5;
  console.log(arguments);
}
fn(1);
// Arguments [1, 5, callee: fn(), Symbol(Symbol.iterator)]
```

注意：如果只传了一个参数，然后把 arguments[1] 设置为某个值，那么这个值不会反映到第二个命名参数，因为arguments的长度是根据传入的参数个数，而不是定义函数时给出的命名参数个数。

如果使用箭头函数，是无法获取 arguments 的。

arguments 有一个 **callee** 属性，它指向 arguments 所在的函数，下面是一个通过递归阶乘的函数：

```js
function factorial(num){
  if(num <= 1){
    return 1;
  } else {
    return num * factorial(num - 1);
  }
}
```

内部调用了 factorial 自己，相当于上面的代码写了两次 factorial，通过 arguments.callee 就可以只写一次，且易读：

```js
function factorial(num){
  if(num <= 1){
    return 1;
  } else {
    return num * arguments.callee(num - 1);
  }
}
```

好处是什么呢？现在还体现不出来，再看个例子：

```js
let factorial1 = factorial;
factorial = function(){
  return 0;
};
console.log(factorial1(5)); // 120
console.log(factorial(5)); // 0
```

相当于原来 factorial 的指针又指向了一个新地址：factorial1，然后重写了 factorial。这样如果不使用 arguments.callee 的话，factorial 内部调用的其实不是自己，而是 factorial，使用了 arguments.callee 之后，调用的就是自己了。

callee 英文是被叫者的意思，也可以理解为被叫者就是所在的函数。

## caller

`caller` 是呼叫者的意思，指向函数被调用者：

```js
function fn(){
  gn();
}
funciton gn(){
  console.log(gn.caller);
}
fn();
```

上面的代码会打印fn函数本身，因为 fn 调用了 gn，所以 gn 的 caller 就指向了 fn，而 gn 其实也是arguments.callee，所以可以这样写：

```js
funciton gn(){
  console.log(arguments.callee.caller);
}
```

## new.target

ECMAScript6定义了 new.target 属性，用于检测函数是否是用 new关键字 调用的，如果不是就返回undefined，如果是就引用被调用的构造函数：

```js
function fn(){
  if(!new.target){
    console.log("没使用new")
  } else {
    console.log("使用了new")
  }
}
new fn(); // 使用了new
fn(); // 没使用new
```


## call

`call` 可以改变函数体内 this 的指向：

```js
function sum(a, b){
  return a + b;
}
function fn(a, b){
  return sum.callthis, a, b);
}
fn(1, 2); // 3
```

上面的例子中，fn 调用了 sum，将 fn 内部的 this 传入了 sum，也可以说 this 指向了 sum，同时传入了 arguments。

下面我们实现一个 call：

首先我们分析 call 干了什么事情，改变了this的指向，并且执行了原来的函数，假如是这样调用的：

```js
var obj = {
  name: "abc"
}
function getName(){
  console.log(this.name);
}
getName.call(obj);
```

那么是不是可以理解为：getName是在obj上被调用了！

```js
var obj = {
  name: "abc",
  getName: function(){
    console.log(this.name)
  }
}
obj.getName();
```

这样不就和上面的逻辑一样了么，但是这样就给obj无缘无故添加了一个方法，我们把这个方法删掉不就更逼真了么：

```js
var obj = {
  name: "abc",
  getName: function(){
    console.log(this.name)
  }
}
obj.getName();
delete obj.getName;
```

到这里，我们从头分析一下走了哪几步：

1. 将函数设置成对象的属性
2. 执行这个函数
3. delete 删除这个函数

那么：

```js
Function.prototype.myCall = function(context){
  // this就是call的函数
  context.fn = this; // obj.fn = getName
  context.fn(); // obj.fn()
  delete context.fn; // delete obj.fn
}
```

一个简单版本的call就重写好了，接下来增加参数，原来的call是这样使用的。

```js
var obj = {
  name: "abc",
}
function getName(first, last){
  console.log(first);
  console.log(last);
  console.log(this.name)
}
getName.call(obj, "a", "bc"); // "a", "bc", "abc"
```

传入的参数不确定！可以使用前面提到的 arguments！取出第二个到最后一个参数，然后放到一个数组里！

```js
// 上面的那个例子里 arguments是
// arguments = {
//	  0: obj,
//    1: "a",
//    2: "b",
//    length: 3
// }
var args = [];
for(var i = 1; i < arguments.length; i++){
  args.push('arguments[' + i + ']');
}
// [obj, "a", "b"]
```

然后我们要把args放到代码里：

```js
Function.prototype.myCall = function(context){
  // this就是call的函数
  context.fn = this; // obj.fn = getName
  
  var args = [];
  for(var i = 1; i < arguments.length; i++){
    args.push('arguments[' + i + ']');
  }
  eval('context.fn(' + args + ')');

  delete context.fn; // delete obj.fn
}
```

到这里要注意两个问题，如果this没有呢？并且函数是可以有返回值的！直接上代码

```js
Function.prototype.myCall = function(context){
  // this 如果没有的话，默认会指向window，
  // this可以传基本类型数据，这种情况的话原生的call处理方式
  // 是将参数用Object()转换一下
  var context = context ? Object(context) : window;
  // this就是call的函数
  context.fn = this; // obj.fn = getName
  
  var args = [];
  for(var i = 1; i < arguments.length; i++){
    args.push('arguments[' + i + ']');
  }
  
  var result = eval('context.fn(' + args + ')');

  delete context.fn; // delete obj.fn
  return result;
}
```

## apply

`apply` 也可以改变函数体内 this 的指向，和 call 用法一样，主不过第二个参数是数组或类数组：

```js
function sum(a, b){
  return a + b;
}
function fn(){
  return sum.apply(this, arguments);
}
fn(1, 2); // 3
```

下面我们实现一个apply：

```js
Function.prototype.myApply = function (context, arr) {
  var context = Object(context) || window;
  context.fn = this;

  var result;
  if (!arr) {
    result = context.fn();
  }
  else {
    var args = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      args.push('arr[' + i + ']');
    }
    result = eval('context.fn(' + args + ')')
  }

  delete context.fn
  return result;
}
```

和call的区别就是一个是用arguments，一个使用传入的arr数组。

## bind

> bind 会创建一个新的函数，在bind被调用的时候，这个新函数的 this 就被指定为 bind 的第一个参数，其余参数将作为新函数的参数传入，供调用时使用。

也就是说，bind方法会创建一个新的函数实例，this也会绑定到这个函数实例上：

```js
var obj = {
  name: "abc"
}
function fn(){
  console.log(this.name);
}
var a = fn.bind(obj);
a(); // abc
```

上面例子将 fn 的 this 指向了 obj。

我们利用apply，来模拟一下：

```js
Function.prorotype.myBind = function(context){
  var _this = this;
  return function(){
    _this.apply(context);
  }
}
```

接着优化，优化参数的传递：

```js
Function.prorotype.myBind = function(context){
  var _this = this;
  // 获取第二个到最后一个参数
  var args = Array.prototype.slice.call(arguments, 1);
  
  return function(){
    //此时的arguments是bind返回的函数的参数
    var bindArgs = Array.prototype.slice.call(arguments);
    _this.apply(context, args.concat(bindArgs));
  }
}
```

到这里，算是一半了，注意：

> 一个绑定函数也能使用new操作符创建对象，这种行为就像把原函数当成了构造器。
>
> 提供的this值被忽略，同时调用的参数被提供给模拟参数。

也就是说 bind 返回的函数作为构造函数的时候，bind 指定的 this 会失效，但是传入的参数仍然生效。

```js
Function.prorotype.myBind = function(context){
  var _this = this;
  // 获取第二个到最后一个参数
  var args = Array.prototype.slice.call(arguments, 1);
  
  var fnBound = funciton(){
    var bindArgs = Array.prototype.slice.call(arguments);
    // 当作为构造函数时，this指向实例
    // 当作为普通函数时，this指向绑定的函数context
    // isCreateOrCustom 是true的话，this指向实例
    var isCreateOrCustom = this instanceof _this ? this : context;
    _this.apply(isCreateOrCustom,  args.concat(bindArgs));
  }
  // 修改函数的 prototype 为绑定函数的 prototype
  // 实例就可以继承函数的原型中的值
  fnBound.prototype = this.prototype;
  return fnBound
}
```

如果此时直接修改 fBound.prototype 了，this.prototype也会改变，所以可以用一个空函数：

```js
Function.prorotype.myBind = function(context){
  var _this = this;
  // 获取第二个到最后一个参数
  var args = Array.prototype.slice.call(arguments, 1);
  var fNOP = function(){}
  
  var fnBound = funciton(){
    var bindArgs = Array.prototype.slice.call(arguments);
    // 当作为构造函数时，this指向实例
    // 当作为普通函数时，this指向绑定的函数context
    // isCreateOrCustom 是true的话，this指向实例
    var isCreateOrCustom = this instanceof _this ? this : context;
    _this.apply(isCreateOrCustom,  args.concat(bindArgs));
  }
  // 修改函数的 prototype 为绑定函数的 prototype
  // 实例就可以继承函数的原型中的值
  fNOP.prototype = this.prototype;
  fnBound.prototype = new fNOP();
  
  return fnBound;
}
```

上面的两句：

```js
 fNOP.prototype = this.prototype;
 fnBound.prototype = new fNOP();
```

可以修改为：

```js
fbound.prototype = Object.create(this.prototype);
```

因为Object.create内部相当于：

```js
Object.create = function (o) {
  function f(){}
  f.prototype = 0;
  return new f;
}
```