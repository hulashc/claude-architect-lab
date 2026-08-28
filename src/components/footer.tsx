export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-zinc-500 dark:text-zinc-500">
        <p>
          Claude Architect Lab is an independent study project — it is{" "}
          <strong className="font-medium text-zinc-700 dark:text-zinc-300">
            not affiliated with or endorsed by Anthropic
          </strong>
          . For the official credential and prep material, see{" "}
          <a
            href="https://anthropic.skilljar.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Anthropic Academy
          </a>
          . All practice questions and scenarios on this site are original.
        </p>
      </div>
    </footer>
  );
}
