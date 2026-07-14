import { App, Notice, SuggestModal } from "obsidian";
import { AladinItem, lookupBook, searchBooks } from "./aladin";
import { createBookNote } from "./note";
import type AladinBookSearchPlugin from "./main";
import { getTranslation } from "./i18n";

const SEARCH_DEBOUNCE_MS = 400;

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export class BookSearchModal extends SuggestModal<AladinItem> {
	private plugin: AladinBookSearchPlugin;

	constructor(app: App, plugin: AladinBookSearchPlugin) {
		super(app);
		this.plugin = plugin;
		const t = getTranslation(plugin.settings.language);
		this.setPlaceholder(t.searchPlaceholder);
		this.emptyStateText = t.searchEmpty;
		this.setInstructions([
			{ command: "↑↓", purpose: t.searchInstructionsNav },
			{ command: "↵", purpose: t.searchInstructionsSelect },
			{ command: "esc", purpose: t.searchInstructionsDismiss },
		]);
	}

	async getSuggestions(query: string): Promise<AladinItem[]> {
		const t = getTranslation(this.plugin.settings.language);
		const trimmed = query.trim();
		if (!trimmed) {
			return [];
		}
		if (!this.plugin.settings.ttbKey) {
			new Notice(t.searchNoKey);
			return [];
		}

		// Debounce so we do not hit the API on every keystroke.
		await delay(SEARCH_DEBOUNCE_MS);
		if (trimmed !== this.inputEl.value.trim()) {
			return [];
		}

		try {
			return await searchBooks(
				trimmed,
				this.plugin.settings.ttbKey,
				this.plugin.settings.searchTarget,
			);
		} catch (e) {
			console.error("Aladin search failed", e);
			new Notice(t.searchFailed);
			return [];
		}
	}

	renderSuggestion(book: AladinItem, el: HTMLElement): void {
		const t = getTranslation(this.plugin.settings.language);
		el.createDiv({ text: book.title, cls: "aladin-suggestion-title" });
		el.createEl("small", {
			text: book.author || t.unknownAuthor,
			cls: "aladin-suggestion-author",
		});
	}

	onChooseSuggestion(book: AladinItem): void {
		void this.createNoteFromBook(book);
	}

	private async createNoteFromBook(book: AladinItem): Promise<void> {
		const t = getTranslation(this.plugin.settings.language);
		new Notice(t.noticeCreating);

		let finalBook = book;
		try {
			const detail = await lookupBook(book.itemId, this.plugin.settings.ttbKey);
			if (detail) {
				finalBook = detail;
			}
		} catch (e) {
			console.error("Aladin lookup failed, using search result", e);
		}

		const result = await createBookNote(this.app, finalBook, this.plugin.settings, t);
		if (!result.created) {
			new Notice(t.noticeExists);
		} else {
			new Notice(t.noticeCreated);
		}
		await this.app.workspace.getLeaf(true).openFile(result.file);
	}
}
