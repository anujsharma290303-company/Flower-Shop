import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { blogService } from '@/api/blogs'
import type { BlogPost } from '@/types'

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadBlogs = async () => {
      try {
        const blogs = await blogService.getAll()
        if (isMounted) {
          setPosts(blogs)
        }
      } catch (error: unknown) {
        const message =
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
            ? (error as { response: { data: { message: string } } }).response.data.message
            : 'Unable to load blog posts.'

        if (isMounted) {
          setErrorMessage(message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadBlogs()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f5f5f5] px-4 py-10 md:py-12">
        <div className="mx-auto max-w-260">
          <h1 className="mb-4 text-center font-serif text-[44px] text-[#262b33]">Blog</h1>
          <p className="mx-auto mb-8 max-w-160 text-center text-[18px] text-[#586274]">
            Insights, ideas, and stories from the Social Flowers team.
          </p>

          {isLoading ? <p className="py-10 text-center text-[18px] text-[#586274]">Loading blog posts...</p> : null}
          {!isLoading && errorMessage ? <p className="py-10 text-center text-[16px] text-[#c82a2f]">{errorMessage}</p> : null}
          {!isLoading && !errorMessage && posts.length === 0 ? (
            <p className="py-10 text-center text-[16px] text-[#586274]">No blog posts available right now.</p>
          ) : null}

          {!isLoading && !errorMessage && posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="overflow-hidden border border-gray-200 bg-white">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="h-52 w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-gray-100 text-sm text-gray-500">No cover image</div>
                  )}

                  <div className="p-5">
                    <p className="text-[13px] uppercase tracking-[0.08em] text-gray-500">
                      {post.author} {post.publishedAt ? `• ${new Date(post.publishedAt).toLocaleDateString()}` : ''}
                    </p>
                    <h2 className="mt-2 text-[24px] font-semibold leading-tight text-[#2f3743]">{post.title}</h2>
                    <p className="mt-3 line-clamp-3 text-[16px] leading-[1.6] text-[#586274]">{post.excerpt}</p>

                    <Link to={`/blog/${post.slug}`} className="mt-4 inline-block text-[16px] font-semibold text-[#c82a2f] hover:underline">
                      Read more
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </Layout>
  )
}

BlogPage.displayName = 'BlogPage'
export default BlogPage
