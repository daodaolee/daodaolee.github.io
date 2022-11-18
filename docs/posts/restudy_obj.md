---
title: 重学JS【对象的结构，创建和继承关系】
date: 2021-02-22 01:15:25
tags:
 - js
---
[[toc]]

提到对象肯定都不陌生。但是你真的掌握对象么？本篇就来全面性的说下对象的结构，创建和继承关系。

## 理解对象

一般来说，创建一个对象通常是创建Object实例，然后再给它添加属性和方法：

```js
let obj = new Object();
obj.name = "abc";
obj.say = function(){
  console.log(this.name);
}
```

上面的例子中，say方法会显示abc，在最早期的JavaScript开发者就频繁使用这种方式创建新对象，之后，对象字面量变成了主流:

```js
let obj = {
  name: "abc",
  say: function(){
    console.log(this.name)
  }
}
```

### 属性的类型

属性的类型定义规范中说明，类型是用两个中括号把特性的名称括起来的，比如：[[Enumerable]]。

属性分为两种：**数据属性** 和 **访问器属性**

#### 数据属性


   数据属性包含了一个保存数据值的位置，数据属性有四个特性来说明这个位置的值：

   * [[Configurable]]

     表示属性是否可以通过 delete 删除并且重新定义，默认为true

   * [[Enumerable]]

     表示属性是否可以通过for...in循环访问，也就是是否可枚举，默认为true

   * [[Writable]]

     表示属性是否可以被修改，默认为true

   * [[Value]]

     表示属性的值，默认为undefined

举个例子:

```js
let obj = {
  name: "abc"
}
   ```

   上面obj的 [[value]] 就是abc，[[Configurable]]、[[Enumerable]]、[[Writable]]都是true，如果想改变这三个属性，就必须使用 `Object.defineProperty()` 方法，该方法接收三个参数，要改变的对象，属性名称和一个描述符对象：

   ```js
   let obj = {}；
   Object.defineProperty(obj, "name", {
     writable: false,
     value: "abc"
   });
   obj.name; // "abc"
   obj.name = "123";
   obj.name;  // "abc"
   ```

   上面我肯可以看出obj的writable是false，也就是不可以被修改，所以就算赋值了123，它也还是原来的值，如果是严格模式，赋值123就会报错。

   再来看：

   ```js
   Object.defineProperty(obj, "name", {
     configurable: false,
     value: "abc"
   });
   obj.name; // "abc"
   delete obj.name;
   obj.name;  // "abc"
   ```

   配置了 configurable 为 false 之后，name属性就删不掉了。**此外一个属性被定义为不可配置后，就不能再变回可配置了！** 如果再次调用 Object.defineProperty() 来修改任何非 writable 属性就会报错！

   ```js
   Object.defineProperty(obj, "name", {
     configurable: false,
     value: "abc"
   });
   
   //下面的会报错
   Object.defineProperty(obj, "name", {
     configurable: true,
     value: "abc"
   });
   ```

   > 在调用 Object.defineProperty() 时，configurable、enumerable 和 writable 的值如果不指定，则都默认为 false。多数情况下，可能都不需要 Object.defineProperty()提供的这些强大的设置，但要理解 JavaScript 对象，就要理解这些概念。

#### 访问器属性

访问器属性不包含数据值，它包含一个 **getter(获取)** 和 **setter(设置)** 函数，在读取访问器属性时，会调用这两个函数，一个是读取值，一个是设置新值。访问器也有四个特性：

* [[Configurable]]

  和数据属性里的一样，表示是否可以通过 delete 来删除并重新定义，默认为true

* [[Enumerable]]

  和数据属性里的一样，表示属性是否可以通过for...in循环访问，默认为true

* [[Get]]

  读取属性时调用，默认为 undefined

* [[Set]]

  设置属性时调用，默认为 undefined

访问器属性是不可以直接定义的，也得用 `Object.defineProperty()` ：

```js
let obj = {};
Object.defineProperty(obj, name, {
  name: {
    value: "abc"
  },
  get(){
    return this.name
  },
  set(newValue){
  	this.name = "123"
	}
});
obj.name = "xyz";
obj.name; // xyz
```

那知道了对象里的属性可以设置之后，如何知道当前对象里的这些属性是什么值呢？

### 读取属性的特性

可以使用 `Object.getOwnPropertyDescriptor()` 方法来获取指定属性的值，会返回一个对象：

```js
let obj = {};
// defineProperties 可以定义多个属性
Object.defineProperties(obj, {
  name_: {
    value: "abc"
  },
  age: {
    value: 20
  },
  name: {
    get: function(){
      return this.name_
    },
    set: function(newValue){
      this.name_ = newValue
    }
  }
});
//获取
let desc = Object.getOwnPropertyDescriptor(obj, "name_");
// {configurable: false, enumerable: false, value: "abc", writable: false}
let desc = Object.getOwnPropertyDescriptor(obj, "name");
// {configurable: false, enumerable: false, get: f(), set: f(newValue)}
```

在ECMAScript2017新增了一个方法：`Object.getOwnPropertyDescriptors()`，比上面的方法多一个s，可以获取所有属性的描述，上面的例子会返回：

```js
/*{
  name:{
		configurable: false
    enumerable: false
    get: ƒ ()
    set: ƒ (newValue)
  },
  age: {
    configurable: false
    enumerable: false
    value: 20
    writable: false
  },
  name_: {
    configurable: false
    enumerable: false
    value: "abc"
    writable: false
	}
}
*/
```

### 合并对象

在ECMAScript6中，添加了 `Object.assign()` 方法，可以把两个对象合并成一个，它接收一个目标对象和一个或多个源对象作为参数，它的过程如下：

1. 将源对象中可枚举和自有属性复制到目标对象中，可枚举就是 Object.propertyIsEnumerable() 返回是true的，自有属性就是 Object.hasOwnProperty() 返回true的。
2. 只复制以字符串和符号为键的属性
3. 对于每个符合条件的属性，会使用源对象上的 [[Get]] 取得值，使用 [[Set]] 设置值

```js
let obj1 = {a: 1},
  obj2 = {b: 2},
  obj3 = {a: 5},
  dest = {};
let result = Object.assign(dest, obj1, obj2, obj3);
console.log(result); // {a: 5, b: 2}
console.log(dest); // {a: 5, b: 2}
console.log(result === dest) // true
```

**Object.assign 修改了目标对象！而且有多个源对象的情况下并且有相同的键，后面会覆盖前面的！Object.assign 其实就是对每个源对象进行了浅复制！**

### 相等判定

在ECMAScript6新增了 `Object.is()` 方法，判断两个值是否为同一个值，如果满足下列条件就相等：

* 都是 undefined
* 都是 null
* 都是 true 或者 false
* 字符串长度、字符和顺序相同
* 对象同一个引用
* 都是数字且
  * 都是 +0
  * 都是 -0
  * 都是 NaN
  * 或都是非零且非NaN，且为同一个值

它和 === 的区别是：三等运算符将数字 -0 和 +0 视为相等，而将 Number.NaN 与 NaN 视为不相等。

![](https://i.imgur.com/pCyqkLc.png)

### 优化

ECMAScript6为定义和操作对象做了很多优化，以下是常用的三点：

1. 属性值简写

   相同的属性名可以直接使用

   ```js
   let name = "abc";
   let obj = {
     name
   }
   ```

2. 可计算属性

   如果对象里没有定义某个属性，是不可以用中括号操作的，只能先声明再使用

   ```js
   const name = "abc";
   let obj = {};
   obj[name] = "123"
   ```

   有了可计算属性，可以这样写：

   ```js
   const name = "abc";
   let obj = {
     [name]: "123"
   };
   ```

   甚至塞入一个方法：

   ```js
   function getKey(key){
     return `key是：${key}`;
   }
   const name = "abc";
   let obj = {
     [getKey(name)]: "123"
   }
   ```

3. 简写方法名

   不需要写 function，直接连起来写：

   ```js
   let obj = {
     say(){}
   }
   ```

   也可以和可计算属性一起使用：

   ```js
   let key = "name";
   let obj = {
     [key](name){}
   }
   ```

### 对象解构

简单说就是可以把对象里的内容单独拿出来使用，如果没有就是undefined，但是可以赋默认值使用：

```js
let obj = {
  name: "abc",
  age: 20
}
let {name, age, say, sex="male"} = obj;
name // "abc"
age // 20
say // undefined
sex // male
```

也有一些特殊的解构，比如嵌套解构和部分解构。

#### 嵌套结构

```js
let person = { 
 name: 'Matt', 
 age: 27, 
 job: { 
 title: 'Software engineer' 
 } 
}; 
let personCopy = {}; 
({ 
 name: personCopy.name, 
 age: personCopy.age, 
 job: personCopy.job 
} = person);
```

因为一个对象的引用被赋值给 personCopy，所以修改 person.job 对象的属性也会影响 personCopy：

```js
person.job.title = 'Hacker' 
console.log(person); 
// { name: 'Matt', age: 27, job: { title: 'Hacker' } } 
console.log(personCopy); 
// { name: 'Matt', age: 27, job: { title: 'Hacker' } }
```

嵌套结构可以读取多层内部的属性：

```js
let person = { 
 name: 'Matt', 
 age: 27, 
 job: { 
 title: 'Software engineer' 
 } 
}; 
// 声明 title 变量并将 person.job.title 的值赋给它
let { job: { title } } = person; 
console.log(title); // Software engineer
```

#### 部分解构

如果一个解构涉及了多个赋值，开始的赋值成功，后面的赋值出错，那么整个解构会完成一部分：

```js
let person = { 
 name: 'Matt', 
 age: 27 
}; 
let personName, personBar, personAge; 
try { 
 // person.foo 是 undefined，因此会抛出错误
 ({name: personName, foo: { bar: personBar }, age: personAge} = person); 
} catch(e) {} 
console.log(personName, personBar, personAge); 
// Matt, undefined, undefined
```

## 创建对象

从上面的代码可以看出来，对象创建的方式有：**Object构造函数** 和 对象字面量，但是这两个有个很明显的不足：创建具有同样接口的多个对象需要很多重复代码。为了解决这一点，创建对象较好的方式有三种：**工厂模式** 、 **构造函数模式** 和 **原型模式**。

### 工厂模式

工厂模式属于一种设计模式，体现在很多语言里，在JavaScript中，利用工厂模式创建可以这样：

```js
function createObj(name, age, sex){
  let o = new Object();
  o.name = name;
  o.age = age;
  o.sex = sex;
  return 0;
}
let obj1 = createObj("abc", 20, "male");
```

通过一个工厂函数内部构建，传入需要的值就可以创建出来。

### 构造函数模式

除了原生的构造函数之外，我们可以自定义构造函数，比如：

```js
function CreateObj(name, age, sex){
  this.name = name;
  this.age = age;
  this.sex = sex;
}
let obj1 = new CreateObj("abc", 20, "male");
```

从代码可以看出来它和工厂模式的区别：

1. 没有显式地创建对象，也就是没有使用 new Object()
2. 对象的属性和方法赋值给了 this
3. 不用return

obj1实例是通过 new 操作符创建的，它的内部逻辑大致为：

1. 内存中创建一个对象
2. 对象内部的 [[Prototype]] 被赋值为构造函数的 prototype 属性
3. 构造函数内部的 this 指向了新对象
4. 执行构造函数内部代码
5. 如果构造函数返回了非空对象，则返回该对象，否则返回刚创建的新对象

可以通过 constructor 来确定obj1的构造函数就是 CreateObj，也可以用 instanceof，instanceof 用来检测构造函数的prototype是否出现在某个实例对象上：

```js
obj1.constructor == CreateObj; //true
obj1 instanceof Object; // true
obj1 instanceof CreateObj; // true
```

构造函数要注意亮点：

1. 构造函数本身也是函数，如果不用 new 的话，生成的实例就会指向window，因为默认全局对象就是window。

2. 如果一个构造函数声明了两个实例，那么这两个实例是互不影响的，二者是不同的，就算调用构造函数的内部方法，也是同名不相等。如果两个实例要做相同的事情，就没必要声明两次内部方法，因为每调用一次实例就会调用一次内部方法来构建，所以这种情况可以把内部方法转移到构造函数的外面：

   ```js
   function CreateObj(name){
     this.name = name;
     this.say = say;
   }
   function say(){
     console.log(this.name)
   }
   // say方法就可以定义在外面，创建的实例就会共享外面的say方法，而内部的say只是一个指向外部say的指针
   ```

   但是这样又会有一个新的问题，如果有很多个方法呢，都要定义在外部么？原型模式就是解决这个问题的。

### 原型模式

   先简单来说一下关键点：每个函数都会创建一个 prototype 属性，这个属性是一个对象，包含了实例共享的属性和方法，也就是说 prototype 就是调用构造函数创建出来的对象。好处是在原型对象定义的属性和方法可以被实例共享。这样的话，在上面的构造函数模式里，赋值给实例的值，可以直接赋值到原型行上，上面的代码用原型模式是这样的：

   ```js
   let CreateObj = function(){};
   CreateObj.prototype.name = "abc";
   CreateObj.prototype.say = function(){
     console.log(this.name);
   }
   
   let obj1 = new CreateObj();
   let obj2 = new CreateObj();
   obj1.say == obj2.say; // true
   ```

   为什么obj1和obj2 **共享** 原型上的方法和属性呢？

   #### 什么是原型

   一个函数被创建，它就会创建一个指向原型对象的 **prototype** 属性，而所有原型对象都有一个叫做 **constructor** 的属性，constructor会指回构造函数。

   按照这样的规定，可以得出 CreateObj(构造函数).prototype(原型).constructor(构造器) === CreateObj(构造函数)，构造函数的原型对象就是 CreateObj.prototype。

   **重点来了！**

   在自定义构造函数时(CreateObj)，原型对象默认只会获得 constructor 属性，其他所有方法都继承于Object。每次调用构造函数创建一个新的实例，实例的内部 [[prototype]] 就会被赋值为构造函数(CreateObj)的原型对象。实际情况下在对象上暴露的是 `__proto__ `。

   我们再来捋一遍原型干了什么事情：

   ```js
   // 首先有一个构造函数
   let CreateObj = function(){}
   
   // CreateObj被创建之后，它就有了一个原型对象
   CreateObj.prototype; // { constructor: f CreateObj(),  __proto__: Object}
   
   // 构造函数有一个prototype属性引用了原型对象，原型对象有一个constructor属性引用了这个构造函数
   // 也就是说 构造函数 和 构造函数.prototype.constructor 是一样的，二者循环引用
   Create.prototype.constructor === CreateObj; // true
   
   // 此时构造函数的原型链是指向Object的原型对象的，Object的原型链最终指向了null
   CreateObj.prototype.__proto__ === Object.prototype; // true
   CreateObj.prototype.__proto__.constructor === Object; // true
   CreateObj.prototype.__proto__.__proto__ === null; // true
   
   // 这时候我们创建一个实例
   let obj1 = new CreateObj();
   
   // 此时，实例和原型对象关系为
   obj1.__proto__ === CreateObj.prototype;
   
   // 这样。实例、原型对象。构造函数就都对上了号了
   // 也可以说：如果A.__proto__ === B.prototype，那么A就是B的实例
   ```

   如果此刻还不相信实例在原型对象上，可以通过 `isPrototypeOf` 来判断，它的意思测试一个对象是否在另一个对象的原型链上：

   ```js
   CreateObj.prototype.isPrototypeOf(obj1); // true
   ```

   还有一种方式：`Object.getPrototypeOf()` ，它的意思是返回某个对象的原型：

   ```js
   Object.getPrototypeOf(obj1) === CreateObj.prototype; // true
   ```

#### 原型的层级关系

```js
let CreateObj = function(){};
CreateObj.prototype.name = "123";

let obj1 = new CreateObj();
let obj2 = new CreateObj();

obj1.name = "abc";
console.log(obj1.name); // abc
console.log(obj2.name); // 123
```

从上面可以看出来，对象寻找某个属性的时候(例子上就是name)，如果实例上没有，就会去原型对象上查找，如果实例上有，就返回实例上的。

那如果删掉实例上的属性呢？

```js
let CreateObj = function(){};
CreateObj.prototype.name = "123";

let obj1 = new CreateObj();

obj1.name = "abc";
delete obj1.name;
console.log(obj1.name); // 123
```

可以看出来obj1返回的是原型对象上的name了。

那如何判断name是实例上的还是原型对象上的呢？`hasOwnProperty()` 就是干这个的，如果属性在实例上就返回true:

```js
let CreateObj = function(){};
CreateObj.prototype.name = "123";

let obj1 = new CreateObj();
obj1.hasOwnProperty("name"); // false

obj1.name = "abc";
obj1.hasOwnProperty("name"); // true
```

那不管是原型上也好，实例上也好，就只想知道name有没有在obj1上怎么实现呢？`in操作符` !

```js
let CreateObj = function(){};
CreateObj.prototype.name = "123";

let obj1 = new CreateObj();
"name" in obj1 // true

obj1.name = "abc";
"name" in obj1 // true
```

再来看一个可能会用到的例子：

```js
let CreateObj = function(){};
CreateObj.prototype.name = "123";
CreateObj.prototype.age = 20;
CreateObj.prototype.sex = "male";

let keys = Object.keys(CreateObj.prototype);
console.log(keys); // name, age. sex

let obj1 = new CreateObj();
obj1.name = "X";
obj1.age = 50;
let o1Keys = Object.keys(obj1);
console.log(o1Keys); // name, age
```

上面可以看到，获取原型对象的键和获取实例的键是不一样的，各自是各自的。如果想列出所有实例的属性，可以通过`Object.getOwnPropertyNames()` 来获取：

```js
Object.getOwnPropertyNames(CreateObj.prototype); 
// [constructor, name, age, sex]
```

#### 原型的特殊语法

从上面的许多例子可以看到，每次添加一个属性或者方法，都得用 `构造函数.prototype` 的方式重写一次，很麻烦，所以有更好的写法推荐：

```js
let CreateObj = function(){};

CreateObj.prototype = {
  name: "abc",
  age: 50
}
```

这个例子里，原型对象指向了一个新的对象，这样会引发一个问题：constructor指向了Object构造函数，解决它的办法是：**自定义constructor要指向的构造函数**

```js
let CreateObj = function(){};

CreateObj.prototype = {
  constructor: CreateObj,
  name: "abc",
  age: 50
}
```

这样就把指向的问题改过来了，但是细节来了，这样的 constructor 会创建一个 [[Enumerable]] 为true的属性，而原生的 constructor 默认是不可枚举的，所以，得用到上面说过的 `Object.defindProperty ` 来初始化为false：

```js
let CreateObj = function(){};

CreateObj.prototype = {
  name: "abc",
  age: 50
}

Object.defineProperty(CreateObj.prototype, "constructor", {
  enumerable: false,
  value: CreateObj
})
```



## 继承

### 原型链

通过原型模式，我们知道了构造函数、原型和实例的关系：构造函数(CreateObj) 有一个原型(CreateObj.prototype)，原型有一个constructor属性指回构造函数(CreateObj)，实例(obj1)有一个内部指针指向原型：

```js
CreateObj.prototype.constructor === CreateObj;
obj1.__proto__ === CreateObj.prototype;
```

如果原型(CreateObj.prototype)是另一个类型的实例呢？

```js
let OtherObj = function(){};
let other = new OtherObj();

CreateObj.prototype = other
```

这就意味着:

```js
CreateObj.prototype.__proto__ ===  OtherObj.prototype;
CreateObj.prototype.constructor == OtherObj;
```

**如果把 CreateObj.prototype 看做一个实例对象，那么实例的 proto 就等于了另一个构造函数的原型，**

**如果把 CreateObj 单独看做一个构造函数，一开始 Createobj的 prototype 的 constructor 等于 CreateObj 自己，现在它等于 另一个构造函数了。**

**此时，CreateObj 继承于 OtherObj 了，因为我们把构造函数的原型，当成了一个实例来看待。**

**这样就构成了一条链：原型链！**

*如果想改变这条原型链，只需要把 CreateObj.prototype 赋值给其他实例就可以了，就相当于 CreateObj.prototype 这个大实例的 proto 指向了另一个构造函数的原型。*

但是原型链也有缺点，还记得说过一句话么：原型中包含的引用值会在所有实例之间共享！所以属性一般都会在构造函数里，而不在原型上。

还有另一个缺点就是，子类型实例化时不能给父类型的构造函数传参数，也就是说 obj1 不能传参给 OtherObj传递参数。

### 对象伪装

前面说了一大堆，其实 CreateObj 是自己，OtherObj也是自己，它们只是有一个原型链关系绑定而已，如果在 CreateObj 里面，把它的 this 指向 OtherObj，那么……对！CreateObj 就可以使用 OtherObj 里面的东西了！

#### 经典继承

```js
function OtherObj(name){
  this.name = name;
}
function CreateObj(){
	OtherObj.call(this, "abc")
}
let obj1 = new CreateObj();
obj1.name // "abc"
```

官方叫：**盗用构造函数**。

当然解决了引用的问题之后，新的问题来了：OtherObj 里要创建好多方法，而且只能在 OtherObj 中定义方法。

#### 组合继承

```js
function OtherObj(name){
  this.name = name;
}
OtherObj.prototype.sayName = function(){
  console.log(this.name)
}
function CreateObj(name, age){
  //继承了属性
  OtherObj.call(this, name);
  this.age = age;
}

//继承了原型链上的方法
CreateObj.prototype = new OtherObj();

CreateObj.prototype.sayAge = function(){
	console.log(this.age);
}

let obj1 = CreateObj("abc", 20);
obj1.sayName(); // abc
obj1.sayAge(); // 20
```

综合了原型链和经典继承，使用原型链继承原型上的属性和方法，改变this指向继承实例属性，这样每个实例就都有自己的属性并且共享相同的方法了。

#### 寄生组合继承

```js
function OtherObj(name){
  this.name = name;
}
OtherObj.prototype.sayName = function(){
  console.log(this.name);
}
function CreateObj(name, age){
  OtherObj.call(this, name);
  this.age = age;
}
CreateObj.prototype = new OtherObj();
CreateObj.prototype.constructor = CreateObj;
CreateObj.prototype.sayAge = function(){
  console.log(this.age)
}
```

这种方式和组合继承很类似，差别就在于：CreateObj.prototype.constructor = CreateObj。

组合继承的 CreateObj 的原型的构造器指向了 OtherObj，而寄生组合继承指向了 CreateObj 自己，这样相当于 OtherObj 没有给 CreateObj 的原型赋值，而是用了一个 OtherObj 的副本，只改变了原型，其他自己还是自己的。