import { App, PluginSettingTab, Setting } from "obsidian";
import type AladinBookSearchPlugin from "./main";
import { getTranslation, LANGUAGE_OPTIONS, Language } from "./i18n";

export type SearchTarget = "All" | "Book";

export interface AladinBookSearchSettings {
	ttbKey: string;
	libraryFolder: string;
	coverFolder: string;
	downloadCover: boolean;
	searchTarget: SearchTarget;
	language: Language;
}

export const DEFAULT_SETTINGS: AladinBookSearchSettings = {
	ttbKey: "",
	libraryFolder: "Library",
	coverFolder: "_assets/library_covers",
	downloadCover: true,
	searchTarget: "All",
	language: "auto",
};

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
						// Re-render settings so labels reflect the new language.
						this.display();
					});
			});
	}
}
