# digital-library

Search books through the [Aladin](https://www.aladin.co.kr/) open API, generate
richly-populated notes with cover images and metadata, and browse your reading
library in a built-in card gallery view — no other plugins required.

## Why

Aladin exposes a free open API with detailed Korean and foreign book metadata.
This plugin turns a title search into a ready-to-use note (cover, author,
publisher, page count, category, ISBN, reading status) and renders every book
note as a cover-first gallery, so your vault doubles as a personal bookshelf.

It is fully self-contained: the library view is a native Obsidian view, so you
do **not** need Dataview, Templater, or a theme snippet.

## ⚠️ Before you start

You need your own **Aladin TTB key** (a personal open API key):

1. Sign in at [aladin.co.kr](https://www.aladin.co.kr/) and open the
   [open API page](https://blog.aladin.co.kr/openapi/).
2. Request an API key. Aladin issues a TTB key that looks like `ttbyourid1234001`.
3. Copy the key into **Settings → Aladin Book Search → Aladin TTB key**.

The key is required for every search and is stored only in your vault. See
[Security](#security) below.

## Setup

1. Install the plugin (from the Community Plugins store, or manually by copying
   `main.js`, `manifest.json`, and `styles.css` into
   `<vault>/.obsidian/plugins/aladin-book-search/`).
2. Enable it in **Settings → Community plugins**.
3. Enter your TTB key and, optionally, adjust the library/cover folders, cover
   download behavior, search target, and interface language.

## Usage

### Search and create a note

- Run the **Search for a book** command (command palette).
- Start typing a title — results from Aladin appear as you type.
- Pick a result. The plugin fetches full details, downloads the cover, and
  creates a note in your library folder, then opens it.

Each note is generated with this front matter (keys are kept in English so they
stay machine-readable):

```yaml
---
cover: "_assets/library_covers/<title>.jpg"
title: "..."
author: "..."
publisher: "..."
publishDate: "..."
totalPage: 0
category: "..."
isbn: "..."
link: "..."
status: unread
rating:
started:
finished:
---
```

Set `status` to `unread`, `reading`, or `finished` to drive the library filter,
and fill in `started` / `finished` dates to sort your shelf.

### Browse your library

There are two ways to open the gallery:

- **As a view:** click the **library** ribbon icon, or run **Open library view**.
- **As a physical note:** on first run the plugin creates a library note (named
  "Library" in your chosen language) containing an `aladin-library` code block.
  Open it from the file explorer any time to render the gallery — handy if you
  want the shelf pinned in your vault like a dashboard. If you delete it, it is
  not recreated; run **Create a library note** to make it again. You can also
  drop the block into any note:

  ````markdown
  ```aladin-library
  ```
  ````

Either way, books render as a cover-first card grid. Filter by title/author,
filter by reading status, and sort by title, author, started, or finished date.
Click a card to open its note. The leading **+** tile launches a book search.

### Hotkeys

Under **Settings → Aladin Book Search → Command hotkeys** you can assign a
shortcut to each command (search, open library, create library note) so they run
directly without the command palette. Click a command's button and press the key
combination. The same shortcuts also appear in Obsidian's native Hotkeys settings.

## Development

```bash
npm install
npm run dev     # watch build
npm run build   # type-check + production bundle
```

For local testing, symlink `main.js`, `manifest.json`, and `styles.css` into a
test vault's `.obsidian/plugins/aladin-book-search/` folder and reload Obsidian.

## Security

Obsidian has no secure secret storage, so your **TTB key is stored in plain
text** in this vault's `.obsidian/plugins/aladin-book-search/data.json`.

- Use a key you can revoke or regenerate from your Aladin account.
- Exclude `data.json` from any sync service you do not fully trust.
- The plugin only ever sends the key to Aladin's official API over HTTPS via
  Obsidian's `requestUrl`.

## License

[MIT](LICENSE)
