---
title: vscode 全局和插件配置
date: 2022-03-19
categories:
 - 工具
tags:
 - 工具
---
[[toc]]

整理了一套自己的 setting.json 和 extension，有需要的可以自取~

```json
// setting.json
{ 
  "debug.console.fontFamily": "JetBrains Mono",
  // 控制在运行预启动任务后遇到错误时应该怎么做。debugAnyway: 忽略任务错误并开始调试。
  "debug.onTaskErrors": "debugAnyway",
  // 控制编辑器是否应在对屏幕阅读器进行了优化的模式下运行。设置为“开”将禁用自动换行。
  "editor.accessibilitySupport": "off",
  // 控制是否启用平滑插入动画
  "editor.cursorSmoothCaretAnimation": true,
  "editor.find.addExtraSpaceOnTop": false,
  // 这个控制是否启用字体连字
  "editor.fontLigatures": "'ss01', 'ss02', 'ss03', 'ss06', 'zero'",
  // 控制编辑器是否应呈现垂直字形边距。字形边距最常用于调试。
  "editor.glyphMargin": true,
  // 控制是否在编辑器中自动显示内联建议。
  "editor.inlineSuggest.enabled": true,
  // 在通过鼠标添加多个光标时使用的修改键。“转到定义”和“打开链接”功能所需的鼠标动作将会相应调整，不与多光标修改键冲突
  "editor.multiCursorModifier": "ctrlCmd",
  "editor.tabSize": 2,
  "editor.fontWeight": 440,
  "editor.fontFamily": "JetBrains Mono, Menlo, Monaco, 'Courier New', monospace",
  // 控制是否突出显示可能与基本 ASCII 字符混淆的字符，但当前用户区域设置中常见的字符除外。
  "editor.unicodeHighlight.ambiguousCharacters": false,
  // 控制是否突出显示仅保留空格或完全没有宽度的字符。
  "editor.unicodeHighlight.invisibleCharacters": false,
  // ESLint要验证的语言
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "vue",
    "typescript",
    "typescriptreact",
    "html",
    "css",
    "scss",
    "less",
    "mpx",
    "json",
    "markdown"
  ],
  // 不显示eslint校验的警告信息
  "eslint.quiet": true,
  // eslint保存时只修复有问题的代码
  "eslint.codeActionsOnSave.mode": "problems",
  "eslint.format.enable": true,
  // 文件自动延迟保存
  "files.autoSaveDelay": 5000,
  // 默认行尾字符。 LF
  "files.eol": "\n",
  // 启用简单文件对话框。启用时，简单文件对话框将替换系统文件对话框。
  "files.simpleDialog.enable": true,
  // 同步 Git 存储库前请先进行确认。
  "git.confirmSync": false,
  "git.autofetch": true,
  // 控制如何处理工作区中的松散文件
  "security.workspace.trust.untrustedFiles": "open",
  "vetur.validation.template": false,
  // 编辑器左侧目录树偏移量
  "workbench.tree.indent": 10,
  "workbench.iconTheme": "file-icons",
  "workbench.startupEditor": "newUntitledFile",
  "workbench.productIconTheme": "icons-carbon",
  "workbench.colorTheme": "Community Material Theme Palenight High Contrast",
  // 控制无标题提示应该是编辑器或浮动按钮中的内联文本，还是应该隐藏。
  "workbench.editor.untitled.hint": "hidden",
  // 调整对话框窗口的外观。
  "window.dialogStyle": "custom",
  // 启用 macOS Sierra 窗口选项卡。请注意，更改在完全重新启动程序后才能生效。同时，开启原生选项卡将禁用自定义标题栏样式。
  "window.nativeTabs": true, // this is great, macOS only
  // 调整窗口标题栏的外观。在 Linux 和 Windows 上，此设置也会影响应用程序和上下文菜单的外观。更改需要完全重新启动才能应用。
  "window.titleBarStyle": "custom",
  // 控制工作台中活动栏的可见性。
  "workbench.activityBar.visible": true,
  // 控制在会话期间显示已打开文件的编辑器是否应在被其他进程删除或重命名时自动关闭。
  // 禁用此功能将使编辑器在此类事件中保持打开状态。
  // 请注意，从应用程序内删除将始终关闭编辑器，且永远不会关闭具有未保存更改的编辑器以保留数据。
  "workbench.editor.closeOnFileDelete": true,
  // 控制是否在具有未保存更改的编辑器的选项卡上绘制顶部边框。
  "workbench.editor.highlightModifiedTabs": true,
  // 控制在工作台中字体的渲染方式。antialiased: 进行像素而不是次像素级别的字体平滑。可能会导致字体整体显示得更细
  "workbench.fontAliasing": "antialiased",
  // 控制列表和树是否具有平滑滚动效果。
  "workbench.list.smoothScrolling": true,
  // 控制侧边栏和活动栏的位置。它们可以显示在工作台的左侧或右侧。
  "workbench.sideBar.location": "left",
  // 控制扩展的自动更新行为。更新是从 Microsoft 联机服务中获取的。
  // onlyEnabledExtensions: 仅为已启用的扩展自动下载并安装更新。将不会自动更新已禁用的扩展。
  "extensions.autoUpdate": "onlyEnabledExtensions",
  // 启用后，将不会显示扩展建议的通知。
  "extensions.ignoreRecommendations": true,
  // 控制终端光标是否闪烁。
  "terminal.integrated.cursorBlinking": true,
  // 控制终端光标的样式。
  "terminal.integrated.cursorStyle": "underline",
  // 要在终端中用于非粗体文本的字体粗细。接受“正常”和“加粗”这两个关键字，或接受 1-1000 之间的数字。
  "terminal.integrated.fontWeight": "300",
  // 当必须关闭终端进程(例如当窗口或应用程序关闭时)时，这将确定何时应还原以前的终端会话内容，以及在下次打开工作区时重新创建的进程。
  "terminal.integrated.persistentSessionReviveProcess": "never",
  // 控制终端选项卡是否以列表的形式显示在终端的一侧。如果禁用此功能，将改为显示下拉列表。
  "terminal.integrated.tabs.enabled": true,
  // 删除时，是否确认
  "explorer.confirmDelete": false,
  // 控制在资源管理器内拖放移动文件或文件夹时是否进行确认。
  "explorer.confirmDragAndDrop": false,
  // 实验性。控制是否已在资源管理器中启用文件嵌套。文件嵌套允许目录中的相关文件在单个父文件下以可视方式组合在一起。
  "explorer.experimental.fileNesting.enabled": true,
  // 实验性。控制是否自动展开文件嵌套。
  "explorer.experimental.fileNesting.expand": false,
  // 实验性。控制资源管理器中文件的嵌套。
  "explorer.experimental.fileNesting.patterns": {
    ".gitignore": ".gitattributes, .gitmodules, .gitmessage, .mailmap, .git-blame*",
    "*.js": "$(capture).js.map, $(capture).min.js, $(capture).d.ts",
    "*.jsx": "$(capture).js",
    "*.ts": "$(capture).js, $(capture).*.ts",
    "*.tsx": "$(capture).ts",
    "*.vue": "$(capture).*.ts, $(capture).*.js",
    "index.d.ts": "*.d.ts",
    "shims.d.ts": "*.d.ts",
    "*.cpp": "$(capture).hpp, $(capture).h, $(capture).hxx",
    "*.cxx": "$(capture).hpp, $(capture).h, $(capture).hxx",
    "*.cc": "$(capture).hpp, $(capture).h, $(capture).hxx",
    "*.c": "$(capture).h",
    "go.mod": ".air*, go.sum",
    "default.nix": "shell.nix",
    "flake.nix": "flake.lock",
    "BUILD.bazel": "*.bzl, *.bazel, *.bazelrc, bazel.rc, .bazelignore, .bazelproject, WORKSPACE",
    "CMakeLists.txt": "*.cmake, *.cmake.in, .cmake-format.yaml, CMakePresets.json",
    ".clang-tidy": ".clang-format",
    ".env": "*.env, .env.*, env.d.ts",
    "dockerfile": ".dockerignore, dockerfile*",
    "package.json": ".browserslist*, .circleci*, .codecov, .commitlint*, .editorconfig, .eslint*, .firebase*, .flowconfig, .github*, .gitlab*, .gitpod*, .huskyrc*, .jslint*, .lintstagedrc*, .markdownlint*, .mocha*, .node-version, .nodemon*, .npm*, .nvmrc, .pm2*, .pnp.*, .pnpm*, .prettier*, .releaserc*, .sentry*, .stackblitz*, .styleci*, .stylelint*, .tazerc*, .textlint*, .tool-versions, .travis*, .vscode*, .watchman*, .xo-config*, .yamllint*, .yarnrc*, api-extractor.json, appveyor*, ava.config.*, azure-pipelines*, bower.json, build.config.*, commitlint*, crowdin*, cypress.json, dangerfile*, dprint.json, firebase.json, grunt*, gulp*, jasmine.*, jenkins*, jest.config.*, jsconfig.*, karma*, lerna*, lint-staged*, nest-cli.*, netlify*, nodemon*, nx.*, package-lock.json, playwright.config.*, pm2.*, pnpm*, prettier*, pullapprove*, puppeteer.config.*, renovate*, rollup.config.*, stylelint*, tsconfig.*, tsdoc.*, tslint*, tsup.config.*, turbo*, typedoc*, vercel*, vetur.config.*, vitest.config.*, webpack.config.*, workspace.json, xo.config.*, yarn*",
    "rush.json": ".browserslist*, .circleci*, .codecov, .commitlint*, .editorconfig, .eslint*, .firebase*, .flowconfig, .github*, .gitlab*, .gitpod*, .huskyrc*, .jslint*, .lintstagedrc*, .markdownlint*, .mocha*, .node-version, .nodemon*, .npm*, .nvmrc, .pm2*, .pnp.*, .pnpm*, .prettier*, .releaserc*, .sentry*, .stackblitz*, .styleci*, .stylelint*, .tazerc*, .textlint*, .tool-versions, .travis*, .vscode*, .watchman*, .xo-config*, .yamllint*, .yarnrc*, api-extractor.json, appveyor*, ava.config.*, azure-pipelines*, bower.json, build.config.*, commitlint*, crowdin*, cypress.json, dangerfile*, dprint.json, firebase.json, grunt*, gulp*, jasmine.*, jenkins*, jest.config.*, jsconfig.*, karma*, lerna*, lint-staged*, nest-cli.*, netlify*, nodemon*, nx.*, package-lock.json, playwright.config.*, pm2.*, pnpm*, prettier*, pullapprove*, puppeteer.config.*, renovate*, rollup.config.*, stylelint*, tsconfig.*, tsdoc.*, tslint*, tsup.config.*, turbo*, typedoc*, vercel*, vetur.config.*, vitest.config.*, webpack.config.*, workspace.json, xo.config.*, yarn*",
    "readme.*": "authors, backers.md, changelog*, citation*, code_of_conduct.md, codeowners, contributing.md, contributors, copying, credits, governance.md, history.md, license*, maintainers, readme*, security.md, sponsors.md",
    "cargo.toml": ".clippy.toml, .rustfmt.toml, cargo.lock, clippy.toml, cross.toml, rust-toolchain.toml, rustfmt.toml",
    "gemfile": ".ruby-version, gemfile.lock",
    "composer.json": "composer.lock, phpunit.xml*, psalm*.xml",
    "vite.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .htmlnanorc*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, cssnano.config.*, cypress.json, env.d.ts, htmlnanorc.*, index.html, jasmine.*, jest.config.*, jsconfig.*, karma*, playwright.config.*, postcss.config.*, puppeteer.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, unocss.config.*, vitest.config.*, webpack.config.*, windi.config.*",
    "vue.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .htmlnanorc*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, cssnano.config.*, cypress.json, env.d.ts, htmlnanorc.*, jasmine.*, jest.config.*, jsconfig.*, karma*, playwright.config.*, postcss.config.*, puppeteer.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, unocss.config.*, vitest.config.*, webpack.config.*, windi.config.*",
    "nuxt.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .htmlnanorc*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, cssnano.config.*, cypress.json, env.d.ts, htmlnanorc.*, jasmine.*, jest.config.*, jsconfig.*, karma*, playwright.config.*, postcss.config.*, puppeteer.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, unocss.config.*, vitest.config.*, webpack.config.*, windi.config.*",
    "next.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .htmlnanorc*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, cssnano.config.*, cypress.json, env.d.ts, htmlnanorc.*, jasmine.*, jest.config.*, jsconfig.*, karma*, next-env.d.ts, playwright.config.*, postcss.config.*, puppeteer.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, unocss.config.*, vitest.config.*, webpack.config.*, windi.config.*",
    "svelte.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .htmlnanorc*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, cssnano.config.*, cypress.json, env.d.ts, htmlnanorc.*, jasmine.*, jest.config.*, jsconfig.*, karma*, mdsvex.config.js, playwright.config.*, postcss.config.*, puppeteer.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, unocss.config.*, vitest.config.*, webpack.config.*, windi.config.*",
    "remix.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .htmlnanorc*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, cssnano.config.*, cypress.json, env.d.ts, htmlnanorc.*, jasmine.*, jest.config.*, jsconfig.*, karma*, playwright.config.*, postcss.config.*, puppeteer.config.*, remix.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, unocss.config.*, vitest.config.*, webpack.config.*, windi.config.*"
  },
  "[typescript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  }
}
```

```json
// extension
Jun Han.Auto Rename Tag
Christian Kohler.Path Intellisense
Alessandro Fragnani.Project Manager
Anthony Fu.Browse Lite
Anthony Fu.Carbon Product Icons
Equinusocio.Community Material Theme
Microsoft.ESLint
Microsoft.TSLint
Pine Wu.Vetur
Anthony Fu.Vite
Johnson Chu.Volar
file-icons.file-icons
GitKraken.GitLens
Yiyi Wang.Markdown Preview Enhanced
WakaTime.WakaTime
```