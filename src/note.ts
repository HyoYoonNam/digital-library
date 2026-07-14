import { App, Notice, TFile, normalizePath, requestUrl } from "obsidian";
import { AladinItem } from "./aladin";
import { AladinBookSearchSettings } from "./settings";
import { Translation } from "./i18n";

/** Strip the series/subtitle suffix Aladin appends to titles. */
function cleanTitle(rawTitle: string): string {
	return rawTitle.split(/ - | \(| :/)[0].trim();
}

/** Remove characters that are illegal in file names. */
function toSafeFileName(title: string): string {
	return title.replace(/[\\/:*?"<>|]/g, "").trim();
}

/** Prefer the mid-level (sub-genre) category, falling back to broader levels. */
function extractCategory(categoryName: string | undefined): string {
	if (!categoryName) {
		return "";
	}
	const parts = categoryName.split(">").map((part) => part.trim());
	let name: string;
	if (parts.length > 2) {
		name = parts[2];
	} else if (parts.length > 1) {
		name = parts[1];
	} else {
		name = parts[0];
	}
	return name.replace(/\//g, "_");
}

/** Upgrade Aladin cover URLs to the highest resolution variant. */
function toHighResCover(cover: string | undefined): string {
	if (!cover) {
		return "";
	}
	return cover.replace("coversum", "cover500").replace("cover200", "cover500");
}

async function ensureFolder(app: App, folder: string): Promise<void> {
	const path = normalizePath(folder);
	if (!app.vault.getAbstractFileByPath(path)) {
		await app.vault.createFolder(path);
	}
}

/**
 * Downloads the cover into the vault and returns its vault-relative path,
 * or the remote URL when downloading is disabled or fails.
 */
async function resolveCover(
	app: App,
	rawCoverUrl: string,
	safeTitle: string,
	settings: AladinBookSearchSettings,
	t: Translation,
): Promise<string> {
	if (!rawCoverUrl || !settings.downloadCover) {
		return rawCoverUrl;
	}

	await ensureFolder(app, settings.coverFolder);
	const imgTarget = normalizePath(`${settings.coverFolder}/${safeTitle}.jpg`);

	if (app.vault.getAbstractFileByPath(imgTarget)) {
		return imgTarget;
	}

	try {
		const imgRes = await requestUrl({ url: rawCoverUrl });
		await app.vault.createBinary(imgTarget, imgRes.arrayBuffer);
		new Notice(t.noticeCoverDownloaded);
		return imgTarget;
	} catch (e) {
		console.error("Aladin cover download failed", e);
		new Notice(t.noticeCoverFailed);
		return rawCoverUrl;
	}
}

function escapeYaml(value: string): string {
	return value.replace(/"/g, '\\"');
}

function buildNoteContent(
	book: AladinItem,
	title: string,
	coverPath: string,
	category: string,
): string {
	const totalPage = book.itemPage ?? book.subInfo?.itemPage ?? 0;
	const frontmatter = [
		"---",
		`cover: "${escapeYaml(coverPath)}"`,
		`title: "${escapeYaml(title)}"`,
		`author: "${escapeYaml(book.author ?? "")}"`,
		`publisher: "${escapeYaml(book.publisher ?? "")}"`,
		`publishDate: "${escapeYaml(book.pubDate ?? "")}"`,
		`totalPage: ${totalPage}`,
		`category: "${escapeYaml(category)}"`,
		`isbn: "${escapeYaml(book.isbn13 ?? "")}"`,
		`link: "${escapeYaml(book.link ?? "")}"`,
		"status: unread",
		"rating: ",
		"started: ",
		"finished: ",
		"---",
	].join("\n");

	const description = book.description?.trim() || "";
	return (
		`${frontmatter}\n\n` +
		`# ${title}\n\n` +
		`## Overview\n\n${description}\n\n` +
		`## Notes\n\n- \n`
	);
}

export interface CreatedNote {
	file: TFile;
	created: boolean;
}

/**
 * Creates a book note from an Aladin item. Returns the existing file (with
 * `created: false`) when a note for that title already exists.
 */
export async function createBookNote(
	app: App,
	book: AladinItem,
	settings: AladinBookSearchSettings,
	t: Translation,
): Promise<CreatedNote> {
	const title = cleanTitle(book.title);
	const safeTitle = toSafeFileName(title);
	const category = extractCategory(book.categoryName);

	await ensureFolder(app, settings.libraryFolder);
	const targetPath = normalizePath(`${settings.libraryFolder}/${safeTitle}.md`);

	const existing = app.vault.getAbstractFileByPath(targetPath);
	if (existing instanceof TFile) {
		return { file: existing, created: false };
	}

	const rawCoverUrl = toHighResCover(book.cover);
	const coverPath = await resolveCover(app, rawCoverUrl, safeTitle, settings, t);
	const content = buildNoteContent(book, title, coverPath, category);

	const file = await app.vault.create(targetPath, content);
	return { file, created: true };
}
