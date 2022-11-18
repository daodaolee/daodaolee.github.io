---
title: 【Async/Await】JS异步终极方案
date: 2021-02-01 20:50:05
tags: 
  - promise
---
[[toc]]

之前我们讲了 `Promise` 的内部结构以及用法，这篇来说下另一个老生常谈的问题：`Async/Await` 。
## 用法
在 `Promise` 出现之后，确实解决了很多异步执行方面的坑，可以说它在那个时候是无人能敌的。但是，慢慢的发现，仍然有一些问题浮出了水面，比如 then 方法其实还是一个回调，多个 `then` 连起来执行看起来还是繁琐，又比如报错是在 `catch` 中，能不能让输出和报错放在统一层呢，又比如请求接口，做了一个判断，是直接返回该数据还是要再获取别的数据，这种情况很有可能会陷入一个 `嵌套地域` 中……而 `Async/Await` 就是处理这些问题的较佳方案。

被称为 `Promise的语法糖` 的 `async/await` 的写法是什么样呢？

```js
function fn() {
  return new Promise((rsolve) => {
    setTimeout(() => {
      resolve('123')
    }, 0)
  })
}
fn().then((value) => {
  console.log(value)
})
```

把所有的输出放到了 `then` 方法中，并且支持链式操作，如果有嵌套就一直 `then` 下去。

而用 `async/await` 如何写呢？

```js
function fn() {
  return new Promise((rsolve) => {
    setTimeout(() => {
      resolve('123')
    }, 0)
  })
}
async function result() {
  const value = await fn()
  console.log(value)
}
result()
```

我们可以在方法外部操作获取的值。

从字面的意思来看，`async` 是"异步" 的意思，`await` 是“等待”的意思，所以应该很好理解：`async` 相当于声明了一个进行异步的方法，而 `await` 用于等待一个异步执行完成的结果。

`async` 和 `await` 必须遵循以下规则：

1. `await` 只能在 `async` 内，不然会报语法错误
2. `async` 方法内可以有多个 `await` 表达式
3. `await` 无法捕捉到 promise 对象 `reject` 的错误信息，需要在 `async` 方法后面 `catch` 错误信息。
4. `async` 方法需要主动 `return` 所需参数


## 注意
再补充一点有关概念的解释：

1. 返回值 `async` 其实是一个 `Promise` ，这个 `promise` 要么通过一个由 `async` 函数返回的值被解决，要么会通过一个从 `async` 函数抛出的异常被拒绝。
    ```js
   async function fn() {
      return 1
   }
   // 等价于
   function fn() {
      return Promise.resolve(1)
   }
   ```
2. 进程 `async` 可以包含多个 `await` 表达式，`await` 表达式会暂停整个 `async` 函数的执行进程，只有当其等待的 `promise` 异步结束后才会继续往下走。

    ```js
   async function fn() {
      await console.log(1)
      await console.log(2)
      await console.log(3)
    }
   fn()
   // 1,2,3
   ```

3. 去掉 `await` 如果在一个 `async` 方法内，没有 `await` 表达式，那么这个方法内的逻辑是同步运行的，如果有一个 `await` 表达式，那么 `async` 方法一定会异步执行。

   ```js
   async function fn() {
     await 1
   }
   // 等价于
   function fn() {
     return Promise.resolve(1).then(() => undefined)
   }
   ```


## 发生了什么?
```js
async function test() {
  const fn1 = await new Promise(resolve => resolve(1))
  const fn2 = await new Promise(resolve => resolve(2))
}
test()
```

以上代码其实进行了三个阶段：

1. `fn1` 中，`await` 等待 `promise` 结束，此时把 `test` 的进程暂停，不往下走了。
2. 第一个 `promise` 结束后，`test` 变成了活跃状态，开始继续往下走，将 `1` 作为返回结果给 `fn1` ，此时 `promise` 状态为 `fulfilled`，接下来 `test` 进行到第二个 `await` 区域， `test` 再次被暂停。
3. 第二个 `promise` 结束后，`fn2` 被赋值为 `2` ，之后 `test` 正常同步执行。

从以上可以看出来，`Promise` 是对异步过程进行了封装，有点函数式编程的感觉，而 `async/await` 是继续进程的机制走的，保存上下文，逻辑控制权暂停和继续，恢复上下文，更准确地表达了 `异步` 这个概念。

## 例子
下面我们再来举两个例子，来看下 `async` 在某些应用场景下的好处。

1.获取用户信息，然后接下来操作这些信息，这两个操作需要有先后顺序。
  ```js
  function getUserInfo() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('用户信息拿到了！')
      }, 1000)
    })
  }
  function getOtherInfo(userInfo) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // do something   
        resolve('用户信息操作完毕了！')
      }, 1000)
    })
  }
  async function collect() {
    const info1 = await getUserInfo()
    consoel.log(info1)
    const info2 = await getOtherInfo(info1)
    console.log(info2)
  }
  collect()
  // 1秒后打印 info1
  // 再过一秒打印 info2
  ```

2. 当请求时间不知道多久的情况下，仍然从上到下挨个执行
  ```js
  // 定时器模拟请求
  function time(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`进行了${ms}毫秒`)
      }, ms)
    })
  }
  async function collect() {
    console.log('-----开始-----')
    const t1 = await time(2000)
    console.log(t1)
    const t2 = await Promise.all([time(3000), time(2000), time(1000)])
    console.log(t2)
    const t3 = await Promise.race([time(1000, time(5000), time(2000))])
    console.log(t3)
    console.log('-----结束-----')
  }
  collect()
  // -----开始-----
  // 2秒后：进行了2000毫秒
  // 2秒后：["进行了3000毫秒", "进行了2000毫秒", "进行了1000毫秒"]
  // 2秒后：进行了 2000毫秒
  // -----结束-----
   ```
  
一般情况下，`async/await` 的写法和上面类似，接下来我们来讲一下报错的话，如何捕获异常(毕竟还是要考虑报错的情况的)。

首先，`async` 会返回一个 `Promise` ，而 `Promise` 有 `.catch` 方法去捕获异常，所以我们可以这样：

```js
  // 通过下面这种方法可以捕获错误
  async test(){
    const data = await fn();
  }
  test()
    .catch(e => {
      console.log(e);
    }).catch(e =>{
      //do something  
    })
```
  
而 `await` 也会返回一个 `Promise` ，所以我们可以在 `await` 后面接上 `.catch`：

```js
async test(){
  await fn().catch(e => {
    console.log(e);
  });
}
```

再来，JS自带  `try/catch` 方法来捕获异常，我们可以在代码中这样使用：

```js
async function test() {
  try {
    const v1 = await fn1()
    const v2 = await fn2()
  }
  catch (e) {
    console.log(e)
  }
}
test()
```

然而以上的方法如果成堆的出现，还是会冗余，功能实现了，改起来依旧头疼，这里可以参考 这位大佬 的写法，把所有的报错和输出都放到同一层，很值得学习：

```js
export default function to(promise) {
  return promise.then((data) => {
    return [null, data]
  })
    .catch(err => [err])
}
async function asyncTask() {
  let err, user, savedTask;
  [err, user] = await to(UserModel.findById(1))
  if (!user) 
    throw new CustomerError('No user found');
  [err, savedTask] = await to(TaskModel({ userId: user.id, name: 'Demo Task' }))
  if (err) 
    throw new CustomError('Error occurred while saving task')
  if (user.notificationsEnabled) {
    const [err] = await to(NotificationService.sendNotification(user.id, 'Task Created'))  
    if (err) 
      console.error('Just log the error and continue flow')
  }
}
```

最后补充一个知识点：串行和并行，这个在开发过程中比较实用：

```js
function getA() {
  return new Promise((resolve) => {
    resolve('a')
  })
}
function getB() {
  return new Promise((resolve) => {
    resolve('b')
  })
}
// 写法1
(async () => {
  const a = await getA()
  const b = await getB()
  console.log(a, b)
  // a b
})()
// 写法2
(async () => {
  const tempA = getA()
  const tempB = getB()
  const a = await tempA
  const b = await tempB
  console.log(a, b)
  // a b
})()
```

上面的写法1和写法2的区别是什么？答案：写法1是串行，写法2是并行，那到底是为什么呢？

参照之前的文章 `知其所以然【Promise篇】` 里面提到的，JS里面的主线程结束后，会把 `任务队列` 里的 `微任务` 拿到主线程中执行，而根据  `Promise` 的参数语法说明里：

> executor 是Promise 函数所传入的两个参数 (resolve 和 reject)，Promise 的实现会立即执行 executor，并传入 resolve 和 reject 函数 (Promise 构造器将会在返回新对象之前 executor )。

这样的话表明 `Promise` 会立即执行回调函数，如果按照写法1，那么每个 `await` 都在等待上面的 `await` 执行完毕再执行自己，按照写法2，`Promise` 先全部执行完毕了，然后全部放到了 `微任务` 里，等 `await` 调用，主线程直接执行 `微任务` 的单项就可以了。简单的说就是，可以立即执行的代码，不要放到 `微任务` 中等待慢慢执行，尤其是互相没有关系的代码块。

使用 `Promise.all` 也可以做到并行的效果：

```js
(async () => {
  const result = await Promise.all([getA(), getB()])
})()
```

这个东西我也想了半天，查了半天资料，最后查文档，才查出来 `Promise` 是会立即执行的，所以阅读文档还是很重要的！