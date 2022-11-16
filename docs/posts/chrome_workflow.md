---
title: 深入了解Chrome浏览器的工作流程
date: 2021-12-08 03:46:51
tags:
 - 浏览器
---

## 前言

`Chrome comic`，一本Chrome架构简要概述的漫画，Chrome架构于2008年同Chrome浏览器一起发布。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211207235435.png" style="zoom: 33%;" />

> 尽管Chrome发布了十多年了，【Chrome comic】漫画中介绍的核心原理仍然有助于理解Electron。([原文](https://www.google.com/googlebooks/chrome/small_00.html)，[中文](https://www.sohu.com/a/251641026_609503)）



漫画目录如下：

* 开源浏览器背后的故事
* 稳定性、严格和多任务架构
* 速度：Webkit和V8
* 搜索和用户体验
* 安全性、沙盒模式和没有危险的浏览
* Gears，标准和开放源代码

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211207235815.png" style="zoom:50%;" />

## 一、CPU，GPU内存和多进程架构

### 计算机的核心是 CPU 和 GPU

#### CPU

CPU是计算机的大脑，可以处理许多不同的任务，大多数CPU都是单芯片。一个内核相当于同一个芯片中的另一个CPU。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208000223.png" style="zoom: 50%;" />



#### GPU

GPU最初为图形处理开发，擅长处理简单的任务，同时跨多个CPU。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208000426.png" style="zoom: 50%;" />



通常，应用程序使用操作系统提供的机制在 `CPU` 和 `GPU`上运行。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208000600.png" style="zoom: 50%;" />

### 进程和线程

进程可以被描述为一个应用程序的执行程序，线程是存在于进程内部并执行其进程程序的任何部分的线程。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208000831.png" style="zoom: 50%;" />

程序在启动的时候会创建一个进程，程序也**可能**会创建线程来帮助它工作。操作系统为进程提供了一块“内存块”以供使用，并且所有应用程序状态都保存在该私有内存空间中。当关闭应用程序时，该进程也会消失，操作系统会释放内存。



<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208002453.svg" />



一个进程可以要求操作系统启动另一个进程来运行不同的任务，这时候会为新进程分配内存的不同部分。如果两个进程需要聊天，它们就需要 `IPC`。如果工作进程无响应，它可以重新启动而无需停止运行应用程序不同部分的其他进程。



![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208002657.svg)

### 浏览器架构

对于浏览器，可以使一个进程有许多不同的线程，也可以是许多不同的进程有多个线程通过 `IPC` 通信的。

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208002900.png)

而对于Chrome浏览器，最新架构如下图：

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208003028.png" style="zoom: 67%;" />

| 进程     | 作用                                                         |
| :------- | ------------------------------------------------------------ |
| Browser  | 浏览器进程，控制应用程序的“chrome”部分，包括地址栏、书签、后退和前进按钮。 还处理 Web 浏览器的不可见的特权部分，例如网络请求和文件访问。 |
| Renderer | 渲染器进程，控制显示网站的选项卡内的任何内容。               |
| Plugin   | 插件进程，控制网站使用的任何插件，例如 flash。               |
| GPU      | 图形处理进程，独立于其他进程处理 GPU 任务。它被分成不同的进程，因为 GPU 处理来自多个应用程序的请求并将它们绘制在同一个表面上。 |



下图为不同进程指向浏览器UI的不同部分：

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208003345.png" style="zoom: 67%;" />

当然也还有更多的进程，比如扩展进程和实用程序进程等等。

### Chrome中多进程的优势

假设，打开了三个选项卡，每个选项卡都由一个独立的渲染器进程运行。如果一个选项卡变得无响应，那可以关闭无响应的选项卡并继续操作，同时保持其他选项卡的活动。如果所有选项卡都在一个进程上运行，当一个选项卡变得无响应时，所有选项卡都无响应。

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208003759.svg)



将浏览器的工作分成多个进程的另一个好处是安全性和沙箱。由于操作系统提供了一种方法来限制进程的权限，浏览器可以从某些功能通过沙箱来执行某些进程。例如，Chrome 浏览器限制对处理任意用户输入的进程（如渲染器进程）的任意文件访问。

因为进程有自己的私有内存空间，所以它们通常包含公共基础设施的副本（比如 V8，它是 Chrome 的 JavaScript 引擎）。这意味着更多的内存使用量，因为如果它们是同一进程内的线程，则无法像它们那样共享它们。为了节省内存，Chrome 限制了它可以启动的进程数。该限制取决于设备的内存和 CPU 能力，但当 Chrome 达到限制时，它会开始在一个进程中运行来自同一站点的多个选项卡。

### 节省更多的内存 - Chrome 中的服务化

Chrome 正在经历架构更改，以将浏览器程序的每个部分作为一项服务运行，从而可以轻松地拆分为不同的进程或聚合为一个进程。

当 Chrome 在强大的硬件上运行时，它可能会将每个服务拆分为不同的进程以提供更高的稳定性，但如果它在资源受限的设备上，Chrome 会将服务合并到一个进程中以节省内存占用。在此更改之前，已在 Android 等平台上使用了类似的方法来合并进程以减少内存使用量。

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208004221.svg)

### 站点隔离

站点隔离为每个跨站点 iframe 运行单独的渲染器进程，并在不同站点之间共享内存空间。同源策略是网络的核心安全模型，它确保一个站点在未经同意的情况下无法访问其他站点的数据。对于攻击者来说，绕过同源策略是安全攻击的主要目标，对于浏览器而言，需要使用进程来分隔站点。自 Chrome 67 以来，桌面上默认启用站点隔离，**选项卡中的每个跨站点 iframe 都有一个单独的渲染器进程，** 当然，也从根本上改变了 iframe 相互通信的方式。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208004717.png" style="zoom: 67%;" />

## 二、导航跳转

在浏览器中写了一个URL，然后浏览器从 Internet 获取数据并显示一个页面，对于请求站点和浏览器渲染前都做了什么？

前面我们知道，选项卡之外的所有内容都由浏览器进程处理，也就是 `Browser Process`。浏览器里的进程里有一些线程，比如绘制 `Button` 和 `Input`  的 UI 线程、处理网络堆栈以从 Internet 接收数据的网络线程、控制对文件访问的存储线程等等。在地址栏中输入 URL 时，输入由浏览器进程的 UI 线程处理。

### 开始

1. 第一步：处理输入

   当地址栏中输入内容时，UI 线程首先询问的是“这是搜索查询还是 URL？”。在 Chrome 中，地址栏也是一个搜索输入字段，因此 UI 线程需要解析并决定是将它发送到搜索引擎，还是发送到请求的站点。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208005609.png" style="zoom:67%;" />

2. 第二步：开始寻找

   按下回车键时，UI 线程会发起网络请求以获取站点内容。Loading spinner 显示在选项卡的一角，网络线程通过适当的协议，如 DNS 查找和为请求建立 TLS 连接。

   <img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208010044.png" style="zoom: 67%;" />

   此时，网络线程可能会收到服务器重定向标头，如 HTTP 301。在这种情况下，网络线程会与服务器请求重定向的 UI 线程通信。然后，将发起另一个 URL 请求。

3. 第三步： 读取响应

   一旦响应的开始进入，也就是请求的 Payload，网络线程会在必要时查看流的前几个字节。响应的 Content-Type 标头应该说明它是什么类型的数据，但由于它可能丢失或错误， 因此在这里完成 `MIME 类型校验`。

   <img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208010402.png" style="zoom: 67%;" />

   如果响应是一个 HTML 文件，那么下一步是将数据传递给 GPU 进程，但如果它是一个 zip 文件或其他一些文件，那么它就是一个下载请求，接着他们需要将数据传递给下载管理器。

   <img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208010451.png" style="zoom:67%;" />

   也正是在这个地方进行安全浏览检查，如果域和相应数据跟恶意网站匹配，网络线程就会发出警报并显示警告页面，而 CORS检查 也发生在这个过程，为了确保敏感跨站点数据不扔给渲染器。

4. 第四步： 查找渲染器进程

   一旦完成所有检查并且网络线程确信浏览器应该导航到请求的站点，网络线程就会告诉 UI 线程数据已准备就绪。UI线程然后找到一个渲染器进程来进行网页的渲染。

   <img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208010809.png" style="zoom:67%;" />

   由于网络请求可能需要数百毫秒才能获得响应，因此应用了优化以加快此过程。当 UI 线程在第 2 步向网络线程发送 URL 请求时，它已经知道他们要导航到哪个站点。UI 线程尝试与网络请求并行地主动查找或启动渲染器进程。这样，如果一切按预期进行，当网络线程接收到数据时，渲染器进程已经处于待机状态。如果导航重定向跨站点，则可能不会使用此备用进程，在这种情况下，可能需要不同的进程。

5. 第五步：提交

   现在数据和渲染器进程已经准备就绪，一个 IPC 从浏览器进程发送到渲染器进程以提交导航。它还传递数据流，因此渲染器进程可以继续接收 HTML 数据。一旦浏览器进程听到在渲染器进程中发生提交的确认，导航就完成了，文档渲染阶段开始。

   此时，地址栏已更新，安全指示器和站点设置 UI 反映了新页面的站点信息。选项卡的会话历史将更新，因此后退/前进按钮将逐步浏览刚刚导航到的站点。为了在关闭选项卡或窗口时促进选项卡/会话恢复，会话历史记录存储在磁盘上。

   <img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208010945.png" style="zoom:67%;" />

6. 其他步骤

   提交后，渲染器进程会继续加载资源并渲染页面。渲染器进程“完成”渲染后，它会将 IPC 发送回浏览器进程（这是在 `onload`页面中的所有帧上触发所有事件并完成执行之后）。此时，UI 线程停止选项卡上的 加载小loading。

   在此之后客户端 JavaScript 仍然可以加载额外的资源并呈现新的视图。

   <img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208011145.png" style="zoom:67%;" />

### 导航到其他站点

如果用户再次将不同的 URL 放入地址栏会发生什么？浏览器进程通过相同的步骤导航到不同的站点。但在此之前，它需要检查当前呈现的站点是否有 `beforeunload` 事件。

`beforeunload` 可以创建一个 “离开此站点?” 的事件， 当离开或关闭选项卡时发出警报。选项卡内的所有内容（包括 JavaScript 代码）都由渲染器进程处理，因此当新的导航请求传入时，浏览器进程必须检查当前的渲染器进程。

> 注意：不要添加无条件`beforeunload`处理程序。它会产生更多的延迟，因为需要在导航开始之前执行处理程序。仅在需要时才应添加此事件处理程序，例如，如果需要警告用户他们可能会丢失在页面上输入的数据。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208011421.png" style="zoom:67%;" />

当新导航到达与当前呈现的站点不同的站点时，将调用一个单独的呈现进程来处理新的导航，同时保留当前的呈现进程以处理诸如 `unload`。有关页面生命周期状态，可以看 [这里](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208011737.png)。

下图为从浏览器进程到新渲染器进程的 2 个 IPC，告诉渲染页面并告诉旧渲染器进程卸载：

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208011833.png" style="zoom:67%;" />

### Service Worker

首先，Service Worker 允许开发者更好地控制本地缓存的内容以及何时从网络获取新数据。如果 service worker 设置为从缓存加载页面，则无需从网络请求数据。

注意：**Service Worker 是在渲染器进程中运行的 JavaScript 代码**。

但是当导航请求进来时，浏览器进程又如何知道哪个站点有Service Worker？

注册Service Worker后，Service Worker的作用域将会保留。当导航发生时，网络线程会根据注册的 Service Worker 范围检查域，如果 Service Worker 已为该 URL 注册，则 UI 线程会查找渲染器进程以执行 Service Worker 代码。Service Worker 可能会从缓存中加载数据，从而无需从网络请求数据，或者它可能会从网络请求新资源。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208012223.png" style="zoom: 50%;" />

下图为浏览器进程中的 UI 线程启动渲染器进程来处理服务工作者；渲染器进程中的工作线程然后从网络请求数据：

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208012250.png" style="zoom:67%;" />

### 导航预加载

如果 Service Worker 最终决定从网络请求数据，浏览器进程和渲染器进程之间的这种往返可能会导致延迟。`Navigation Preloads` 是一种通过在 Service Worker 启动的同时加载资源来加速此过程的机制。它用标头标记这些请求，允许服务器决定为这些请求发送不同的内容；例如，只是更新数据而不是完整文档。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208012532.png" style="zoom: 67%;" />

## 三、渲染

导航过后，浏览器会调用渲染器(UI)进程工作。

#### 渲染器进程处理Web

渲染器进程负责选项卡内发生的所有事情。在渲染器进程中，主线程处理发送给用户的大部分代码。如果使用 Web Worker 或 Service Worker，有部分 JavaScript 由工作线程处理。合成器和光栅线程也在渲染器进程内运行，以高效、流畅地渲染页面。

渲染器进程的核心工作是将 HTML、CSS 和 JavaScript 转换为用户可以与之交互的网页。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208012901.png" style="zoom:67%;" />

#### 解析

##### 构建DOM

当渲染过程接收提交消息用于导航和开始接收HTML数据，主线程开始解析HTML，使之成为一个 `DOM`。

DOM 是浏览器对页面的内部表示，也是开发人员可以通过 JavaScript 与之交互的数据结构和 API。将HTML文档解析为DOM是由HTML标准定义的，所以有时候写错标签，也会被自动纠正，具体可以查看 [解析器中的错误处理](https://html.spec.whatwg.org/multipage/parsing.html#an-introduction-to-error-handling-and-strange-cases-in-the-parser)。

##### 子资源加载

对于图像、CSS 和 JavaScript 等外部资源，需要从网络或缓存加载。主线程可以在解析构建DOM的过程中找到它们后一一请求，但为了加快速度，“预加载扫描器(preload scanner)” 是并发运行的。如果HTML 文档中有类似`<img>`或 `<link>`，预加载扫描器会查看 HTML 解析器生成的 `token`，并将请求发送到浏览器进程中的网络线程。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208013600.png" style="zoom:67%;" />

##### JavaScript 可以阻止解析

当 HTML 解析器找到一个`<script>`标签时，它会暂停 HTML 文档的解析，并且必须加载、解析和执行 JavaScript 代码。为什么？因为 JavaScript 可以使用`document.write()`改变整个 DOM 结构的东西来改变文档的结构，[这里有张图表](https://html.spec.whatwg.org/multipage/parsing.html#overview-of-the-parsing-model)。

#### 如何加载资源

如果JavaScript 不使用`document.write()`，可以添加 `async` 或 `defer` 属性到`<script>`标签。然后浏览器异步加载和运行 JavaScript 代码，并且不会阻止解析。浏览器支持的话，当然也可以用 `Javascript Module`。`<link rel="preload">`是一种通知浏览器当前导航肯定需要该资源并且希望尽快下载的方式，[这里是资源优先级](https://web.dev/fast/#prioritize-resources)。

#### 样式解析

主线程会解析 CSS 并确定每个 DOM 节点的计算样式。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208014052.png" style="zoom:67%;" />

每个DOM节点都有一个默认样式，[这是默认样式表](https://source.chromium.org/chromium/chromium/src/+/master:third_party/blink/renderer/core/html/resources/html.css)。

#### 布局

到目前为止，渲染器进程知道文档的结构和每个节点的样式。

布局是一个寻找元素几何形状的过程，主线程遍历 DOM 和计算样式并创建布局树，其中包含 xy 坐标和边界框大小等信息。布局树可能与 DOM 树的结构相似，但它只包含与页面上可见的内容相关的信息。如果 `display: none` 应用，则该元素不是布局树的一部分（但是，具有的 `visibility: hidden` 在布局树中）。类似地，如果应用了具有类似内容的伪类，`p::before{content:"Hi!"}` 即使它不在 DOM 中，它也会包含在布局树中。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208014514.png" style="zoom:67%;" />

CSS代表了整个页面的初始布局，如果想多了解一点，[看下这个演讲吧!](https://www.youtube.com/watch?v=Y5Xa4H2wtVA)

#### 绘制

到目前为止，有了DOM、样式和布局，但是想要开始绘制需要判断绘制的顺序。例如，`z-index `可能会为某些元素设置，在这种情况下，按照 HTML 中编写的元素的顺序绘制将导致不正确的渲染。

<img src="https://developers.google.com/web/updates/images/inside-browser/part3/zindex.png" alt="zindex" style="zoom: 33%;" />

在绘制步骤中，主线程遍历布局树以创建绘制记录。绘制记录的顺序是：先背景，后文字，再矩形。这个和 `<canvas>` 的绘制过程有点像。

<img src="https://developers.google.com/web/updates/images/inside-browser/part3/paint.png" alt="paint" style="zoom: 67%;" />

##### 注意

绘制过程最重要的一点是：绘制的每一步都使用前一操作的结果来创建新数据。如果布局树中的某些内容发生了变化，则需要为文档的受影响部分重新生成绘制顺序。

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208015731.gif)

如果为元素设置动画，则浏览器必须在每一帧之间运行这些操作。我们的大多数显示器每秒刷新屏幕 60 次 (60 fps)；在每一帧在屏幕上移动物体时，动画对人眼来说会显得平滑。但是，如果动画错过了中间的帧，则页面将出现“janky”。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208015817.png" style="zoom:67%;" />

即使渲染操作跟上屏幕刷新，这些计算也在主线程上运行，也就是说当应用程序运行 JavaScript 时，它可能会被阻止。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208015837.png" style="zoom:67%;" />

这时候，可以将 JavaScript 操作分成小块，并使用 `requestAnimationFrame()` 来处理，也可以通过 `WebWorker` 运行JavaScript以避免阻塞主线程。有关JS执行优化，可以[点这里](https://developers.google.com/web/fundamentals/performance/rendering/optimize-javascript-execution)。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208015954.png" style="zoom:67%;" />

### 合成

#### 光栅化

到现在，浏览器知道了文档的结构、每个元素的样式、页面的几何形状和绘制顺序，开进行真正的绘制，将此过程转换为屏幕上的像素称为 `光栅化` 。

Chrome第一次发布时，处理光栅化的方式是：只在视窗口内对部分页面进行光栅化，当用户滚动页面，就移动光栅的架子，并通过更多光栅来填充缺失的部分。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208020556.gif" style="zoom:67%;" />

然而，在现代浏览器运行着一个更复杂的过程，叫合成。

合成，把页面的各个部分分成多个层，单独光栅化它们，并在合成器线程的单独线程中合并成一个页面。此时如果发生滚动，因为图层已经被光栅化，它所要做的就是合成一个新的框架。动画可以通过移动图层并合成新帧以相同的方式实现。查看页面的图层，可以从控制台的 `More tools --> layers` 打开。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208021208.gif" style="zoom:50%;" />

#### 分层

为了找出哪些元素需要在哪些层中，主线程遍历布局树以创建层树（可以在 DevTools 的 Performance 面板中称为“Update Layer Tree”）。如果页面的某些部分应该是单独的层（如滑入式侧菜单）没有获取到，可以通过使用 `will-change` CSS 中的属性来提示浏览器。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208021808.png" style="zoom:67%;" />

和每帧光栅化页面的小部分相比，为每个元素都提供层，并且合成会导致操作很慢。

#### 主线程的光栅和合成

一旦创建了层树并确定了绘制顺序，主线程就会将该信息提交给合成器线程。合成器线程然后光栅化每一层。一个图层可能像页面的整个长度一样大，因此合成器线程将它们分成多个图块并将每个图块发送到光栅线程。光栅线程光栅化每个图块并将它们存储在 GPU 内存中。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208022001.png" style="zoom:67%;" />

合成器线程可以对不同的光栅线程进行优先级排序，以便可以首先对视口内（或附近）的事物进行光栅化。一个图层也有多个不同分辨率的平铺来处理诸如放大操作之类的事情。

对切片进行光栅化后，合成器线程会收集称为**绘制四边形的**切片信息以创建**合成器框架**。

| 名称       | 说明                                                         |
| ---------- | ------------------------------------------------------------ |
| 合成器框架 | 代表页面框架的绘制四边形的集合。                             |
| 绘制四边形 | 包含诸如磁贴在内存中的位置以及在考虑页面合成的情况下在页面中绘制磁贴的位置等信息。 |

然后通过 IPC 将合成器框架提交给浏览器进程。此时，可以从用于浏览器 UI 更改的 UI 线程或用于扩展的其他渲染器进程添加另一个合成器框架。这些合成器帧被发送到 GPU 以将其显示在屏幕上。如果出现滚动事件，合成器线程会创建另一个合成器帧以发送到 GPU。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208022144.png" style="zoom:67%;" />

合成的好处是它是在不涉及主线程的情况下完成的。合成器线程不需要等待样式计算或 JavaScript 执行。这就是为什么 `只合成动画` 被认为是获得流畅性能的最佳选择。如果需要重新计算布局或绘制，则必须涉及主线程。

## 用户输入和合成器

### 浏览器的input事件

从浏览器的角度来看，输入意味着来自用户的任何事件。鼠标滚轮滚动是一个事件，触摸或鼠标悬停也是一个事件。

当用户在屏幕上进行触摸等手势时，浏览器进程首先接收该手势。但是，浏览器进程只知道该手势发生的位置，因为选项卡内的内容由渲染器进程处理。因此浏览器进程将事件类型（如`touchstart`）及其坐标发送到渲染器进程。渲染器进程通过查找事件目标并运行附加的事件侦听器来适当地处理事件。

下图为Input事件通过浏览器进程路由到渲染器进程：

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208022545.png" style="zoom:67%;" />

### 非快速滚动区域

如果没有input事件监听器附加到页面，合成器线程可以创建一个完全独立于主线程的新复合框架，如果某些事件侦听器附加到页面上，合成器线程如何确定事件是否需要处理？

由于运行 JavaScript 是主线程的工作，因此在合成页面时，合成器线程会将页面中附加有事件处理程序的区域标记为“非快速可滚动区域”。通过获得这些信息，合成器线程可以确保在该区域发生事件时将input事件发送到主线程。如果input事件来自该区域之外，则合成器线程继续合成新帧，而无需等待主线程。
<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208022919.png" style="zoom:67%;" />

### 事件委托

开发中常见的事件处理模式是事件委托。由于事件冒泡，可以在最顶层元素附加一个事件处理程序，并根据事件目标委派任务，比如：

```js
document.body.addEventListener('touchstart', event => {
    if (event.target === area) {
        event.preventDefault();
    }
});
```

如果需要为所有元素编写一个事件处理程序的话，这种事件委托模式很有吸引力。但是，如果从浏览器的角度来看这段代码，现在整个页面都被标记为非快速可滚动区域。这意味着即使程序不关心来自页面某些部分的输入，合成器线程也必须与主线程通信并在每次输入事件进入时等待它。因此，**合成器的平滑滚动能力被打败了**。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208023136.png" style="zoom:67%;" />

为了减少这种情况的发生，可以传递属性 `passive: true` ，这样会向浏览器暗示仍然希望在主线程中侦听事件，但合成器也可以继续合成新帧，比如：

```js
document.body.addEventListener('touchstart', event => {
    if (event.target === area) {
        event.preventDefault()
    }
 }, {passive: true});
```

### 检查事件是否可以取消

有个场景，只有水平滚动，没有垂直滚动。

`passive: true` 在指针事件中使用选项意味着页面滚动可以平滑，但垂直滚动可能在想要的时候开始`preventDefault`以限制滚动方向，这时候可以使用`event.cancelable`方法对此进行检查，比如：

```js
document.body.addEventListener('pointermove', event => {
    if (event.cancelable) {
        event.preventDefault(); // block the native scroll
        /*
        *  do what you want the application to do here
        */
    }
}, {passive: true});
```

或者，可以使用 CSS 规则 `touch-action`来完全消除事件处理程序，比如：

```css
#area {
  touch-action: pan-x;
}
```

### 寻找event.target

当合成器线程向主线程发送输入事件时，首先要运行的是命中以找到事件目标。命中使用渲染过程中生成的绘制记录数据来找出发生事件的点坐标下方的内容。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208023549.png" style="zoom:50%;" />

### 最小化事件调度到主线程

前面知道了，典型显示器每秒刷新屏幕 60 次，以及我们需要跟上节奏以获得流畅的动画。而对于输入来说。典型的触摸屏设备每秒传递 60-120 次触摸事件，典型的鼠标每秒传递 100 次事件。输入事件的保真度高于我们的屏幕可以刷新的保真度。

如果像`touchmove `这样的连续事件每秒发送到主线程 120 次，那么与屏幕刷新的速度相比，它可能会触发过多的命中和 JavaScript 执行：

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208023809.png" style="zoom: 50%;" />

为了尽量减少对主线程的过多调用，Chrome 会合并连续事件（例如 `wheel`, `mousewheel`, `mousemove`, `pointermove`, `touchmove`）并延迟调度直到下一个`requestAnimationFrame`，可以发现，时间线一样，但事件进行了合并和延迟。

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208023834.png" style="zoom: 50%;" />

类似的事件，如`keydown`，`keyup`，`mouseup`，`mousedown`，`touchstart`，和`touchend` 被立即执行。

### 使用 `getCoalescedEvents` 得到帧内事件

对于大多数 Web 程序，合并事件应该足以提供良好的用户体验。但是，像构建绘图程序和基于 `touchmove` 坐标放置路径之类的东西 ，绘制平滑线的时候可能会丢失中间坐标。在这种情况下，可以使用 `getCoalescedEvents` 指针事件中的方法来获取有关这些合并事件的信息。

下图左侧是平滑的触摸手势路径，右侧是合并的有限路径：

<img src="https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211208024132.png" style="zoom: 67%;" />

```js
window.addEventListener('pointermove', event => {
    const events = event.getCoalescedEvents();
    for (let event of events) {
        const x = event.pageX;
        const y = event.pageY;
        // draw a line using x and y coordinates.
    }
});
```

## 参考资料

[Inside look at modern web browser](https://developers.google.com/web/updates/2018/09/inside-browser-part1)

