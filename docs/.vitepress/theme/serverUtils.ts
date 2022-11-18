import globby from 'globby'
import matter from 'gray-matter'
// @ts-expect-error igonre fs-extra
import fs from 'fs-extra'

export async function getPosts() {
  const paths = await getPostMDFilePaths()
  const posts = await Promise.all(
    paths.map(async (item) => {
      const content = await fs.readFile(item, 'utf-8')
      const { data } = matter(content)
      data.date = _convertDate(data.date)
      return {
        frontMatter: data,
        regularPath: `/${item.slice(5).replace('.md', '.html')}`
      }
    })
  )
  posts.sort(_compareDate)
  return posts
}

function _convertDate(date = new Date().toString()) {
  const json_date = new Date(date).toJSON()
  return json_date.split('T')[0]
}

function _compareDate(obj1: any, obj2: any) {
  return obj1.frontMatter.date < obj2.frontMatter.date ? 1 : -1
}

async function getPostMDFilePaths() {
  const paths = await globby(['docs/posts/**.md'], {
    ignore: ['node_modules', 'README.md']
  })
  return paths
}
