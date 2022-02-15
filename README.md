# @kumanote/site-builder

以下のような機能を持つサイト制作用ライブラリです。

- ビルド機能
  - Sass のコンパイル
  - CSS の最適化（autoprefixer, メディアクエリの統合）
  - CSS の minify / format
  - module ベースの JavaScript の bundle 処理
  - TypeScript の bundle 処理
  - JavaScript の最適化（ES5 への変換）
  - JavaScript の minify / format
  - Handlebars の展開処理
  - HTML の format
  - 画像の最適化
- ファイルを監視して自動的にビルド

## 使用方法

- コマンドラインツール → [@kumanote/site-builder-cli](https://github.com/shoji-kumanote/site-builder-cli#readme)
- VSCode 機能拡張 → coming soon

## 設定

### 実行時設定

実行時設定は`Config.create`に引き渡します。

| 設定名 | 型                | 用途                                             | 省略時   |
| ------ | ----------------- | ------------------------------------------------ | -------- |
| config | string / string[] | 設定ファイルを指定します。複数の指定も可能です。 | 省略不可 |
| dryRun | boolean           | 実際のファイル作成・削除を行わないで実行します。 | 指定なし |
| dev    | boolean           | dev モードを有効にします。                       | 指定なし |

#### dev モード

開発時など、速度を重視する場合に使用します。
主に最適化処理や minify 処理、format 処理が省かれるようになります。

### 設定ファイル

設定ファイルは yaml で記述します。

| キー            | 値                                 | 用途                                  | 省略時           |
| --------------- | ---------------------------------- | ------------------------------------- | ---------------- |
| base            | ファイルパス                       | ソースファイルのベースディレクトリ    | （省略不可）     |
| dist            | ファイルパス                       | 出力先ディレクトリ                    | （省略不可）     |
| src             | ファイルパス or ファイルパスの配列 | ソースを探すディレクトリ              | base             |
| vendor          | 文字列 or 文字列の配列             | vendor 判定するファイルのパターン     | `**/vendor/**/*` |
| ignore          | 文字列 or 文字列の配列             | 無視するファイルのパターン            | （なし）         |
| disabled        | 文字列 or 文字列の配列             | 使用しない[フィルタ](#フィルタ)の指定 | （なし）         |
| externalModules | 文字列 or 文字列の配列             | bundle 時に含めない node_modules      | （なし）         |
| data            | キー・値データ                     | 引き渡しデータ                        | （なし）         |

ファイルパスは、設定ファイルからの相対指定のみ有効です。

### その他の設定ファイル

いくつかのライブラリが使用する設定ファイルは自動的に参照されます。

| ファイル名      | 用途                                           |
| --------------- | ---------------------------------------------- |
| .browserslistrc | cssOptimize, jsOptimize で参照されます         |
| .prettierrc     | cssFormat, jsFormat, htmlFormat で参照されます |

## 仕様

### ファイル種別

対象となるファイルをどのように扱うファイルかを判定し、ファイル種別とします。

まず vendor 判定を行います。
vendor 判定された場合は以下のように分別されます。

| 拡張子    | 種別       |
| --------- | ---------- |
| .css      | vendorCss  |
| .css 以外 | vendorFile |

次にライブラリ判定を行います。
ライブラリ判定は、ファイル名の先頭が`_`かどうかで判定されます。
ライブラリ判定された場合は以下のように分別されます。

| 拡張子              | 種別                                 |
| ------------------- | ------------------------------------ |
| .sass / .scss       | sassLib                              |
| .hbs / .tpl / .html | hbsLib                               |
| .mjs                | mjsLib                               |
| .ts                 | tsLib                                |
| 上記以外            | （ライブラリ判定を覆して次の判定へ） |

vendor 判定もライブラリ判定もされなかった場合は以下のように分別されます。

| 拡張子        | 種別 |
| ------------- | ---- |
| .css          | css  |
| .sass / .scss | sass |
| .hbs / .tpl   | hbs  |
| .html         | html |
| .js           | js   |
| .mjs          | mjs  |
| .ts           | ts   |
| .jpg / .jpeg  | jpeg |
| .png          | png  |
| .gif          | gif  |
| .svg          | svg  |
| 上記以外      | file |

### フィルタ

ファイルの変換処理を`フィルタ`とします。
以下のフィルタが定義されています。

- CSS 系
  - cssFormat: CSS の整形
  - cssMinify: CSS の minify
  - cssOptimize: CSS の最適化
  - sassCompile: Sass のコンパイル
- JavaScript 系
  - jsFormat: JavaScript の整形
  - jsMinify: JavaScript の minify
  - jsOptimize: JavaScript の最適化
  - mjsBundle: JavaScript module の bundle
  - tsBundle: TypeScript の bundle
- HTML 系
  - hbsTransform: Handlebars の展開処理
  - htmlFormat: HTML の整形
- 画像系
  - gifOptimize: GIF の最適化
  - jpegOptimize: JPEG の最適化
  - pngOptimize: PNG の最適化
  - svgOptimize: SVG の最適化
- その他
  - smarty: Smarty 向けテンプレートの作成
  - thru: 何もしない（テキスト内容を継承）
  - copy: ファイルコピー

フィルタは設定ファイルの disabled で無効化することが可能です。

### ビルド処理

ビルド処理はファイル種別に応じてフィルタを適用する処理とします。
info コマンドの出力で、どのような処理が行われるかを確認することができます。

#### vendorCss

元ファイル名: foo.css

| 1: thru | 2: smarty | foo.css | foo.css.data |
| :-----: | :-------: | :-----: | :----------: |
|    o    |     o     |    1    |      2       |
|    o    |     x     |    1    |     なし     |
|    x    |     o     |  なし   |      2       |
|    x    |     x     |  なし   |     なし     |

#### vendorFile

元ファイル名: foo.txt

| 1: thru | foo.txt |
| :-----: | :-----: |
|    o    |    1    |
|    x    |  なし   |

#### css

元ファイル名: foo.css

| 1: cssOptimize | 2: cssMinify | 3: cssFormat | foo.css | foo.css.map | foo.orig.css |
| :------------: | :----------: | :----------: | :-----: | :---------: | :----------: |
|       o        |      o       |      o       |  1 + 2  |    1 + 2    |    1 + 3     |
|       o        |      o       |      x       |  1 + 2  |    1 + 2    |      1       |
|       o        |      x       |      o       |  1 + 3  |    なし     |     なし     |
|       o        |      x       |      x       |    1    |      1      |     なし     |
|       x        |      o       |      o       |    2    |      2      |      3       |
|       x        |      o       |      x       |    2    |      2      |     なし     |
|       x        |      x       |      o       |    3    |    なし     |     なし     |
|       x        |      x       |      x       |  なし   |    なし     |     なし     |

- さらに、smarty フィルタ有効かつ、foo.css が出力される場合 --> foo.css.data

#### sass

元ファイル名: foo.sass

- sassCompile フィルタ適用後は css と同様にフィルタ適用されます。
- sassCompile フィルタが無効の場合は、そのまま css のフィルタ適用となります。
  - たいていの場合は構文エラーとなります。
- 拡張子が .sass の場合は indented スタイルとみなされます。

#### hbs

元ファイル名: foo.hbs

| 1: hbsTransform | 2: htmlFormat | foo.html |
| :-------------: | :-----------: | :------: |
|        o        |       o       |  1 + 2   |
|        o        |       x       |    1     |
|        x        |       o       |    2     |
|        x        |       x       |   なし   |

- 別ファイルの差し込みは partial ではなく独自拡張を使用します。詳細は[Handlebars 独自拡張](#Handlebars-独自拡張)を参照。

#### tpl

元ファイル名: foo.tpl

| 1: hbsTransform | foo.tpl |
| :-------------: | :-----: |
|        o        |    1    |
|        x        |  なし   |

#### html

元ファイル名: foo.html

| 1: htmlFormat | foo.html |
| :-----------: | :------: |
|       o       |    1     |
|       x       |   なし   |

#### js

元ファイル名: foo.js

| 1: jsOptimize | 2: jsMinify | 3: jsFormat | foo.js | foo.js.map | foo.orig.js |
| :-----------: | :---------: | :---------: | :----: | :--------: | :---------: |
|       o       |      o      |      o      | 1 + 2  |   1 + 2    |    1 + 3    |
|       o       |      o      |      x      | 1 + 2  |   1 + 2    |      1      |
|       o       |      x      |      o      | 1 + 3  |    なし    |    なし     |
|       o       |      x      |      x      |   1    |     1      |    なし     |
|       x       |      o      |      o      |   2    |     2      |      3      |
|       x       |      o      |      x      |   2    |     2      |    なし     |
|       x       |      x      |      o      |   3    |    なし    |    なし     |
|       x       |      x      |      x      |  なし  |    なし    |    なし     |

#### mjs

元ファイル名: foo.mjs

- mjsBundle フィルタ適用後は js と同様にフィルタ適用されます。
- mjsBundle フィルタが無効の場合は、そのまま js のフィルタ適用となります。

#### ts

元ファイル名: foo.ts

- tsBundle フィルタ適用後は js と同様にフィルタ適用されます。
- tsBundle フィルタが無効の場合は、そのまま js のフィルタ適用となります。
  - たいていの場合は構文エラーとなります。

#### jpeg

元ファイル名: foo.jpg

| 1: jpegOptimize | foo.jpg |
| :-------------: | :-----: |
|        o        |    1    |
|        x        |  なし   |

#### png

元ファイル名: foo.png

| 1: pngOptimize | foo.png |
| :------------: | :-----: |
|       o        |    1    |
|       x        |  なし   |

#### gif

元ファイル名: foo.gif

| 1: gifOptimize | foo.gif |
| :------------: | :-----: |
|       o        |    1    |
|       x        |  なし   |

#### svg

元ファイル名: foo.svg

| 1: svgOptimize | foo.svg |
| :------------: | :-----: |
|       o        |    1    |
|       x        |  なし   |

#### file

元ファイル名: foo.txt

| 1: copy | foo.txt |
| :-----: | :-----: |
|    o    |    1    |
|    x    |  なし   |

## Handlebars 独自拡張

### 定義済み変数

| 変数名                      | 値                                                            |
| --------------------------- | ------------------------------------------------------------- |
| \_\_PATH\_\_                | ベースディレクトリから見た、ファイルへの相対パス              |
| \_\_ROOT\_\_                | ファイルからベースディレクトリへの相対パス                    |
| \_\_TIMESTAMP\_\_           | ビルド時のタイムスタンプが定義される                          |
| \_\_TIMESTAMP_QUERY\_\_     | `?` + ビルド時のタイムスタンプが定義される                    |
| \_\_DEV\_\_                 | dev モードであれば定義される                                  |
| \_\_DEV_TIMESTAMP\_\_       | dev モードであればビルド時のタイムスタンプが定義される        |
| \_\_DEV_TIMESTAMP_QUERY\_\_ | dev モードであれば `?` + ビルド時のタイムスタンプが定義される |

タイムスタンプはキャッシュバスターの用途などを想定しています。

### 追加ヘルパー: {{include "パス"}} / {{_ "パス"}}

- パスで指定したファイルを handlebars として扱い、展開します。

### 追加ヘルパー: {{insert "パス"}} / {{$ "パス"}}

- パスで指定したファイルをそのまま展開します。

### 追加ヘルパーでのパスの扱い

- 先頭が`/`の場合は、ベースディレクトリからの相対パスとみなされます。
- それ以外は、当該ファイルからの相対パスとみなされます。
- ベースディレクトリ以外を差す相対パスはエラーとなります。
- ファイル名先頭の `_` と拡張子は省略可能です。
- 拡張子が省略された場合、`.hbs`, `.tpl`, `.html` の順で探します。

例: `{{include "foo/bar"}}` が指定された場合は以下の順でファイルを探します。

- ./foo/bar
- ./foo/bar.hbs
- ./foo/bar.tpl
- ./foo/bar.html
- ./foo/\_bar
- ./foo/\_bar.hbs
- ./foo/\_bar.tpl
- ./foo/\_bar.html

### データ

設定ファイルの data で引き渡すデータを指定できます。
相対パスをキーにすることで、特定のファイルに対してデータを与えることが可能です。

```yaml
data:
  foo: FOO
  bar: BAR
  file/to/path.hbs:
    foo: FOO-FOO # file/to/path.hbs の場合はこちらが仕様される
    bar: BAR-BAR
```
