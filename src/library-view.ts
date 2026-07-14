import { ItemView, TFile, TFolder, WorkspaceLeaf, normalizePath } from "obsidian";
import type AladinBookSearchPlugin from "./main";
import { getTranslation, Translation } from "./i18n";

export const VIEW_TYPE_LIBRARY = "aladin-library-view";

type SortKey = "title" | "author" | "started" | "finished";
type StatusFilter = "all" | "unread" | "reading" | "finished";

interface BookEntry {
	file: TFile;
	title: string;
	author: string;
	cover: string;
	status: string;
	started: string;
	finished: string;
}

export class LibraryView extends ItemView {
	private plugin: AladinBookSearchPlugin;
	private filterText = "";
	private sortKey: SortKey = "title";
	private statusFilter: StatusFilter = "all";

	constructor(leaf: WorkspaceLeaf, plugin: AladinBookSearchPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return VIEW_TYPE_LIBRARY;
	}

	getDisplayText(): string {
		return getTranslation(this.plugin.settings.language).libraryTitle;
	}

	getIcon(): string {
		return "library";
	}

	async onOpen(): Promise<void> {
		this.render();
		// Keep the gallery in sync as book notes are added, edited, or removed.
		this.registerEvent(this.app.metadataCache.on("changed", () => this.render()));
		this.registerEvent(this.app.vault.on("delete", () => this.render()));
		this.registerEvent(this.app.vault.on("rename", () => this.render()));
	}

	private collectBooks(): BookEntry[] {
		const folderPath = normalizePath(this.plugin.settings.libraryFolder);
		const folder = this.app.vault.getAbstractFileByPath(folderPath);
		if (!(folder instanceof TFolder)) {
			return [];
		}

		const books: BookEntry[] = [];
		for (const child of folder.children) {
			if (!(child instanceof TFile) || child.extension !== "md") {
				continue;
			}
			const cache = this.app.metadataCache.getFileCache(child);
			const fm = cache?.frontmatter;
			if (!fm || fm["title"] === undefined) {
				continue;
			}
			books.push({
				file: child,
				title: String(fm["title"] ?? child.basename),
				author: String(fm["author"] ?? ""),
				cover: String(fm["cover"] ?? ""),
				status: String(fm["status"] ?? ""),
				started: String(fm["started"] ?? ""),
				finished: String(fm["finished"] ?? ""),
			});
		}
		return books;
	}

	private filterAndSort(books: BookEntry[]): BookEntry[] {
		const needle = this.filterText.toLowerCase();
		const filtered = books.filter((book) => {
			if (this.statusFilter !== "all" && book.status !== this.statusFilter) {
				return false;
			}
			if (!needle) {
				return true;
			}
			return (
				book.title.toLowerCase().includes(needle) ||
				book.author.toLowerCase().includes(needle)
			);
		});

		filtered.sort((a, b) => {
			const av = a[this.sortKey] ?? "";
			const bv = b[this.sortKey] ?? "";
			if (this.sortKey === "started" || this.sortKey === "finished") {
				// Empty dates sort last, newest dates first.
				if (!av && !bv) return 0;
				if (!av) return 1;
				if (!bv) return -1;
				return bv.localeCompare(av);
			}
			return av.localeCompare(bv);
		});
		return filtered;
	}

	private render(): void {
		const t = getTranslation(this.plugin.settings.language);
		const container = this.contentEl;
		container.empty();
		container.addClass("aladin-library");

		this.renderControls(container, t);

		const books = this.filterAndSort(this.collectBooks());
		if (books.length === 0) {
			container.createDiv({ cls: "aladin-library-empty", text: t.libraryEmpty });
			return;
		}

		const grid = container.createDiv({ cls: "aladin-card-grid" });
		for (const book of books) {
			this.renderCard(grid, book, t);
		}
	}

	private renderControls(container: HTMLElement, t: Translation): void {
		const controls = container.createDiv({ cls: "aladin-library-controls" });

		const search = controls.createEl("input", {
			cls: "aladin-library-search",
			type: "text",
			placeholder: t.filterSearchPlaceholder,
		});
		search.value = this.filterText;
		search.addEventListener("input", () => {
			this.filterText = search.value;
			this.renderGridOnly(container, t);
		});

		const statusSelect = controls.createEl("select", { cls: "dropdown" });
		const statuses: Array<[StatusFilter, string]> = [
			["all", t.statusAll],
			["unread", t.statusUnread],
			["reading", t.statusReading],
			["finished", t.statusFinished],
		];
		for (const [value, label] of statuses) {
			statusSelect.createEl("option", { value, text: label });
		}
		statusSelect.value = this.statusFilter;
		statusSelect.addEventListener("change", () => {
			this.statusFilter = statusSelect.value as StatusFilter;
			this.renderGridOnly(container, t);
		});

		const sortSelect = controls.createEl("select", { cls: "dropdown" });
		const sorts: Array<[SortKey, string]> = [
			["title", t.sortTitle],
			["author", t.sortAuthor],
			["started", t.sortStarted],
			["finished", t.sortFinished],
		];
		for (const [value, label] of sorts) {
			sortSelect.createEl("option", { value, text: `${t.sortLabel}: ${label}` });
		}
		sortSelect.value = this.sortKey;
		sortSelect.addEventListener("change", () => {
			this.sortKey = sortSelect.value as SortKey;
			this.renderGridOnly(container, t);
		});
	}

	/** Re-render only the grid so control focus/state is preserved while typing. */
	private renderGridOnly(container: HTMLElement, t: Translation): void {
		container.querySelector(".aladin-card-grid")?.remove();
		container.querySelector(".aladin-library-empty")?.remove();

		const books = this.filterAndSort(this.collectBooks());
		if (books.length === 0) {
			container.createDiv({ cls: "aladin-library-empty", text: t.libraryEmpty });
			return;
		}
		const grid = container.createDiv({ cls: "aladin-card-grid" });
		for (const book of books) {
			this.renderCard(grid, book, t);
		}
	}

	private renderCard(grid: HTMLElement, book: BookEntry, t: Translation): void {
		const card = grid.createDiv({ cls: "aladin-card" });
		card.addEventListener("click", () => {
			this.app.workspace.getLeaf(true).openFile(book.file);
		});

		const coverWrap = card.createDiv({ cls: "aladin-card-cover" });
		const resolvedCover = this.resolveCoverSrc(book.cover);
		if (resolvedCover) {
			coverWrap.createEl("img", { attr: { src: resolvedCover, alt: book.title } });
		} else {
			coverWrap.createDiv({ cls: "aladin-card-cover-placeholder", text: book.title });
		}

		const info = card.createDiv({ cls: "aladin-card-info" });
		info.createDiv({ cls: "aladin-card-title", text: book.title });
		info.createDiv({
			cls: "aladin-card-author",
			text: book.author || t.unknownAuthor,
		});
	}

	/** Maps a stored cover value (remote URL or vault path) to a renderable src. */
	private resolveCoverSrc(cover: string): string {
		if (!cover) {
			return "";
		}
		if (cover.startsWith("http")) {
			return cover;
		}
		const file = this.app.vault.getAbstractFileByPath(normalizePath(cover));
		if (file instanceof TFile) {
			return this.app.vault.getResourcePath(file);
		}
		return "";
	}

	async onClose(): Promise<void> {
		this.contentEl.empty();
	}
}
