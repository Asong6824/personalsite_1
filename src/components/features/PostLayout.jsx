// src/components/features/PostLayout.jsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { MDXRemote } from 'next-mdx-remote/rsc';

// 导入 remark/rehype 插件
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrismPlus from 'rehype-prism-plus';

export default function PostLayout({ 
    post, 
    channelKey, 
    columnKey, 
    channelConfig, 
    columnConfig, 
    relatedPosts = [] 
}) {
    const { frontmatter, content } = post;
    
    // 检查是否为技术频道
    const isTechChannel = channelKey === 'tech';

    // MDX 组件配置
    const mdxComponents = {
        img: ({ src, alt, ...props }) => (
            <span className="block my-8 rounded-lg overflow-hidden">
                <Image
                    src={src}
                    alt={alt || ''}
                    width={800}
                    height={400}
                    className="w-full h-auto"
                    {...props}
                />
            </span>
        ),
        a: ({ href, children, ...props }) => (
            <Link href={href || '#'} className="text-primary hover:underline" {...props}>
                {children}
            </Link>
        ),
        h2: ({ children, ...props }) => (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4" {...props}>
                {children}
            </h2>
        ),
        h3: ({ children, ...props }) => (
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3" {...props}>
                {children}
            </h3>
        ),
        pre: ({ children, ...props }) => (
            <pre className="!bg-[#1e1e1e] !text-[#d4d4d4] rounded-md p-4 overflow-x-auto my-6 border border-[#3c3c3c] font-mono text-sm leading-relaxed [&_*]:!text-[#d4d4d4] [&_.token.keyword]:!text-[#569cd6] [&_.token.string]:!text-[#ce9178] [&_.token.comment]:!text-[#6a9955] [&_.token.function]:!text-[#dcdcaa] [&_.token.number]:!text-[#b5cea8] [&_.token.operator]:!text-[#d4d4d4] [&_.token.punctuation]:!text-[#d4d4d4]" {...props}>
                {children}
            </pre>
        ),
        code: ({ children, className, ...props }) => {
            const isInline = !className;
            if (isInline) {
                return (
                    <code className="bg-[#f3f3f3] dark:bg-[#2d2d30] text-[#e01e5a] dark:text-[#ce9178] px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                    </code>
                );
            }
            return (
                <code className={`${className} !text-inherit`} {...props}>
                    {children}
                </code>
            );
        },
    };

    // MDX 选项配置
    const mdxOptions = {
        mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                rehypePrismPlus,
            ],
        },
    };

    return (
        <div 
            className="min-h-screen" 
            style={isTechChannel ? { backgroundColor: '#f8f1ee' } : {}}
            {...(isTechChannel && { 'data-tech-page': true })}
        >
            <div className="container mx-auto px-4 pt-16 pb-8 md:py-12">
            {/* 面包屑导航 */}
            <nav className="mb-8 text-sm text-gray-500 dark:text-gray-400">
                <Link href="/" className="transition-colors" style={{ color: '#6b7280' }} onMouseEnter={(e) => e.target.style.color = '#eaddd7'} onMouseLeave={(e) => e.target.style.color = '#6b7280'}>首页</Link>
                <span className="mx-2">{'>'}</span>
                <Link href="/blog" className="transition-colors" style={{ color: '#6b7280' }} onMouseEnter={(e) => e.target.style.color = '#eaddd7'} onMouseLeave={(e) => e.target.style.color = '#6b7280'}>博客</Link>
                <span className="mx-2">{'>'}</span>
                <Link href={`/blog/${channelKey}`} className="transition-colors" style={{ color: '#6b7280' }} onMouseEnter={(e) => e.target.style.color = '#eaddd7'} onMouseLeave={(e) => e.target.style.color = '#6b7280'}>{channelConfig.name}</Link>
                <span className="mx-2">{'>'}</span>
                <Link href={`/blog/${channelKey}/${columnKey}`} className="transition-colors" style={{ color: '#6b7280' }} onMouseEnter={(e) => e.target.style.color = '#eaddd7'} onMouseLeave={(e) => e.target.style.color = '#6b7280'}>{columnConfig.name}</Link>
                <span className="mx-2">{'>'}</span>
                <span style={{ color: '#eaddd7' }}>{frontmatter.title}</span>
            </nav>

            <div className="max-w-4xl mx-auto">
                {/* 文章头部 */}
                <header className="mb-12 text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        {frontmatter.title}
                    </h1>
                    
                    {frontmatter.excerpt && (
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                            {frontmatter.excerpt}
                        </p>
                    )}
                    
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8">
                        {frontmatter.date && (
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {format(parseISO(frontmatter.date), 'yyyy年MM月dd日', { locale: zhCN })}
                            </span>
                        )}
                        
                        {frontmatter.author && (
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {frontmatter.author}
                            </span>
                        )}
                    </div>
                    
                    {frontmatter.tags && frontmatter.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                            {frontmatter.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                    
                    {frontmatter.coverImage && (
                        <div className="rounded-2xl overflow-hidden shadow-lg">
                            <Image
                                src={frontmatter.coverImage}
                                alt={frontmatter.title}
                                width={800}
                                height={400}
                                className="w-full h-auto"
                                priority
                            />
                        </div>
                    )}
                </header>

                {/* 文章内容 */}
                <article className="prose prose-lg dark:prose-invert max-w-none mb-12">
                    <MDXRemote source={content} components={mdxComponents} options={mdxOptions} />
                </article>

                {/* 相关文章 */}
                {relatedPosts.length > 0 && (
                    <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                            相关文章
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {relatedPosts.map((relatedPost) => (
                                <Link 
                                    key={relatedPost.slug} 
                                    href={`/blog/${channelKey}/${columnKey}/${relatedPost.slug}`}
                                    className="group"
                                >
                                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors mb-2 line-clamp-2">
                                            {relatedPost.title}
                                        </h3>
                                        {relatedPost.excerpt && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
                                                {relatedPost.excerpt}
                                            </p>
                                        )}
                                        {relatedPost.date && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {format(parseISO(relatedPost.date), 'yyyy年MM月dd日', { locale: zhCN })}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}  
            </div>
            </div>
        </div>
    );
}