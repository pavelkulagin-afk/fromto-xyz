export default function cloudflareLoader({ src, width, quality }) {
  return `${src}?w=${width || 800}&q=${quality || 85}&format=webp`
}
