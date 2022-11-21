import baseConfig from 'minimalist/config'
import { getPosts } from './theme/serverUtils'

async function config() {
  return {
    extends: baseConfig,
    title: 'DaoDaoLee',
    titleTemplate: false,
    appearance: false,
    markdown: {
      theme: {
        dark: 'vitesse-dark',
        light: 'vitesse-light'
      }
    },
    // base: '/vitepress-theme-minimalist',
    base: '/',
    themeConfig: {
      logoDark: '/logo-white.webp',
      logo: '/logo-black.webp',
      // all posts
      posts: await getPosts(),
      // movies
      movies: [{
        date: '2022',
        movie: [{
          title: '海边的曼彻斯特',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16689602727211668960272691.png',
          link: 'https://movie.douban.com/subject/25980443/'
        }, {
          title: '天鹅挽歌',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16689602727211668960272691.png',
          link: 'https://movie.douban.com/subject/35258381/'
        }, {
          title: '军舰岛',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687854268751668785426018.png',
          link: 'https://movie.douban.com/subject/21324900/'
        }, {
          title: '你眼中的世界',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687853818781668785381324.png',
          link: 'https://movie.douban.com/subject/10549480/'
        }, {
          title: '降临',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687852648821668785264401.png',
          link: 'https://movie.douban.com/subject/21324900/'
        }, {
          title: '湮灭',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687854868771668785486580.png',
          link: 'https://movie.douban.com/subject/26384741/'
        }, {
          title: '隐入尘烟',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687854999141668785499890.png',
          link: 'https://movie.douban.com/subject/35131346/'
        }, {
          title: '赛博朋克：边缘行者',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687855188721668785518401.png',
          link: 'https://movie.douban.com/subject/35118256/'
        }, {
          title: '神探大战',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687855378711668785537826.png',
          link: 'https://movie.douban.com/subject/26995893/'
        }, {
          title: '漫长的告白',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687855578701668785557222.png',
          link: 'https://movie.douban.com/subject/34929859/'
        }, {
          title: '神偷奶爸前传',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687855728771668785572559.png',
          link: 'https://movie.douban.com/subject/26642033/'
        }, {
          title: '阿丽塔：战斗天使',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687855878791668785587747.png',
          link: 'https://movie.douban.com/subject/1652592/'
        }, {
          title: '沙丘',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687856048831668785604300.png',
          link: 'https://movie.douban.com/subject/3001114/'
        }, {
          title: '2077日本锁国',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687856178791668785617763.png',
          link: 'https://movie.douban.com/subject/2035642/'
        }, {
          title: '我的樱花恋人',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687856378781668785637201.png',
          link: 'https://movie.douban.com/subject/35390650/'
        }, {
          title: '狙击手',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687856518771668785651494.png',
          link: 'https://movie.douban.com/subject/35215390/'
        }, {
          title: '花束般的恋爱',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687856668771668785665961.png',
          link: 'https://movie.douban.com/subject/34874432/'
        }, {
          title: '我们都无法成为大人',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687856808761668785680844.png',
          link: 'https://movie.douban.com/subject/35259430/'
        }, {
          title: '7号房的礼物',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687856938761668785693343.png',
          link: 'https://movie.douban.com/subject/10777687/'
        }, {
          title: '长津湖之水门桥',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687857108761668785710482.png',
          link: 'https://movie.douban.com/subject/35613853/'
        }, {
          title: '长津湖',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687857258771668785725703.png',
          link: 'https://movie.douban.com/subject/25845392/'
        }, {
          title: '起跑线',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687857378751668785737782.png',
          link: 'https://movie.douban.com/subject/26942631/'
        }, {
          title: '白日梦想家',
          photo: 'https://fastly.jsdelivr.net/gh/daodaolee/photobed@main/img/16687857518731668785751116.png',
          link: 'https://movie.douban.com/subject/2133323/'
        }] 
      }]
    }
  }
}
module.exports = config()
