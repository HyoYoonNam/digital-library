export type Language = "auto" | "en" | "ko" | "ja" | "zh";

export const LANGUAGE_OPTIONS: Record<Language, string> = {
	auto: "Auto (follow Obsidian)",
	en: "English",
	ko: "한국어",
	ja: "日本語",
	zh: "中文",
};

export interface Translation {
	// commands / ribbon
	searchCommand: string;
	openLibraryCommand: string;
	createLibraryNoteCommand: string;
	createLibraryNoteDesc: string;
	createLibraryNoteCta: string;
	libraryNoteTitle: string;
	ribbonTooltip: string;
	// search modal
	searchPlaceholder: string;
	searchInstructionsNav: string;
	searchInstructionsSelect: string;
	searchInstructionsDismiss: string;
	searchEmpty: string;
	searchNoKey: string;
	searchFailed: string;
	// note creation
	noticeCreating: string;
	noticeCreated: string;
	noticeExists: string;
	noticeCoverDownloaded: string;
	noticeCoverFailed: string;
	// library view
	libraryTitle: string;
	libraryEmpty: string;
	filterSearchPlaceholder: string;
	sortLabel: string;
	sortTitle: string;
	sortAuthor: string;
	sortStarted: string;
	sortFinished: string;
	statusAll: string;
	statusUnread: string;
	statusReading: string;
	statusFinished: string;
	unknownAuthor: string;
	addBook: string;
	// settings
	settingsTtbKeyName: string;
	settingsTtbKeyDesc: string;
	settingsTtbKeyPlaceholder: string;
	settingsGetKey: string;
	settingsSecurityWarning: string;
	settingsLibraryFolderName: string;
	settingsLibraryFolderDesc: string;
	settingsCoverFolderName: string;
	settingsCoverFolderDesc: string;
	settingsDownloadCoverName: string;
	settingsDownloadCoverDesc: string;
	settingsSearchTargetName: string;
	settingsSearchTargetDesc: string;
	settingsSearchTargetAll: string;
	settingsSearchTargetBook: string;
	settingsLanguageName: string;
	settingsLanguageDesc: string;
	hotkeysHeading: string;
	hotkeysHint: string;
	hotkeyBlank: string;
	hotkeyPrompt: string;
	hotkeyClear: string;
}

const en: Translation = {
	searchCommand: "Search for a book",
	openLibraryCommand: "Open library view",
	createLibraryNoteCommand: "Create a library note",
	createLibraryNoteDesc: "Create the library dashboard note now, or open it if it already exists.",
	createLibraryNoteCta: "Create",
	libraryNoteTitle: "Library",
	ribbonTooltip: "Open library",
	searchPlaceholder: "Type a book title to search Aladin…",
	searchInstructionsNav: "to navigate",
	searchInstructionsSelect: "to create a note",
	searchInstructionsDismiss: "to dismiss",
	searchEmpty: "No results found.",
	searchNoKey: "Set your Aladin TTB key in the plugin settings first.",
	searchFailed: "Aladin search failed. Check your TTB key and network.",
	noticeCreating: "Creating note…",
	noticeCreated: "Book note created",
	noticeExists: "This book note already exists.",
	noticeCoverDownloaded: "Cover downloaded",
	noticeCoverFailed: "Cover download failed, using remote link instead.",
	libraryTitle: "Library",
	libraryEmpty: "No book notes yet. Search for a book to get started.",
	filterSearchPlaceholder: "Filter by title or author…",
	sortLabel: "Sort",
	sortTitle: "Title",
	sortAuthor: "Author",
	sortStarted: "Started",
	sortFinished: "Finished",
	statusAll: "All",
	statusUnread: "Unread",
	statusReading: "Reading",
	statusFinished: "Finished",
	unknownAuthor: "Unknown author",
	addBook: "Add a book",
	settingsTtbKeyName: "Aladin TTB key",
	settingsTtbKeyDesc: "Your personal Aladin open API key (TTB key).",
	settingsTtbKeyPlaceholder: "ttbyourkey…",
	settingsGetKey: "Get an Aladin TTB key",
	settingsSecurityWarning:
		"Your TTB key is stored in plain text in this vault's data.json. Use a key you can revoke, and exclude data.json from any sync you do not trust.",
	settingsLibraryFolderName: "Library folder",
	settingsLibraryFolderDesc: "Folder where book notes are created and read for the library view.",
	settingsCoverFolderName: "Cover folder",
	settingsCoverFolderDesc: "Folder where downloaded cover images are stored.",
	settingsDownloadCoverName: "Download covers",
	settingsDownloadCoverDesc: "Save cover images into the vault. When off, the remote cover URL is used.",
	settingsSearchTargetName: "Search target",
	settingsSearchTargetDesc: "Limit results to domestic (Korean) books or include foreign books.",
	settingsSearchTargetAll: "All books",
	settingsSearchTargetBook: "Korean books only",
	settingsLanguageName: "Language",
	settingsLanguageDesc: "Language used for this plugin's interface.",
	hotkeysHeading: "Command hotkeys",
	hotkeysHint:
		"Assign a shortcut to run each command directly, without the command palette. Click a button and press the key combination. These also appear in Obsidian's Hotkeys settings.",
	hotkeyBlank: "Blank",
	hotkeyPrompt: "Press keys… (Esc to cancel)",
	hotkeyClear: "Clear",
};

const ko: Translation = {
	searchCommand: "도서 검색",
	openLibraryCommand: "서재 뷰 열기",
	createLibraryNoteCommand: "서재 노트 만들기",
	createLibraryNoteDesc: "서재 대시보드 노트를 지금 생성합니다. 이미 있으면 엽니다.",
	createLibraryNoteCta: "생성",
	libraryNoteTitle: "서재",
	ribbonTooltip: "서재 열기",
	searchPlaceholder: "알라딘에서 검색할 도서 제목을 입력하세요…",
	searchInstructionsNav: "이동",
	searchInstructionsSelect: "노트 생성",
	searchInstructionsDismiss: "닫기",
	searchEmpty: "검색 결과가 없습니다.",
	searchNoKey: "먼저 플러그인 설정에서 알라딘 TTB 키를 입력하세요.",
	searchFailed: "알라딘 검색에 실패했습니다. TTB 키와 네트워크를 확인하세요.",
	noticeCreating: "노트를 생성하는 중…",
	noticeCreated: "도서 노트를 생성했습니다",
	noticeExists: "이미 존재하는 도서 노트입니다.",
	noticeCoverDownloaded: "표지를 다운로드했습니다",
	noticeCoverFailed: "표지 다운로드 실패, 원격 링크로 대체합니다.",
	libraryTitle: "서재",
	libraryEmpty: "아직 도서 노트가 없습니다. 도서를 검색해 시작하세요.",
	filterSearchPlaceholder: "제목 또는 저자로 필터…",
	sortLabel: "정렬",
	sortTitle: "제목",
	sortAuthor: "저자",
	sortStarted: "시작일",
	sortFinished: "완독일",
	statusAll: "전체",
	statusUnread: "읽기 전",
	statusReading: "읽는 중",
	statusFinished: "완독",
	unknownAuthor: "저자 미상",
	addBook: "책 추가",
	settingsTtbKeyName: "알라딘 TTB 키",
	settingsTtbKeyDesc: "개인 알라딘 오픈 API 키(TTB 키)입니다.",
	settingsTtbKeyPlaceholder: "ttb내키…",
	settingsGetKey: "알라딘 TTB 키 발급받기",
	settingsSecurityWarning:
		"TTB 키는 이 볼트의 data.json에 평문으로 저장됩니다. 철회할 수 있는 키를 사용하고, 신뢰하지 않는 동기화에서는 data.json을 제외하세요.",
	settingsLibraryFolderName: "서재 폴더",
	settingsLibraryFolderDesc: "도서 노트가 생성되고 서재 뷰가 읽어오는 폴더입니다.",
	settingsCoverFolderName: "표지 폴더",
	settingsCoverFolderDesc: "다운로드한 표지 이미지가 저장되는 폴더입니다.",
	settingsDownloadCoverName: "표지 다운로드",
	settingsDownloadCoverDesc: "표지 이미지를 볼트에 저장합니다. 끄면 원격 표지 URL을 사용합니다.",
	settingsSearchTargetName: "검색 대상",
	settingsSearchTargetDesc: "국내 도서로 한정하거나 외국 도서를 포함합니다.",
	settingsSearchTargetAll: "전체 도서",
	settingsSearchTargetBook: "국내 도서만",
	settingsLanguageName: "언어",
	settingsLanguageDesc: "이 플러그인 인터페이스에 사용할 언어입니다.",
	hotkeysHeading: "명령 단축키",
	hotkeysHint:
		"명령 팔레트를 거치지 않고 각 명령을 바로 실행할 단축키를 지정합니다. 버튼을 누른 뒤 키 조합을 누르세요. 옵시디언 단축키 설정에도 함께 표시됩니다.",
	hotkeyBlank: "지정 안 됨",
	hotkeyPrompt: "키를 누르세요… (Esc 취소)",
	hotkeyClear: "지우기",
};

const ja: Translation = {
	searchCommand: "書籍を検索",
	openLibraryCommand: "ライブラリを開く",
	createLibraryNoteCommand: "ライブラリノートを作成",
	createLibraryNoteDesc: "ライブラリのダッシュボードノートを今すぐ作成します。既にある場合は開きます。",
	createLibraryNoteCta: "作成",
	libraryNoteTitle: "ライブラリ",
	ribbonTooltip: "ライブラリを開く",
	searchPlaceholder: "Aladinで検索する書名を入力…",
	searchInstructionsNav: "移動",
	searchInstructionsSelect: "ノートを作成",
	searchInstructionsDismiss: "閉じる",
	searchEmpty: "検索結果がありません。",
	searchNoKey: "先にプラグイン設定でAladinのTTBキーを入力してください。",
	searchFailed: "Aladin検索に失敗しました。TTBキーとネットワークを確認してください。",
	noticeCreating: "ノートを作成中…",
	noticeCreated: "書籍ノートを作成しました",
	noticeExists: "この書籍ノートは既に存在します。",
	noticeCoverDownloaded: "表紙をダウンロードしました",
	noticeCoverFailed: "表紙のダウンロードに失敗、リモートリンクを使用します。",
	libraryTitle: "ライブラリ",
	libraryEmpty: "書籍ノートがまだありません。書籍を検索して始めましょう。",
	filterSearchPlaceholder: "タイトルまたは著者で絞り込み…",
	sortLabel: "並べ替え",
	sortTitle: "タイトル",
	sortAuthor: "著者",
	sortStarted: "開始日",
	sortFinished: "読了日",
	statusAll: "すべて",
	statusUnread: "未読",
	statusReading: "読書中",
	statusFinished: "読了",
	unknownAuthor: "著者不明",
	addBook: "書籍を追加",
	settingsTtbKeyName: "Aladin TTBキー",
	settingsTtbKeyDesc: "個人のAladinオープンAPIキー（TTBキー）です。",
	settingsTtbKeyPlaceholder: "ttbyourkey…",
	settingsGetKey: "Aladin TTBキーを取得",
	settingsSecurityWarning:
		"TTBキーはこのVaultのdata.jsonに平文で保存されます。取り消し可能なキーを使い、信頼できない同期からはdata.jsonを除外してください。",
	settingsLibraryFolderName: "ライブラリフォルダ",
	settingsLibraryFolderDesc: "書籍ノートが作成され、ライブラリ表示が読み込むフォルダです。",
	settingsCoverFolderName: "表紙フォルダ",
	settingsCoverFolderDesc: "ダウンロードした表紙画像を保存するフォルダです。",
	settingsDownloadCoverName: "表紙をダウンロード",
	settingsDownloadCoverDesc: "表紙画像をVaultに保存します。オフの場合はリモートの表紙URLを使用します。",
	settingsSearchTargetName: "検索対象",
	settingsSearchTargetDesc: "韓国国内書籍に限定するか、外国書籍を含めます。",
	settingsSearchTargetAll: "すべての書籍",
	settingsSearchTargetBook: "韓国書籍のみ",
	settingsLanguageName: "言語",
	settingsLanguageDesc: "このプラグインのインターフェースに使う言語です。",
	hotkeysHeading: "コマンドのショートカット",
	hotkeysHint:
		"コマンドパレットを使わずに各コマンドを直接実行するショートカットを割り当てます。ボタンを押してからキーの組み合わせを押してください。Obsidianのホットキー設定にも表示されます。",
	hotkeyBlank: "未設定",
	hotkeyPrompt: "キーを押してください…（Escで取消）",
	hotkeyClear: "クリア",
};

const zh: Translation = {
	searchCommand: "搜索图书",
	openLibraryCommand: "打开书库视图",
	createLibraryNoteCommand: "创建书库笔记",
	createLibraryNoteDesc: "立即创建书库仪表盘笔记。若已存在则打开。",
	createLibraryNoteCta: "创建",
	libraryNoteTitle: "书库",
	ribbonTooltip: "打开书库",
	searchPlaceholder: "输入书名以在 Aladin 搜索…",
	searchInstructionsNav: "导航",
	searchInstructionsSelect: "创建笔记",
	searchInstructionsDismiss: "关闭",
	searchEmpty: "未找到结果。",
	searchNoKey: "请先在插件设置中填写 Aladin TTB 密钥。",
	searchFailed: "Aladin 搜索失败。请检查 TTB 密钥与网络。",
	noticeCreating: "正在创建笔记…",
	noticeCreated: "已创建图书笔记",
	noticeExists: "该图书笔记已存在。",
	noticeCoverDownloaded: "封面已下载",
	noticeCoverFailed: "封面下载失败，改用远程链接。",
	libraryTitle: "书库",
	libraryEmpty: "还没有图书笔记。搜索一本书开始吧。",
	filterSearchPlaceholder: "按标题或作者筛选…",
	sortLabel: "排序",
	sortTitle: "标题",
	sortAuthor: "作者",
	sortStarted: "开始日期",
	sortFinished: "读完日期",
	statusAll: "全部",
	statusUnread: "未读",
	statusReading: "在读",
	statusFinished: "读完",
	unknownAuthor: "作者不详",
	addBook: "添加图书",
	settingsTtbKeyName: "Aladin TTB 密钥",
	settingsTtbKeyDesc: "你的个人 Aladin 开放 API 密钥（TTB 密钥）。",
	settingsTtbKeyPlaceholder: "ttbyourkey…",
	settingsGetKey: "获取 Aladin TTB 密钥",
	settingsSecurityWarning:
		"TTB 密钥以明文形式存储在本仓库的 data.json 中。请使用可撤销的密钥，并将 data.json 排除在不信任的同步之外。",
	settingsLibraryFolderName: "书库文件夹",
	settingsLibraryFolderDesc: "创建图书笔记并供书库视图读取的文件夹。",
	settingsCoverFolderName: "封面文件夹",
	settingsCoverFolderDesc: "存放已下载封面图片的文件夹。",
	settingsDownloadCoverName: "下载封面",
	settingsDownloadCoverDesc: "将封面图片保存到仓库。关闭时使用远程封面 URL。",
	settingsSearchTargetName: "搜索范围",
	settingsSearchTargetDesc: "限定韩国国内图书或包含外文图书。",
	settingsSearchTargetAll: "全部图书",
	settingsSearchTargetBook: "仅韩国图书",
	settingsLanguageName: "语言",
	settingsLanguageDesc: "此插件界面使用的语言。",
	hotkeysHeading: "命令快捷键",
	hotkeysHint:
		"为每个命令分配可直接运行的快捷键，无需命令面板。点击按钮后按下组合键。这些快捷键也会显示在 Obsidian 的快捷键设置中。",
	hotkeyBlank: "未设置",
	hotkeyPrompt: "请按键…（Esc 取消）",
	hotkeyClear: "清除",
};

const TRANSLATIONS: Record<Exclude<Language, "auto">, Translation> = { en, ko, ja, zh };

function resolveLanguage(language: Language): Exclude<Language, "auto"> {
	if (language !== "auto") {
		return language;
	}
	const locale = window.localStorage.getItem("language") ?? "en";
	if (locale.startsWith("ko")) return "ko";
	if (locale.startsWith("ja")) return "ja";
	if (locale.startsWith("zh")) return "zh";
	return "en";
}

export function getTranslation(language: Language): Translation {
	return TRANSLATIONS[resolveLanguage(language)];
}
