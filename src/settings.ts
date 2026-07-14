import { App, Hotkey, Modifier, Platform, PluginSettingTab, Setting } from "obsidian";
import type AladinBookSearchPlugin from "./main";
import { getTranslation, LANGUAGE_OPTIONS, Language, Translation } from "./i18n";

export type SearchTarget = "All" | "Book";

/** Commands whose hotkey can be configured from the settings tab. */
export type CommandKey = "search" | "openLibrary";

export type CommandHotkeys = Record<CommandKey, Hotkey | null>;

export interface AladinBookSearchSettings {
	ttbKey: string;
	libraryFolder: string;
	coverFolder: string;
	downloadCover: boolean;
	searchTarget: SearchTarget;
	language: Language;
	hotkeys: CommandHotkeys;
	/** True once the startup library note has been created, so it is only auto-created once. */
	libraryNoteInitialized: boolean;
}

export const DEFAULT_SETTINGS: AladinBookSearchSettings = {
	ttbKey: "",
	libraryFolder: "Library",
	coverFolder: "_assets/library_covers",
	downloadCover: true,
	searchTarget: "All",
	language: "auto",
	hotkeys: { search: null, openLibrary: null },
	libraryNoteInitialized: false,
};

/** Builds a Hotkey from a captured keydown event, honoring the platform. */
function eventToHotkey(evt: KeyboardEvent): Hotkey {
	const modifiers: Modifier[] = [];
	if (Platform.isMacOS ? evt.metaKey : evt.ctrlKey) modifiers.push("Mod");
	if (Platform.isMacOS && evt.ctrlKey) modifiers.push("Ctrl");
	if (!Platform.isMacOS && evt.metaKey) modifiers.push("Meta");
	if (evt.altKey) modifiers.push("Alt");
	if (evt.shiftKey) modifiers.push("Shift");
	const key = evt.key.length === 1 ? evt.key.toUpperCase() : evt.key;
	return { modifiers, key };
}

/** Human-readable rendering of a Hotkey for the settings button. */
function hotkeyToString(hotkey: Hotkey): string {
	const symbols: Record<Modifier, string> = Platform.isMacOS
		? { Mod: "⌘", Meta: "⌘", Ctrl: "⌃", Alt: "⌥", Shift: "⇧" }
		: { Mod: "Ctrl", Meta: "Win", Ctrl: "Ctrl", Alt: "Alt", Shift: "Shift" };
	const parts = hotkey.modifiers.map((m) => symbols[m]);
	parts.push(hotkey.key);
	return parts.join(Platform.isMacOS ? " " : " + ");
}

const ALADIN_BLOG_URL = "https://blog.aladin.co.kr/openapi/";

export class AladinBookSearchSettingTab extends PluginSettingTab {
	private plugin: AladinBookSearchPlugin;

	constructor(app: App, plugin: AladinBookSearchPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		const t = getTranslation(this.plugin.settings.language);
		containerEl.empty();

		new Setting(containerEl)
			.setName(t.settingsTtbKeyName)
			.setDesc(t.settingsTtbKeyDesc)
			.addText((text) =>
				text
					.setPlaceholder(t.settingsTtbKeyPlaceholder)
					.setValue(this.plugin.settings.ttbKey)
					.onChange(async (value) => {
						this.plugin.settings.ttbKey = value.trim();
						await this.plugin.saveSettings();
					}),
			)
			.addButton((button) =>
				button
					.setButtonText(t.settingsGetKey)
					.onClick(() => window.open(ALADIN_BLOG_URL)),
			);

		// Plain-text storage warning box.
		const warning = containerEl.createDiv({ cls: "aladin-security-warning" });
		warning.setText(t.settingsSecurityWarning);

		new Setting(containerEl)
			.setName(t.settingsLibraryFolderName)
			.setDesc(t.settingsLibraryFolderDesc)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.libraryFolder)
					.onChange(async (value) => {
						this.plugin.settings.libraryFolder = value.trim() || DEFAULT_SETTINGS.libraryFolder;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t.createLibraryNoteCommand)
			.setDesc(t.createLibraryNoteDesc)
			.addButton((button) =>
				button
					.setButtonText(t.createLibraryNoteCta)
					.setCta()
					.onClick(() => {
						void this.plugin.createLibraryNote();
					}),
			);

		new Setting(containerEl)
			.setName(t.settingsCoverFolderName)
			.setDesc(t.settingsCoverFolderDesc)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.coverFolder)
					.onChange(async (value) => {
						this.plugin.settings.coverFolder = value.trim() || DEFAULT_SETTINGS.coverFolder;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t.settingsDownloadCoverName)
			.setDesc(t.settingsDownloadCoverDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.downloadCover)
					.onChange(async (value) => {
						this.plugin.settings.downloadCover = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t.settingsSearchTargetName)
			.setDesc(t.settingsSearchTargetDesc)
			.addDropdown((dropdown) =>
				dropdown
					.addOption("All", t.settingsSearchTargetAll)
					.addOption("Book", t.settingsSearchTargetBook)
					.setValue(this.plugin.settings.searchTarget)
					.onChange(async (value) => {
						this.plugin.settings.searchTarget = value as SearchTarget;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t.settingsLanguageName)
			.setDesc(t.settingsLanguageDesc)
			.addDropdown((dropdown) => {
				(Object.keys(LANGUAGE_OPTIONS) as Language[]).forEach((lang) => {
					dropdown.addOption(lang, LANGUAGE_OPTIONS[lang]);
				});
				dropdown
					.setValue(this.plugin.settings.language)
					.onChange(async (value) => {
						this.plugin.settings.language = value as Language;
						await this.plugin.saveSettings();
						this.plugin.registerCommands();
						// Re-render settings so labels reflect the new language.
						this.display();
					});
			});

		new Setting(containerEl).setName(t.hotkeysHeading).setHeading();
		containerEl.createDiv({ cls: "aladin-hotkeys-hint", text: t.hotkeysHint });

		this.addHotkeySetting(containerEl, t, "search", t.searchCommand);
		this.addHotkeySetting(containerEl, t, "openLibrary", t.openLibraryCommand);
	}

	private addHotkeySetting(
		containerEl: HTMLElement,
		t: Translation,
		key: CommandKey,
		label: string,
	): void {
		const current = this.plugin.settings.hotkeys[key];
		new Setting(containerEl)
			.setName(label)
			.addButton((button) => {
				button
					.setButtonText(current ? hotkeyToString(current) : t.hotkeyBlank)
					.onClick(() => this.captureHotkey(button, key, t));
			})
			.addExtraButton((extra) => {
				extra
					.setIcon("x")
					.setTooltip(t.hotkeyClear)
					.setDisabled(!current)
					.onClick(async () => {
						this.plugin.settings.hotkeys[key] = null;
						await this.plugin.saveSettings();
						this.plugin.registerCommands();
						this.display();
					});
			});
	}

	private captureHotkey(
		button: { setButtonText: (text: string) => unknown },
		key: CommandKey,
		t: Translation,
	): void {
		button.setButtonText(t.hotkeyPrompt);
		const handler = async (evt: KeyboardEvent) => {
			// Ignore lone modifier presses; wait for a real key.
			if (["Control", "Shift", "Alt", "Meta", "OS"].includes(evt.key)) {
				return;
			}
			evt.preventDefault();
			evt.stopPropagation();
			window.removeEventListener("keydown", handler, true);

			if (evt.key !== "Escape") {
				this.plugin.settings.hotkeys[key] = eventToHotkey(evt);
				await this.plugin.saveSettings();
				this.plugin.registerCommands();
			}
			this.display();
		};
		window.addEventListener("keydown", handler, true);
	}
}
