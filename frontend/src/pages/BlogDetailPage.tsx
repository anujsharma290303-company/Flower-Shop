import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { blogService } from '@/api/blogs'
import type { BlogPost } from '@/types'

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    if (!slug) {
      setErrorMessage('Invalid blog slug.')
      setIsLoading(false)
      return
    }

    const loadBlog = async () => {
      try {
        const blog = await blogService.getBySlug(slug)
        if (isMounted) {
          setPost(blog)
        }
      } catch (error: unknown) {
        const message =
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof (error as { response?: { status?: number; data?: { message?: string } } }).response?.status === 'number' &&
          (error as { response: { status: number } }).response.status === 404
            ? 'Blog post not found.'
            : typeof error === 'object' &&
              error !== null &&
              'response' in error &&
              typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
              ? (error as { response: { data: { message: string } } }).response.data.message
              : 'Unable to load this blog post.'

        if (isMounted) {
          setErrorMessage(message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadBlog()

    return () => {
      isMounted = false
    }
  }, [slug])

  return (
    <Layout>
      <section className="border-t border-gray-200 bg-[#f5f5f5] px-4 py-10 md:py-12">
        <div className="mx-auto max-w-210">
          {isLoading ? <p className="py-10 text-center text-[18px] text-[#586274]">Loading blog post...</p> : null}
          {!isLoading && errorMessage ? <p className="py-10 text-center text-[16px] text-[#c82a2f]">{errorMessage}</p> : null}

          {!isLoading && !errorMessage && post ? (
            <article className="overflow-hidden border border-gray-200 bg-white">
              {post.coverImage ? (
                <img src={post.coverImage} alt={post.title} className="h-90 w-full object-cover" loading="lazy" />
              ) : null}

              <div className="p-6 md:p-8">
                <p className="text-[13px] uppercase tracking-[0.08em] text-gray-500">
                  {post.author} {post.publishedAt ? `• ${new Date(post.publishedAt).toLocaleDateString()}` : ''}
                </p>
                <h1 className="mt-2 text-[42px] font-semibold leading-tight text-[#2f3743]">{post.title}</h1>
                <p className="mt-5 text-[22px] leading-[1.55] text-[#4b5563]">{post.excerpt}</p>

                <div className="mt-7 whitespace-pre-wrap text-[18px] leading-[1.75] text-[#2f3743]">
                  {post.content}
                </div>
              </div>
            </article>
          ) : null}

          <div className="mt-8 text-center">
            <Link to="/blog" className="text-[18px] text-[#c82a2f] hover:underline">Back to Blog</Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

BlogDetailPage.displayName = 'BlogDetailPage'
export default BlogDetailPage
