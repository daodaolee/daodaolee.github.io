---
title: Web渲染的权衡
date: 2021-12-13 17:08:08
categories:
 - 前端
tags:
 - 浏览器
 - 性能优化
---
[[toc]]
构建网站的方法有很多，但是每种构建都离不开渲染，那如何从性能的角度来权衡Web上的渲染呢？

## 术语

### 渲染

* **SSR**：服务器渲染，在服务器上将客户端或通用程序渲染为 HTML。 
* **CSR**：客户端渲染， 在浏览器中渲染程序，通常使用 DOM。
* **Rehydration**：同构渲染，复用服务器渲染的 HTML 的 DOM 树和数据后，在客户端再进行渲染。
* **Prerendering**：预渲染，在构建时运行客户端程序以将其初始状态捕获为静态 HTML。

### 表现

* **TTFB**：第一个字节出现的时间，被看作单击链接和第一次内容进入的时间。
* **FP**：First Paint，像素第一次可见。
* **FCP**：First Contentful Paint，请求的内容（比如正文）第一次可见。
* **TTI**：Time To Interactive，页面变为可交互的时间（事件连接等）。

## 服务器渲染

*服务器渲染为服务器上的页面生成完整的 HTML 以响应[导航](https://juejin.cn/post/7039036362653171742#heading-10)。这避免了在客户端上进行数据获取和模板化 的额外开销，因为它是在浏览器获得响应之前处理的。*

服务器渲染会产生比较快的 `首次绘制(FP)` 和 `首次内容绘制(FCP)`。在服务器上运行页面逻辑和渲染可以避免向客户端发送大量 JavaScript，这有助于实现快速的 `交互时间(TTI)`。因为通过服务器渲染，实际上只是将文本和链接发送到用户的浏览器。这种方法可以很好地适用于各种设备和网络条件，并开启了浏览器优化，例如流式文档解析。

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211213145054.png)

服务器渲染的话，用户不太可能在访问站点前等待 CPU-bound（计算密集型）处理JavaScript。即使在三方JS无法避免的情况下，使用服务器渲染来降低自己的当前JS成本，可以有更多的性能预算。

> * CPU-bound：计算密集型，表示在多重程序系统中，大部份时间用来做计算、逻辑判断等CPU动作的程序。
> * 性能预算：一个团队不能允许超过的页面**限制**，[点击查看链接](https://juejin.cn/post/6844903700524171271)

但是这种方法有一个主要缺点：在服务器上生成页面需要的时间，会导致 `首字母时间（TTFB）`变慢。

服务端渲染能不能满足当前的系统取决于构建的前端体验类型。有关服务器渲染和客户端渲染一直存在着长期的争论，但是要注意的是，可以对某些页面使用服务器渲染。

许多现代框架、库和体系结构支持在客户端和服务端起上呈现相同的程序，这些技术可用于服务器渲染，在使用的时候，注意它们在渲染发生在客户端和服务器端的方案的实现。

## 静态渲染

静态渲染发生在构建时，并提供快速的 `首次绘制（FP）`、`首次内容绘制（FCP）` 和 `交互时间（TTI）`，和服务器渲染不同，他还会实现快速的 `首次首字节时间（TTFB）`，因为页面的HTML不必即时生成。一般，静态渲染意味着提前为每个URL生成单独的HTML文件，通过提前生成HTML，静态渲染可以部署到多个CDN，从而利用 [边缘缓存](https://www.easemob.com/news/7325)。

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211213151915.png)

静态渲染的缺点之一是必须为每个可能的URL生成单独的HTML文件。如果无法提前预测这些URL的内容，有可能就无法通过静态渲染实现。这里说一下静态渲染和预渲染之间的区别：静态渲染是交互式的，无需执行大量客户端JS，而预渲染改进了必须启动的 `SPA（单页应用程序）` 的首次绘制或者首次绘制内容以使页面真正具有交互性。*这个可以通过看博客渲染引擎（类似jekyll等）和SPA应用的区别会有所理解。*

如果不确定是要用静态渲染还是预渲染，可以这样测试一下：禁用JavaScript并加载创建的网页。对于静态渲染的页面，大多数功能在没有启用JavaScript的情况下依然可用。而对于预渲染页面，虽然仍然有一些基本功能，比如链接，但是大多数页面是不可用 的。

还可以使用控制台网络板块，降低网络速度，并观察在页面变为可交互之前下载了多少JavaScript。预渲染通常需要更多的JavaScript才可以交互，而且 JavaScript 往往比静态渲染使用的[渐进增强](https://developer.mozilla.org/zh-CN/docs/Glossary/Progressive_Enhancement)方法更复杂。

## 服务器渲染和静态渲染

服务器渲染的动态特性会带来大量的 [计算开销](https://medium.com/airbnb-engineering/operationalizing-node-js-for-server-side-rendering-c5ba718acfc9)。许多服务器渲染方案不会提前刷新，可能会延迟 TTFB 或者将发送到数据加倍。在React中，`renderToString()` 可能很慢，因为它是同步和单线程的。服务器渲染正确的使用，可能离不开组件缓存、内存消耗、[应用记忆技术](https://speakerdeck.com/maxnajim/hastening-react-ssr-with-component-memoization-and-templatization)等其他问题，仅仅因为服务器渲染可以使某些内容更快的显示出来，并不代表所做的工作少。

服务器渲染为每个URL按需生成HTML，但可能会比仅提供静态渲染的内容慢。如果可以的话，服务器渲染 **+** [HTML缓存](https://freecontent.manning.com/caching-in-react/)可以大大减少服务器渲染时间。与静态渲染相比，服务器渲染的优势在于可以提取更多“动态”数据并响应完整的请求。需要个性化的页面是不是和静态渲染的。

## 客户端渲染

*客户端渲染是指用JavaScript直接在浏览器里渲染页面。所有的逻辑、获取数据、模板、路由都在客户端处理。*

对于移动设备，客户端渲染可能很难使用并且一直能快速执行。如果可以做最少的工作，保持最少的JavaScript性能预算并尽可能减少 [往返时延（RTT）](https://blog.csdn.net/qq_38890412/article/details/106663674)， 它就可以有接近纯服务器渲染的性能。可以使用http2，或者 `<link rel=preload>`，这样可以让解析器更快的工作。

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211213163255.png)

客户端渲染的主要缺点是所需的 JavaScript 量往往会随着应用程序的增长而增长，比如添加了新的库、polyfill、三方代码等。它们会争夺页面的处理顺序，并且通常必须在渲染页面内容之前处理。所以在使用依赖大型JavaScript包的CSR构建时，应该考虑代码拆分，并确保延迟加载JavaScript，也就是按需加载：只在需要时提供需要的服务。

## rehydration下的SSR和CSR

hydration直译为水合，可以理解为对曾经渲染过的HTML进行重新渲染的过程，rehydration可以理解为一种使用水合的技术，也被叫做同构渲染。

该方法会同时进行服务器渲染和客户端渲染，以权衡渲染平衡。这样的首次内容绘制会很快，就像服务器渲染一样，然后用一个同构技术（rehydration）在客户端再次渲染。

该技术主要的缺点就是，执行JS之前，什么也做不了，下面是一个例子：

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211213165856.png)

服务器返回页面节点，也就是三个checkbox，也会返回DATA，再加载JS脚本，只有 bundle.js 完成加载和执行之后，页面才变成交互式。

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211213163143.png)

## 流式服务器渲染和渐进式同构

流式服务器渲染允许以块的形式发送HTML，浏览器接收到之后把他们拼接渲染。这样可以有快速的首次绘制和首次内容绘制。

使用渐进式同构的话，服务器渲染的程序的各个部分会随着时间的推移而执行，而不是当前一次就初始化整个程序。这样可以推迟页面低优先级部分的代码以防止阻塞主线程。

## 三体渲染

结合 Service Worker 的话，三题渲染技术也可以使用。可以使用流式服务器渲染进行初始导航，然后让 Service Worker 安装后为导航渲染HTML。这可以使缓存的组件和模板保持最新，并启用 SPA 样式的导航以在同一会话中渲染新视图。如果可以在服务器、客户端页面和 Service Worker 之间共享相同的模板和路由代码，三体渲染是个不错的选择。

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211213165517.png)

## 总结

下图为服务器-客户端渲染到范围，可以参照下图来决定使用哪种渲染方式：

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211213165749.png)

## 参考资料

*  [Rendering on the Web ](https://developers.google.com/web/updates/2019/02/rendering-on-the-web)
* [什么是CPU密集型、IO密集型？](https://zhuanlan.zhihu.com/p/62766037)
* [开启性能预算](https://juejin.cn/post/6844903700524171271)
* [傻子都能看懂的——RTT](https://blog.csdn.net/qq_38890412/article/details/106663674)
* [Vue SSR 流式渲染](https://ssr.vuejs.org/zh/guide/streaming.html#%E6%B5%81%E5%BC%8F%E4%BC%A0%E8%BE%93%E8%AF%B4%E6%98%8E-streaming-caveats)
* [前端同构应用和SSR有什么区别](https://www.zhihu.com/question/379831174)
* [渐进增强](https://developer.mozilla.org/zh-CN/docs/Glossary/Progressive_Enhancement)