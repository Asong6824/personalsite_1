// src/components/features/ColumnLayout.jsx
"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function ColumnLayout({ channelKey, channelConfig, columnKey, columnConfig, posts }) {
    // 检查是否为技术频道
    const isTechChannel = channelKey === 'tech';
    

    
    return (
        <div 
            className="min-h-screen" 
            style={isTechChannel ? { backgroundColor: '#f8f1ee' } : {}}
            {...(isTechChannel && { 'data-tech-page': true })}
        >
            <div className="container mx-auto px-4 pt-24 pb-8 md:pt-28 md:pb-12">
            {/* 专栏标题 */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <div className="flex items-center justify-center gap-3 mb-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                        {columnConfig.name}
                    </h1>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {columnConfig.description}
                </p>
                
                {/* 面包屑导航 */}
                <nav className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                    <Link href="/" className="transition-colors" style={{ color: '#6b7280' }} onMouseEnter={(e) => e.target.style.color = '#8b5a3c'} onMouseLeave={(e) => e.target.style.color = '#6b7280'}>首页</Link>
                    <span className="mx-2">{'>'}</span>
                    <Link href="/blog" className="transition-colors" style={{ color: '#6b7280' }} onMouseEnter={(e) => e.target.style.color = '#8b5a3c'} onMouseLeave={(e) => e.target.style.color = '#6b7280'}>博客</Link>
                    <span className="mx-2">{'>'}</span>
                    <Link href={`/blog/${channelKey}`} className="transition-colors" style={{'color': '#6b7280'}} onMouseEnter={(e) => e.target.style.color = '#8b5a3c'} onMouseLeave={(e) => e.target.style.color = '#6b7280'}>{channelConfig.name}</Link>
                    <span className="mx-2">{'>'}</span>
                    <span style={{ color: '#8b5a3c' }}>{columnConfig.name}</span>
                </nav>
                
                {/* 文章统计 */}
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    共 {posts.length} 篇文章
                </div>
                

            </motion.div>

            {/* 文章列表 */}
            {posts.length > 0 ? (
                <div className="max-w-4xl mx-auto">
                    <div className="grid gap-6">
                        {posts.map((post, index) => (
                            <motion.article
                                key={post.slug}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className="group"
                            >
                                <Link href={`/blog/${channelKey}/${columnKey}/${post.slug}`}>
                                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:shadow-lg" style={{ '--hover-shadow-color': '#8b5a3c' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(139, 90, 60, 0.15), 0 4px 6px -2px rgba(139, 90, 60, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = ''}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white transition-colors mb-3 line-clamp-2" style={{ color: 'inherit' }} onMouseEnter={(e) => e.target.style.color = '#8b5a3c'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>
                                                    {post.title}
                                                </h2>
                                                
                                                {post.excerpt && (
                                                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                                        {post.excerpt}
                                                    </p>
                                                )}
                                                
                                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {post.date ? format(parseISO(post.date), 'yyyy年MM月dd日', { locale: zhCN }) : '未知日期'}
                                                    </span>
                                                    
                                                    {post.author && (
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            {post.author}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                {post.tags && post.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-4">
                                                        {post.tags.slice(0, 4).map(tag => (
                                                            <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                        {post.tags.length > 4 && (
                                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded text-xs">
                                                                +{post.tags.length - 4}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* 置顶标识和箭头 */}
                                            <div className="flex flex-col items-end gap-2">
                                                {post.pinned && (
                                                    <span className="inline-flex items-center px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded">
                                                        📌 置顶
                                                    </span>
                                                )}
                                                <svg className="w-6 h-6 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}  
                    </div>
                </div>
            ) : (
                /* 空状态 */
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        暂无文章
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        该专栏下暂时还没有文章，敬请期待！
                    </p>
                    <Link
                        href={`/blog/${channelKey}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        返回{channelConfig.name}频道
                    </Link>
                </motion.div>
            )}
            </div>
        </div>
    );
}