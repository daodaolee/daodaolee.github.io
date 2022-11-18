---
title: 资源加载一丈红?罪魁祸首竟然是CSP!
date: 2021-02-19 19:43:58
tags:
 - http
 - csp
---
[[toc]]

## 前言
今天把做好的项目打包放测试环境上之后，发现页面资源全部加载不出来，好久没看见满满的一丈红了！

<img src="https://i.loli.net/2021/02/19/AnLeYjT4z7V2gPJ.png"  />

不慌，有问题不要紧，挨个排查解决就好了，既然报错不是404，说明资源是可以加载的，也就是说不是项目打包路径的错。报错 `net::ERR_SSL_PROTOCOL_ERROR` ，很明显是个 `SSL` 的问题导致资源无法加载，于是问了一下运维发现测试环境没有配置SSL，怪不得会报错！于是欣慰的让运维加一个 `SSL` ，问题不就解决了么？完美~

但是运维回来一句，这个项目不需要https！瞬间感觉不对劲了，不需要https为什么会报SSL的错呢？检查nginx的service配置：

```nginx
server {
    listen   9002;
    server_name  localhost;
		# ... 
    location / {
      	root   E:\web\Project;
      	index  index.html index.htm;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
      	root   html;
    }
}
```

之前的项目都是这样配置的而且也没有什么特殊情况，为什么现在单独它出错了？把root地址换成之前的项目，也能加载出来，nginx重启之后，问题仍然遗留，那很大可能性在代码上了，既然页面可以加载出来index.html，那source一定有index这个文件！此时没有资源加载很正常，可以理解。

<img src="https://i.loli.net/2021/02/19/V1aSNhf5oTQIUxr.png" />

那就看看index里面会不会有什么猫腻？

<img src="https://i.loli.net/2021/02/19/e3MJlmwVtDTpOuN.png"/>

有一个之前没用过的 `meta` 标签，会不会是它引起的呢？把它注释之后打包，what？ 打包后的index里还有它！而且是没有注释的！暴力一点，删掉总不会有了吧，接着打包、部署，果然！页面资源加载成功了！

这个 `Content-Security-Policy` 到底为什么阻止页面资源加载？为什么没有SSL的服务器会报一个和SSL有关的错？

查了半天资料发现事情其实并不简单(正文开始)！

## CSP是什么

我们都知道，浏览器是有同源策略的，每个站点只允许加载来自自身域的数据，**a.cn** 是无法从 **b.cn** 获取数据的，这样网络就不会杂乱无章了，而且它也保证了网站的安全性(如果做数据共享，请学习：跨资源共享CORS)。

然而在实际情况下，同源策略不会百分之百阻挡 XSS 等攻击，理论上讲只要有注入(比如a标签的href，script标签的引入，img的src等，就可能会受到攻击)，而 `Content-Security-Policy(CSP)` 从另一面给浏览器加了层防护，可以极大的减少这种攻击行为的发生。

## 原理和使用

`CSP` 是通过高速浏览器一系列规则，严格规定了页面中哪些范围内的资源可访问，而不在这个范围内的资源统统不能访问。

使用CSP的方法有两种：

1. 在服务器上添加 `Content-Security-Policy` 响应头来指定规则：

   ```java
   Content-Security-Policy: default-src 'self' http://example.com;
                           connect-src 'none';
   Content-Security-Policy: connect-src http://example.com/;
                           script-src http://example.com/
   ```

2. HTML中添加 `<meta>` 标签来指定域规则：

   ```html
   <meta 
      http-equiv="Content-Security-Policy" 
      content="default-src 'self';default-src 'unsafe-inline';"
   >
   ```

以下为CSP的常用规则：

* 获取指令 
  * `child-src`：列出可用于worker 及 frame 形式 嵌入的链接
  * `connect-src`：限制能通过脚本接口加载的url
  * `default-src`：如果其他指令不存在，就会应用该指令的值，提供一个备选项
  * `font-src`：限制字体来源
  * `frame-src`：限制frame和iframe的源地址
  * `img-src`：限制图片的来源
  * `media-src`：限制音视频的来源
  * `object-src`：限制flash及其他插件的来源
  * `maintest-src`：限制声明文件的源地址
  * `prefetch-src`：限制预加载后者预渲染的源地址
  * `style-src`：限制CSS的来源
  * `script-src`：限制JS的源地址
  * `worker-src`：限制worker，shared worker 或 service worker的地址
  * `webtrc-src`：限制WebTRC的地址

* 文档指令
   * `base-uri`：限制了可出现在页面 `<base>` 标签中的url
   * `plugin-types`：通过限制可以加载的资源类型来限制哪些插件可以被嵌入到文档中
   * `sandbox`：为请求的资源启用沙盒
   * `disown-opener`：确保资源在导航的时候能脱离父页面

* 导航指令

  * `form-action`：限制form可以提交的地址

  * `frame-ancestors`：当前页面可以被哪些来源所嵌入(正好和child-src相反)，该指令不能通过 `<meta>` 指定，且只对非HTML文档类型的资源生效

  * `navigation-to`：限制文档可以通过以下任何方式访问url(a, form, window.location, window.open...)


* 其他指令
  * `report-uri`：制定一个接收CSP报告的地址，浏览器会在指令不通过时发送报告，不能通过 `<meta>` 标签来指定
  * `block-all-mixed-content`：当使用https加载页面时，阻止使用http加载任何资源
  * `referer`：指定会离开当前页的跳转链接的 referer header 信息
  * `upgrade-insecure-requests`：客户端页面将重写，会把 http 改为 https，一般用于站点有大量旧地址需要重写的情况



> CSP 的配置是很灵活的。每条指令可指定多个来源，空格分开。而一条 CSP 规则可由多条指令组成，指令间用分号隔开。各指令间没有顺序的要求，因为每条指令都是各司其职。甚至一次响应中， **Content-Security-Policy** 响应头都可以重复设置。

## 结尾
所以，在项目里面配置了如下代码，而服务器没有配置https，就会报错:

```html
<meta http-equiv=Content-Security-Policy content=upgrade-insecure-requests>
```

在前端开发过程中，也要时刻注意这些细节，避免甩锅最后到自己头上！

