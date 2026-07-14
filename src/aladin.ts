import { requestUrl } from "obsidian";
import { SearchTarget } from "./settings";

/**
 * Subset of the Aladin ItemSearch / ItemLookUp item fields this plugin uses.
 * Declared explicitly so external API responses are typed (no `any`).
 */
export interface AladinItem {
	itemId: number;
	title: string;
	author: string;
	publisher: string;
	pubDate: string;
	isbn13: string;
	link: string;
	cover: string;
	categoryName: string;
	description: string;
	itemPage?: number;
	subInfo?: {
		itemPage?: number;
	};
}

interface AladinSearchResponse {
	item?: AladinItem[];
}

interface AladinLookupResponse {
	item?: AladinItem[];
}

const API_BASE = "https://www.aladin.co.kr/ttb/api";
const API_VERSION = "20131101";

export async function searchBooks(
	query: string,
	ttbKey: string,
	searchTarget: SearchTarget,
): Promise<AladinItem[]> {
	const url =
		`${API_BASE}/ItemSearch.aspx?ttbkey=${encodeURIComponent(ttbKey)}` +
		`&Query=${encodeURIComponent(query)}&QueryType=Title&MaxResults=10&start=1` +
		`&SearchTarget=${searchTarget}&Output=js&Version=${API_VERSION}`;

	const response = await requestUrl({ url });
	const data = response.json as AladinSearchResponse;
	return data.item ?? [];
}

export async function lookupBook(itemId: number, ttbKey: string): Promise<AladinItem | null> {
	const url =
		`${API_BASE}/ItemLookUp.aspx?ttbkey=${encodeURIComponent(ttbKey)}` +
		`&itemIdType=ItemId&ItemId=${itemId}&Output=js&Version=${API_VERSION}`;

	const response = await requestUrl({ url });
	const data = response.json as AladinLookupResponse;
	if (data.item && data.item.length > 0) {
		return data.item[0];
	}
	return null;
}
