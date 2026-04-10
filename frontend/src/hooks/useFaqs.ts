import { useEffect, useState } from 'react'
import { faqService } from '@/api/faqs'
import type { FAQItem } from '@/types'

let cachedFaqs: FAQItem[] = []
let faqRequest: Promise<FAQItem[]> | null = null

const loadFaqs = async (): Promise<FAQItem[]> => {
  if (!faqRequest) {
    faqRequest = faqService.getAll({ isActive: true }).finally(() => {
      faqRequest = null
    })
  }

  cachedFaqs = await faqRequest
  return cachedFaqs
}

export const useFaqs = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>(cachedFaqs)
  const [isLoading, setIsLoading] = useState(cachedFaqs.length === 0)

  useEffect(() => {
    let isMounted = true

    setIsLoading(cachedFaqs.length === 0)

    loadFaqs()
      .then((nextFaqs) => {
        if (isMounted) {
          setFaqs(nextFaqs)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { faqs, isLoading }
}

export default useFaqs
