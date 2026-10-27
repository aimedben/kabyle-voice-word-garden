<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Public reading lives in a shared reading workspace rendered at `/` and `/read`; the legacy `/auth` redirects to `/read` because reading does not require an account.
- Reading prompts live in the Cloud `reading_prompts` table with anonymous active-row SELECT only; both public routes use a publishable server-function read and shared Query cache, then filter in the browser to keep reading account-free without exposing research data.
- Practice recordings stay in browser memory and can be downloaded locally; do not imply they are submitted to the research corpus.
