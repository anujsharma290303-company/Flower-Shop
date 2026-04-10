import { useEffect, useState } from 'react'
import { reviewService } from '@/api/reviews'
import type { CustomerReview } from '@/types'

let cachedReviews: CustomerReview[] = []
let reviewsRequest: Promise<CustomerReview[]> | null = null

const loadReviews = async (): Promise<CustomerReview[]> => {
  if (!reviewsRequest) {
    reviewsRequest = reviewService.getAll().finally(() => {
      reviewsRequest = null
    })
  }

  cachedReviews = await reviewsRequest
  return cachedReviews
}

export const useReviews = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>(cachedReviews)
  const [isLoading, setIsLoading] = useState(cachedReviews.length === 0)

  useEffect(() => {
    let isMounted = true

    setIsLoading(cachedReviews.length === 0)

    loadReviews()
      .then((nextReviews) => {
        if (isMounted) {
          setReviews(nextReviews)
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

  return { reviews, isLoading }
}

export default useReviews
