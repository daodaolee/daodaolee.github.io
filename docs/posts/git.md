---
title: Git从入门到规范
date: 2021-10-24 18:50:08
tags:
 - git
---
[[toc]]
# 背景

Linus Torvalds，linux作者

linux在创造初期，世界各地的志愿者把源文件通过 `diff` 的方式发给 Linus，然后Linus手动合并代码！

人工管理代码容易导致2个问题：**容易出错** 和 **效率低下**，于是Linus 选择了一个叫 `BitKeeper` 的版本控制系统，而 BitKeeper 的东家 BitMover 公司出于人道主义精神，授权 Linux 社区免费使用这个版本控制系统。最后，出于某种原因，BitMover 公司收回了 Linux 社区的免费使用权，于是 Linus 花了两周时间自己用 C 语言写了一个分布式版本控制系统，从此GIt诞生了。

*市面上还存在的其他版本控制产品有：CVS，VSS， TFS，Visual Studio Online，Perforce、Rational ClearCase、RCS（GNU Revision Control System）、Serena Dimention、SVK、BitKeeper、Monotone、Bazaar、Mercurial、SourceGear Vault...*

# Git和SVN的区别

## Git是分布式的，SVN是集中式的
因为 Git 是分布式的，所以 Git 支持离线工作，在本地可以进行很多操作，而 SVN 必须联网才能正常工作。

## Git复杂概念多，SVN简单易上手

Git 的命令实在太多了，日常工作需要掌握`add`,`commit`,`status`,`fetch`,`push`,`rebase`等，若要熟练掌握，还必须掌握`rebase`和`merge`的区别，`fetch`和`pull`的区别等，除此之外，还有`cherry-pick`，`stash`等功能。

SVN在易用性这方面 会好得多，简单易上手，对新手很友好，比如：`add`,`commit`,`status`,`delete`,`checkout`,`update`等

## Git分支廉价，SVN分支昂贵

Git 分支是指针指向 **某次提交**，而 SVN 分支是 **拷贝的目录**。这个特性使 Git 的分支切换非常迅速，且创建成本非常低。

而且 Git 有本地分支，SVN 无本地分支。在实际开发过程中，经常会遇到有些代码没写完，但是需紧急处理其他问题，若我们使用 Git，便可以创建本地分支存储没写完的代码，待问题处理完后，再回到本地分支继续完成代码。



# Git工作区域和流程

## 工作区域

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d446ae44badc41d3a4c3dfad1efb4b6e~tplv-k3u1fbpfcp-zoom-1.image" alt="流程" style="zoom:80%;" />



* Workspace：工作区，就是平时进行开发改动的地方，是当前看到最新的内容，在开发的过程也就是对工作区的操作（也就是本地工作区）。

* Index：暂存区，当执行 `git add` 的命令后，工作区的文件就会被移入暂存区，暂存区标记了当前工作区中哪些内容是被 Git 管理的，当完成某个需求或者功能后需要提交代码，第一步就是通过 `git add` 先提交到暂存区。

* Repository：本地仓库，位于自己的电脑上，通过 `git commit` 提交暂存区的内容，会进入本地仓库。

* Remote：远程仓库，用来托管代码的服务器，远程仓库的内容能够被分布在多个地点的处于协作关系的本地仓库修改，本地仓库修改完代码后通过 `git push` 命令同步代码到远程仓库。

## 流程

一般来说，工作流程也就是：

1. 本地工作区开发，添加/修改文件
2. 将修改后的文件放入暂存区
3. 暂存区提交到本地仓库
4. 本地仓库推送到远程仓库



# Git基本操作

> git有三个环境配置级别： `system(系统级别)`，`global(当前用户)`，`local(项目)`
> 优先级：`local`  > `global` > `system`

## config

```bash
# 设置全局，会同步到 `~/.gitconfig` 文件里
git config --global user.name "username"  #名称
git config --global user.email username@xx.com  #邮箱
# 删除全局
git config --global --unset user.name
```

## status

```bash
# 查看指定文件当前状态
git status <file>
# 查看所有文件状态
git status
```

## add

```bash
# 添加某个文件到暂存区，后面可以跟多个文件，以空格区分
git add xxx
# 添加当前更改的所有文件到暂存区。
git add .
```

## commit

```bash
# 提交暂存的更改，会新开编辑器进行编辑
git commit 
# 提交暂存的更改，并记录下备注
git commit -m "you message"
# 等同于 git add . && git commit -m
git commit -am
# 对最近一次的提交的信息进行修改,此操作会修改 commit 的 hash 值
git commit --amend
```

## pull

```bash
# 从远程仓库拉取代码并合并到本地，可简写为 git pull 等同于 git fetch && git merge 
# fetch 表示只拉取代码，保留本地修改
git pull <远程主机名> <远程分支名>:<本地分支名>
# 使用 rebase 的模式进行合并
git pull --rebase <远程主机名> <远程分支名>:<本地分支名>
```

## fetch

```bash
# git fetch 操作仅仅只会拉取远程的更改，不会自动进行 merge 操作。对你当前的代码没有影响
# 获取远程仓库特定分支的更新
git fetch <远程主机名> <分支名>
# 获取远程仓库所有分支的更新
git fetch --all
```

## branch

```bash
# 新建本地分支，但不切换
git branch <branch-name> 
# 查看本地分支
git branch
# 查看远程分支
git branch -r
# 查看本地和远程分支
git branch -a
# 删除本地分支
git branch -D <branch-nane>
# 删除远程分支
git push origin --delete <branch-name>
# 重新命名分支
git branch -m <old-branch-name> <new-branch-name>
```

## tag

```bash
# 查看标签
git tag
# 查看特定标签信息
git show v0.1
# 创建标签
git tag -a v0.1 -m "提交信息"
# 删除标签
git tag -d v0.1
# 标签推送到远程(默认的push不会提交标签)
git push origin v0.1
# 所有标签都推送到远程
git push origin --tags
# 删除远程分支
git push origin :refs/tags/<tagname>
# 根据tag创建分支
git branch <branch-name> <tag-name>
```



# Git常见命令

## git rebase

`rebase` 被叫做变基，可以理解为把修改的分支(基) 变化到主分支上。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5183c695f03145fea4dedbc283a430d9~tplv-k3u1fbpfcp-zoom-1.image)

从上图来看，就是把分支拿过来拼接到了主分支的后面。



<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f4b12b00257b479099dab166f5d5afda~tplv-k3u1fbpfcp-zoom-1.image" style="zoom:50%;" />

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18b793e7c8fb48d6a1e6bb60c0ab8ecf~tplv-k3u1fbpfcp-zoom-1.image" alt="iShot2021-08-05 14.46.02" style="zoom:50%;" />

## git merge

merge就是合并，把修改的分支和主分支合并，然后生成一条新的commit。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6185b9a0ac2b4bfa8c0b0e3022ce438b~tplv-k3u1fbpfcp-zoom-1.image)

从上图来看，就是把分支和主分支同时修改了head，并生成一个新的commit放到分支上。

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a562b49a4b46432db0f8236b237c6a4d~tplv-k3u1fbpfcp-zoom-1.image" style="zoom:50%;" />

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e59e6c3a3ba64302b8add9b7df6e8d4a~tplv-k3u1fbpfcp-zoom-1.image" alt="iShot2021-08-05 14.50.03" style="zoom:50%;" />

### --no-fastforward

`--no-ff` 表示强行关闭fast-forward方式。

fast-forward方式就是当条件允许的时候，git直接把HEAD指针指向合并分支的头，完成合并。属于“快进方式”，不过这种情况如果删除分支，则会丢失分支信息。因为在这个过程中没有创建commit，以下分别为 `ff` 和 `no-ff` 模式的效果图

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/852e5e8b4f8f4a0e87edeaca9cf438de~tplv-k3u1fbpfcp-zoom-1.image" alt="iShot2021-08-12 14.54.30" style="zoom: 50%;" />

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/938ab6f8c84041d1b1566d519443fa8b~tplv-k3u1fbpfcp-zoom-1.image" alt="iShot2021-08-12 14.51.30" style="zoom:50%;" />



### --squash

`--squash` 用来合并一些不必要的commit进行压缩，合并之后的状态需要再次commit 补充提交信息，同时不会拉过来其他分支的commit信息。

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f751a4287a484afb9b09ab3a3551109c~tplv-k3u1fbpfcp-zoom-1.image" alt="iShot2021-08-12 14.58.54" style="zoom:50%;" />



### rebase 和 merge 的区别

`rebase `和 `merge` 解决的问题一样：分支代码的归并(合并)，只是方式不同而已：

* rebase 不会修改master的head，merge会

* rebase 解决冲突是一个一个解决，merge最多只会有一个冲突

  > git add .     git rebase --continue   git rebase -edit-todo

* merge 只有在冲突的时候，解决完冲突才会自动产生一个commit。

* rebase可以合并commit，也就是篡改历史，merge不会

  > git rebase -i `<commit-id>`

* rebase——注意细节，merge——大力出奇迹

* 个人本地rebase，线上merge

  

再来看一个例子：

1. 初始化

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b9aa25a08b241f1a3f3ece14df7982d~tplv-k3u1fbpfcp-zoom-1.image" alt="820480-20151210160805574-772504074" style="zoom:40%;" />



2. merge

   <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d07f84cd2a54af3b9c17e585c64fa32~tplv-k3u1fbpfcp-zoom-1.image" alt="820480-20151210161019933-162065399" style="zoom: 50%;" />

3. rebase

   ![820480-20151210161429652-541776089](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/457ec78d30ad47519d96d1b66851d990~tplv-k3u1fbpfcp-zoom-1.image)

   ![820480-20151210161609636-1636192051](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78e1b637cbe246f987f86c5d1a22741e~tplv-k3u1fbpfcp-zoom-1.image)

## git cherry-pick

`cherry-pick` 主要作用于：截取一段代码提交合并到当前分支上

```bash
git cherry-pick <commit-id>
git cherry-pick <start-id>..<end-id>
git cherry-pick <start-id>^..<end-id>
```

## git stash

`stash` 主要作用于：暂存当前分支，修改其他的分支结束后，执行 pop 可以还原之前的修改

```bash
# 保存当前修改
git stash save "message"

# 查看当前分支上次的修改
git stash pop

# 查看分支所有的更改
git stash list
```

## git reset

`reset` 指的是版本的撤回，即彻底撤回(回退)到某个版本，此次之后的修改会被退回到暂存区，同时commit信息会被消除

```bash
# 回退到某个版本
git reset --hard <commit-id>
# 回退到所有内容上个版本
git reset HEAD^
# 回退某个文件到上个版本
git reset HEAD^ <file>
```

## git revert

`revert` 指的是撤销某次操作，此次操作前的commit都会被保留，会创建一个新的commit

```bash
# 丢弃最近的三个commit，把状态恢复到最近的第四个commit，并提交一个新的commit来记录这次改变
git revert HEAD~3
# 丢弃从最近的第五个commit（包含）到第二个（不包含）,但是不自动生成commit
git revert -n master~5..master~2
```

`reset` 和 `revert` 的区别：

* revert 是用一个新的commit来回滚之前的commit，reset是直接删除指定的commit

* revert 合并老分支不会出现删除的代码，而 reset 会

  > 假设场景为merge以前的老版本：因为git revert是用一次逆向的commit“中和”之前的提交，因此日后合并老的branch时，导致这部分改变不会再次出现，但是git reset是之间把某些commit在某个branch上删除，因而和老的branch再次merge时，这些被回滚的commit应该还会被引入。

*  revert是HEAD继续前进，reset 是HEAD向后移动，revert 新的commit内容和要revert的内容正好相反，才能够抵消要被revert的内容。

## git alias

重命名git命令，更方便，配置会生效到 `~/.gitconfig` 里。

```bash
# 配置
git config --global alias.ci commit
# 使用
git ci -m "提交信息"
```

# Git 深入

## 版本控制分类

### 本地版本控制

记录文件每次的更新，可以对每个版本做一个快照，或是记录补丁文件，适合个人用，如RCS。

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b7252fd431641cf8defef6fccd89d68~tplv-k3u1fbpfcp-zoom-1.image" alt="05163110-c8a48b29015245b78dc0127429ef5213" style="zoom:100%;" />

### 集中式版本控制

所有的版本数据都保存在服务器上，协同开发者从服务器上同步更新或上传自己的修改。

![63651-20170904213634085-673206677](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e26bd1b81e84c578305f4b4697fe0e3~tplv-k3u1fbpfcp-zoom-1.image)

1. 所有的版本数据都存在服务器上，用户的本地只有自己以前所同步的版本，如果不连网的话，用户就看不到历史版本，也无法切换版本验证问题，在不同分支工作。
2. 所有数据都保存在单一的服务器上，有很大的风险这个服务器会损坏，这样就会丢失所有的数据，当然可以定期备份。
3. 代表产品：SVN、CVS、VSS

### 分布式版本控制

![63651-20170904214244944-1222535795](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd2695bc55d544e48831215a7f484832~tplv-k3u1fbpfcp-zoom-1.image)

1. 所有版本信息仓库全部同步到本地的每个用户，这样就可以在本地查看所有版本历史，可以离线在本地提交，只需在连网时push到相应的服务器或其他用户那里。
2. 每个用户那里保存的都是所有的版本数据，只要有一个用户的设备没有问题就可以恢复所有的数据，但这增加了本地存储空间的占用。

## 文件操作

版本控制就是对文件的版本控制，要对文件进行修改、提交等操作，首先要知道文件当前在什么状态。

GIT不关心文件两个版本之间的具体差别，而是关心文件的整体是否有改变，**若文件被改变，在添加提交时就生成文件新版本的快照，而判断文件整体是否改变的方法就是用 `SHA-1` 算法计算文件的校验和。**

### 文件的4种状态

- **Untracked**: 未跟踪, 此文件在文件夹中, 但并没有加入到git库, 不参与版本控制. 通过`git add` 状态变为`Staged`.
- **Unmodify**: 文件已经入库, 未修改, 即版本库中的文件快照内容与文件夹中完全一致. 这种类型的文件有两种去处, 如果它被修改, 而变为`Modified`. 如果使用`git rm`移出版本库, 则成为`Untracked`文件
- **Modified**: 文件已修改, 仅仅是修改, 并没有进行其他的操作. 这个文件也有两个去处, 通过`git add`可进入暂存`staged`状态, 使用`git checkout` 则丢弃修改过, 返回到`unmodify`状态, 这个`git checkout`即从库中取出文件, 覆盖当前修改
- **Staged**: 暂存状态. 执行`git commit`则将修改同步到库中, 这时库中的文件和本地文件又变为一致, 文件为`Unmodify`状态. 执行`git reset HEAD filename`取消暂存, 文件状态为`Modified`

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/610b2af02de3437a8425cfae47f8b259~tplv-k3u1fbpfcp-zoom-1.image" alt="63651-20170909091456335-1787774607" style="zoom: 67%;" />

### rm

```bash
# 直接从暂存区删除文件，工作区不变
git rm --cached <file>
# 版本库拉代码到暂存区，暂存区被覆盖，但是工作区不受影响
git reset HEAD <file>
```



### checkout

![63651-20170906224842804-513302659](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2820af3a3b2446779eef8dea9598216e~tplv-k3u1fbpfcp-zoom-1.image)

```bash
# 检出branch分支。要完成图中的三个步骤，更新HEAD以指向branch分支，以及用branch  指向的树更新暂存区和工作区。
git checkout branch
# 汇总显示工作区、暂存区与HEAD的差异。
git checkout
# 用暂存区中filename文件来覆盖工作区中的filename文件。相当于取消自上次执行git add filename以来（如果执行过）的本地修改。
git checkout -- filename
# 维持HEAD的指向不变。用branch所指向的提交中filename替换暂存区和工作区中相应的文件。注意会将暂存区和工作区中的filename文件直接覆盖。
git checkout branch -- filename
# 这条命令最危险！会取消所有本地的修改（相对于暂存区）。相当于用暂存区的所有文件直接覆盖本地文件，不给用户任何确认的机会！
git checkout .
# 如果不加commit_id，那么git checkout -- file_name 表示恢复文件到本地版本库中最新的状态。
git checkout commit_id -- file_name
# 从当前分支的HEAD签出一个新分支
git checkout -b <branch>
```

### diff

```bash
# 比对文件差异
git diff <file>
# 比较暂存区的文件与之前已经提交过的文件
git diff --cached
# 比较repo与工作空间中的文件差异
git diff HEAD~n
```

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c5089fef53f49d189d9cd4d2593ead1~tplv-k3u1fbpfcp-zoom-1.image" alt="63651-20170914095506203-2063795525" style="zoom:50%;" />

### .gitIgnore

```bash
# 忽略所有 .txt结尾的文件
*.txt 
# 但lib.txt除外
!lib.txt
# 仅忽略项目根目录下的TODO文件,不包括其它目录temp
/temp
# 忽略build/目录下的所有文件
build/
# 会忽略 doc/notes.txt 但不包括 doc/server/arch.txt
doc/*.txt 
```

### log

```bash
# 显示某个文件提交日志
git log <file>
# 显示当前分支所有提交日志
git log
# 图形化显示提交历史
git log --graph
```



![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e88a1da185c4edfb5b87bdb2021a07b~tplv-k3u1fbpfcp-zoom-1.image)

### 其他

```bash
#  得到 git仓库中的代码行数
git ls-files | xargs wc -l

#仓库提交者排名前 5（如果看全部，去掉 head 管道即可）：
git log --pretty='%aN' | sort | uniq -c | sort -k1 -n -r | head -n 5

#仓库提交者（邮箱）排名前 5：这个统计可能不会太准，因为很多人有不同的邮箱，但会使用相同的名字
git log --pretty=format:%ae | gawk -- '{ ++c[$0]; } END { for(cc in c) printf "%5d %s\n",c[cc],cc; }' | sort -u -n -r | head -n 5 

#贡献者统计：
git log --pretty='%aN' | sort -u | wc -l

#提交数统计：
git log --oneline | wc -l 
```



## 目录

```js
COMMIT_EDITMSG // 本地最后一个提交的信息
config // -local的配置
description // 描述
FETCH_HEAD // 分支在远程的最新状态
HEAD // 当前的HEAD，映射到ref引用，能够找到下一次commit的前一次哈希值
hook // 钩子
index // 暂存区
info //仓库的一些信息
logs // 提交信息，引用记录
objects // git对象
ORIGIN_HEAD // 远程仓库的当前引用
refs // 引用的映射关系
```

## 项目规范

使用 `husky` , `lint-staged` 和  `commitlint` 来规范提交的代码。

### husky

可以将`git`内置的钩子暴露出来，很方便地进行钩子的命令注入，而不需要在`.git`目录下自己写`shell`脚本了；不仅可以执行`js`文件作为脚本，还可以将脚本暴露出来，方便在`git`项目中进行管理。

常用的钩子：

* `pre-commit`：由`git commit`命令触发，在`commit-msg`之前
* `commit-msg`：`git commit`和`git merge`都会触发，会传递一个参数，该参数为存放当前`commit`消息的**临时文件路径**；可以通过`--no-verify`参数来跳过`commit-msg`钩子
* `post-merge`：触发于`merge`完成后

### lint-staged

验证被 `git add` 的文件，相当于提交到暂存区前的一个验证。

### commitlint

验证commit提交的信息，格式为：

```bash
git commit -m <type>[optional scope]: <description>
```

#### type

用于表明我们这次提交的改动类型，是新增了功能？还是修改了测试代码？又或者是更新了文档？ 

| 类型     | 描述                                                   |
| -------- | ------------------------------------------------------ |
| build    | 编译相关的修改，例如发布版本、对项目构建或者依赖的改动 |
| chore    | 其他修改, 比如改变构建流程、或者增加依赖库、工具等     |
| ci       | 持续集成修改                                           |
| docs     | 文档修改                                               |
| feat     | 新特性、新功能                                         |
| fix      | 修改bug                                                |
| perf     | 优化相关，比如提升性能、体验                           |
| refactor | 代码重构                                               |
| revert   | 回滚到上一个版本                                       |
| style    | 代码格式修改, 注意不是 css 修改                        |
| test     | 测试用例修改                                           |

#### optional scope

一个可选的修改范围。用于标识此次提交主要涉及到代码中哪个模块。

#### description

一句话描述此次提交的主要内容，做到言简意赅。

#### 例子

```bash
git commit -m 'fix(account): 修复xxx的bug'
git commit -m 'refactor: 重构整个项目'
```

### 安装

```js
npm i husky lint-staged @commitlint/cli @commitlint/config-conventional @commitlint/format -D
```

### 使用

在 `package.json` 中加入：

```json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged",
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
},
"lint-staged": {
  "src/*.{js,vue}": [
    "npm run didlint",
    "git add ."
  ]
}
```

新增文件 `.commitlintrc.js`

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',
  rules: {
    'type-enum': [
      2,
      'always',
      ['fix','feat','test', 'chore','docs','refactor','style']
    ],
    'type-case': [2,'always','lower-case'], //允许type小写校验
    'type-empty': [2,'never'],  //不允许type为空
    'scope-empty': [0],         // 允许scope为空
    'subject-full-stop': [0, 'never'],
    'subject-case': [2, 'always','lower-case'],
    'header-max-length': [0, 'always', 72]
  }
};
```



# 相关资料

* [BitKeeper与Linux，git史前琐事](http://www.path8.net/tn/archives/6039)

* [Git图解剖析](https://www.cnblogs.com/yaozhongxiao/p/3811130.html)
* [gitIgnore规则](https://www.cnblogs.com/kevingrace/p/5690241.html)
* [Git系列之Refs与Reflog](https://segmentfault.com/a/1190000007996197)
* [husky文档](https://typicode.github.io/husky/#/)
* [lint-staged文档](https://github.com/okonet/lint-staged#readme)
* [commitlint文档](https://commitlint.js.org/#/)
* [前端codeLint-- 为项目集成ESLint、StyleLint、commitLint实战和原理](https://zhuanlan.zhihu.com/p/100427908)


