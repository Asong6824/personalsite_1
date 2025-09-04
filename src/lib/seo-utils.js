// src/lib/seo-utils.js
// SEO优化工具，生成结构化数据和增强的meta标签

/**
 * 生成网站基础信息
 */
const SITE_CONFIG = {
    name: '阿松的个人网站',
    description: '阿松的个人博客，分享技术、生活和理财心得',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    author: {
        name: '阿松',
        email: 'contact@example.com',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    },
    social: {
        twitter: '@asong',
        github: 'https://github.com/asong'
    }
};

// 移除了频道相关的结构化数据生成函数

// 移除了专栏相关的结构化数据生成函数

// 移除了文章相关的结构化数据生成函数

/**
 * 生成增强的meta标签
 * @param {Object} options - meta标签选项
 * @returns {Object} Next.js metadata对象
 */
export function generateEnhancedMetadata(options) {
    const {
        title,
        description,
        url,
        image,
        type = 'website',
        publishedTime,
        modifiedTime,
        authors,
        tags,
        section
    } = options;
    
    const fullTitle = title.includes(SITE_CONFIG.name) ? title : `${title} | ${SITE_CONFIG.name}`;
    const ogImageUrl = image ? 
        (image.startsWith('http') ? image : `${SITE_CONFIG.url}${image}`) : 
        `${SITE_CONFIG.url}/default-og-image.png`;
    
    return {
        title: fullTitle,
        description,
        keywords: tags?.join(', '),
        authors: authors ? authors.map(author => ({ name: author })) : [{ name: SITE_CONFIG.author.name }],
        creator: SITE_CONFIG.author.name,
        publisher: SITE_CONFIG.author.name,
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: SITE_CONFIG.name,
            images: [{
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: title,
            }],
            locale: 'zh_CN',
            type,
            publishedTime,
            modifiedTime,
            authors: authors || [SITE_CONFIG.author.name],
            section,
            tags
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [ogImageUrl],
            creator: SITE_CONFIG.social.twitter,
        },
        alternates: {
            canonical: url,
        },
        other: {
            'article:author': authors?.join(', ') || SITE_CONFIG.author.name,
            'article:section': section,
            'article:tag': tags?.join(', '),
            'article:published_time': publishedTime,
            'article:modified_time': modifiedTime,
        }
    };
}

/**
 * 生成结构化数据脚本标签
 * @param {Object} structuredData - 结构化数据对象
 * @returns {string} JSON-LD脚本标签
 */
export function generateStructuredDataScript(structuredData) {
    return `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
}

/**
 * 生成网站地图数据
 * @param {Array} posts - 所有文章
 * @param {Object} channelsConfig - 频道配置
 * @returns {Array} 网站地图URL列表
 */
export function generateSitemapData(posts, channelsConfig) {
    const urls = [];
    
    // 添加主页
    urls.push({
        url: SITE_CONFIG.url,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0
    });
    
    // 添加博客首页
    urls.push({
        url: `${SITE_CONFIG.url}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9
    });
    
    // 添加频道页面
    Object.entries(channelsConfig).forEach(([channelKey, channelConfig]) => {
        urls.push({
            url: `${SITE_CONFIG.url}/blog/${channelKey}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8
        });
        
        // 添加专栏页面
        Object.keys(channelConfig.columns || {}).forEach(columnKey => {
            urls.push({
                url: `${SITE_CONFIG.url}/blog/${channelKey}/${columnKey}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7
            });
        });
    });
    
    // 添加文章页面
    posts.forEach(post => {
        urls.push({
            url: `${SITE_CONFIG.url}/blog/${post.slug}`,
            lastModified: post.lastModified ? new Date(post.lastModified) : new Date(post.date),
            changeFrequency: 'monthly',
            priority: 0.6
        });
    });
    
    return urls;
}

export { SITE_CONFIG };