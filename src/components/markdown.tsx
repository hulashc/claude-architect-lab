import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders trusted, author-written markdown (lesson prose, rationales) —
 * never end-user input. react-markdown doesn't execute embedded code by
 * design, which is exactly why we chose it over MDX for prose blocks; see
 * architecture/adr/0002-content-model.md. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert prose-p:leading-7 prose-headings:font-semibold">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
