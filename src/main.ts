import { Plugin, WorkspaceLeaf } from "obsidian";
import {
	AladinBookSearchSettings,
	AladinBookSearchSettingTab,
	DEFAULT_SETTINGS,
} from "./settings";
import { BookSearchModal } from "./search-modal";
import { LibraryView, VIEW_TYPE_LIBRARY } from "./library-view";
import { getTranslation } from "./i18n";

export default class AladinBookSearchPlugin extends Plugin {
	settings: AladinBookSearchSettings = DEFAULT_SETTINGS;

	async onload(): Promise<void> {
		await this.loadSettings();

		this.registerView(VIEW_TYPE_LIBRARY, (leaf) => new LibraryView(leaf, this));

		const t = getTranslation(this.settings.language);

		this.addRibbonIcon("library", t.ribbonTooltip, () => {
			void this.activateLibraryView();
		});

		this.addCommand({
			id: "search-book",
			name: t.searchCommand,
			callback: () => {
				new BookSearchModal(this.app, this).open();
			},
		});

		this.addCommand({
			id: "open-library",
			name: t.openLibraryCommand,
			callback: () => {
				void this.activateLibraryView();
			},
		});

		this.addSettingTab(new AladinBookSearchSettingTab(this.app, this));
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
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}
