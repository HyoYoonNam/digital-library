import { App, PluginSettingTab, Setting, SettingDefinitionItem } from "obsidian";
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
	libraryNoteInitialized: false,
};

const ALADIN_BLOG_URL = "https://blog.aladin.co.kr/openapi/";

export class AladinBookSearchSettingTab extends PluginSettingTab {
	private plugin: AladinBookSearchPlugin;

	constructor(app: App, plugin: AladinBookSearchPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	getControlValue(key: string): unknown {
		const settings = this.plugin.settings;
		switch (key) {
			case "libraryFolder":
				return settings.libraryFolder;
			case "coverFolder":
				return settings.coverFolder;
			case "downloadCover":
				return settings.downloadCover;
			case "searchTarget":
				return settings.searchTarget;
			case "language":
				return settings.language;
			default:
				return undefined;
		}
	}

	async setControlValue(key: string, value: unknown): Promise<void> {
		const settings = this.plugin.settings;
		switch (key) {
			case "libraryFolder":
				settings.libraryFolder = String(value).trim() || DEFAULT_SETTINGS.libraryFolder;
				break;
			case "coverFolder":
				settings.coverFolder = String(value).trim() || DEFAULT_SETTINGS.coverFolder;
				break;
			case "downloadCover":
				settings.downloadCover = Boolean(value);
				break;
			case "searchTarget":
				settings.searchTarget = value === "Book" ? "Book" : "All";
				break;
			case "language":
				settings.language = value as Language;
				break;
		}
		await this.plugin.saveSettings();
		// Language changes relabel every setting, so rebuild the definitions.
		if (key === "language") {
			this.update();
		}
	}

	getSettingDefinitions(): SettingDefinitionItem[] {
		const t = getTranslation(this.plugin.settings.language);
		return [
			{
				name: t.settingsTtbKeyName,
				desc: t.settingsTtbKeyDesc,
				aliases: ["aladin", "ttb", "api key"],
				render: (setting: Setting) => {
					setting
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
				},
			},
			{
				name: "",
				searchable: false,
				render: (setting: Setting) => {
					// Full-width plain-text storage warning box.
					setting.settingEl.empty();
					setting.settingEl.removeClass("setting-item");
					setting.settingEl.createDiv({
						cls: "aladin-security-warning",
						text: t.settingsSecurityWarning,
					});
				},
			},
			{
				name: t.settingsLibraryFolderName,
				desc: t.settingsLibraryFolderDesc,
				control: {
					type: "folder",
					key: "libraryFolder",
					defaultValue: DEFAULT_SETTINGS.libraryFolder,
				},
			},
			{
				name: t.createLibraryNoteCommand,
				desc: t.createLibraryNoteDesc,
				render: (setting: Setting) => {
					setting.addButton((button) =>
						button
							.setButtonText(t.createLibraryNoteCta)
							.setCta()
							.onClick(() => void this.plugin.createLibraryNote()),
					);
				},
			},
			{
				name: t.settingsCoverFolderName,
				desc: t.settingsCoverFolderDesc,
				control: {
					type: "folder",
					key: "coverFolder",
					defaultValue: DEFAULT_SETTINGS.coverFolder,
				},
			},
			{
				name: t.settingsDownloadCoverName,
				desc: t.settingsDownloadCoverDesc,
				control: { type: "toggle", key: "downloadCover" },
			},
			{
				name: t.settingsSearchTargetName,
				desc: t.settingsSearchTargetDesc,
				control: {
					type: "dropdown",
					key: "searchTarget",
					options: {
						All: t.settingsSearchTargetAll,
						Book: t.settingsSearchTargetBook,
					},
				},
			},
			{
				name: t.settingsLanguageName,
				desc: t.settingsLanguageDesc,
				control: {
					type: "dropdown",
					key: "language",
					options: LANGUAGE_OPTIONS,
				},
			},
		];
	}
}
