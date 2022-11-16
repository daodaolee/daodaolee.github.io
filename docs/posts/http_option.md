---
title: http的option请求
date: 2019-06-24 18:50:08
categories:
 - 前端
tags:
 - http
---

[[toc]]

先看两张图：

![](https://i.loli.net/2019/06/20/5d0b73254660812409.png)

![](https://i.loli.net/2019/06/20/5d0b732a2829499623.png)



流程是这样：选择支付方式，填入充值金额，跳转到“选择银行卡界面”，但是在跳转的过程中走了2次`get_card`请求。

由于模块是H5纯静态页面，肯定会遇到跨域的问题，之前是用`jsonp`解决的，但是现在需要给后端传一堆`headers` 头部信息，然后，jsonp就不行了，因为他的实质是src标签，然后用callback传的，而且只能传get，所以这次接口的改动，只能让后端配置CORS了，也就是`Allow-Control-Allow-Origin: *` 和`Allow-Control-Allow-Methods:GET,POST` 让后端配置这个就可以了，再保险点，把`*` 变成`访问地址` ，然后就出现了上面的情况，第一次的`Request Method:OPTION` ，而且没有发送请求头，第二次就是 正常的post了。

出现第一次的原因是探测请求，客户端可以在采取具体资源请求之前，决定对该资源采取何种必要措施，或者了解服务器的性能。



> 在ajax中出现options请求，也是一种提前探测的情况，ajax跨域请求时，如果请求的是json，就属于复杂请求，因此需要提前发出一次options请求，用以检查请求是否是可靠安全的，如果options获得的回应是拒绝性质的，比如404\403\500等http状态，就会停止post、put等请求的发出。



如果你查资料(W3C规范)，你会发现在跨域请求中，分为简单请求（get和部分post，post时content-type属于application/x-www-form-urlencoded，multipart/form-data，text/plain中的一种）和复杂请求。而复杂请求发出之前，就会出现一次options请求。





参考资料：

[jquery ajax 请求中多出现一次OPTIONS请求及其解决办法](http://www.tangshuang.net/2271.html)



