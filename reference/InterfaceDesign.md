---
lang: ja
translations: none
---

本書は、以下の2種類の機能のどちらかを持つ、または両者を統合した装置をインターフェース装置と定義して、体系化を行う。

(a) 構成機能
システムが受け付けられる命令を構成する。
人の意図の解釈として適切であることを目標に、人の所作から、装置の構成し得る命令のうち、一つを定める。

(b) 信号機能
人が情報を読み取ることのできる現象を生じさせる。
システムが人へ伝えることを要する情報から、人が適切に解釈できることを目標に、生じさせ得る現象のうち、一つを定める。

---

This document provides a general systematization of interface devices.
An interface device is a device having either of the following two functions, or one that combines both.

(a) Determining a request
It produces a request the system can accept.
From the person's behavior, it determines one request among those the device can construct, with the goal that the command be an appropriate interpretation of the person's intent.

(b) Bringing about a phenomenon
It brings about a phenomenon from which the person can gain information.
From the information the system needs to convey to the person, it determines one phenomenon among those it is capable of bringing about, with the goal that the person can interpret it appropriately.

# 体系化

インターフェース装置は、設計時には知り得ない個人と、コンピューターアルゴリズムとの相互作用を設計する。
設計成果物の形式は、インターフェース装置を形成する各要素が、自然言語による定義と実装で構成されたライブラリとする。
UD(個人や状況に依らず機能する)の網羅性の程度も、機能品質の程度も、体系に対する実装の網羅率も、決して100%を達成することはない。体系化は、自然言語によるインターフェース装置の取り得る空間内の整理、具体的な実装の、トップダウンとボトムアップからそれぞれ行い、この2つの語彙の整合の維持活動である。

# 共通手続き段階

人間の単一の意図表明に始まる、インターフェース装置と人間、システムの間に発生する手続きを以下に定義する[^jis-c-0447]。

1. 人間の所作と装置の構成機能: 操作意思表明 (P0)
2. 装置の信号機能: システム状態信号 (P0')
3. 人間の所作と装置の構成機能: 対象選択 (P1)
4. 装置の信号機能: 対象確認信号 (P1')
5. 人間の所作と装置の構成機能: コマンド構成 (P2)
6. 装置の信号機能: 構成確認信号 (P2')
7. 人間の所作と装置の構成機能: 執行命令 (P3)
8. 装置の信号機能: 結果信号 (P3')

# 要素の規則化

体系内の要素が所作への習熟を要求しないために、構成要素・信号要素に共通して、規則を適用する。

| Rule | Example |
|-|-|
| Boundary | divider(Material 3), 区画枠(JIS C 0447 4.1.8) |
| Neutral position | 停止位置規則(JIS 5.2) |
| P1 Grouping | toolbar(ARIA APG), 機能・順序・頻度・優先順位によるグループ化(JIS C 0447 4.1.8) |
| P' Identification sign | 図記号・色・文字による識別(JIS C 0447 6) |
| P2 Direction mapping | 操作方向と結果の対応(JIS 表A)  |

# 所作

十分容易な運動によって、要求する1つの所作を定義する。運動には、代替を想定する。
例えば、ディスプレイに触れる手指の運動で実現する時、tapとlong pressのうち個々の人間にとってより容易な片方の運動によって実現できるように、tapとlong press(show context menu) → long press(1st option)の2つで同じ操作を可能にする。

- touch, mouse(pointer down, move, up)
    - tap
    - long press
    - drag (& drop)
    - swipe
    - (hover) (mouse only)
- keyboard
    - enter
    - space
    - tab
    - arrow(↑→↓←)

# 信号機能の状態属性

所作に対応したものの他に、一般的に必要のある状態属性を以下に挙げる[^xforms]。

| Variant | Meaning |
|-|-|
| hidden, disabled | irrelevant |
| readonly | - |
| required | - |
| valid | validated (acceptable) |
| invalid, out-of-range | validated (not acceptable) |
| busy | not ready |

# P1~P3' Pattern Examples

- 表中「タップ」はショートクリック・ショートタップ(ポインターダウンからポインターアップまで)を指す。
- 長押し時・ドラッグ時の挙動については、定義を別途必要とする行がある。
- P3' 結果信号については、エラー時の定義を別途必要とする行がある。
- CSS表記(:hover等)で信号の差分を表記する。
- toggle: 非常停止ボタン(JIS C 0447)のように、操作を1方向に制限する差分が存在する。
- toggle (sort) | column sorter(Ant Design Table)
- filter chip | filter chip(Material 3)
- tabs | tabs(ARIA APG)

| Name | Example | P1 | P1' | P2 | P2' | P3 | P3' |
|-|-|-|-|-|-|-|-|
| drag and drop reordering | Drag and drop(Apple HIG) | pointer down | :active(grab) | pointer down + move | insert preview | pointer up, pointer down + move(out) | (default) |
| toggle | Switch(ARIA APG) | hover, focus | label, :hover, :focus | - | label, :checked | enter, tap | (default), :checked |
| tooltip | Tooltip(Material 3) | hover, focus(tip sign) | - | - | - | - | :visible |
| immediate button | - | hover, focus | label, :hover, :focus | - | label(undo sign, etc.) | enter, space, tap | - |
| immediate button (hold-to-run) | 寸動操作(JIS C 0447) | hover, focus | label, :hover, :focus | - | - | enter, pointer down | label(meter) |
| immediate input | InlineEdit(React Suite) | focus, tap(edit button) | :focus, caret | key input, option tap | :active(track, text) | enter, focus out | (default) |
| immediate select | Menu and Menubar(ARIA APG) | hover, focus / pointer down (menu) | label, :hover, :focus / :open | hover, focus(option) | :focus, :focus(option) | enter, tap(option) | - (default) |
| immediate select (search) | Combobox(ARIA APG) | hover, focus, tap (track) | :hover, :focus | key input, arrow key | highlight (option) | enter, tap(option) | - |
| immediate slider | - | hover / focus, pointer down | label, :hover / :focus, :active | arrow key, pointer move | track & knob | - | - |
| immediate slider (rate) | Rate(Ant Design) | hover, focus | label, :hover, :focus | arrow key, pointer move | :hover (preview) | enter, tap | fill / outline elements |
| form | form(HTML Living Standard) | (P2 components) | label, boundary | (P2 components) | (confirm dialog) | enter, tap(submit button) | error summary, detail |
| multi-step form | Steps+Form(Ant Design) | (P2 components) | label, boundary, step indicator | (P2 components), proceed & back button | label, bondary, step indicator, error summary, detail | enter, tap(submit button) | (success toast, error modal) |

- dialog
- button structure | breadcrumb(ARIA APG)
- pagination | pagination(Bootstrap), Pagination(Ant Design)
- disclosure | disclosure(ARIA APG), Collapse(Ant Design)
- disclosure (tree view) | tree view(ARIA APG), Tree(Ant Design)
- carousel | carousel(ARIA APG), carousel(Bootstrap)
- window splitter | window splitter(ARIA APG), split view(Apple HIG)
- scroll list | feed(ARIA APG)

## P2 Component examples

- multi-select apply | Transfer(Ant Design)
- :hover, :focus

| Name | Reference | Parts |
|-|-|-|
| checkbox | checkbox(ARIA APG), checkbox(Material 3) | 表示(ラベル, ボックス), 真偽値表現 |
| radio button | radio group(ARIA APG), Radio(Ant Design) | 表示(ラベル, リスト(ラベル, ボタン)), 真偽値表現 |
| input | textarea(HTML Living Standard) | 表示(ラベル, 入力枠), キャレット表現, (Enter時改行) |
| select | select(HTML Living Standard) | 表示(ラベル, オプションリスト, 無効オプション行ラベル, オプションボタン), 閉時の値表現 |
| listbox | listbox(ARIA APG) | 表示(ラベル, 囲い, オプションリスト, オプションボタン), オプションの有効表現 |
| slider | slider(ARIA APG) | 表示(ラベル, トラック, つまみ) |
| date picker | date picker(Material 3) | 表示(ラベル, カレンダー) |
| time picker | time picker(Material 3) | 表示(ラベル, 時間入力枠, 分数入力枠) |
| file uploader | input type=file(HTML Living Standard), Upload(Ant Design) | 表示(ラベル, 実行ボタン) |
| input chip | input chip(Material 3), Tag(Ant Design 入力用途) | 表示(ラベル, トラック, 左又は右アイコン) (Material 3: "The stroke color was softened to improve visual hierarchy between chips and buttons") |
| enabling button | 許可装置(JIS C 0447 7.7.3) | |
| step button | spinbutton(ARIA APG) | 表示(増方向ボタン, 減方向ボタン) (JIS 5.1: 増減ジェスチャの反対動作対) |

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

# Sign (draft)

Sign (符号)は、その幾何学的性質を利用して、なるべく依存する文脈を少なく理解できるのが望ましい。
また、同じ場所にあり続け、試行できるインタラクティブ要素を表すとき、記号は変化せず、今現在の様子の信号とセットで使うべきである(例: toggle button)。
試行すると同じ場所にあることのできない要素は、それがもたらす操作を表現する信号となることが望ましい(例: chevron button dropdown)。

```
˄ (U+02C4 MODIFIER LETTER UP ARROWHEAD)
˅ (U+02C5 MODIFIER LETTER DOWN ARROWHEAD)
˂ (U+02C2 MODIFIER LETTER LEFT ARROWHEAD)
˃ (U+02C3 MODIFIER LETTER RIGHT ARROWHEAD)
○ (U+25CB WHITE CIRCLE)

× (適切な文字コード無し)

+ (U+002B PLUS SIGN)
− (U+2212 MINUS SIGN)
| (U+007C VERTICAL LINE)
☰ (適切な文字コード無し)
⦀ (U+2980 TRIPLE VERTICAL BAR DELIMITER)
⊤ (適切な文字コード無し)
⊥ (適切な文字コード無し)
⊢ (適切な文字コード無し)
⊣ (適切な文字コード無し)
⌜ (U+231C TOP LEFT CORNER)
⌝ (U+231D TOP RIGHT CORNER)
⌞ (U+231E BOTTOM LEFT CORNER)
⌟ (U+231F BOTTOM RIGHT CORNER)
⧉ (U+29C9 TWO JOINED SQUARES)
```

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
- IBM Common User Guide
- [Microsoft: Shortcut Keys](https://learn.microsoft.com/en-us/previous-versions/windows/desktop/bb246441(v=vs.85)?redirectedfrom=MSDN)
- [Microsoft: Keyboard Interface Summary](https://learn.microsoft.com/en-us/previous-versions/ms997427(v=msdn.10))

[^jis-c-0447]: JIS C 0447:1997 (IEC60447:1993) Man-machine-interface (MMI) - Actuating principles
[^xforms]: XForms 1.1, W3C Recommendation 20 October 2009 - 6 4.4 model item property
