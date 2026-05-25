export function looksLikeHtml(content: string) {
  return /<\s*[a-z][\s\S]*>/i.test(content.trim())
}

export function stripBlogExcerpt(content: string, maxLength = 180) {
  const text = content
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}…`
}

export function extractBlogHtml(content: string) {
  let html = content.trim()

  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
  if (articleMatch) {
    html = articleMatch[1]
  } else {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    if (bodyMatch) {
      html = bodyMatch[1]
    }
  }

  return html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
}

export function estimateReadMinutes(content: string) {
  const text = stripBlogExcerpt(content, 100_000)
  const words = text.split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 200))} min`
}
