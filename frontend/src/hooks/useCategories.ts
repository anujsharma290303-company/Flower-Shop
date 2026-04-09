import { useEffect, useState } from 'react'
import { categoryService } from '@/api/categories'
import type { Category } from '@/types'

let cachedCategories: Category[] = []
let categoriesRequest: Promise<Category[]> | null = null

const loadCategories = async (): Promise<Category[]> => {
  if (!categoriesRequest) {
    categoriesRequest = categoryService.getTopLevel().finally(() => {
      categoriesRequest = null
    })
  }

  cachedCategories = await categoriesRequest
  return cachedCategories
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(cachedCategories)

  useEffect(() => {
    let isMounted = true

    loadCategories()
      .then((nextCategories) => {
        if (isMounted) {
          setCategories(nextCategories)
        }
      })
      .catch(() => {
        if (isMounted) {
          setCategories([])
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { categories }
}

export default useCategories