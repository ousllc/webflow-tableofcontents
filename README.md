# 目次ジェネレーター

この JavaScript ライブラリは、ウェブページの目次（TOC）を動的に生成するためのものです。コンテンツ内の見出しに基づいて目次を作成し、カスタマイズやインタラクションのオプションを提供します。

## はじめに

このライブラリを使用するには、以下のスクリプトを HTML に含めてください：

```html
<script src="https://cdn.jsdelivr.net/gh/ousllc/webflow-tableofcontents@latest/dist/tableofcontents.min.js"></script>
```

## 使い方

### 1. HTML に必要な要素を追加

まず、目次を表示するコンテナと、目次を生成するコンテンツ領域を用意します。

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .hidden {
        display: none;
      }
      .toc-toggle {
        /* トグルボタンのスタイル */
      }
      .show-all {
        /* 全て表示ボタンのスタイル */
      }
      .toc.active {
        /* アクティブ状態のスタイル */
      }
    </style>
  </head>
  <body>
    <div class="article">
      <!-- 見出し (h1-h6) を含むコンテンツ -->
      <h1>はじめに</h1>
      <p>...</p>
      <h2>セクション1</h2>
      <p>...</p>
      <!-- 他のコンテンツ -->
    </div>
    <div id="toc">
      <button id="toggleButton" class="toc-toggle">目次</button>
      <button id="showAllButton" class="show-all">全て表示</button>
    </div>

    <script src="https://cdn.jsdelivr.net/gh/ousllc/webflow-tableofcontents@latest/dist/tableofcontents.min.js"></script>
    <script>
      const toc = new Toc(
        ".article",
        "#toc",
        {
          h1: ["intro", "overview", "conclusion"],
          h2: ["section1", "section2"],
          h3: ["subsection1", "subsection2"],
          h4: ["detail1"],
          h5: [],
          h6: [],
        },
        {
          offsetTop: 100,
          duration: 500,
          maxItems: 2, // 最大表示項目数
          classes: {
            h1: "custom-toc-h1",
            h2: "custom-toc-h2",
            h3: "custom-toc-h3",
            h4: "custom-toc-h4",
            h5: "custom-toc-h5",
            h6: "custom-toc-h6",
          },
          showAll: { enabled: true, id: "showAllButton" },
          toggleButton: { enabled: true, id: "toggleButton" },
        }
      );

      toc.initialize();
    </script>
  </body>
</html>
```

### 2. JavaScript で目次を初期化

以下のコードを使用して、目次を初期化します。コンテンツ領域、目次コンテナ、見出し ID、およびオプションを指定します。

```javascript
const toc = new Toc(
  ".article",
  "#toc",
  {
    h1: ["intro", "overview", "conclusion"],
    h2: ["section1", "section2"],
    h3: ["subsection1", "subsection2"],
    h4: ["detail1"],
    h5: [],
    h6: [],
  },
  {
    offsetTop: 100, // スクロール時のオフセット
    duration: 500, // スクロールのアニメーション時間（ミリ秒）
    maxItems: 2, // 最大表示項目数
    classes: {
      h1: "custom-toc-h1",
      h2: "custom-toc-h2",
      h3: "custom-toc-h3",
      h4: "custom-toc-h4",
      h5: "custom-toc-h5",
      h6: "custom-toc-h6",
    },
    showAll: { enabled: true, id: "showAllButton" }, // 全て表示ボタンの設定
    toggleButton: { enabled: true, id: "toggleButton" }, // 目次トグルボタンの設定
  }
);

toc.initialize();
```

### 3. オプションの説明

- `offsetTop`: スクロール時のオフセット（ピクセル単位）。
- `duration`: スクロールのアニメーション時間（ミリ秒単位）。
- `maxItems`: 初期表示される目次項目の最大数。
- `classes`: 各見出しレベルに対応するクラス名。
- `showAll`: 全て表示ボタンの設定。
  - `enabled`: 全て表示ボタンを有効にするかどうか。
  - `id`: 全て表示ボタンの ID。
- `toggleButton`: 目次トグルボタンの設定。
  - `enabled`: 目次トグルボタンを有効にするかどうか。
  - `id`: 目次トグルボタンの ID。

### 4. 見出し ID の設定

`Toc` クラスの初期化時に、各見出しレベル (`h1` ～ `h6`) に対して任意の ID を指定できます。これにより、特定の見出しに固定された ID を付与できます。ID リストに指定がない場合、またはリストの長さが見出しの数より少ない場合、残りの見出しには自動的に連番 ID が付与されます。

例えば、以下の設定では：

```javascript
const toc = new Toc(
  ".article",
  "#toc",
  {
    h1: ["intro", "overview", "conclusion"], // h1見出しに指定するID
    h2: ["section1", "section2"], // h2見出しに指定するID
    h3: ["subsection1", "subsection2"], // h3見出しに指定するID
    h4: ["detail1"], // h4見出しに指定するID
    h5: [], // h5見出しに指定なし（自動付与）
    h6: [], // h6見出しに指定なし（自動付与）
  },
  {
    // その他のオプション
  }
);
```

- `h1` 見出しには `"intro"`, `"overview"`, `"conclusion"` の ID が付与されます。
- `h2` 見出しには `"section1"`, `"section2"` の ID が付与されます。
- `h3` 見出しには `"subsection1"`, `"subsection2"` の ID が付与されます。
- `h4` 見出しには `"detail1"` の ID が付与されます。
- `h5` および `h6` 見出しには自動的に `header1`, `header2`, ... のように連番の ID が付与されます。

### 5. ボタンの動作

- **目次トグルボタン**: 目次の表示/非表示を切り替えます。目次が閉じられるとき、全ての項目が隠され、全て表示ボタンが再表示されます。
- **全て表示ボタン**: 目次の全ての項目を表示します。クリックするとボタン自体が非表示になります。

これで、目次ジェネレーターの設定と使用方法が完了です。必要に応じて、オプションをカスタマイズしてご利用ください。
