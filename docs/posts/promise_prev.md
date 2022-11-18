---
title: Promise【知其然】
date: 2021-01-30 22:28:15
tags:
 - promise
---
[[toc]]

要想掌握 `Promise`，先从概念和使用方法入手，而后刨根它的原理，方可大成。

## 概念

 抛去所有和它有关的东西，`Promise` 这个词，翻译过来是 **承诺** 的意思，那么我们可以猜想，它是不是一个有关逻辑状态的东西呢。

**`Promise` 是一个对象**，它代表了一个异步操作的 **完成** 或者 **失败**，本质上它是一个函数返回的对象，我们可以在他上面绑定回调函数，这样就不需要在一开始把回调函数作为参数传入这个函数了。

意思是说：

1. 首先我们认定了 `Promise`是一个函数
2. 它是一个返回了管理异步操作状态(成功 / 失败)的函数
3. 它默认绑定了回调函数
4. 它的返回值是一个对象

那我们可以尝试着写一个 **伪Promise**

```js
function fn(params) {
  const successCallback = result => {
    return result
  }
  const failedCallback = error => {
    return error
  }
  
  return {params, successCallback, failedCallback};
}
// 1. 可以这样调用
const promise = fn(params);
promise.then(successCallback, failedCallback);
// 2. 也可以这样调用
fn(params).then(successCallback, failedCallback);
```

我们把这称为 *异步函数调用* ，在使用 `Promise` 的时候，会有以下约定：

1. 在本轮事件循环运行完成之前，回调函数是不会被调用的
2. 即使异步操作结束，在这之后通过 `then()` 添加的回调函数也会被执行
3. 通过 `then()` 可以添加多个回调函数，它们按照插入的顺序依次执行

所以：`Promise` 很棒的一点就是 **链式调用**，下面我们通过链式调用简单使用一下。

## 简单使用

我们先模拟一个环境：连续执行多个异步操作，上个操作结束后，才开始下一个，并带上上一个的返回值。

```js
// 可以这样写
const promise1 = fn();
const promise2 = promise.then(successCB, failedCB);

//也可以这样写
const promise2 = fn().then(successCB, failedCB);
```

在上面的例子里， `Promise2` 表示 `fn`() 函数的完成，也表示了传入的` successCB()` 或者 `failedCB()` 的完成，当然这两个函数也返回了一个 Promise 对象，从而形成一个异步操作。

此刻我们就解决了 *回调地域* 的问题：

```js
fn(result => {
  fn1(result, newResult => {
    fn2(newResult, finalResult => {
      //do something...
    }, failedCB)
  }, failedCB)
}, failedCB)
```

上面的回调地域，我们把回调绑定到 Promise 上，形成一个 Promise 链，再看：

```js
fn().then(result => {
	return fn1(result);	
}).then(newResult => {
  return fn2(newResult);
}).then(finalResult => {
  //do something...
}).catch(failedCB)

//上方的catch(failedCB) 就是 then(null, failedCB)的缩写
```

看起来清爽了很多🎉。

那么在这个时候考虑一个问题，如果在一个链式操作中，使用了一个 `catch()`，再次继续回调怎么办？

```js
new Promise((resolve, reject) => {
    console.log('初始化');
    resolve();
})
.then(() => {
    throw new Error('有哪里不对了');
    console.log('执行「这个」');
})
.catch(() => {
    console.log('执行「那个」');
})
.then(() => {
    console.log('执行「这个」，无论前面发生了什么');
});

// 	初始化
// 	执行“那个”
// 	执行“这个”，无论前面发生了什么
```

**注意**：因为抛出了错误 *有哪里不对了*，所以前一个 *执行「这个」* 没有被输出。

## 时序问题

在理想状态下，所有的异步函数其实都已经返回了 Promise 了，但是还是有些特殊的回调比如定时器，如果混用 Promise 和 定时器 可能会造成时序问题，所以，最好的做法是把有问题的函数封装，永远不要直接调用它们：

```js
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

wait(1000).then(()=>{fn()})
```

`then()` 方法的函数会被放到一个微任务队列中，而不是立即执行，这意味着它是在JS事件队列的所有运行时结束了，并且事件队列被清空了之后，才开始执行的。

```js
Promise.resolve().then(() => console.log(2)).then(() => console.log(3));
console.log(1); // 1, 2, 3, 4
```

*后期会补一篇循环机制的文章，专门讲下事件队列*。

## 并行

平常用的比较多的就是 `Promise.all()` 和 `Promise.race()` 了，它们两个是并行运行异步的方法，也就是都执行完之后才可以操作结果，但是坏处就是只要有一个失败，就会中断并抛出异常。

```js
Promise.all([fn1(), fn2()])
	.then(result => {
  // [result1,result2]
}).catch(err => {
  //返回最先被reject失败的状态
})
```

`Promise.race()` 与 `Promise.all() ` 不一样的地方就是，按走完的时间顺序排序结果。

```js
Promise.all([fn1(), fn2()])
	.then(result => {
  // [result2, result1] or [result1, result2]
})
```

**注意：一定要在 `then()` 方法里返回一个 Promise 对象(总是返回或终止 Promise)，这样才是一条完整的可异步执行的链。**



上面简单的把 `Promise` 的概念和简单使用阐述了一下，主要针对的是对 promise 不熟悉的朋友，也算是一个简单的回顾。“知其所以然【Promise篇】“ 会把里面的细节讲一下。



参考资料：

* [使用Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)
* [大白话讲解Promise（一）](https://www.cnblogs.com/lvdabao/p/es6-promise-1.html)
* [这是一篇傻瓜都能看懂的Promises文章！](https://zhuanlan.zhihu.com/p/24684803)
* [什么是Promise](https://wiki.jikexueyuan.com/project/javascript-promise-mini-book/what-is-the-promise.html)