import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function optimizeImage(url: string, width = 800, quality = 85) {
  return `https://cdn.fromto.xyz/${url}?w=${width}&q=${quality}&format=webp`
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

export function generateBackupSnapshot(data: any) {
  return {
    version: '1.0',
    timestamp: new Date().toISOString(),
    checksum: btoa(JSON.stringify(data)).slice(0, 16),
    data,
  }
}
