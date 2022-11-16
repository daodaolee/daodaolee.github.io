---
title: 我做了一款vuepress的音乐可视化播放插件
date: 2021-12-26 17:50:08
categories:
 - 前端
tags:
 - 可视化
---
[[toc]]

体验地址：[博客](https://daodaolee.cn/music/#%E5%96%9C%E6%AC%A2%E7%9A%84)，[github](https://github.com/daodaolee/vuepress-plugin-awesome-musicplayer)，[npm](https://www.npmjs.com/package/vuepress-plugin-awesome-musicplayer)

 ## 前言

博客上的音乐播放器，大多都长一个样，小小的，塞在页面的一个角落里，在别人阅读文章的同时可以听音乐，增加某些体验的满意指数。而我，做了一件不太一样的事情：

博客不就是让人看文章的么？再播放音乐甚至有可能会降低阅读的质量，那听歌就好好听歌不好么？**既然要体验，那就沉浸体验到爽不好么？**

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211226165507.png)

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211226165508.png)

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211226165506.png)

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211226165509.png)

某天，偶然打开了豆瓣FM网页版，很符合豆瓣的感觉，干净简洁，当然网上类似的音乐播放有很多，这里为我后面做的事情埋下了伏笔。

我博客是用 [vuepress]() 搭建的，主题是 [vuepress-reco](https://vuepress-theme-reco.recoluan.com/views/1.x/)，最开始想找一个播放音乐的插件，于是去找了 [awesome-vuepress](https://github.com/vuepress/awesome-vuepress)，搜到唯一和音乐相关的插件，只有一个叫：[vuepress-plugin-music-bar](https://github.com/PentaTea/B-Tree.studio/tree/master/docs/.vuepress/plugin/vuepress-plugin-music-bar#vuepress-plugin-music-bar) 的插件.....还是个bar....有点失落。于是，没人做？那...我做个试试？最终的效果图就是上面看到的四张图了：亮/暗系歌词，亮暗系可视化解码。在看完 `vuepress` 官网的插件api，就开始搞了！

## 开搞

不管怎么画页面，初衷是沉浸式体验，找了很多播放器的大体结构，还是觉得网易云的播放界面算比较舒服的，自己也有尝试画过脑海里的播放界面，但是最终还是选择用网易云的效果（拿来吧你）：左侧黑胶唱片滚动，右侧歌词滚动， 目前不需要上一曲下一曲，就有播放和分享按钮，也就是长这个样子：

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211223183444.png)

一天半时间，匆匆忙忙做完之后，`npm link` 调试成功就发了一版npm包。好用？不好说。能不能用？能！

## 优化

做到这里之后，沉浸式有那么点感觉了，体验？照搬过来就是好的体验么？不，还是要加点东西，比如**可视化**。

这里特别感谢网易云大前端团队的一篇文章：[Web Audio在音频可视化中的应用](https://juejin.cn/post/6844903953130323976)，基本上照着看下来，里面的文献也看一下，就可以做出来上面的效果。说实话，文献是真头大....波长，正余弦，频域时域，奈奎斯特定理，还有什么快速傅里叶变换，头发在偷偷的掉...顺便附上一张某个文献的截图：

![](https://cdn.jsdelivr.net/gh/daodaolee/photobed@main/img/20211226171755.jpg)

不过不看这些也可以做出来！

基本上的思路就是：

1. 创建 `AudioContext`，关联音频输入，进行解码、控制音频播放和暂停
2. 创建 `analyser` ，获取音频的频率数据（FrequencyData）和时域数据（TimeDomainData）
3. 设置快速傅里叶变换值，信号样本的窗口大小，区间为32-32768，默认2048
4. 创建音频源，音频源关联到分析器，分析器关联到输出设备（耳机、扬声器等）
5. 获取频率数组，转格式，然后用 `requestAnimationFrame` 通过 `canvas` 画出来

这些东西上面的文章里讲的很详细，我这种门外汉就不多说啥了。

## 遇到的问题

### npm link

之前使用 `npm link` 的时候，依赖包没有三方/四方的依赖，所以没注意到，如果开发的npm包带有别的依赖，那么调试的时候要在主项目里的 `package.json` 先加上这些包，就不会报错说 `resolve` 失败什么的了，调试结束记得 `npm unlink` 断开。

### 接口

本来想用的是 [网易云音乐 NodeJS 版 API](https://binaryify.github.io/NeteaseCloudMusicApi/#/)，但是有些东西不好找，比如我需要歌曲id，封面和歌词，但是文档里没有歌曲id反查专辑id的（封面在专辑id里），只有一个歌曲详情的，但是这个接口，还需要认证跳转....对于使用者来说，我没必要让使用者多这么一步操作，而且很容易出错。于是就换了一个api：[保罗API](https://api.paugram.com/help/netease)，这个API可以解析的网易云歌曲不是那么的多，不过一般的够了，唯一的缺点就是，多频次刷新会一直 `pending`，应该是后端设置了ip频次。

既然都有问题，不使用接口行么？尝试找一种 mp3 文件解析出来歌词和封面呢？找到一个 [jsmediatags](https://github.com/aadsm/jsmediatags) 的仓库，可以解析ID3v2，MP4，FLAC等字段，但是.....这不就是给用户添加麻烦么？需要找专辑，歌词，歌曲，艺人信息全部合一的音源文件....如果我是用户，我不会用它。

翻来覆去，最终还是决定，歌曲用户传进来，然后再传一个歌曲id，封面和歌词走接口，歌曲就是传进来的音源链接，使用方法如下：

```vue
<MusicPlayer musicId="xxx" musicSrc="xxx.mp3" style="margin:0 auto">
```

音源我个人建议要么放vuepress的静态资源，要么就搞成类似图床一样的音源仓库，这样也好维护。

后期想办法优化吧。

### 主题色

亮系和暗系是适配 [vuepress-reco](https://vuepress-theme-reco.recoluan.com/views/1.x/) 的主题切换做的适配。

## 结尾

灵感来自 [豆瓣FM](https://fm.douban.com/?from_=shire_top_nav)，结构参考了昊神的 [音乐播放器](https://github.com/sl1673495/vue-netease-music)，可视化播放参考了 [Web Audio在音频可视化中的应用](https://juejin.cn/post/6844903953130323976)，接口感谢 [保罗API](https://api.paugram.com/help/netease)，这么一说我好像也没做什么事.....

该插件已发npm包，[awesome-vuepress](https://github.com/vuepress/awesome-vuepress) 仓库也已收录，可能多少还会有点体验上的小问题，会慢慢修复的。大家也可以提建议，能听进去算我输！

项目写的匆匆忙忙，希望可以做一点更有深度的东西吧——致自己。