---
title: Webpack 核心流程
date: 2022-03-23
categories:
 - 前端
tags:
 - Webpack
 - JS
---
[[toc]]
*[原文地址](https://segmentfault.com/a/1190000039956437)*

## 前提简介

- `Entry`：编译入口，webpack 编译的起点
- `Compiler`：编译管理器，webpack 启动后会创建 `compiler` 对象，该对象一直存活知道结束退出
- `Compilation`：单次编辑过程的管理器，比如 `watch = true` 时，运行过程中只有一个 `compiler` 但每次文件变更触发重新编译时，都会创建一个新的 `compilation` 对象
- `Dependence`：依赖对象，webpack 基于该类型记录模块间依赖关系
- `Module`：webpack 内部所有资源都会以“module”对象形式存在，所有关于资源的操作、转译、合并都是以 “module” 为基本单位进行的
- `Chunk`：编译完成准备输出时，webpack 会将 `module` 按特定的规则组织成一个一个的 `chunk`，这些 `chunk` 某种程度上跟最终输出一一对应
- `Loader`：资源内容转换器，其实就是实现从内容 A 转换 B 的转换器
- `Plugin`：webpack构建过程中，会在特定的时机广播对应的事件，插件监听这些事件，在特定时间点介入编译过程

## 一、初始化

### 简要步骤

1. 初始化参数，从配置文件、配置对象、Shell 参数中读取，和默认配置结合出最终参数
2. 创建编译器对象，用 1 的结果创建 `Compliler` 对象
3. 初始化编译环境，包括注入内置插件，注册各种模块工厂，初始化 `RuleSet` 集合，加载插件等
4. 开始编译，执行 `compiler` 对象的 `run` 方法

### 具体步骤

下图是 **1** 到 **3** 的流程图：

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/1648043519010webpack1.png)

至此，`Compiler` 对象被构建出来

## 二、构建

> **构建主要围绕的是 `module`**

### 简要步骤

1. 找到入口

   根据配置的 `entry` 找到入口，调用 `compilition.addEntry`，将入口文件转换为 `dependence`

2. 编译模块（make）

   根据 `entry` 对应的 `dependence` 创建 `module` 对象，调用 `loader` 将模块转换为标准的 `JS` 内容，再调用 `JS` 解释器将内容转换为 `AST` 对象，从中找出模块的依赖模块，再递归本步骤，直到所有入口所依赖的文件都处理完毕

3. 完成模块编译

   上一步递归结束，会得到每个模块被处理后的结果，以及它们的 **依赖关系图**

### 具体步骤

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/16480415301872.png)

该过程：`module => AST => dependences => module`，先转 AST，再从 AST 中找依赖，所以就需要 `loader` 加载后的结果必须是可以被 `acron` 处理的 JS 标准语法。

`compilation` 按这个流程递归处理，逐步解析出每个模块的内容以及 `module` 依赖关系，后续就可以根据这些内容打包输出。

## 三、生成

> **生成主要围绕的是 `chunk`**
### 简要步骤

1. 输出资源（seal）

   根据得到的依赖关系图，组装成一个个包含多个模块的 `chunk`，再把每个 `chunk` 转换成一个单独的文件并添加到输出列表，**这一步是可以修改输出内容的最后机会**
   
1.  写入文件系统（emitAssets）

   确定好输出内容后，根据配置的路径和文件名，写入到文件系统中

### 具体步骤

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/16480426731243.png)



## 总结

整体的代码：

```js
// 取自 webpack/lib/compiler.js 
compile(callback) {
  const params = this.newCompilationParams();
  // 构建之前
  this.hooks.beforeCompile.callAsync(params, err => {
    // 创建 compilation
    const compilation = this.newCompilation(params);
    // 执行 make
    this.hooks.make.callAsync(compilation, err => {
      // 结束 make
      this.hooks.finishMake.callAsync(compilation, err => {
        // ...
        process.nextTick(() => {
          // compilation 结束
          compilation.finish(err => {
            // seal 执行
            compilation.seal(err => {...});
            });
          });
        });
      });
    });
  }
```