// This file includes untranslated text (ja).

# Interface design

本プロジェクトで体系化の対象とするインターフェース装置を、以下の2種類の機能のどちらかを持つ、または両者を統合した装置と定義する。

(a) 構成機能
システムが受け付けられる命令を構成する。
人の意図の解釈として適切であることを目標に、人の所作から、装置の構成し得る命令のうち、一つを定める。

(b) 信号機能
人が情報を読み取ることのできる現象を生じさせる。
システムが人へ伝えることを要する情報から、人が適切に解釈できることを目標に、生じさせ得る現象のうち、一つを定める。

---

This project provides a general systematization of interface devices.
An interface device is a device having either of the following two functions, or one that combines both.

(a) Determining a request
It produces a request the system can accept.
From the person's behavior, it determines one request among those the device can construct, with the goal that the command be an appropriate interpretation of the person's intent.

(b) Bringing about a phenomenon
It brings about a phenomenon from which the person can gain information.
From the information the system needs to convey to the person, it determines one phenomenon among those it is capable of bringing about, with the goal that the person can interpret it appropriately.

---

# 共通手続き段階

人間の単一の意図表明に始まる、インターフェース装置と人間、システムの間に発生する手続きを段階で定義する:

- P0  操作意思表明
- P0' システム状態信号
- P1  対象選択
- P1' 選択確認信号
- P2  コマンド構成
- P2' 構成確認信号
- P3  執行命令
- P3' 結果信号

なお、単機能操作機器/多機能操作機器の差異は、P0'の省略有無と整理できる。

- 参照: [JIS C 0447 4.2](./references/JIS_C_0447.md)

---

# 部品体系

ライブラリ化可能な範囲でインターフェースの部品を整理する。

- 部品の部品
    - Text block: monospace font, copy button (pre, code, kbd, samp)
    - Card: article > header, footer
    - Hidden:
        - [hidden], .hidden: visibility: hidden
        - aria-hidden
        - .visibility-hidden
    - Fill box: *[data-style="fill"]:before, *[data-style="fill"], *[data-style="fill"]:after
    - Fill header and outline body: [GOV.UK Design System: Notification banner](https://design-system.service.gov.uk/components/notification-banner/)
    - List:
        - ol > li
        - ul > li
        - menu > li
    - Outline box: *[data-style="outline"]:before, *[data-style="outline"], *[data-style="outline"]:after
    - Panel box: div[data-style="panel"] > (*[data-style="fill"], *[data-style="outline"], *[data-style="underline"]) [GOV.UK Design System: Panel](https://design-system.service.gov.uk/components/panel/)
    - Underline text: *[data-style="underline"]:before, *[data-style="underline"], *[data-style="underline"]:after
    - Rule indent(indent block with accent rule): *[data-style="rule-indent"]
    - Mark: mark, *:selection, *[data-style="underline"]:focus-visible
    - Strikethrough: del

- 信号部品
    - Badge: span[data-style]
    - Deletion and addition: div > (del > p, ins > p) (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ins)
    - Description list: dl > (dt, dd)
        - [GOV.UK Design System: Summary list](https://design-system.service.gov.uk/components/summary-list/)
        - Task list: https://design-system.service.gov.uk/components/task-list/
    - Figure: figure > (figcaption > cite, img/table/blockquote/div)
        - Blockquote: figure > (blockquote > p, figcaption > cite)
    - Error message: https://design-system.service.gov.uk/components/error-message/
    - Heading: hgroup > (h1/h2/h3/h4/h5/h6, p)
    - Meter: label > meter
    - Progress indicator:
        - Loading: *[aria-busy="true"] [Pico: Loading](https://picocss.com/docs/loading)
    - Table: table > (caption, (thead, tbody, tfoot) > tr > (th, td))
    - Tabs: ul > li, div
    - Input count: p[role="status"][aria-live="polite"][aria-atomic="true"] > (samp, span)
    - Icon: image [Kelp CSS: Avatar](https://kelpui.com/docs/components/avatar/)

- P2(コマンド構成)部品
    - Checkbox: fieldset > (legend, label > input[type="checkbox"])
    - Color picker
    - Coordinate picker: label > input[type=image]
    - Dropdown:
        - details > (summary, ul > li) [Pico: Dropdown](https://picocss.com/docs/dropdown)
        - label > select > optgroup > option
    - Email: label > input[type="email"]
    - File picker: label > input[type=file]
    - Numeric: label > (button[type="button"], input[type="text"][inputmode="numeric"], button[type="button"])
    - Password:
        - label > input[type="password"][autocomplete="current-password"], label > input[type="checkbox"]
        - fieldset > (legend, label > input[type="password"][autocomplete="new-password"], label > input[type="checkbox"], label > input[type="password"][autocomplete="new-password"], label > input[type="checkbox"])
    - Radio: fieldset > (legend, label > input[type="radio"])
    - Range: label > input[type=range]
    - Searchbox: label > input[type=search], [role="search"]
    - Tel: label > input[type="tel"]
    - Temporal: fieldset[role=group] > (legend, (label > input[type=text][inputmode=numeric]))
        - [autocomplete="bday-year", "bday-month", "bday-day"]
    - Text: label > input[type="text"], [readonly], [disabled], [aria-invalid], ::placeholder
    - Textarea: label > textarea
    - Url: label > input[type="url"]

- P1~P3(対象選択~執行)パターン
        - Command button: [disabled]
        - label > button[type="button"], a[role=button]
        - Back link, Link: a, button[role="link"]
          - Link copy button: chain(🔗) 
          - Anchor link: [Kelp: Heading anchors](https://kelpui.com/docs/components/heading-anchors)
        - Breadcrumb: nav > ol > li > a
        - Pagenation: nav[aria-label="Pagination"] > (a[rel=prev] > span, ul > li > a[aria-current="page"], a[rel=next]) [GOV.UK Design System: Pagenation](https://design-system.service.gov.uk/components/pagination/)
    - Cookie agreement: https://design-system.service.gov.uk/components/cookie-banner/
    - Disclosure: details > (summary, div)
    - Form: form, fieldset > legend, submit button[type="submit"], button[type="reset"]
        - Hint
        - Error summary: div[role="alert"] > p, (ul > li) (https://design-system.service.gov.uk/components/error-summary/)
    - Toggle button: label > input[type="checkbox"]
    - Tooltip: *:hover, *:focus

- その他
    - header, footer
    - section: 汎用ブロック要素
    - article: 汎用ブロック要素(独立して意味の通る情報)
    - dialog:  汎用ポップアップ要素, ::backdrop, backdrop-filter
    - label > output
    - body > header, main, aside, body > footer
    - address
    - nav, search, form: セマンティクスラッパー
    - hr
    - cite
    - q
    - ruby > rt
    - em, strong
    - small: 免責事項、著作権表示、利用規約への言及
    - sub
    - sup
    - dfn
    - abbr
    - bdi
    - time[datetime]
    - Media: img, iframe, object, video, audio

---

## P1~P3'パターン具体例

- 表中「タップ」はショートクリック・ショートタップ(ポインターダウンからポインターアップまで)を指す。
- 長押し時・ドラッグ時の挙動については、定義を別途必要とする行がある。
- P3' 結果信号については、エラー時の定義を別途必要とする行がある。

| 名前 | 既存例 | P1 | P1' | P2 | P2' | P3 | P3' |
|-|-|-|-|-|-|-|-|
| toggle switch | Switch(ARIA APG) | フォーカス, ポインターホバー | 表示(ラベル)とフォーカスリング, ホバーハイライト | | 表示(トラック・つまみ) | Enter, 表示へのタップ | 表示(トラック・つまみ) |
| command button | Button(ARIA APG), 押ボタン(JIS C 0447) | フォーカス, ポインターホバー | 表示(ラベル)とフォーカスリング, ホバーハイライト |  | 表示(囲み・ラベル) | Enter, Space, タップ | |
| immediate slider | Sliders(Material 3, 連続型), ハンドホイール・ノブ(JIS C 0447) | ポインターホバー / フォーカス, ポインターダウン | 表示(ラベル)とホバーハイライト / 表示(ラベル)とフォーカスリング, 表示(トラック・つまみ)の押し込み表現 | 矢印キーダウン, ポインタームーブ | 表示(トラック・つまみ) | | |
| rating | Rate(Ant Design), Rating(Fluent 2) | フォーカス, ポインターホバー | 表示(ラベル)・フォーカスリング, ホバーハイライト | 矢印キー, ポインタームーブ | 表示(星の充填)のプレビュー表現 | Enter, タップ | 表示(星の充填数) |
| inline edit | Inline edit(Atlassian Design System), Treegrid(ARIA APG) | フォーカス, タップ | 表示(ラベル)へのフォーカスリング, 表示(インラインコンテンツ)の入力枠・キャレット表現 | テキスト入力・選択 | 表示(インラインコンテンツ) | Enter, フォーカスアウト | 表示(ラベル・インラインコンテンツ) |
| drag and drop reordering | Drag and drop(Apple HIG) | 表示(つまみ)へのポインターダウン | 表示(コンテンツ・囲み)の掴み表現 | ポインタームーブ | 表示(コンテンツのリスト)の挿入箇所プレビュー表現 | ポインターアップ, 境界外ポインタームーブ(キャンセル) | 表示(コンテンツのリスト) |
| command menu | Menu and Menubar(ARIA APG), Pull-down buttons(Apple HIG) | メニューへのフォーカス, ポインターホバー / ポインターダウン | 表示(メニューラベル)とフォーカスリング, ホバーハイライト / 表示(オプションリスト) | オプションへのフォーカス, ポインターホバー | オプションのフォーカスリング, ホバーハイライト | オプションへのEnter, タップ | |
| immediate select | Pop-up buttons(Apple HIG), Menus(Material 3) | トリガーへのフォーカス, ポインターホバー / ポインターダウン | フォーカスリング, ホバーハイライト / 表示(オプションリスト) | オプションへのフォーカス, ポインターホバー | オプションのフォーカスリング, ホバーハイライト | オプションへのEnter, タップ | 表示(値) |
| undo action | Snackbarのアクション(Material 3) | フォーカス, ポインターホバー | 表示(ラベル)とフォーカスリング, ホバーハイライト | | 表示(ラベル) | Enter, タップ | |
| emergency stop | 非常（緊急）停止(JIS C 0447) | フォーカス, ポインターホバー | 表示とフォーカスリング, ホバーハイライト | | 表示 | Enter, ポインターダウン | 表示の押下状態表現 |
| hold-to-run control | インチング（寸動）操作(JIS C 0447) | フォーカス/ポインターホバー | 表示(ラベル)とフォーカスリング, ホバーハイライト | | | Enter, ポインターダウン | 表示(メーター) |
| command palette | Spotlight(Apple), Combobox(ARIA APG) | 表示(検索ボックス)へのフォーカス, タップ | 表示(検索ボックス)へのフォーカスリング, ハイライト | 表示(検索ボックス)への入力 | 表示(候補)へのフォーカスリング, ハイライト | Enter, 表示(候補)へのタップ | |
| form submission | form(HTML Living Standard), 多機能の3ステップ動作順序(JIS C 0447) | 各P2部品依存 | 表示(囲み・formの見出し) | 各P2部品依存 | 表示(囲み・formの見出し・各P2部品) | submit buttonへのenter, タップ | 表示(バリデーションエラーサマリー・メッセージ) |
| wizard | Steps+Form(Ant Design), Progress indicator(Carbon Design System) | 各P2部品依存 | 表示(囲み・step indicator) | 各P2部品依存・proceedボタンとbackボタン | 表示(囲み・step indicator・各P2部品), 表示(バリデーションエラーサマリー・メッセージ) | submit buttonへのenter, タップ | 表示(バリデーションエラーサマリー・メッセージ) |
| tooltip | Tooltip(ARIA APG), Tooltip(Material 3) | フォーカス, ポインターホバー | | | | | 表示(コンテンツ・囲み) |

- multi-select apply | Transfer(Ant Design)
- dialog
- tabs | tabs(ARIA APG), セレクタスイッチ・機器選択群(JIS C 0447 図2 ステップ1)
- link | link(ARIA APG), breadcrumb(ARIA APG)
- pagination | pagination(Bootstrap), Pagination(Ant Design)
- navigation menu | navigation bar／drawer(Material 3): command menuのlink機能実装
- search | search(Material 3), search field(Apple HIG): command palletのlinkまたは表示切替機能実装
- filter chip | filter chip(Material 3), CheckableTag(Ant Design)
- sort control | column sorter(Ant Design Table), sort menu(Fluent 2)
- disclosure | disclosure(ARIA APG), Collapse(Ant Design)
- tree view | tree view(ARIA APG), Tree(Ant Design)
- carousel | carousel(ARIA APG), carousel(Bootstrap)
- window splitter | window splitter(ARIA APG), split view(Apple HIG)
- scrolling feed | feed(ARIA APG), infinite scroll(各実装)

## P2部品

- フォーカスリング・ホバーハイライトを要する

| 名前 | 既存例 | 構成 |
|-|-|-|
| checkbox | checkbox(ARIA APG), checkbox(Material 3) | 表示(ラベル, ボックス), 真偽値表現 |
| radio button | radio group(ARIA APG), Radio(Ant Design) | 表示(ラベル, リスト(ラベル, ボタン)), 真偽値表現 |
| text field | text field(Material 3), 英数字キーボード(JIS C 0447 3.2.2) | 表示(ラベル, 入力枠), キャレット表現 |
| text area | textarea(HTML Living Standard) | 表示(ラベル, 入力枠), キャレット表現, Enter時改行機能 |
| select | select(HTML Living Standard), dropdown(Fluent 2) | 表示(ラベル, オプションリスト, 無効オプション行ラベル, オプションボタン), 閉時の値表現 |
| listbox | listbox(ARIA APG), list box(Fluent 2) | 表示(ラベル, 囲い, オプションリスト, オプションボタン), オプションの有効表現 |
| slider | slider(ARIA APG), Slider(Ant Design) | 表示(ラベル, トラック, つまみ) |
| date picker | date picker(Material 3), DatePicker(Ant Design) | 表示(ラベル, カレンダー) |
| time picker | time picker(Material 3), TimePicker(Ant Design) | 表示(ラベル, 時間入力枠, 分数入力枠) |
| file uploader | input type=file(HTML Living Standard), Upload(Ant Design) | 表示(ラベル, 実行ボタン) |
| input chip | input chip(Material 3), Tag(Ant Design 入力用途) | 表示(ラベル, トラック, 左又は右アイコン) (Material 3: "The stroke color was softened to improve visual hierarchy between chips and buttons") |
| enabling button | 許可装置(JIS C 0447 7.7.3) | |
| spin button | spinbutton(ARIA APG), stepper(Apple HIG) | 表示(増方向ボタン, 減方向ボタン) (JIS 5.1: 増減ジェスチャの反対動作対) |

## P3部品

| 名前 | 既存例 | 構成 |
|-|-|-|
| submit button | button type=submit(HTML Living Standard), 実行専用操作部(JIS C 0447 7.7.5 図2 ステップ3) |  |
| confirmation dialog | alert and message dialogs(ARIA APG), 2段操作インタロック(JIS C 0447 4.1.7) | 表示(ダイアログ, cancel button(HTML form: reset), confirm button(alertdialog内, ARIA APG)またはconfirm input) |
| two-hand control | ツーハンド制御(JIS C 0447 7.7.3) | 複合キー操作（例: Ctrl+Enterでsubmit） |

## 信号部品（P0'・P1'・P2'・P3'）

| 名前 | 既存例 | 構成 |
|-|-|-|
| status indicator | 状態表示ランプ(JIS C 0447 図1「ポンプ1停止中」), badge(Material 3), meter(ARIA APG) | 表示(トラック, テキスト) |
| selection highlight | focus・hover(HTML Living Standard), 選択した機器の確認表示(JIS C 0447 図2) | 表示(フォーカスリング, ホバーハイライト) |
| validation message | error text(Material 3), validation message(Fluent 2) | 表示(サマリー(囲み, テキスト)) |
| staging preview | 入力プレビュー・差分表示(各実装), 選択コマンドの表示(JIS C 0447 図2) | |
| progress indicator | progress indicators(Material 3), skeleton(Fluent 2) | |
| result notice | alert(ARIA APG), 結果表示ランプ(JIS C 0447 図1「ポンプ1始動」) | |
| sound feedback | 聴覚信号(JIS C 0447 3.4.2, 6.2) | |
| haptic feedback | 触覚信号(JIS C 0447 3.4.3, 6.3) | |

---

## 持続状態

P1'〜P3'の信号部品は、フォーカス・ホバーのような一時的な相互作用状態を扱う。それとは別に、部品が値および文脈から負う**持続状態**の軸が要る。[XForms 1.1 6章・4.4節](./references/XForms11.md)のmodel item propertyとその遷移イベントの対を、閉じた状態集合として採る。

| 状態 | 属性/セレクタ | 継承 | 遷移信号 |
|-|-|-|-|
| relevant | `[hidden]`, `[aria-hidden]`, `:disabled`, `[aria-disabled]` | **祖先のAND** | 出現・消失, disabled表現(Kelp: button `opacity:0.7`+`pointer-events:none` / checkbox `opacity:0.6`+`cursor:not-allowed`) |
| readonly | `[readonly]`, `[aria-readonly]` | **祖先のOR** | 入力枠・キャレット表現の消失 |
| required | `[required]`, `[aria-required]` | しない | 必須マーク(ラベルへの付加) |
| valid | `:user-invalid`, `[aria-invalid]` | 子の集約 | validation message |
| in-range | `:in-range`, `:out-of-range`, `[aria-valuemin]`, `[aria-valuemax]` | しない | 範囲外表現 |
| busy | `[aria-busy]` | 子孫への伝播 | progress indicator (Pico: 属性のみでスピナー) |

- **relevantが他のすべての状態に先行する**(XForms 8.1.1: 関与復帰時に`xforms-enabled`→値→valid→readonly→required→in-rangeの順で再表明)。非関与のあいだ他の状態は意味を持たない。よってCSSでもrelevantの否定を最優先で適用し、他状態の装飾を打ち消す。
- 継承規則はCSSの子孫セレクタと`:has()`で直接書ける。relevantのANDは祖先の`[aria-disabled]`からの子孫セレクタ、readonlyのORも同様。validの子集約は`:has(:user-invalid)`。
- relevantがfalseの部品は**ナビゲーション順序から除外**しフォーカスを与えない(XForms 6.1.4)。`display:none`/`[hidden]`は自動的にそうなるが、disabled表現で残す場合は`tabindex`の扱いを別途要する。
- in-rangeはvalidとは別軸で、**部品が値を表現しきれるか**を指す(例: sliderのトラック範囲外の値、date pickerの表示月外の日付)。
- 必須・妥当・表現可能性・読取専用の4つは、XFormsが描画の区別を**必須要件**とし、かつスタイルシートから制御可能にすることを要求している(8.1.1)。本ライブラリの責務範囲がここに重なる。

---

## 規則要素

JIS C 0447(IEC60447:1993)の基本原則の規則化要素

| 名前 | 既存例 | 構成 |
|-|-|-|
| control grouping | toolbar(ARIA APG), 機能・順序・頻度・優先順位によるグループ化(JIS C 0447 4.1.8) | P1要素の配列規則。 |
| group boundary | divider(Material 3), 区画枠(JIS C 0447 4.1.8) | 表示(囲み)によるcontrol groupingの視覚表現。 |
| identification mark | Avatar(Ant Design), 図記号・色・文字による識別(JIS C 0447 6)  | 信号要素の識別規則 |
| direction mapping | 操作方向と結果の対応(JIS 表A)  | P2要素のジェスチャ方向の符号化規則 |
| neutral position | 停止位置規則(JIS 5.2) | 中立・停止状態の空間的定位規則 |

---

## Keyboard operation

- [ARIA APG: pattern](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [IBM Common User Guide](./references/ibm_common_user_access/)
- [Microsoft: Shortcut Keys](https://learn.microsoft.com/en-us/previous-versions/windows/desktop/bb246441(v=vs.85)?redirectedfrom=MSDN)
- [Microsoft: Keyboard Interface Summary](https://learn.microsoft.com/en-us/previous-versions/ms997427(v=msdn.10))

| Component | Key | Specification |
|-|-|-|
| Button, Link  | Enter, Space | Activates the button. |
|               | Tab / Shift + Tab | Seque focus to /  |
| Disclosure    | Enter, Space | (Dis)close a panel if focused |
| Modal, Drawer | Escape | Closes the dialog. |
| Link | Shift + F10 | Opens a context menu for the page or focused element. |
| Textarea | Tab / Shift Tab | Indent if caret visible / unindent |
| Dropdown, Spin button | ↓ / ↑ | |
| Radio button, Slider | → / ← |

---

## Bertin (1967) Sémiologie graphique

### 4性質の定義

| 仏語 | 日本語 | 意味 |
|-|-|-|
| sélectif (sélectivité) | 選択性 | 同じ図の中で、あるカテゴリの記号だけを瞬時に「浮き上がらせて」見つけられるか。例:多色の点群の中から青い点だけを一瞬で識別できるか。 |
| associatif (associativité) | 結合性 | 他の変数(色・位置など)が変化しても、あるカテゴリを一貫して知覚できるか。例:色や位置が違っても三角形を「三角形」として見つけられるか。 |
| ordonné (ordre) | 順序性 | その変数を使った図形同士の間に、視覚的な「順序」を感じ取れるか。 |
| quantitatif (quantité) | 定量性 | その変数を使った図形同士の間に、量の比率(何倍か)を感じ取れるか。 |

### 6つの網膜変数 × 4性質のマトリクス

| 変数(仏語/日本語) | 選択性 | 結合性 | 順序性 | 定量性 |
|-|-|-|-|-|
| Position/Plan(位置・平面 X,Y) | ○ | ○ | ○ | ○ |
| Taille(サイズ) | ○ | ✕ | ○ | ○ |
| Valeur(明度) | ○ | ? | ○ | ✕ |
| Grain(粒状・テクスチャー) | ○ | ○ | △ | △ |
| Couleur(色相) | ○ | ○ | ✕ | ✕ |
| Orientation(傾き) | △(点では○、面では✕) | ○ | ✕ | ✕ |
| Forme(形) | ✕ | ? | ✕ | ✕ |

---

## Color

グローバル体系:
- ink   : 体系内で最も(濃い/薄い)基本文字色。
- paper : 体系内で最も(薄い/濃い)基本背景色。
- mute  : inkとpaperの混文字色(灰色)。
- emphasis:    UIの印象を表現する色。各コントラスト要件に応じたバリアントの集合概念。コンポーネントレベルで上書き可能。
- error:       赤系の色。textに使用不可(borderかfillのみに使用可能)。
- invalid:     エラーサマリー及びメッセージ表現は表外で別途実装する。
- transparent: 各コンポーネントは、paper(または--rgb-base-*)色上に載る前提とする。

コンポーネント内体系:
- background: コンポーネントに隣接する背景色。
- border:     コンポーネントが持つ、境界線色。
- fill:       コンポーネントが持つ、境界内塗り色。
- text:       コンポーネントのインライン文字色。

| Style | | :focus-visible | :hover | :focus-visible:hover | :user-invalid | :user-invalid:focus | :disabled, [aria-disabled="true"] |
|-|-|-|-|-|-|-|-|
| `select` | mute border, transparent background, mute text | emphasis outline, ink border | `cursor: pointer;` | - | error border | error border, error outline | mute border, mute text, `cursor: not-allowd` |
| `input:is([type="text"], [type="email"], [type="password"], [type="search"], [type="url"]), textarea` | (as above), mute caret, ink text |  | `cursor: text;` | | | | |
| `[data-style="outline"]` | emphasis border, transparent background, emphasis text | emphasis outline | emphasis text(差分), 太い下線, `box-decoration-break: clone;cursor: pointer;` | - | - | - |  |
| `[data-style="fill"]` | transparent border, emphasis background, paper text | emphasis outline | emphasis background(差分), 下線の太線化  | - | - | - | mute(差分) background, `cursor: not-allowd` |
| `a:not([data-style]), [data-style="underline"]` | transparent background, ink text, ink underline | emphasis outline | underline太線化 | - | - | - | mute text, mute underline, `cursor: not-allowd` |

---

## forced-colors: active

- [W3C: CSS Color Adjustment Module Level 1](https://www.w3.org/TR/css-color-adjust-1/)

以下が強制的にSystem Color(CSS Color Level 4)またはnone, autoで上書きされる。

- accent-color: auto;, background-color, border-color, caret-color, color, flood-color, fill, lighting-color, outline-color, rule-color, scrollbar-color: auto;, stop-color, stroke, text-decoration-color, text-emphasis-color, "box-shadow and text-shadow compute to none", "background-image computes to none"(但し、url()は例外的に除かれる), "color-scheme computes to light dark"
- `forced-color-adjust: none`(`header/_mixin.scss:53,102`(バックプレートが下線を隠すのを防止)、`warning-text/_mixin.scss:49`(感嘆符の丸))
- tag(`tag/_mixin.scss:81`)は forced-colors 下で背景色が本文と同色になるため `font-weight: bold` で区別を作る。かつては透明outlineを足していたが、**ボタンと区別がつかなくなる**ため廃止した経緯がコメントにある。
- `skip-link/_mixin.scss:33` は forced-colors 下で `outline-offset` を負値へ反転させ、outlineを要素の内側に描く。accordion(`accordion/_mixin.scss:340`)は Firefox 特有の挙動対応で、`<button>` 内テキストが常に黒になる一方で**入れ子要素の背景だけがユーザー指定色になる**ためコントラスト事故が起きる。そのためフォーカス/ホバー時に入れ子要素の背景を `transparent` へ戻している。

| キーワード | 用途 |
|---|---|
| `Canvas` | ページ/コンテンツの背景 |
| `CanvasText` | 本文の文字色 |
| `LinkText` | 未訪問リンク |
| `VisitedText` | 訪問済みリンク |
| `ActiveText` | アクティブ(押下中)リンク |
| `ButtonFace` | ボタンの背景 |
| `ButtonText` | ボタンの文字色 |
| `ButtonBorder` | ボタンの枠線色 |
| `Field` | テキスト入力欄などの背景 |
| `FieldText` | 入力欄の文字色 |
| `Mark` | `<mark>` 相当のハイライト背景 |
| `MarkText` | `<mark>` 相当のハイライト文字色 |
| `Highlight` | テキスト選択時などの背景(反転色) |
| `HighlightText` | 選択された部分の文字色 |
| `SelectedItem` | (新しめ)選択された項目の背景。`Highlight` の後継的位置づけ |
| `SelectedItemText` | 選択された項目の文字色 |
| `GrayText` | 無効化(disabled)要素の文字色 |
| `AccentColor` | チェックボックス・ラジオなどのアクセント色(比較的新しい) |
| `AccentColorText` | `AccentColor` 上に乗る文字色 |

### 参考: Kelp の forced-colors 実装

govuk-frontend が「透明outline/borderを常時置く」パターン中心なのに対し、Kelp は**メディアクエリ内で最小限を足す**方式。

| 箇所 | 内容 | 手法の分類 |
|---|---|---|
| `components/switch.css:42` | `[role="switch"]` に `border: 1px solid CanvasText`、`:checked` で `background-color: CanvasText` | システムカラー明示。ON/OFF を色ではなく塗りの有無で伝える |
| `components/forms.css:215` | checkbox/radio の `:checked`/`:indeterminate` の `::after` に `background-color: CanvasText` | 同上。チェックマーク自体が消えるのを防ぐ |
| `components/mark.css:11` | `background`/`color` を **`revert`** に戻す | 自前のハイライト色を捨て、UA既定(=`Mark`/`MarkText` 相当)に委ねる |
| `components/skeleton.css:20` | `border: var(--size-6xs) solid` を追加 | 背景色だけで存在を示す要素に輪郭を与える |
| `components/dialog.css:33` | `border-width: var(--size-5xs)` を追加 | 同上(影で浮かせている要素の輪郭確保) |
| `components/tabs-wc.css:43` | 選択中タブに `border-width: var(--size-5xs)` | 選択状態を色以外で示す |
| `components/date-picker.css:10` | `.dark ::-webkit-calendar-picker-indicator` に `filter: invert(1)` を維持 | forced-colors 下でも反転を維持する意図的な例外 |

### 実際のCSSライブラリで個別対応が必要な内容

上の一括指定では拾えず、コンポーネント単位の判断が必要になるもの。

- **box-shadow だけで作っているフォーカスリング** — forced-colors では box-shadow が描画されず、フォーカスが完全に消える。透明 `outline` の常時併置が必須。現行実装はフォーカスに `outline` を使っている(`base.css:108-121`)ため素性は良いが、`--color-focus`(黄)の背景・box-shadow に依存している箇所は代替が必要。論点#8/#10 と合わせて確認する。
- **`--color-focus`(黄)を background-color で塗るフォーカス表現** — GOV.UK の focused-text 型の「マーカー塗り」は forced-colors で消える。黄色の帯を主表現にする設計を採るなら、透明 outline のフォールバックを同時に入れることが前提条件になる。
- **`border: none` を基本ルールにしている要素** — forced-colors では背景色差が消えるので、border が無い要素は輪郭を失う。透明 border を先に確保しておく必要がある(論点#10 で `border-color` が死んだ宣言になっている件と根が同じ)。
- **hover/active の色差** — ink基調のウォッシュ(`--color-wash-hover` 等)は forced-colors 下で消え、hover のフィードバックが失われる。論点#6/#11 と合わせ、色以外の手掛かり(下線の太さ、outline)を持たせるか判断する。
- **`data-style="fill"` 系ボタン** — 白文字+塗り背景という構成は forced-colors で `ButtonFace`/`ButtonText` に置換され、outline系ボタンとの視覚差が消える。区別を色だけに依存していないか確認する。
- **入れ子要素に背景色を持つインタラクティブ要素** — accordion と同じ Firefox 挙動を踏む。`<button>` 内に背景色付きの子要素があるなら、forced-colors 下で子の背景を `transparent` へ戻す。
- **disabled 表現** — 現行が opacity や薄い色で表現している場合、forced-colors では区別が消える。`GrayText` の明示指定が必要。
- **SVGアイコン** — `fill: currentcolor` でも親の色を継承しない実装があるため `forced-color-adjust: auto` が必要。逆に、リーダビリティ・バックプレートが下線やアイコン形状を潰す箇所では `forced-color-adjust: none` を選ぶ。どちらが必要かは要素ごとに実機確認が必要。
- **色のみで状態を伝えている要素(tag/badge/バリデーション)** — 背景色が地と同化する。太字・border・アイコンなど色以外の手掛かりを足す。invalid の `--color-invalid`(論点の `forms.css:176`)も forced-colors では色差が消えるため、テキストや記号での明示が必要。
- **`outline-offset` が親要素に食われるケース** — skip-link のように要素が画面端やオーバーフロー境界にある場合、offset を負値にして内側に描く必要がある。
- **アイコンフォント・擬似要素の装飾** — `content` による記号は残るが色が置換されるため、地と同化しないか確認する。
- **`::selection` のカスタム色** — 独自指定していると forced-colors 下で `Highlight`/`HighlightText` に戻す指定が必要。
- **画像・グラデーションで情報を伝えている箇所** — forced-colors は画像自体は置換しないため、背景がシステムカラーになった上に元の色の画像が乗り、コントラスト事故が起きうる。

---

## prefers-reduced-motion

- 自動モーションはデフォルトの定義には適用せず、`@media (prefers-reduced-motion: no-preference)`で明示オプションとして全コンポーネントを設計する。

### 個別に対応が必要な内容

- **一括 `!important` はフォーカス表現を壊しうる** — フォーカスリングのフェードインなど「動きが状態変化を伝えている」箇所まで消える。論点#8/#10 のフォーカス表現に transition を使うなら、その要素は一括指定の対象外にするか、`transition-duration` を短縮するだけに留める判断が必要。
- **JS 駆動のアニメーション** — CSS メディアクエリでは止まらない。`matchMedia("(prefers-reduced-motion: reduce)")` を JS 側で読んで分岐する必要がある。`scrollIntoView({behavior: "smooth"})`、`Element.animate()`、requestAnimationFrame ベースの処理が該当。
- **`scroll-behavior: smooth`** — CSS 側は上で打ち消せるが、`html` に直接指定している場合はセレクタが届くか確認が必要(`html:focus-within` は回避策として広まった書き方で、素の `html` にも別途指定した方が確実)。Kelp も `*` 側のリセットに `scroll-behavior: auto !important` を含めており、`html` を個別に狙ってはいない。
- **自動再生する動画・GIF・カルーセル** — CSS では止まらない。`autoplay` の除去や一時停止コントロールの提供が必要。WCAG 2.2 達成基準 2.2.2 Pause, Stop, Hide の対象。
- **`transform: scale()` を伴う hover** — 論点#6/#11 の hover 表現に拡大縮小を使う場合、reduced-motion 下では色や下線など動き以外の手掛かりに退避させる。動きを消した結果 hover のフィードバックが完全に消失しないよう確認する。
- **ローディングスピナー** — `animation-iteration-count: 1` を当てると1回転で停止し、「処理中」が伝わらなくなる。Kelp の `spinner.css:128` のように、スピナー自体を `content: attr(fallback) / ""` によるテキスト表示へ差し替えるのが最も情報が保たれる。属性セレクタで一括リセットから除外するだけの手もあるが、それでは回転が続くだけで reduced-motion の要求に応えていない。
- **`prefers-reduced-motion: no-preference` を前提にした設計** — 未指定(=`no-preference`)がデフォルトなので、モーションを足す側を `@media (prefers-reduced-motion: no-preference)` で囲む方式もある。「動かないのが基本、動くのは上乗せ」になり事故が少ないため、新規実装ではこちらを推奨。

---

## prefers-contrast

`@media (prefers-contrast: more) and (forced-colors: none)` と書く必要がある。

| 書き方 | 用途 | 備考 |
|---|---|---|
| `@media (prefers-contrast)`(値なし) | **視覚的な単純化**。装飾グラデーション・背景画像・box-shadow を単色やsolid borderに置き換える | `more`/`less`/`custom` すべてで真。forced-colors ユーザーにも有益(仕様が明記) |
| `@media (prefers-contrast: more)` | コントラストを上げる | forced-colors でも真になるため要注意 |
| `@media (prefers-contrast: less)` | コントラストを下げる | 片方だけに当てるなら値を明示する |
| `@media (prefers-contrast)` を高コントラスト用に使う | **仕様が "incorrect and user-hostile" と明言** | `less` を要求した人に高コントラストを押し付けるため |

上を踏まえ、`prefers-contrast: more` で色を濃くする部分は `forced-colors: none` で保護し、値なしの `@media (prefers-contrast)` は仕様推奨どおり「視覚的単純化」専用とする。

| メディアクエリ | 意味 | 自前の色は | 値なし `(prefers-contrast)` で真? |
|---|---|---|---|
| `forced-colors: active` | ブラウザが色を強制置換する | **消える**(システムカラーに置換) | — (別のクエリ) |
| `prefers-contrast: more` | より高いコントラストを望んでいる | 保たれる(forced-colors 併発時を除く) | ○ |
| `prefers-contrast: less` | コントラストを下げたい | 保たれる | ○ |
| `prefers-contrast: custom` | 独自パレット使用中(高低どちらでもない) | 環境依存 | ○ |
| `prefers-contrast: no-preference` | 未指定 | — | × |

| 環境 | forced-colors | prefers-contrast |
|---|---|---|
| Windows ハイコントラスト(高コントラストなパレット) | `active` | `more` |
| Windows ハイコントラスト(高低どちらでもないパレット) | `active` | `custom` |
| macOS「コントラストを上げる」 | `none` | `more` |
| 設定なし | `none` | `no-preference` |

### 個別に対応が必要な内容

- **`(forced-colors: none)` による保護をどこまで付けるか** — 上のコードブロックは層2・層3の両方に付けたが、これは「自前の色を濃く/薄くする」指定だから。`border-width` を太らせるだけの指定なら forced-colors 下でも有害ではないので、保護を外して両環境に効かせる判断もありうる。**プロパティ単位で判断する必要がある**(色系は保護、寸法系は素通しでよいことが多い)。
- **forced-colors 側の透明 border との二重指定** — forced-colors 節で「透明 border を常時置く」パターンを採ると、層2の `border-width: 2px` と太さが競合する。層2に `(forced-colors: none)` を付けている限り同時適用はされないが、保護を外す判断をした場合は実機確認が必要。
- **`--color-emphasis-fill` 系のブランド色** — 黒白に振り切ると、ブランド色を使った fill 系ボタン(論点#8)が没個性になる。「どこまでブランドを保つか」は自動判定できず、デザイン判断が必要。
- **hover/active のウォッシュ(論点#6/#11)** — ink基調のウォッシュは `more` 下で地と同化するか、逆に濃すぎて文字が読めなくなる。トークンを振り切った後のコントラスト比を、ライト/ダーク双方で再計測する必要がある(論点#6 で既に指摘されている「統合後の配色がライト/ダーク双方でコントラスト要件を満たすか確認」に、`more` の軸が加わる)。
- **`--color-invalid` などの状態色** — `more` 下で赤・緑の区別が保てるか。色相を保ったまま明度だけ下げる必要があり、単純な黒への置換ではエラー表現が壊れる。
- **薄いグレーの本文・プレースホルダー** — `more` で最も効果が大きい対象。ただし `::placeholder` を本文色まで濃くすると入力値と区別がつかなくなるため、濃くしつつ差は残す。
- **画像・アイコンの中の色** — CSS トークンでは届かない。SVG なら `currentcolor` 化しておけば追従するが、ラスタ画像は別途高コントラスト版を用意するか、`filter: contrast()` で対処するかの判断が必要。
- **ダークモードとの組み合わせ** — `prefers-color-scheme: dark` と `prefers-contrast: more` の同時成立時、ダークの地に対して振り切るべき方向が逆になる(白文字を #fff へ、地を #000 へ)。上のコードブロックはライト前提なので、ダーク側の指定と組み合わせる際は入れ子の順序に注意する。なお仕様 §12.4 には「forced-colors のパレットが `prefers-color-scheme` のいずれかに合致する場合、その値も真になる」という規定もあるため、Windows ハイコントラストのダークテーマでは `dark` も同時に立つ。
- **`less` を無視しないこと** — `more` だけ対応して `less` を放置する実装は珍しくないが、仕様 §12.3 は `less` の需要理由として片頭痛(強いコントラストが視覚的苦痛)とディスレクシアの一部(高コントラストの文字が光って見える)を挙げている。`more` と対称に扱うのが本来。
- **そもそも採用するかの判断** — 参照3ライブラリすべてが0件という事実は重い。「最初から全配色を高コントラストで設計する」(GOV.UK 方式)を採れば層2は不要になる。導入するなら、層1(視覚的単純化)だけを入れるのが最も費用対効果が高く、仕様の推奨にも合致する。
