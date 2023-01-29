---
title: Source Map 原理
date: 2023-01-29
tags: 
  - sourcemap
  - webpack
---
[[toc]]

Source Map 是一种 `.map` 结尾的文件类型，主要的作用是记录和源码有关的位置信息。<br />JavaScript 从最开始的简单变得越来越复杂，大部分源码都要经过转换才能放到生产环境。一般情况下在 **压缩**、**文件合并** 和 **语言转义** 方面可以看到实际的运行代码不同于源码，这时候如果要调试就会毫无头绪，Source Map 就是来解决这个问题的。
## 格式
Source Map 的文件大概长这个样子：
```json
{
  version : 3,
  file: "out.js",
  sourceRoot : "",
  sources: ["foo.js", "bar.js"],
  names: ["src", "maps", "are", "fun"],
  mappings: "AAgBC,SAAQ;CAAEA"
}
```
整个文件是一个 json，其中：

- **version**： Source Map 的版本，目前为3，这是 [Source Map 3 的提案](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.1ce2c87bpj24)。
- **file**：转换后的文件名。
- **sourceRoot**：转换前文件所在目录。如果和转换前的文件在同一个目录，该项为空。
- **sources**：转换前的文件。是一个数组，表示可多文件合并。
- **names**：转换前的变量名和属性名。
- **mappings**：记录位置信息的字符串。

## mapping
 Source Map 的核心是：如何把两个文件内的位置一一对应。**mapping** 字段就是来解决这个问题的，它是一个很长的字符串，分为三层：

- 行对应：以分号（;）表示，每个分号对应转换后源码的一行，一个分号前的内容就对应源码的一行。
- 位置对应：以逗号（,）表示，每个逗号对应转换后源码的一个位置，一个逗号前的内容对应源码的一个位置。
- 位置转换：以 VLQ 编码 表示，代表该位置对应的转换前的源码位置。
```javascript
mapping: "AAAAA,BBBBB;CCCCC"

// 表示转换后的源码分成两行，第一行有两个位置，第二行有一个位置。
```

## 位置对应原理
每个位置占五位，表示五个字段：

- 第一位：表示这个位置在第几列（转换后的代码）。
- 第二位：表示这个位置属于 `sources` 属性中的哪个文件。
- 第三位：表示这个位置属于第几行（转换前代码）。
- 第四位：表示这个位置属于第几列（转换前代码）。
- 第五位：表示这个位置属于 `names` 属性的哪一个变量。

注意，所有的值都是以 0 为基数的。其次，第五位不是必须的，如果没有 names 属性，就可以忽略第五位。每一位都是用 VLQ 编码表示的，由于 VLQ 是可以变长的，所以每一位可以由多个字符构成。<br />举例，一个位置是 AAAAA 的，在 VLQ 编码中的 A 是 0，所以这个位置的五个位都是 0，代表的意思也就是：该位置在转换后代码的第 0 列，对应 **sources** 属性中第 0 个文件，属于转换前代码的第 0 列第 0 行，对应 **names** 属性中的第 0 个变量。

假设有个文件 `a.js` 有一行代码：`Hello World`，最终打包输出的文件为 `bundle.js`，内容为: `Awesome JavaScript`，映射关系如下：
<img src="https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/1674989061318yuque_diagram.jpg" style="width:300px">

以 World 为例，它原始的位置为（0,6），输出后是 Awesome，位置为（0,0），那么可以这样来表示一下：
<img src="https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/1674989197316yuque_mind (1).jpeg" style="width:500px">
<br />这样就可以写成一种固定的格式，包含了输出前后的位置信息、文件名和具体的单词，此时的映射关系为：


| 输出后的单词 | 映射关系 |
| --- | --- |
| Awesome |  0  &nbsp;&#124;&nbsp;  0  &nbsp;&#124;&nbsp;  a.js  &nbsp;&#124;&nbsp;  0  &nbsp;&#124;&nbsp;  6  &nbsp;&#124;&nbsp;  World |
| JavaScript |  0  &nbsp;&#124;&nbsp;  8  &nbsp;&#124;&nbsp;  a.js  &nbsp;&#124;&nbsp;  0  &nbsp;&#124;&nbsp;  8  &nbsp;&#124;&nbsp;  Hello |

可以再优化一下，把 `a.js` 和最后面的单词放到数组里，用 `sources` 来记录所有的原始文件名，`names` 来记录所有的单词，并用下标表示它们，以 `World` 为例，就变成了：
<img src="https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/1674989431951yuque_mind (2).jpeg" style="width:600px">

很多时候输出的文件其实只有一行，所以可以暂且把输出文件的行号省略掉，就变成了：
<img src="https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/1674989481318yuque_mind (3).jpeg" style="width:600px">


再考虑一点，如果文件很大的话，行列的数值就会特别的大，所以可以考虑用 **相对位置** 代替 **绝对位置** 来表示，只用绝对位置表示第一个单词的位置，后面都使用相对前一个单词的位置：

<table style="text-align:center">
<tr>
  <th>原始单词</th>
  <th>输入位置</th>
  <th>输出单词</th>
  <th>输出位置</th>
  <th>映射</th>
</tr>
<tr>
  <td>Hello</td>
  <td>(0, 0)<br/>绝对位置</td>
  <td>JavaScript</td>
  <td>(0, 8)<br/>绝对位置</td>
  <td>8 | 0 | 0  | 0  | 0 </td>
</tr>
<tr>
  <td>World</td>
  <td>(0, 6)<br/>相对于 Hello 的“H”<br/>(空格的位置也算进去)</td>
  <td>Awesome</td>
  <td>(0, -8)<br/>相对于 JavaScript 的 “J”<br/>(空格的位置也算进去)</td>
  <td>-8 | 0 | 0 | 6 | 0 </td>
</tr>
</table>

现在可以得到一个初步的 `map` 文件了：
```json
{
  names: ['Hello', 'World'],
  sources: ['a.js'],
  mappings: [8|0|0|0|0, -8|0|0|6|0]
}
```
但是这个 mappings 很难看，而且需要使用 “|” 来分隔， 此时就需要用 VLQ 编码来解决分隔的问题，它的理念是在连续的数字上做标记。

## VLQ编码
**VLQ（Variable-length quantity）** 是一种通用的，使用任意位数的二进制来表示任意一个大的数字的编码方式，最开始用于 MIDI 文件，后来被多种格式采用。用来节省空间。<br />上面的例子用 “|” 做标记，是为了用一个字符串存储多个数字（像 1 | 23 | 456 | 7 这样），但是每个 “|” 都要占一个字符，下面看下 VLQ 如何对连续的数字做标记：

<img src="https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/1674990255321yuque_diagram (1).jpg" style="width:600px">


可以发现，标记只在数字不是结尾的部分才有，也就是说，没有标记意味着数字的结束。<br />它的具体实现是这样的，VLQ 利用 6 位进行存储，其中：

- 第一位，表示是否连续
- 最后一位，表示正数/负数
- 中间四位，范围为[-15, 15]，因为二进制的四位数全都是 1 的十进制就是15，超过了就要用连续标识位了。

来看几个用 VLQ 表示数字的例子：
<img src="https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16749903243181674990323473.png" style="width:600px">

从上图可以看出：

1. 如果数字在 [-15, 15] 内，一个单元就可以，例如 7，只需要把 7 的二进制放到中间四位就好。
2. 如果超过 [-15, 15]，就要用多个单元表示，需要对数字按照 **“..5554”** 的规则划分，把最右边的 4 位 放进第一个单元格中，然后每 5 个放入右边新的单元格，而第一个单元只放 4 个是因为它的最后一位表示正负标识，其他单元的最后一位就没必要表示正负了。
3. 如果是负数，求它的正数的二进制，继续按照之前的规则放，只把第一个单元格的最后一位改为 1 即可。
4. 最后把划分好的 6 位变成 Base64 编码，因为 Base64 也是 6 位一单元（下图就是Base64编码字符表）。 
<img src="https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/1674990373317image (1).png" style="width:300px">

了解了 VLQ编码 的实现，现在就可以对 “Hello World” 的例子进行编码了，上面知道 mappings 为：

<div text-center font-bold>
[ 8 | 0 | 0 | 0 | 0,  -8 | 0 | 0 | 6 | 0 ]
</div>

按照上面 VLQ 规则编码后的每一部分为：

<div text-center font-bold text-3>
[ 010000 | 000000 | 000000 | 000000 | 000000，010001 | 000000 | 000000 | 001100 | 000000 ]
</div>

每一部分按照二进制转十进制，得出结果为：

<div text-center font-bold>
[ 16 | 0 | 0 | 0 | 0， 17 | 0 | 0 | 12 | 0 ]
</div>

最后查 Base64 表，得出 VLQ 编码为：

<div text-center font-bold>
[ QAAAA, RAAMA ]
</div>

可以在 [这个网站](https://www.murzwin.com/base64vlq.html) 验证一下结果：
<img src="https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/1674990619435image (2).png" style="width:650px">


🎉 这样就得到了一个 **mapping** 映射关系 ！

## 项目中的 Source Map
在 Webpack 中，使用了一个 [source-map](https://github.com/mozilla/source-map) 包来实现该功能，大概的意思就是通过自定义的转换关系对 sourcemap 部分的内容进行生产和消费，而 Webpack 也是在其基础上添加了一点的属性和封装。<br />一般情况下要想在项目里的 `a.js` 生成一个对应的 `a.js.map`，就需要在 `a.js` 的最后添加一句：
```javascript
//# sourceMappingURL=/path/to/source.js.map
```
像 jquery 的 [在线cdn](https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js)，也在文件结尾加了下面这句注释，而它的在线 map 文件是 [这样](https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.map) 的：
```javascript
//@ sourceMappingURL=jquery.min.map
```
Webpack5 里的 Source Map 正则判定规则是：

```
^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$
```

可以看出来是各种前缀拼接 `source-map` 字符串来定义是哪种 sourcemap 模式：
<img src="https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/1674990714317image (3).png" style="width:650px">



### eval
eval 的 api 是动态执行的，浏览器针对 eval 有个特殊的处理：
<img src="https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/1674990760320image (4).png" style="">

加了两句特殊的语句，在浏览器的源代码里也可以找到这个文件：
<img src="https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/1674990792412image (5).png" style="">

注意，这里的文件是可以打断点的，也就是说 Webpack 利用了 eval 的该特性来优化 sourcemap 的生成，所以在配置的时候加上 `devtool`：
```javascript
module.exports = {
  entry: './src/index.js',
  devtool: 'eval',
  ....
}

// 此时生成的 sourcemap 每个都被 eval 包裹住，然后利用该特性进行映射
```
一般情况下生成的 sourcemap 很大，也很耗时，所以就出了上面说的各种 sourcemap 模式的 api。

### cheap
sourcemap 速度慢是因为映射慢，映射量大，很多时候的调试不需要精确到行+列，只需要精确到行就可以了，这时候就用 cheap 的 sourcemap。

### module
在有多个 `loader` 的情况下，每次转换都会有 sourcemap，默认能拿到的 sourcemap 的最终结果只关联了最后一个 loader，这个时候要想调试最初的源码就需要把每次的 `loader` 的 sourcemap 关联起来，`module` 就是配置它的。

### nosources
sourcemap 是有 sourceContent 内容的，也就是源码本身的复制份，如果不想生成 sourceContent，就使用 `nosources-source-map `模式的 `devtool`。

## 相关资料
* [mozilla / source-map](https://github.com/mozilla/source-map#examples)
* [Source Maps 101](https://code.tutsplus.com/tutorials/source-maps-101--net-29173)
* [Base64 VLQ](https://github.com/D-kylin/note/blob/master/VLQ%E7%BC%96%E7%A0%81.md)
* [BASE64 VLQ 编码规则](https://enjoyasp.net/archives/2424)
* [源码映射（Source Map）](https://www.bilibili.com/read/cv11547448?from=search)
* [深入浅出之 Source Map](https://juejin.cn/post/7023537118454480904)
* [sourceMap是个啥](https://juejin.cn/post/6844903926202892295)
* [聊一聊SourceMap](https://zhuanlan.zhihu.com/p/475964893)
* [source map原理分析&vlq](http://www.qiutianaimeili.com/html/page/2019/05/89jrubx1soc.html)
* [Compiling to JavaScript, and Debugging with Source Maps](https://hacks.mozilla.org/2013/05/compiling-to-javascript-and-debugging-with-source-maps/)
