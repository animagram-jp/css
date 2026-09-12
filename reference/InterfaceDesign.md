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

## 本プロジェクトについて

インターフェース装置の設計には、設計時には知り得ない個人と、コンピューターアルゴリズムが干渉しあう。
UD(個人や状況に依らず機能する)の網羅性の程度も、機能品質の程度も、決して100%を達成することはない。
本プロジェクトの成果物は、インターフェース装置を形成する各要素が、自然言語による定義とCSS実装で構成されたライブラリ形式を想定する。
インターフェース装置は、CSSで表すことのできるより遥かに広い組み合わせ空間を持つため、本プロジェクトの要素群は、体系を網羅することはできない。要素の体系は、自然言語によるインターフェース装置の取り得る空間内の整理、HTMLとCSSによる具体的な実装の、トップダウンとボトムアップからそれぞれ行い、この2つの語彙を整合することで行う。

---

## 共通手続き段階

人間の単一の意図表明に始まる、インターフェース装置と人間、システムの間に発生する手続きを以下に定義する。

1. 人間の所作と装置の構成機能: 操作意思表明 (P0)
2. 装置の信号機能: システム状態信号 (P0')
3. 人間の所作と装置の構成機能: 対象選択 (P1)
4. 装置の信号機能: 選択確認信号 (P1')
5. 人間の所作と装置の構成機能: コマンド構成 (P2)
6. 装置の信号機能: 構成確認信号 (P2')
7. 人間の所作と装置の構成機能: 執行命令 (P3)
8. 装置の信号機能: 結果信号 (P3')

- reference: JIS C 0447:1997 (IEC60447:1993) Man-machine-interface (MMI) - Actuating principles

---

## 所作 (draft)

十分容易な運動によって、要求する1つの所作を定義する。運動には、代替を想定する。
例として、ディスプレイに触れる手指の運動で実現する時、それは
tap と long press のうち個々の人間にとってより容易な片方の運動によって実現できるように、
tap ==  long press → (show context menu) → option 1 long press
の2つを代替関係とする。

- pointer down, move, up (touch, mouse)
    - tap
    - long press
    - drag (& drop)
    - swipe
    - (hover) (mouse only)
- keyboard
    - enter
    - space
    - arrow (↑→↓←)

---

## 状態属性による信号操作 (draft)

フォーカス・ホバーの相互作用状態と別に、信号機能の実装機構としての一般的な状態属性を以下に挙げる。
適用には、各状態に対応する差分を設計してある必要がある。

| Variant | Meaning |
|-|-|
| hidden, disabled | irrelevant |
| readonly | - |
| required | - |
| valid | 検証済み(受け入れ可) |
| invalid, out-of-range | 検証済み(受け入れ不可) |
| busy | not ready |

- reference: XForms 1.1, W3C Recommendation 20 October 2009 - 6 4.4 model item property

---

## 規則化要素 (draft)

個別の要素に習熟を要さないために、構成要素・信号要素に共通して、規則を適用する。

| 名前 | 既存例 | 構成 |
|-|-|-|
| control grouping | toolbar(ARIA APG), 機能・順序・頻度・優先順位によるグループ化(JIS C 0447 4.1.8) | P1要素の配列規則。 |
| group boundary | divider(Material 3), 区画枠(JIS C 0447 4.1.8) | 表示(囲み)によるcontrol groupingの視覚表現。 |
| identification mark | Avatar(Ant Design), 図記号・色・文字による識別(JIS C 0447 6)  | 信号要素の識別規則 |
| direction mapping | 操作方向と結果の対応(JIS 表A)  | P2要素のジェスチャ方向の符号化規則 |
| neutral position | 停止位置規則(JIS 5.2) | 中立・停止状態の空間的定位規則 |

---

## P1~P3'パターン具体例 (draft)

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

## Sign (draft)

Sign (符号)は、その幾何学的性質を利用して、なるべく依存する文脈を少なく理解できるのが望ましい。
また、同じ場所にあり続け、試行できるインタラクティブ要素を表すとき、記号は変化せず、今現在の様子の信号とセットで使うべきである(例: toggle button)。
試行すると同じ場所にあることのできない要素は、それがもたらす操作を表現する信号となることが望ましい(例: chevron button dropdown)。

```
˄ (U+02C4 MODIFIER LETTER UP ARROWHEAD)
˅ (U+02C5 MODIFIER LETTER DOWN ARROWHEAD)
˂ (U+02C2 MODIFIER LETTER LEFT ARROWHEAD)
˃ (U+02C3 MODIFIER LETTER RIGHT ARROWHEAD)
∘ (U+2218 RING OPERATOR)

× (U+00D7 MULTIPLICATION SIGN)

+ (U+002B PLUS SIGN)
☰ (U+2630 TRIGRAM FOR HEAVEN)
⦀ (U+2980 TRIPLE VERTICAL BAR DELIMITER)
⊤ (U+22A4 DOWN TACK)
⊥ (U+22A5 UP TACK)
⊢ (U+22A2 RIGHT TACK)
⊣ (U+22A3 LEFT TACK)
```

---

## Color

グローバル系:

- black: 系全体で最も黒に近い色値。
- white: 系全体で最も白に近い色値。

スコープ系:

- ink   : 系内で最も(濃い | 薄い)文字色。
- paper : 系内で最も(薄い | 濃い)背景色。
- mute  : inkとpaperの混文字色。
- emphasis: 系内に1つ、印象を表現する色。背景/文字の他、各コントラスト要件に応じたバリアント値の集合。
- error:     赤の背景色。
- highlight: 黄の背景色。
- success:   緑の背景色。
- focus:     境界線色。
- transparent: 透明の背景色。各コンポーネントは、paper(または--rgb-base-*)色上に載る前提とする。

コンポーネント系:

- background: コンポーネントに隣接する外部の背景色。
- border:     コンポーネントが持つ、境界線色。
- fill:       コンポーネントが持つ、内部の背景色。
- text:       コンポーネントが持つ、内部の文字色。

textに対して背景色を当てることは出来ない。

```
┌ background ─────┐
│  ┏ border ━━━┓  │
│  ┃  fill     ┃  │
│  ┃  -text-   ┃  │
│  ┗━━━━━━━━━━━┛  │
└─────────────────┘
```

| Style | Static | Focus | Hover | Focus hover | Invalid | Invalid focus | Disabled |
|-|-|-|-|-|-|-|-|
| select | border: mute, background: transparent, text: mute | outline: emphasis, border: ink | cursor: pointer | - | border: error | error border, error outline | mute border, mute text, cursor: not-allowd |
| input | border: mute, background: transparent, text: mute, caret: mute, text: ink |  | cursor: text | - | | | |
| outline | border: emphasis, background: transparent, text: emphasis | outline: emphasis | underline: emphasis, cursor: pointer | - | - | - |  |
| fill | border: transparent, background: emphasis, text: paper | outline: emphasis | emphasis background: emphasis, underline: bold paper | - | - | - | background: mute, cursor: not-allowd |
| underline | background: transparent, text: ink, underline: ink | outline: emphasis | underline: bold | - | - | - | text: mute, underline: mute, cursor: not-allowd |
| icon | all: unset | - | - | - | - | - | - |
| rule-indent | background(縦棒): emphasis | - | - | - | - | - | - |

---

## forced-colors: active

forced-colorで失われる要素は、使用しない。色要素で伝える情報は、形またはテキストを常に併用する。

- [W3C: CSS Color Adjustment Module Level 1](https://www.w3.org/TR/css-color-adjust-1/)

以下が強制的にSystem Color(CSS Color Level 4)またはnone, autoで上書きされる。

- accent-color: auto;, background-color, border-color, caret-color, color, flood-color, fill, lighting-color, outline-color, rule-color, scrollbar-color: auto;, stop-color, stroke, text-decoration-color, text-emphasis-color, "box-shadow and text-shadow compute to none", "background-image computes to none"(但し、url()は例外的に除かれる), "color-scheme computes to light dark"

### System color

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

---

## prefers-reduced-motion

- 全コンポーネントで、自動モーションはデフォルトの定義には適用せず、`@media (prefers-reduced-motion: no-preference)`で明示オプションとする。

---

## prefers-contrast

`@media (prefers-contrast)`(値なし) は、装飾グラデーション・背景画像・box-shadow を単色やsolid borderに置き換えるなど、視覚的な単純化の共通段階に留める。
`@media (prefers-contrast: more | less) and (forced-colors: none)` と書く必要がある。

---

## References

- [CUDO: Color Universal Design Recommended Color Set ver.3](https://cudo.jp/wp-content/uploads/2016/07/CUD%E6%8E%A8%E5%A5%A8%E9%85%8D%E8%89%B2%E3%82%BB%E3%83%83%E3%83%88%E3%82%AC%E3%82%A4%E3%83%89%E3%83%96%E3%83%83%E3%82%AF.pdf)
- JIS C 0447:1997 (IEC60447:1993) Man-machine-interface (MMI) - Actuating principles
- XForms 1.1, W3C Recommendation 20 October 2009
- [Kelp CSS](https://github.com/cferdinandi/kelp)
- [Pico CSS](https://picocss.com/docs)
- [Gov UK Design System: Repository](https://github.com/alphagov/govuk-frontend)
- [U.S. Web Design System (USWDS)](https://designsystem.digital.gov/)

---

## Keyboard operation (draft)

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

- [ARIA APG: pattern](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [IBM Common User Guide](./references/ibm_common_user_access/)
- [Microsoft: Shortcut Keys](https://learn.microsoft.com/en-us/previous-versions/windows/desktop/bb246441(v=vs.85)?redirectedfrom=MSDN)
- [Microsoft: Keyboard Interface Summary](https://learn.microsoft.com/en-us/previous-versions/ms997427(v=msdn.10))