---
title: form表单提交的submit和ajax区别
date: 2019-01-23 21:05:22
categories:
 - 前端
tags:
 - form
 - ajax
---
[[toc]]

## 页面

* submit：更新数据完成后，需要**转到一个空白的页面**再对原页面进行提交后的处理，即重绘。
* ajax：异步进行，直接返回原页面进行提交后的处理，比submit少增加一个页面，即局部刷新。

## 安全

* ajax：出于安全性的考虑，不能对文件进行操作，所以不可以通过ajax来实现文件上传
* submit：通过隐藏form的submit可以实现文件上传

## form默认提交

如果想要submit后**不刷新页面**，在该方法的最后加上 `return false` ，就可以了。

*`return false` 的含义不是阻止事件继续向顶层元素传播，而是阻止浏览器对事件的默认处理方式。在js中，它的作用一般是用来取消默认动作的。*

*`return false` 等效于 `window.event.returnValue = false`* 。



> 因为原页面用 form 提交到另一个域名之后，原页面的脚本无法获取新页面中的内容。所以浏览器认为这是安全的。而 AJAX 是可以读取响应内容的，因此浏览器不能允许你这样做。 如果你细心的话你会发现，其实请求已经发送出去了，你只是拿不到响应而已。 所以浏览器这个策略的本质是，一个域名的 JS ，在未经允许的情况下，不得读取另一个域名的内容。但浏览器并不阻止你向另一个域名发送请求。 ——来自知乎



有关同源策略和跨域，可以参考 [跨域的那些事儿](https://mp.weixin.qq.com/s?__biz=MzU0OTExNzYwNg==&mid=2247483685&idx=1&sn=543e9736146405e9e5b37ec5a1c4b448)









参考资料：

[Ajax提交与传统Form表单提交的区别说明](https://www.cnblogs.com/zhujiabin/p/4901167.html)