// app/blog/page.jsx
export const metadata = {
    title: '博客 | 阿松的个人网站',
    description: '欢迎来到我的博客页面。',
};

export default function BlogIndexPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                        我的博客
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 mb-12">
                        欢迎来到我的个人博客，这里分享我的技术学习、生活感悟和思考。
                    </p>
                    
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-12">
                        <h2 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
                            关于这个博客
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            这里是我记录学习历程、分享技术心得和生活感悟的地方。
                            我会在这里分享编程技术、项目经验、学习笔记以及一些个人思考。
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                            <div className="text-3xl mb-4">💻</div>
                            <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">技术分享</h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm">
                                编程技术、开发经验和项目实践
                            </p>
                        </div>
                        
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                            <div className="text-3xl mb-4">📚</div>
                            <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">学习笔记</h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm">
                                学习过程中的总结和思考记录
                            </p>
                        </div>
                        
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                            <div className="text-3xl mb-4">🌱</div>
                            <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">生活感悟</h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm">
                                日常生活中的思考和感悟分享
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}