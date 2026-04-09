/**
 * Utility function to conditionally merge classNames
 * Replaces clsx or classnames utility for Tailwind CSS
 */
export function cn(...classes: (string | undefined | null | false | Record<string, boolean>)[]): string {
  return classes
    .flat()
    .reduce((acc: string[], cl) => {
      if (typeof cl === 'string') {
        return [...acc, cl]
      }
      if (typeof cl === 'object' && cl !== null) {
        return [...acc, ...Object.keys(cl).filter((key) => cl[key])]
      }
      return acc
    }, [])
    .filter(Boolean)
    .join(' ')
}

export default cn
