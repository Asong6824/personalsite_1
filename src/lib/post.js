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

/**
 * 获取所有博文的 slug 列表。
 * 这主要用于 Next.js 的 generateStaticParams 函数，以便在构建时生成动态路由。
 * @returns {Array<{ slug: string }>} slug 对象数组。
 */
export function getAllPostSlugs() {
    let fileNames;
    try {
        fileNames = fs.readdirSync(postsDirectory);
    } catch (err) {
        return []; // 如果目录不存在，返回空数组
    }

    return fileNames
        .filter(fileName => /\.(mdx|md)$/.test(fileName))
        .map(fileName => {
            return {
                slug: fileName.replace(/\.(mdx|md)$/, ''),
            };
        });
}

/**
 * 根据 slug 获取单篇博文的完整数据，包括 frontmatter 和 MDX 内容（原始函数，不缓存）。
 * @param {string} slug - 博文的 slug (不含文件扩展名)。
 * @returns {Promise<Object|null>} 包含 slug, frontmatter 和 content 的对象，如果找不到则返回 null。
 * 注意：虽然内部使用了同步的 fs 操作，但通常在 Next.js 的 async Server Components 或 generateMetadata 中调用，
 * 保持其为普通函数即可，调用方会用 await (如果调用它的函数是 async)。
 * 如果未来有异步操作（如数据库查询），此函数可改为 async。
 */
function _getPostData(slug) {
    const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
    const mdPath = path.join(postsDirectory, `${slug}.md`);

    let fullPath;
    if (fs.existsSync(mdxPath)) {
        fullPath = mdxPath;
    } else if (fs.existsSync(mdPath)) {
        fullPath = mdPath;
    } else {
        // 如果 .mdx 和 .md 文件都不存在
        console.warn(`Post with slug "${slug}" not found in "${postsDirectory}". Looked for .mdx and .md.`);
        return null;
    }

    try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // 使用 gray-matter 解析 frontmatter 和主要内容
        const { data, content } = matter(fileContents);

        return {
            slug,
            frontmatter: data, // 博文元数据
            content,          // MDX/Markdown 正文内容 (字符串)
        };
    } catch (error) {
        console.error(`Error reading or parsing post with slug "${slug}":`, error);
        return null;
    }
}

/**
 * 根据 slug 获取单篇博文的完整数据，包括 frontmatter 和 MDX 内容（带缓存）。
 * @param {string} slug - 博文的 slug (不含文件扩展名)。
 * @returns {Promise<Object|null>} 包含 slug, frontmatter 和 content 的对象，如果找不到则返回 null。
 */
export const getPostData = withCache(_getPostData, 'post-data', 15 * 60 * 1000); // 15分钟缓存

// 导入频道配置
import { getChannelByTags, getColumnByTags, CHANNELS_CONFIG } from './channels';


/**
 * 根据频道获取文章（原始函数，不缓存）
 * @param {string} channelKey - 频道key
 * @returns {Array} 文章数组
 */
function _getPostsByChannel(channelKey) {
    const allPosts = getSortedPostsData();
    if (!channelKey) return allPosts;
    
    return allPosts.filter(post => {
        const channel = getChannelByTags(post);
        return channel === channelKey;
    });
}

/**
 * 根据频道获取文章（带缓存）
 * @param {string} channelKey - 频道key
 * @returns {Array} 文章数组
 */
export const getPostsByChannel = withCache(_getPostsByChannel, 'posts-by-channel', 8 * 60 * 1000); // 8分钟缓存

/**
 * 根据专栏获取文章（原始函数，不缓存）
 * @param {string} channelKey - 频道key
 * @param {string} columnKey - 专栏key
 * @returns {Array} 文章数组
 */
function _getPostsByColumn(channelKey, columnKey) {
    const allPosts = getSortedPostsData();
    if (!channelKey || !columnKey) return allPosts;
    
    return allPosts.filter(post => {
        const column = getColumnByTags(post);
        return column && column.channelKey === channelKey && column.columnKey === columnKey;
    });
}

/**
 * 根据专栏获取文章（带缓存）
 * @param {string} channelKey - 频道key
 * @param {string} columnKey - 专栏key
 * @returns {Array} 文章数组
 */
export const getPostsByColumn = withCache(_getPostsByColumn, 'posts-by-column', 8 * 60 * 1000); // 8分钟缓存

export function getAllUniqueTags() {
    const allPosts = getSortedPostsData();
    const tagSet = new Set();
    allPosts.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => {
                if (tag && typeof tag === 'string') { // 确保标签存在且为字符串
                    tagSet.add(tag.trim()); // 可以转换为小写并去除首尾空格以统一
                }
            });
        }
    });
    return Array.from(tagSet).sort(); // 返回排序后的唯一标签数组
}