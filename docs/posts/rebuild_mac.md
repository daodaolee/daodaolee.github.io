---
title: 重装Mac历程
date: 2021-01-22 16:08:13
tags:
   - mac
---

自从升级了 `Big Sur` 之后，本以为 Mac变为 iPad 会更轻便更舒服，然而，平常工作状态下，cpu直飙60%左右，转速也基本在2000，用Node打个包，转速能到5000，真的简直了。常用软件虽然也慢慢的都适配了 Big Sur，但是总感觉有点不舒服（iPreview直接向下不兼容了……淦，不知道其他有没有）。于是乎在工作稳定和体验新系统的权衡之下，还是妥妥的降级到了 `mojave`。还是熟悉的配方，还是熟悉的味道，还是熟悉的百分之十以下的cpu，还是熟悉的一千多转速，哪里都很香。

因为只熟悉 `windows` 的系统，`Mac` 的话，自己还没有搞过系统，以前有过一次还是从淘宝上花钱让别人远程装了的……网上找了一堆资料，最终总结出比较踏实的重装流程，然后就开始了：

1. 下载系统⬇

   到  `App Store ` 下载相应的系统，如果在 `App Store` 里面找不到，那就去官网下载（[Big Sur系统链接](https://apps.apple.com/cn/app/macos-big-sur/id1526878132?ls=1&mt=12)，[Catalina系统链接](https://apps.apple.com/cn/app/macos-catalina/id1466841314?ls=1&mt=12)，[Mojave系统链接](https://apps.apple.com/cn/app/macos-mojave/id1398502828?ls=1&mt=12)，[High Sierra系统链接](https://apps.apple.com/cn/app/macos-high-sierra/id1246284741?ls=1&mt=12)），因为有可能商店里只有最新的系统。

   下载好之后可以在 `Launchpad`界面看到一个安装程序。如果是要升级系统，直接点击就可以了，如果要降级，别点，留着。

2. 做系统盘💿

   接下来就是格式化U盘，去磁盘工具里，抹掉U盘，名称先改成 `MyVolume` ，格式为 `Mac OS扩展 (日志式)`。抹完之后就开始制作系统盘了。

   根据想做的系统盘，在终端里输入以下命令（注意命令里的 `MyVolume`就是上面系统盘的名称）：

   ```bash
   # Catalina (10.15)
   sudo /Applications/Install\ macOS\ Catalina.app/Contents/Resources/createinstallmedia --volume /Volumes/MyVolume
   
   # Mojave (10.14)
   sudo /Applications/Install\ macOS\ Mojave.app/Contents/Resources/createinstallmedia --volume /Volumes/MyVolume
   
   # High Sierra (10.13)
   sudo /Applications/Install\ macOS\ High\ Sierra.app/Contents/Resources/createinstallmedia --volume /Volumes/MyVolume
   ```

   然后会输入密码，输入之后回车，接着输入 `y` ，再回车就可以看到安装的进度条了，大概3~5分钟。

   提示`  Done` 之后，就制作完成了。

3. 安装✌

   电脑关机，一直按住 `⌥alt`键( 也就是option )，然后开机，开机也要一直按住 `⌥alt` ，界面会出来一个磁盘和一个安装系统的图标。进去右边，选择磁盘工具，左侧选择“Macintosh HD”( 注意看清楚是“内置”栏下面的，不要选“磁盘映像”栏下面的 )，格式默认选择 `APFS` ，没有的话就选择 `Mac OS 扩展( 日志式 )`。抹完之后，点击关闭，回到之前的界面，选择 `安装macOS`。

   本以为到这里就可以结束了，然而我的电脑报错了！

   ![](https://i.loli.net/2021/01/25/kXiYCrSh6IRs4qj.jpg)

   本来有点惊讶，还以为哪里出错了，看完这个提示之后感觉应该不是问题，就按着上面的接着操作了，重新启动后，菜单栏有个安全性实用工具，把 `外部启动` 修改为 `允许从外部介质启动` 就可以了，有点像BIOS更改启动项的味道。接下来一切顺利，重装之后是真干净，什么都没有，Xcode，Java全部干掉了，然而还是硬着头皮装回来一部分。

   整个过程还是比较顺利的，有想降级的朋友可以试着降级，不必担心什么，只要东西备份好就可以了，我有内测阿里云盘的权限之后，把东西都放上去了。速度还可以，不太舒服的地方就是下载的时候不能下载文件夹，只能下载文件，有点头疼。

   over~👨‍💻

参考资料:

* [macOS 重装系统 Mojave Catalina Big Sur 升级 降级mac OS](https://zhuanlan.zhihu.com/p/39103887)
* [macOS 系统如何重装？](https://www.zhihu.com/question/21454213)
* [如何重新安装 macOS](https://support.apple.com/zh-cn/HT204904)
* [关于“启动安全性实用工具”](https://support.apple.com/zh-cn/HT208198)
* [重装系统安装关键性更新失败](https://discussionschinese.apple.com/thread/250455252)

