import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="prose mx-auto w-full">
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </article>
  )
}
