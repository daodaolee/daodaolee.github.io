---
title: 重学JavaScript【作用域、执行上下文和垃圾回收】
date: 2021-02-06
tags:
 - JS
 - Scope
---
[[toc]]


## 原始值和引用值

在JavaScript中，数据分为 `原始值` 和 `引用值`，原始值就是最简单的数据，一般也称为 **值类型**，引用值就是由多个值构成的对象，一般被叫做 **引用类型**。保存原始值的变量是按值访问的，所以操作的是存储在变量中的实际值。引用值是保存在内存中的对象，要想改变它，实际上操作的是对该对象的 **引用**。

* 原始值不能添加属性，引用值可以添加属性
* 原始值复制给另一个变量是两个独立的栈，引用值复制给另一个变量是复制的引用地址，对象所在的堆不变。

* 对象被传入方法并改变它的属性时，对象在外部访问的还是原来的值

  ```js
  function setName(obj){
    obj.name = "adc";
    obj = new Object();
    obj.name = "def"
  }
  let person = new Object();
  setName(person);
  console.log(person.name) // abc
  ```

上面可得出，方法传入的对象其实是按值传递的，内部obj被重写之后，obj会变成一个指向本地对象的指针，而这个指向本地的对象在函数结束后会被销毁。

## 执行上下文

在JavaScript中，`上下文` 的概念特别重要，因为上下文决定了它们可以访问哪些数据和行为。每个上下文都有一个关联的变量对象，这个对象里包括了上下文中定义的所有东西。

* 全局上下文，也就是最外层的上下文，一般就是 **window**
* 函数上下文，执行的时候会被推入到一个上下文栈上，函数执行完毕后，上下文栈会弹出该函数上下文，将控制权返还给之前的执行上下文
* **上下文是在函数调用的时候才会生效的**

现在我们来模拟一个执行上下文的行为：

首先要知道的是，JavaScript的整个执行过程分为两个阶段：编译阶段(由作用域规则确定，编译成可执行代码)，执行阶段(引擎完成，该阶段创建执行上下文)。

我们定义一个执行上下文栈是一个数组：`ECStack = []`，当JavaScript开始解释执行代码的时候，首先会遇到全局代码，所以此时我们压入一个全局执行上下文 **globalContext**，当整个应用程序结束的时候，ECStack才会被清空，所以ECStack底部永远会有一个 globalContext。

```js
ECStack = [
	globalContext
]
```

此时，如果碰到了一个函数:

```js
// 要执行下面的函数
function fn(){
  function inFn(){}
  inFn()
}
fn()
```

那么执行上下文栈会经历以下过程：

```js
// 压栈
ECStack.push(globalContext)
ECStack.push(fnContext)
ECStack.push(inFnContext)

//弹出
ECStack.pop(inFnContext)
ECStack.pop(fnContext)
ECStack.pop(globalCotext)
```

执行上下文在创建阶段，会发生三件事：

1. 创建变量对象

2. 创建作用域链

3. this的指向

每个执行上下文都会分配一个 **变量对象(variable object,VO)** ，它的属性由 **变量** 和 **函数声明** 构成，在函数上下文的情况下，参数列表也会被加入到变量对象中作为属性，不同作用域的变量对象也不同。

**注意：只有函数声明会被加入到变量对象中，而函数表达式不会！**

   ```js
   // 函数声明
   function a(){}
   typeof a //function
   
   //函数表达式
   var a - function fn(){}
   typeof fn // undefined
   
   ```

   当一个函数被激活的时候，会创建一个活动对象(activation object,AO)并分配给执行上下文，活动对象由 arguments 初始化构成，随后它会被当做 **变量对象** 用于变量初始化。

   ```js
   function a(name, age){
     var gender = "male";
     function b()
   }
   a("小明", 20)
   ```

   a 被调用时，在a的执行上下文会创建一个活动对象AO，并且被初始化为：AO = [arguments]，随后AO又被当做变量对象VO进行变量初始化，此时：VO = [arguments].concat([name.age,gender,b])

一般情况下变量对象包括：形参，函数声明，和变量声明，下面用代码来表示一下某刻的变量对象都是什么：

```js
function fn(value){
  console.log(a);
  console.log(inFn);
  var a = 2;
  function inFn(){};
  var c = function() {};
  a = 3;
}
fn(1);
```

在进入执行上下文后，此时的AO是：

```js
AO = {
	arguments: {
		0: 1,
    length: 1
	}
	value: 1,
  a: undefined,
  b: reference to function inFn(){},
  c: undefined
}
```

接下来代码开始执行，执行完后，此时的AO是：

```js
AO = {
	arguments: {
    0: 1,
    length: 1
  },
  value: 1,
  a: 3,
  b: reference to function inFn(){},
  c: reference to FunctionExpression "c"
}
```

从上面来看，代码整体的执行顺序应该是：

```js
function fn(value){
  var a;
  function inFn(){};
  var d;
  console.log(a);
  console.log(inFn);
  a = 2;
  function inFn(){};
  c = function(){};
  a = 3;
}
```

每个时间，只会存在一个激活的变量对象。

## 作用域

作用域决定了查找变量的方法，JavaScript里采用的是 **静态作用域** 和 **动态作用域**，静态作用域是在函数定义的时候才会被决定，动态作用域是在函数被调用的时候定义，下面是一道经典面试题：

```js
var a = 1;
function out(){
  var a = 2;
  inner();
}
function inner(){
  console.log(a)
}
out()
// 1
```

作用域和作用域之间是有链接关系的，在查找变量的时候，如果当前上下文没有找到，就从父级执行上下文的变量对象中找，直到全局上下文。

函数的作用域在创建的时候决定，是因为内部有个属性叫：`[[scope]]`，它会保留所有的父变量，换句话讲，它就是所有父变量对象的层级链，我们可以从控制台找到某个函数里的 **[[scope]]** ，但是他不代表完整的作用域链！

```js
function out(){
  function inner(){}
}
```

函数创建时，各自的 **[[scope]]** 为：

```js
out.[[scope]] = [
	globalContext.VO
]
inner.[[scope]] = [
  outContext.AO,
  globalContext.VO
]
```

当函数被激活时，进入函数上下文，创建AO后，会将活动对象添加到作用域链的顶端，此时执行上下文的作用域链，我们叫 **Scope**：

```js
Scope = [AO].concat([[scope]])
```

到现在为止，作用域链创建完毕。

下面把执行上下文和作用域结合起来，看一下它的执行过程是怎样的：

```js
var scope = "global scope";
function fn(){
  var a = "local scope";
  return a;
}
scope();
```

1. fn函数被创建，此时fn会维护一个私有属性[[scope]]，把当前环境的作用域链初始化到这个[[scope]]上

   ```js
   fn.[[scope]] = [
   	globalContext.VO
   ]
   ```

2. 执行fn函数，创建fn的执行上下文，之后fn函数的执行上下文被压入执行上下文栈

   ```js
   ECStack = [
     fnContext,
     globalContext
   ]
   ```

3. fn函数复制内部的[[scope]]属性，从而创建作用域链

   ```js
   fnContext = {
   	Scope: fn.[[scope]]
   }
   ```

4. 此时fn的执行上下文和作用域链构建完毕，开始用 arguments 创建并初始化活动对象，加入形参，函数声明和变量声明

   ```js
   fnContext = {
     AO: {
   		arguments: {
         length: 0
       },
       a: undefined
     },
     Scope: fn.[[scope]]
   }
   ```

5. 此时fn内部也构建完毕，开始将自己的活动对象AO压入自己作用域链的顶端

   ```js
   fnContext = {
     AO: {
   		arguments: {
         length: 0
       },
       a: undefined
     },
     Scope: [AO, [[Scope]]]
   }
   ```

   注意，此时的作用域链就包括了 自己的AO 和 前面通过复制内部[[scope]]创建好的作用域链

6. 此时，fn的作用域链，变量，执行上下文都完毕了，开始执行fn函数，接下来的每一步就是修改 AO 的值，然后把AO压栈出栈，最终：

   ```js
   ECStack = [
   	globalContext
   ]
   ```

   有一个讲的比较细的例子在这里：[一道JS面试题引发的思考](https://github.com/kuitos/kuitos.github.io/issues/18)

## 垃圾回收

在函数中，局部变量会在函数执行的时候存在，如果函数结束了，变量就不被需要了，它所占用的内存就可以释放出来。常用的两种机制为 **标记清理** 和 **引用计数**。

标记清理是最常用的，就是每用到一次，该变量就会被标记一次，依次叠加，每不用一次(即离开上下文)，标记就会减少一个，依次递减。

引用计数就是对每个值的引用做一个记录，引用一次就加1，浏览器记录的是引用的次数，如果该值引用的变量被其他值覆盖了，就减1，当引用数为0时，释放内存。

如果对变量引用不当，或者执行的最终作用域没有释放掉，那么它就不会被标记和引用计数，此时就会造成 **内存泄漏**，又一道经典面试题：

```js
function fn(value){
	return function(name){
		return value + name
	}
}
var fn2 = fn("123");
var name = fn2("小明")
```

经典闭包题，函数内返回一个匿名函数！我们再来分析一遍：
fn2调用了fn，返回了一个匿名函数，该匿名函数会持有fn函数作用域的VO，包括arguments和value。当fn执行结束被销毁后，它的VO还是会一直保存在内存中，它的VO仍然在匿名函数中存在，也就是说这个VO一直被用着，所以浏览器的垃圾回收机制不会对它做处理，此刻就成了内存泄漏。

要想避免内存泄漏，常用的方法就是：赋值为null

```js
fn2 = null
```

强制把fn2内部清空，这样匿名函数的引用就成了null，此时它所使用的fn的VO就可以被回收了。



参考链接：

* [JavaScript深入之执行上下文](https://github.com/Hey-hy/Blog/issues/7)
* [VO、AO、执行环境和作用域链](https://www.cnblogs.com/lulin1/p/9712311.html)

* [执行上下文和作用域的区别](https://blog.csdn.net/qq_39148344/article/details/103657248)


