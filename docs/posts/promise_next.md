---
title: Promise【知其所以然】
date: 2021-01-30 22:29:24
tags:
 - promise
---
[[toc]]
上一篇讲了 `Promise ` 的概念和简单用法之后，这篇来说下 Promise 内部结构和工作方式，看看它里面都藏了什么东西。

## 结构

上篇说道， `Promise`是一个函数返回的对象(用官话讲就是：一个在将来某个时刻产生一个单一结果的对象，代表了一个值，但是这个值不确定什么时候会被返回)，可以用来进行异步操作，可以拿到操作成功或者失败的结果。异步方法并不会返回最终的值，而是返回一个 Promise，这样才可以链式调用。

一个 `Promise` 有三种状态：

1. 待定(pending)：初始状态，也就是没有成功也没有失败，属于正在进行中
2. 成功(fulfilled)：操作成功完成
3. 拒绝(rejected)：操作失败

待定状态下，要么通过一个值返回成功，要么报错被拒绝。当一个 Promise 在被绑定的时候就已经成功或者拒绝了，那么它就会被后面的逻辑调用，所以在完成异步操作和绑定处理方法之间不会存在竞争关系。

```js
//这种就是默认绑定了成功的状态
Promise.resolve().then()
```

如果状态是操作成功或者失败，那么 Promise 就处于 已敲定状态(settled)，可以理解为结束的状态。

```js
const promise = new Promise((resolve,reject) => {
    resolve(100);
});
// 这时，"promise" 已经被敲定了。
const x = promiseA.then(val => console.log(val,val+1) );
const y = promiseA.then(val => console.log(val,val+2) );
console.log(x, y);
// x: 777 778
// y: 777 779
```

## 执行顺序

在链式调用中，只有当第一个 Promise 执行完毕，从事件队列中移除，才会进行下一个。也就是说 Promise 里面的 return ，执行的是 Promise 被移除(弹出)，当前的返回值替换被弹出的 Promise 原来的位置，接着进行后面的异步操作。

## 方法

1. `Promise.resolve(value)`

   该方法返回一个value，如果值是 then，返回的 Promise 对象的最终状态由 then 方法决定，如果没有value，则返回 Promise 对象的状态为 `fulfilled` ，并且将该状态传到对应的 then 方法。

   ```js
   const p1 = Promise.resolve(123);
   
   p1.then((value) => {
     console.log(value);
   });
   
   // 123
   ```

2. `Promise.reject(reason)`

   该方法返回一个状态为失败的 Promise 对象，并将失败信息传递下去。

   ```js
   const resolve = result => console.log("resolved");
   const reject = result => console.log(result);
   
   Promise.reject(new Error('fail'))
     .then(resolve, reject)
   
   //Error: fail
   ```

3. `Promise.all(iterable)`

   该方法返回一个新的 Promise 对象，当 iterable 里的所有 Promise 都成功之后，才会触发成功。一旦有任何一个失败，就会立即出发该 Promise 对象失败。

   成功：返回的值的顺序和调用的时候的排序一致。

   失败：返回第一个触发失败的错误信息。

   ```js
   const p1 = Promise.resolve(3);
   const p2 = "123";
   const p3 = new Promise((resolve, reject) => {
     setTimeout(resolve("foo"), 1000);
   });
   promise.all([p1, p2, p3]).then(res =>{
     console.log(res)
   })
     
   // [3, "123", "foo"]
   ```

   * 如果传入的参数是空数组，就直接返回一个 已完成 状态的 Promise。

   * 如果传入的的参数不包含任何 promise，就直接返回一个 已完成 状态的 Promise。

   * 其他情况就会返回 pending 状态的 promise。这个返回的 `promise` 之后会在所有的 promise 都完成或者有一个失败时，异步地变为完成或者失败。

4. `Promise.allSettled(iterable)`

   等所有 Promise 状态都变成 `已敲定(settled)`，也就是每个 Promise 都变成成功状态或者已拒绝之后，返回一个 Promise，里面包含了每个 Promise的结果。

   ```js
   const p1 = Promise.resolve(3);
   const p2 = new Promise((resolve, reject) => setTimeout(reject("foo"), 2000);
   
   Promise.allSettled([p1, p2]).
     then(results => console.log(result));
   
   /* [{
       status: "fulfilled", value: 3
     },{
     	status: "rejected", reason: "foo"
     }]
   */
   ```

    传入的参数得是一个数组，每个参数都是 `Promise`，每个结果都有一个 `status` 字符串，代表状态。

5. `Promise.race(iterable)`

   当 iterable 参数里任意一个子 promise 成功或者失败，就结束。接着就会调用父promise后面绑定的相应逻辑，就会接着往下运行(只要一个有结果就会接着网后走)。

   ```js
   const p1 = new Promise((resolve, reject) => {
     setTimeout(resolve("1", 5000))
   });
   const p2 = new Promise((resolve, reject) => {
     setTimeout(resolve("2", 1000))
   });
   
   Promise.race([p1, p2]).then(value => {
     console.log(value);
   })
   
   // 2
   ```



## 原型

通过 `Promise.prototype` ，可以看到它的原型链上有个三个方法：

1. `Promise.prototype.then(onFulfilled, onRejected)`

   给当前的 Promise 添加 解决 和 拒绝 回调，并返回一个 Promise，所以可以进行链式调用。

2. `Promise.prototype.catch(onRejected)`

   给当前的 Promise 设置为 拒绝状态 ，并返回一个 Promise。

   该方法其实就是 `.then(null, rejection)` ，或者 `.then(undefined, rejection)`的别名。如果有多个 catch，那么当前 catch 捕获的是上一个报错。

3. `Promise.prototype.finally(onFinally)`

   给当前的 Promise 添加一个回调的事件处理，在 Promise 解析完毕后，返回一个 新的Promise对象。无论状态是成功或者失败，该回调都会在当前promise运行结束后调用，



## 实现

知道了 `Promise` 的内部结构之后，我们来简单的实现一个 Promise（实现的细节要与规范符合）。

`myPromis ` 实现思路：

1. Promise 是 new 出来的，而且需要一个 executor 执行器
2. executor 带入 resolve 和 reject
3. 状态只能从 pending 到 fulfilled 或者 rejected
4. 状态一旦确认不可改变

```js
function myPromise(executor){
  let _this = this;
  _this.status = "pending"; //状态
  _this.onFulfilled = []; //成功回调
  _this.onRejected = []; //失败回调
  
	//定义resolve  
  function resolve(value){
    if(_this.status === "pending"){
      _this.status = "fulfilled";
      _this.value = value;
      _this.onFulfilled.forEach(fn => fn());
    }
  }
  
  //定义reject
  function reject(reason){
    if(_this.status === "pending"){
      _this.status === "rejected";
      _this.reason = reason;
      _this.onRejected.forEach(fn => fn());
    }
  }
  
	//调用  
  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e)
  }
}
```

至此呢，通过一个 `myPromise` 就初始化好了，里面包括了状态，值和两个回调。接下来我们去构造 `then` 方法。

1. then 方法有两个参数，分别是 myPromise 的两个回调(onFulfilled 和 onRejected)
2. then 方法是在 myPromise 状态结束之后调用的：

    1. 成功：执行 onFulfilled，把值传进去
    2. 失败：执行onRejected，把错误原因传进去
    3. 待定：等状态确定后再执行成功或者失败，所以要先把成功和失败的回调存起来
3. then 方法可以链式调用，每次调用都返回一个 promise
4. then的结果
    1. 如果是一个结果，就传递给下一个 then 的成功回调(onFulfilled)
    2. 如果是一个异常，就传递给下一个 then 的失败回调(onRejected)
    3. 如果返回的是一个 promise，就得等待这个 promise，执行完之后，成功就走下一个 then 的成功，否则就走下一个 then 的失败

```js
myPromise.prototype.then = function(onFulfilled, onRejected){
  onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
  onRejected = typeof onRejected === "function" ? onRejected : reason => { throw reason};
  
 let _this = this;
 let promiseThen = new Promise((resolve, reject) => {
   // 返回的状态是成功，一个结果
   let fulfilledFn = 
     setTimeout(()=>{
       try {
         let fn = onFulfilled(_this.value);
         resolvePromise(promiseThen, fn, resolve, reject);
       } catch (e) {
         reject(e);
       }
     },0);
   // 返回的状态是失败，一个异常
   let rejectedFn = 
     setTimeout(() => {
       try {
         let fn = onRejected(_this.reason);
         resolvePromise(promiseThen, fn, resolve, reject);
       } catch (e) {
         reject(e);
       }
     });
   
   switch(_this.status){
     case "fulfilled":
       {
         fulfilledFn();
       }
      break;
     case "rejected":
       {
         rejectedFn();
       }
       break;
     case "pending":
       {
         _this.onFulfilled.push(fulfilledFn);
         _this.onRejected.push(rejectedFn);
       }
    }
  });
}
function resolvePromise(promiseThen, fn, resolve, reject){
  let _this = this;
  if(promiseThen === fn){
    reject(new TypeError('Chaining cycle'));
  }
  if(fn && typeof fn === "object" || typeof fn === "function"){
    let used; //PromiseA+2.3.3.3.3 只能调用一次
    try {
      let then = fn.then;
      if(typeof then === "function"){
        then.call(fn, y => {
          if(used) return;
          used = true;
          resolvePromise(promiseThen, y, resolve, reject);
        }, r => {
          if(used) return;
          used = true;
          reject(r);
        })
      } else {
        if(used) return;
        used = true;
        resolve(fn);
      }
    } catch (e) {
      if(used) return;
      used = true;
      reject(e);
    }
  } else {
    resolve(fn)
  }
}
```

有关其他的方法实现，可以查看[Promise的源码实现（完美符合Promise/A+规范）](https://github.com/YvetteLau/Blog/issues/2)。

至此 `Promise ` 的用法就结束了，实际项目运用中会配合**事件循环机制**一起使用，后文再叙。



参考资料：

* [Promises/A+](https://promisesaplus.com/)
* [Promise的源码实现（完美符合Promise/A+规范）](https://github.com/YvetteLau/Blog/issues/2)