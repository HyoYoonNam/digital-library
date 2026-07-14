import { Plugin, TFile, WorkspaceLeaf, normalizePath } from "obsidian";
import {
	AladinBookSearchSettings,
	AladinBookSearchSettingTab,
	DEFAULT_SETTINGS,
} from "./settings";
import { BookSearchModal } from "./search-modal";
import {
	LibraryCodeBlockChild,
	LibraryView,
	LIBRARY_CODE_BLOCK,
	VIEW_TYPE_LIBRARY,
} from "./library-view";
import { getTranslation } from "./i18n";

export default class AladinBookSearchPlugin extends Plugin {
	settings: AladinBookSearchSettings = DEFAULT_SETTINGS;

	async onload(): Promise<void> {
		await this.loadSettings();

		this.registerView(VIEW_TYPE_LIBRARY, (leaf) => new LibraryView(leaf, this));

		this.registerMarkdownCodeBlockProcessor(LIBRARY_CODE_BLOCK, (_source, el, ctx) => {
			ctx.addChild(new LibraryCodeBlockChild(this, el));
		});

		const t = getTranslation(this.settings.language);

		this.addRibbonIcon("library", t.ribbonTooltip, () => {
			void this.activateLibraryView();
		});

		this.addCommand({
			id: "search-book",
			name: t.searchCommand,
			callback: () => this.openBookSearch(),
		});

		this.addCommand({
			id: "open-library",
			name: t.openLibraryCommand,
			callback: () => void this.activateLibraryView(),
		});

		this.addCommand({
			id: "create-library-note",
			name: t.createLibraryNoteCommand,
			callback: () => void this.createLibraryNote(),
		});

		this.addSettingTab(new AladinBookSearchSettingTab(this.app, this));

		// Create the library dashboard note once, after the vault is ready.
		this.app.workspace.onLayoutReady(() => void this.initLibraryNote());
	}

	private libraryNotePath(): string {
		const t = getTranslation(this.settings.language);
		return normalizePath(`${t.libraryNoteTitle}.md`);
	}

	/** Auto-creates the library note on first run only; never recreates it. */
	private async initLibraryNote(): Promise<void> {
		if (this.settings.libraryNoteInitialized) {
			return;
		}
		this.settings.libraryNoteInitialized = true;
		await this.saveSettings();

		const path = this.libraryNotePath();
		if (!this.app.vault.getAbstractFileByPath(path)) {
			await this.app.vault.create(path, "```" + LIBRARY_CODE_BLOCK + "\n```\n");
		}
	}

	/**
	 * Creates (or opens, if it already exists) a physical note containing the
	 * library code block, giving users a file they can open from the explorer.
	 */
	async createLibraryNote(): Promise<void> {
		const path = this.libraryNotePath();

		const existing = this.app.vault.getAbstractFileByPath(path);
		const file =
			existing instanceof TFile
				? existing
				: await this.app.vault.create(path, "```" + LIBRARY_CODE_BLOCK + "\n```\n");
		await this.app.workspace.getLeaf(true).openFile(file);
	}

	openBookSearch(): void {
		new BookSearchModal(this.app, this).open();
	}

	async activateLibraryView(): Promise<void> {
		const { workspace } = this.app;

		const existing = workspace.getLeavesOfType(VIEW_TYPE_LIBRARY);
		if (existing.length > 0) {
			await workspace.revealLeaf(existing[0]);
			return;
		}

		const leaf: WorkspaceLeaf | null = workspace.getLeaf(true);
		await leaf.setViewState({ type: VIEW_TYPE_LIBRARY, active: true });
		await workspace.revealLeaf(leaf);
	}

	async loadSettings(): Promise<void> {
		const data = (await this.loadData()) as Partial<AladinBookSearchSettings> | null;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}
