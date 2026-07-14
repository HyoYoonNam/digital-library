import { ItemView, MarkdownRenderChild, WorkspaceLeaf } from "obsidian";
import type AladinBookSearchPlugin from "./main";
import { getTranslation } from "./i18n";
import { LibraryRenderer } from "./library-renderer";

export const VIEW_TYPE_LIBRARY = "aladin-library-view";
export const LIBRARY_CODE_BLOCK = "aladin-library";

export class LibraryView extends ItemView {
	private plugin: AladinBookSearchPlugin;
	private renderer: LibraryRenderer;

	constructor(leaf: WorkspaceLeaf, plugin: AladinBookSearchPlugin) {
		super(leaf);
		this.plugin = plugin;
		this.renderer = new LibraryRenderer(this.app, plugin);
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
		this.draw();
		// Keep the gallery in sync as book notes are added, edited, or removed.
		this.registerEvent(this.app.metadataCache.on("changed", () => this.draw()));
		this.registerEvent(this.app.vault.on("delete", () => this.draw()));
		this.registerEvent(this.app.vault.on("rename", () => this.draw()));
	}

	private draw(): void {
		this.renderer.render(this.contentEl);
	}

	async onClose(): Promise<void> {
		this.contentEl.empty();
	}
}

/**
 * Renders the library gallery inside an `aladin-library` markdown code block,
 * so a physical note can act as an openable library dashboard.
 */
export class LibraryCodeBlockChild extends MarkdownRenderChild {
	private renderer: LibraryRenderer;

	constructor(
		private plugin: AladinBookSearchPlugin,
		containerEl: HTMLElement,
	) {
		super(containerEl);
		this.renderer = new LibraryRenderer(plugin.app, plugin);
	}

	onload(): void {
		this.draw();
		this.registerEvent(this.plugin.app.metadataCache.on("changed", () => this.draw()));
		this.registerEvent(this.plugin.app.vault.on("delete", () => this.draw()));
		this.registerEvent(this.plugin.app.vault.on("rename", () => this.draw()));
	}

	private draw(): void {
		this.renderer.render(this.containerEl);
	}
}
