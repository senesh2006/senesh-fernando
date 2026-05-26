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

/**
 * Parse markdown with custom block syntax (:::blocktype)
 * Converts blocks like :::scoreboard, :::pull-quote, :::timeline into HTML divs
 */
export function parseMarkdownWithBlocks(content: string): string {
  // Remove frontmatter if present (YAML between ---)
  let cleanContent = content.replace(/^---[\s\S]*?---\n/, "")

  // Convert custom block syntax into HTML divs or markdown blockquotes
  cleanContent = cleanContent.replace(/:::([\w-]+)\n([\s\S]*?):::/g, (match, blockType, blockContent) => {
    const trimmedContent = blockContent.trim()
    
    switch (blockType) {
      case "scoreboard":
      case "alert":
      case "timeline":
      case "feature-grid":
      case "project-links":
        // Convert to a blockquote which will be styled
        return `> **${blockType.toUpperCase()}**\n> \n${trimmedContent
          .split("\n")
          .map((line) => `> ${line}`)
          .join("\n")}`

      case "pull-quote":
        // Convert to blockquote
        return `> ${trimmedContent.split("\n").join("\n> ")}`

      default:
        // Default: treat as blockquote
        return `> ${trimmedContent.split("\n").join("\n> ")}`
    }
  })

  // Also handle inline project-links, scoreboard without closing :::
  cleanContent = cleanContent.replace(/:::([\w-]+)\n([\s\S]*?)(?=\n\n|$)/g, (match, blockType, blockContent) => {
    if (blockContent.includes(":::")) {
      return match // Already handled by previous regex
    }
    
    const trimmedContent = blockContent.trim()
    
    switch (blockType) {
      case "scoreboard":
      case "alert":
      case "timeline":
      case "feature-grid":
      case "project-links":
        return `> ${trimmedContent.split("\n").join("\n> ")}`
      case "pull-quote":
        return `> ${trimmedContent.split("\n").join("\n> ")}`
      default:
        return match
    }
  })

  return cleanContent
}
