---
title: SVG 一览
date: 2023-01-10
tags: 
  - svg
---
[[toc]]

## 引言

**SVG（Scalable Vector Graphics）** 应该是浏览器发展历史以来，曲线绘画支持度最高的一块内容了。HTML 提供了定义段落、表格、标题等内容的元素，SVG 提供了用于定义矩形、复杂曲线图形的元素，之后 SVG 也变得复杂起来，渐变、旋转、动画、滤镜等效果，以及和 JS 交互也都慢慢加上了。

SVG 自 2003 年被 W3C 作为推荐标准以来，最接近的完整版本是 1.1 版，在 2011 年 SVG1.1 的第二个版本成为推荐版本，完整的 SVG1.2 本来是下一个标准版本，但是被 [SVG 2.0](https://www.w3.org/TR/SVG2/Overview.html) 取代了。针对移动端，SVG 在 2003 年推出了 **SVG Tiny** 和 **SVG Basic**，在 2008 年 SVG Tiny1.2 成为 W3C 推荐标准。

## 入门
SVG 是由 `<svg>` 标签包裹的一组元素，也可以说是 **XML** 用来描述图形和绘图程序的语言。简单看一个例子：

<div text-center>
  <SVGDemo1 />
</div>


```html
<svg 
  version="1.1"
  baseProfile="full"
  width="300"
  height="200"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect width="100%" height="100%" fill="rgb(248,113,113)" />
  <circle cx="150" cy="100" r="80" fill="rgb(74,222,128)" />
  <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">
    Dao
  </text>
</svg>
```
以上就是一个简单的 SVG 文件效果，其中：
* [version](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/version) 表示 SVG 遵循的版本规范，只有 `1.0` 和 `1.1` 这两个有效选择。
* [baseProfile](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/baseProfile) 表示一个 SVG 的描述，取值为 `none` | `full` | `basic` | `tiny`。
* [width](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/width) 和 [height](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/height) 表示 SVG 整体容器的宽高。
* [xmlns](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Namespaces_Crash_Course) 表示 SVG 遵循的命名空间（作为 XML 语言需要正确命名它）。

*在 SVG2 后，不再需要 basePofile 和 version。*

> 在 XML 中，标签和属性属于命名空间，这是为了防止来自不同技术的标签和属性发生冲突。例如在 SVG 中存在 a 标签，在 HTML 中也存在 a 标签，那么怎么区分这个 a 标签属于哪一种技术，这就需要使用命名空间了。 加入命名空间以后我们就能知道哪一个是 svg:a，哪一个又是 html:a，这样我们就可以区分出不同的标签和属性。

### 文件属性和类型
SVG 中元素的渲染顺序是 “后来居上”，越后面的越可见。在 Web 上渲染 SVG 一般有两种：直接渲染 SVG 文件 和 嵌入到 HTML 中：
* `application/xhtml` 类型的文件，可以直接把 SVG 嵌入 XML 里。
* 可以通过 `<object />`、`<iframe />`、`<embed>`、`<img />` 、`background-image` 以及行内引入，更多的说明可以查看 [W3C 对于SVG 使用的说明](https://www.w3.org/Graphics/SVG/IG/resources/svgprimer.html#SVG_in_HTML)。 

SVG 文件同样支持压缩，通过 [gzip](https://www.gzip.org/) 的方式压缩之后，会生成 `.svgz` 后缀的压缩文件，当然想要正常访问需要在服务端添加相关 gzip 的配置。对于普通的 SVG 文件，服务端会发送这种请求头：

```js
Content-Type: image/svg+xml
```

而对于压缩的 SVG 文件，则会发送这种：

```js
Content-Type: image/svg+xml
Content-Encoding: gzip
```

### 坐标系统

<img  src="../svgs/coordinate.svg"/>

和 [Canvas](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API) 差不多， SVG 使用的坐标左上角是（0, 0），坐标以像素为单位，x 轴正方向是右，y 轴正方向是下。

在 SVG 文档中的 1 个像素对应输出设备的 1 个像素，由于 SVG 是可缩放的，所以它可以对应 绝对单位 或者 相对单位，在 [CSS 长度单位](https://www.w3.org/Style/Examples/007/units.zh_CN.html) 中对 em、px、pt、cm 等有相关介绍。默认情况下 1 个用户单位等于 1 个屏幕单位，但是在使用的时候要标明，SVG 通过 **容器** 和 **绘制区域** 来实现：

```html
<!-- 容器的大小为 100x100 -->
<svg width="100" height="100" />
```
定义一个 100x100px 的容器，这时候 1 个用户单位等于 1 个屏幕单位。

```html
<!-- 容器的大小为 100x100，绘制区域为 50x50 -->
<svg width="100" height="100" viewBox="0 0 50 50" />
```
把 50x50 的绘制内容放到 100x100 的容器上展示，这个时候就会放大两倍。

在某些文章描述中，会把容器称之为 `视口范围（viewport）`，把绘制区域称之为 `可视区域（viewBox）`，所以也可以这样做个总结：**当 viewBox 小于 viewport 时会放大，当 viewBox 大于 viewport 时会缩小，二者相同时等同于没有 viewBox。**

如果你想深入了解坐标系统，可以看下 Sara Soueidan 的 [Understanding SVG Coordinate Systems and Transformations](https://www.sarasoueidan.com/blog/svg-coordinate-systems/)，她也有一个非常棒的 [在线 Demo](https://www.sarasoueidan.com/demos/interactive-svg-coordinate-system/index.html) 来让你熟悉 SVG 坐标系统。




### 基本形状
SVG 有 6 种基本形状：`矩形（rect）`、`圆形（circle）`、`椭圆形（ellipse）`、`线条（line）`、`折线（polyline）`、`多边形（polygon）`。


### 路径

### 填充

### 渐变

### 图案

### 文字

### 裁剪

### 滤镜

## 工具库

## 相关资料
* [SVG 2](https://www.w3.org/TR/SVG2/Overview.html)
* [SVG Tiny1.2](https://www.w3.org/TR/SVGTiny12/intro.html)
* [SVG in HTML](https://www.w3.org/Graphics/SVG/IG/resources/svgprimer.html#SVG_in_HTML)
* [命名空间 Example](https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course/Example)
* [SVG 命名空间（xmlns、xmlns:xlink、xmlns:svg）](https://juejin.cn/post/7026187468323946527)
* [案例+图解带你一文读懂 SVG](https://juejin.cn/post/7124312346947764260)

* [How to Use SVG Images in CSS and HTML](https://www.freecodecamp.org/news/use-svg-images-in-css-html/)





<script setup>
  import SVGDemo1 from '../code/svg/demo1.vue'
</script>