import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Tag, ArrowLeft, ChevronRight } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import AnimatedSection from '../ui/AnimatedSection';
import { SectionHeader, LoadingSpinner } from '../ui/SeverityBadge';
import { BLOG_POSTS_DATA } from '../../lib/data';
import type { BlogPost } from '../../types';

const categories = ['All', 'threat-analysis', 'tutorials', 'soc-operations', 'network-security'];

export function BlogListPage() {
  const [posts] = useState<BlogPost[]>(BLOG_POSTS_DATA);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [search, activeCategory]);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = !search ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCat = activeCategory === 'All' || post.category === activeCategory;
      return matchesSearch && matchesCat && post.published;
    });
  }, [posts, search, activeCategory]);

  return (
    <div className="pt-20 pb-16">
      <section className="py-16">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              title="Cybersecurity Blog"
              subtitle="Articles on threat analysis, security operations, and ethical hacking techniques."
            />
          </AnimatedSection>

          {/* Search & Filter */}
          <div className="max-w-2xl mx-auto mb-10 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="cyber-input pl-11"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all font-medium ${
                    activeCategory === cat
                      ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                      : 'bg-dark-800/50 text-dark-400 border border-dark-700/30 hover:text-white'
                  }`}
                >
                  {cat === 'All' ? 'All' : cat.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-20"><LoadingSpinner /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-dark-400">No posts found.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <AnimatedSection key={post.id} delay={i * 100}>
                  <Link to={`/blog/${post.slug}`} className="block">
                    <div className="cyber-card p-6 h-full flex flex-col group hover:border-neon-blue/50">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 text-[10px] font-mono bg-neon-blue/10 text-neon-blue rounded border border-neon-blue/20">
                          {post.category.replace('-', ' ')}
                        </span>
                        <span className="text-dark-500 text-xs font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold mb-2 group-hover:text-neon-blue transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-dark-400 text-sm mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="flex items-center gap-1 text-dark-500 text-[10px] font-mono">
                            <Tag className="w-2.5 h-2.5" />{tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-neon-blue text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function BlogPostPage() {
  const slug = window.location.pathname.split('/blog/')[1];
  const post = BLOG_POSTS_DATA.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="pt-20 pb-16">
        <div className="section-container py-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Post Not Found</h2>
          <Link to="/blog" className="cyber-btn">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const htmlContent = DOMPurify.sanitize(marked(post.content) as string);

  return (
    <div className="pt-20 pb-16">
      <section className="py-16">
        <div className="section-container max-w-4xl mx-auto">
          <Link to="/blog" className="flex items-center gap-2 text-dark-400 hover:text-neon-blue mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <div className="cyber-card p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-0.5 text-[10px] font-mono bg-neon-blue/10 text-neon-blue rounded border border-neon-blue/20">
                {post.category.replace('-', ' ')}
              </span>
              <span className="text-dark-500 text-xs font-mono">{new Date(post.created_at).toLocaleDateString()}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">{post.title}</h1>

            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-dark-800/50 text-dark-400 rounded border border-dark-700/30">
                  <Tag className="w-3 h-3" />{tag}
                </span>
              ))}
            </div>

            <div
              className="prose prose-invert prose-sm max-w-none
                prose-headings:text-white prose-headings:font-semibold
                prose-h2:text-xl prose-h3:text-lg
                prose-p:text-dark-300 prose-p:leading-relaxed
                prose-a:text-neon-blue prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-code:text-neon-green prose-code:bg-dark-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
                prose-pre:bg-dark-900 prose-pre:border prose-pre:border-dark-700/30 prose-pre:rounded-lg
                prose-li:text-dark-300
                prose-ul:list-disc prose-ol:list-decimal"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
