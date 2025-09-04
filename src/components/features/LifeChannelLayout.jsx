// src/components/features/LifeChannelLayout.jsx
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import { motion } from 'framer-motion'; // 已移除动画效果
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { getColumnByTags } from '@/lib/channels';

export default function LifeChannelLayout({ channelKey, channelConfig, posts }) {
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

    // 获取精选博文（最多6篇）
    const featuredPosts = posts.slice(0, 6);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
                {/* 背景图片 */}
                <div className="absolute inset-0">
                    <div 
                        className="w-full h-full bg-cover bg-center bg-no-repeat opacity-90"
                        style={{
                            backgroundImage: 'url("https://blog-assets-asong.tos-cn-beijing.volces.com/travel/izu/xiuqiu_cover_4-3.jpg")',
                            backgroundColor: '#0ABAB5'
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30"></div>
                </div>
                
                {/* 中心文字 */}
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                        从世界来 到世界去
                    </h1>
                    <p className="text-xl md:text-2xl text-white/95 drop-shadow-md">
                        记录旅行足迹，分享生活感悟
                    </p>
                </div>
            </section>

            {/* 精选专栏 */}
            <section className="py-12 md:py-24 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-4xl font-bold text-[#0ABAB5] dark:text-white mb-3 md:mb-4">
                            精选专栏
                        </h2>
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
                            深度探索生活的各个维度
                        </p>
                    </div>

                    <div className="space-y-6">
                        {Object.entries(postsByColumn).map(([columnKey, { config, posts: columnPosts }], index) => (
                            <div
                                key={columnKey}
                                className="bg-teal-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-[#0ABAB5] transition-colors duration-300"
                            >
                                <div className="flex flex-col md:flex-row h-auto md:h-64">
                                    {/* 左侧图片 */}
                                    <div className="w-full md:w-1/2 h-64 md:h-full relative overflow-hidden">
                                        {config.cover ? (
                                            <Image
                                                src={config.cover}
                                                alt={config.name || '专栏封面'}
                                                fill
                                                style={{objectFit: 'cover'}}
                                                className="transition-transform duration-300 hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <span className="text-gray-400">专栏首图占位 (16:9)</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* 右侧内容 */}
                                    <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                                            {config.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                            {config.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                {columnPosts.length} 篇文章
                                            </span>
                                            <Link
                                                href={`/blog/${channelKey}/${columnKey}`}
                                                className="inline-flex items-center px-4 py-2 bg-[#0ABAB5] text-white rounded-lg hover:bg-[#089B96] font-bold transition-colors min-h-[44px] min-w-[44px] justify-center"
                                            >
                                                阅读更多 →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 精选博文 */}
            <section className="py-12 md:py-24 bg-teal-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-4xl font-bold text-[#0ABAB5] dark:text-white mb-3 md:mb-4">
                            精选博文
                        </h2>
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
                            最新的生活感悟与旅行记录
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredPosts.map((post, index) => {
                            const column = getColumnByTags(post);
                            return (
                                <article
                                    key={post.slug}
                                    className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-[#0ABAB5] transition-colors duration-300"
                                >
                                    <Link href={column ? `/blog/${column.channelKey}/${column.columnKey}/${post.slug}` : `/blog/${post.slug}`}>
                                        {/* 文章图片 */}
                                        <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative overflow-hidden">
                                            {post.coverImage ? (
                                                <img
                                                    src={post.coverImage}
                                                    alt={post.title || '文章封面'}
                                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                                />
                                            ) : (
                                                <span className="text-gray-400">文章首图占位 (16:9)</span>
                                            )}
                                        </div>
                                        
                                        {/* 文章内容 */}
                                        <div className="p-4 md:p-6 flex flex-col justify-between min-h-[200px]">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    {post.pinned && (
                                                        <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded">
                                                            置顶
                                                        </span>
                                                    )}
                                                    {column && (
                                                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
                                                            {postsByColumn[column.columnKey]?.config?.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                                                    {post.title}
                                                </h3>
                                                {post.excerpt && (
                                                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
                                                        {post.excerpt}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center justify-between text-xs md:text-sm text-gray-600 dark:text-gray-300">
                                                <span>{post.author || '阿松'}</span>
                                                <time dateTime={post.date}>
                                                    {format(parseISO(post.date), 'yyyy年MM月dd日', { locale: zhCN })}
                                                </time>
                                            </div>
                                        </div>
                                    </Link>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}