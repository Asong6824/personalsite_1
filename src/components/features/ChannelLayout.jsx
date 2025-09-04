// src/components/features/ChannelLayout.jsx
"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { getColumnByTags } from '@/lib/channels';

export default function ChannelLayout({ channelKey, channelConfig, posts }) {
    // 按专栏分组文章
    const postsByColumn = React.useMemo(() => {
        const grouped = {};
        
        posts.forEach(post => {
            const column = getColumnByTags(post);
            if (column && column.channelKey === channelKey) {
                const columnKey = column.columnKey;
                if (!grouped[columnKey]) {
                    grouped[columnKey] = {
                        config: channelConfig.columns[columnKey],
                        posts: []
                    };
                }
                grouped[columnKey].posts.push(post);
            }
        });
        
        return grouped;
    }, [posts, channelKey, channelConfig]);

    return (
        <div className="container mx-auto px-4 pt-16 pb-8 md:py-12">
            {/* 频道标题 */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-4xl">{channelConfig.icon}</span>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                        {channelConfig.name}
                    </h1>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {channelConfig.description}
                </p>
                
                {/* 面包屑导航 */}
                <nav className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/" className="transition-colors" style={{ color: '#6b7280' }} onMouseEnter={(e) => e.target.style.color = '#eaddd7'} onMouseLeave={(e) => e.target.style.color = '#6b7280'}>首页</Link>
                    <span className="mx-2">{'>'}</span>
                    <Link href="/blog" className="transition-colors" style={{ color: '#6b7280' }} onMouseEnter={(e) => e.target.style.color = '#eaddd7'} onMouseLeave={(e) => e.target.style.color = '#6b7280'}>博客</Link>
                    <span className="mx-2">{'>'}</span>
                    <span style={{ color: '#eaddd7' }}>{channelConfig.name}</span>
                </nav>
            </motion.div>

            {/* 专栏列表 */}
            <div className="space-y-12">
                {Object.entries(postsByColumn).map(([columnKey, { config, posts: columnPosts }], index) => (
                    <motion.section
                        key={columnKey}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
                    >
                        {/* 专栏标题 */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {config.name}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {config.description}
                                </p>
                            </div>
                            <Link
                                href={`/blog/${channelKey}/${columnKey}`}
                                className="px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                                style={{ 
                                    backgroundColor: 'rgba(234, 221, 215, 0.1)', 
                                    color: '#eaddd7' 
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'rgba(234, 221, 215, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'rgba(234, 221, 215, 0.1)';
                                }}
                            >
                                查看全部 →
                            </Link>
                        </div>

                        {/* 文章列表 */}
                        <div className="grid gap-4 md:gap-6">
                            {columnPosts.slice(0, 3).map((post, postIndex) => (
                                <motion.article
                                    key={post.slug}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (index * 0.1) + (postIndex * 0.05), duration: 0.4 }}
                                    className="group"
                                >
                                    <Link href={`/blog/${channelKey}/${columnKey}/${post.slug}`}>
                                        <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            {/* 文章信息 */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors line-clamp-2" onMouseEnter={(e) => e.target.style.color = '#eaddd7'} onMouseLeave={(e) => e.target.style.color = ''}>
                                                    {post.title}
                                                </h3>
                                                {post.excerpt && (
                                                    <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                                        {post.excerpt}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                                                    <span>
                                                        {post.date ? format(parseISO(post.date), 'yyyy年MM月dd日', { locale: zhCN }) : '未知日期'}
                                                    </span>
                                                    {post.tags && (
                                                        <div className="flex gap-2">
                                                            {post.tags.slice(0, 2).map(tag => (
                                                                <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* 置顶标识 */}
                                            {post.pinned && (
                                                <div className="flex-shrink-0">
                                                    <span className="inline-flex items-center px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded">
                                                        📌 置顶
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </motion.article>
                            ))}
                        </div>
                        
                        {columnPosts.length > 3 && (
                            <div className="mt-6 text-center">
                                <Link
                                    href={`/blog/${channelKey}/${columnKey}`}
                                    className="inline-flex items-center gap-2 transition-colors font-medium"
                                    style={{ color: '#eaddd7' }}
                                    onMouseEnter={(e) => e.target.style.color = 'rgba(234, 221, 215, 0.8)'}
                                    onMouseLeave={(e) => e.target.style.color = '#eaddd7'}
                                >
                                    查看更多 {columnPosts.length - 3} 篇文章
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </motion.section>
                ))}
            </div>
            
            {/* 如果没有文章 */}
            {Object.keys(postsByColumn).length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        暂无内容
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        该频道下暂时还没有文章，敬请期待！
                    </p>
                </motion.div>
            )}
        </div>
    );
}