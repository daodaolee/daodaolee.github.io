import type { UserConfig } from 'vitepress'
import baseConfig from 'vitepress-theme-minimalist/config'
console.log(baseConfig)
const config: UserConfig = {
  extends: baseConfig,
  title: 'Minimalist',
  markdown: {
    theme: {
      dark: 'vitesse-dark',
      light: 'vitesse-light'
    }
  },
  base: '/vitepress-theme-minimalist',
  // base: '/',
  themeConfig: {
    logo: '/avatar.png',
    lastestPage: [{
      text: 'git',
      link: '/posts/git',
      date: '10-24'
    }, {
      text: 'async',
      link: '/posts/async',
      date: '02-01'
    }, {
      text: 'chrome_workflow',
      link: '/posts/chrome_workflow',
      date: '02-01'
    }, {
      text: 'test',
      link: '/posts/test',
      date: '02-01'
    }],
    // all posts
    posts: [{
      year: '2022',
      post: [{
        text: 'webpack_core',
        link: '/posts/webpack_core',
        date: '03-23'
      }, {
        text: 'vscode_setting',
        link: '/posts/vscode_setting',
        date: '03-19'
      }, {
        text: 'refactor_js',
        link: '/posts/refactor_js',
        date: '03-01'
      }]
    }, {
      year: '2021',
      post: [{
        text: 'vuepress_plugin_awesome_musicplayer',
        link: '/posts/vuepress_plugin_awesome_musicplayer',
        date: '12-26'
      }, {
        text: 'render_on_the_web',
        link: '/posts/render_on_the_web',
        date: '12-13'
      }, {
        text: 'chrome_workflow',
        link: '/posts/chrome_workflow',
        date: '12-08'
      }, {
        text: 'git',
        link: '/posts/git',
        date: '10-24'
      }, {
        text: 'restudy_function',
        link: '/posts/restudy_function',
        date: '02-23'
      }, {
        text: 'restudy_obj',
        link: '/posts/restudy_obj',
        date: '02-22'
      }, {
        text: 'csp',
        link: '/posts/csp',
        date: '02-19'
      }, {
        text: 'restudy_scope',
        link: '/posts/restudy_scope',
        date: '02-06'
      }, {
        text: 'async',
        link: '/posts/async',
        date: '02-01'
      }, {
        text: 'eventloop',
        link: '/posts/eventloop',
        date: '01-31'
      }]
    }, {
      year: '2019',
      post: [{
        text: 'http_option',
        link: '/posts/http_option',
        date: ' 06-24'
      }, {
        text: 'form',
        link: '/posts/form',
        date: '01-23'
      }]
    }]
  }
}
export default config
