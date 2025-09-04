// lib/posts.js
import fs from 'fs'; // Node.js 文件系统模块
import path from 'path'; // Node.js 路径模块
import matter from 'gray-matter'; // 解析 Markdown/MDX frontmatter
import { withCache } from './cache';

// 定义博客文章存放的目录 (项目根目录下的 _posts 文件夹)
const postsDirectory = path.join(process.cwd(), 'content/blog');

/**
 * 获取所有博文的元数据，并按日期降序排序（原始函数，不缓存）。
 * @returns {Array<Object>} 博文元数据数组，每个对象包含 slug 和 frontmatter 中的所有数据。
 */
function _getSortedPostsData() {
    // 读取 _posts 目录下的所有文件名
    let fileNames;
    try {
        fileNames = fs.readdirSync(postsDirectory);
    } catch (err) {
        // 如果 _posts 目录不存在，则返回空数组或抛出更具体的错误
        console.warn("'_posts' directory not found. Returning empty array for posts.", err);
        return [];
    }

    const allPostsData = fileNames
        .filter(fileName => /\.(mdx|md)$/.test(fileName)) // 只处理 .mdx 或 .md 文件
        .map(fileName => {
            // 从文件名移除 ".mdx" 或 ".md" 后缀以得到 slug
            const slug = fileName.replace(/\.(mdx|md)$/, '');

            // 构建完整的文件路径
            const fullPath = path.join(postsDirectory, fileName);
            // 读取文件内容
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            // 使用 gray-matter 解析博文的元数据 (frontmatter)
            const matterResult = matter(fileContents);

            // 组合数据
            return {
                slug,
                ...(matterResult.data), // frontmatter 中的所有数据 (title, date, excerpt, etc.)
            };
        });

    // 按置顶状态和日期排序：置顶文章优先，然后按日期降序排序
    return allPostsData.sort((a, b) => {
        // 首先按置顶状态排序（置顶文章在前）
        const aPinned = a.pinned || false;
        const bPinned = b.pinned || false;
        
        if (aPinned && !bPinned) {
            return -1; // a 置顶，b 不置顶，a 在前
        } else if (!aPinned && bPinned) {
            return 1;  // b 置顶，a 不置顶，b 在前
        } else {
            // 都置顶或都不置顶时，按日期降序排序
            if (new Date(a.date) < new Date(b.date)) {
                return 1;
            } else if (new Date(a.date) > new Date(b.date)) {
                return -1;
            } else {
                return 0;
            }
        }
    });
}

/**
 * 获取所有博文的元数据，并按日期降序排序（带缓存）。
 * @returns {Array<Object>} 博文元数据数组，每个对象包含 slug 和 frontmatter 中的所有数据。
 */
export const getSortedPostsData = withCache(_getSortedPostsData, 'sorted-posts-data', 10 * 60 * 1000); // 10分钟缓存

// 移除了 getAllPostSlugs 函数，不再需要动态路由支持

// 移除了 getPostData 相关函数，不再需要单篇文章获取功能

// 移除了所有动态路由相关的函数，包括频道和专栏过滤功能