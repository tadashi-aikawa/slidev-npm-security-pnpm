---
title: サプライチェーン攻撃対策とpnpmのススメ
colorSchema: light
canvasWidth: 1280
themeConfig:
  primary: "#3db680"
# TODO: public/attachments/ に cover.webp を配置してコメントアウトを外す
# background: ./attachments/cover.webp
comark: true
layout: cover
routerMode: hash
---

# サプライチェーン攻撃対策と<br>pnpmのススメ

<span class="text-dimmed">
2026/05/10   Tadashi Aikawa
</span>

---
title: Agenda
layout: chapter-divider
---

---
layout: center
---

# 今日の結論

5つの対策のうち **3つ** が **pnpm v11** でデフォルト適用済み

<conclusion>

設定コストを最小化しながら身を守るなら **pnpm v11** が最適解

</conclusion>

---
title: Chapter1
layout: chapter-divider
activeChapter: 1
---

---

# npmレジストリへの攻撃が激化している

- 昨今、npmレジストリを標的にした**サプライチェーン攻撃**が増加している
- 依存関係に悪意あるコードを仕込み、開発者のマシンやCI環境を侵害する
- ライブラリ開発者だけでなく、**利用者側にも自衛が必要**な時代

---
layout: fact
---

# サプライチェーン攻撃とは

悪意あるコードを **依存パッケージ** に仕込み<br/>
インストール時に実行させる攻撃

---

# このプレゼンのスコープと対象バージョン

- **開発者として最低限できること**にフォーカス
- ライブラリ開発者のアクションはスコープ外

| 対象 | 比較バージョン |
| ---- | -------------- |
| npm  | 11.x           |
| pnpm | 11.x           |
| Bun  | 1.3.x          |
| Deno | 2.7.x          |

---
title: Chapter2
layout: chapter-divider
activeChapter: 2
---

---
class: table-compact
---

# 5つの対策 × 4PM 全体比較

| 対策                            | npm           | pnpm             | Bun           | Deno          |
| ------------------------------- | ------------- | ---------------- | ------------- | ------------- |
| 1. バージョンピン留め (直接)    | ⚙️ 設定要     | ⚙️ 設定要        | ⚙️ 設定要     | ⚠️ 毎回指定   |
| 1. バージョンピン留め (推移的)  | ⚙️ 設定要     | ⚙️ 設定要        | ⚙️ 設定要     | ⚙️ 設定要     |
| 2. ロックファイル活用           | `npm ci`      | `pnpm ci`        | `bun ci`      | `--frozen`    |
| 3. ライフサイクルスクリプト無効 | ⚙️ 設定要     | ✅ v11デフォルト | ✅ デフォルト | ✅ デフォルト |
| 4. Minimal Release Age          | ⚙️ v11.10以降 | ✅ v11デフォルト | ⚙️ 設定要     | ⚙️ 設定要     |
| 5. 危険なソース指定を禁止       | ❌ 未対応     | ✅ v11デフォルト | ❌ 未対応     | ❌ 未対応     |

---
layout: fact
---

# 対策1: バージョンをピン留め

依存関係のバージョンを**正確な値**に固定する<br>
`^` や `~` を排除してマイナー/パッチアップデートによる<br>
不正バージョンのインストールリスクを軽減

---

# 対策1: 直接依存関係のピン留め

::code-group

```sh [npm]
npm config set save-exact=true
# ~/.npmrc に save-exact=true が追加される
```

```sh [pnpm]
pnpm config set save-exact true
# ~/Library/Preferences/pnpm/config.yaml に追加される
```

```toml [Bun (bunfig.toml)]
# npmの設定がされていれば不要。それ以外は:
[install]
exact = true
```

```sh [Deno]
# 設定はできない。コマンドごとに --save-exact を指定する
deno add --save-exact <package>
```

::

---

# 対策1: 推移的依存関係のピン留め

::code-group

```json [npm / Bun / Deno (package.json)]
{
  "overrides": {
    "dayjs": "1.11.18"
  }
}
```

```yaml [pnpm (pnpm-workspace.yaml)]
overrides:
  "dayjs": "1.11.18"
```

::

---
layout: fact
---

# 対策2: ロックファイルを活用したインストール

`package.json` とロックファイルに**齟齬があるとエラー**になるインストール方法<br>
危険なバージョンへの意図しない更新を防ぐ

---

# 対策2: 各PMのコマンド

::code-group

```sh [npm]
npm ci
```

```sh [pnpm]
pnpm ci
# pnpm < v11 の場合: pnpm i --frozen-lockfile
```

```sh [Bun]
bun ci
```

```sh [Deno]
deno install --frozen
```

::

---
layout: fact
---

# 対策3: ライフサイクルスクリプトを無効

`pre*` / `post*` のスクリプトがインストール時に<br>
**攻撃コードを実行する**リスクを軽減

---

# 対策3: 各PMの設定状況

| PM   | 状況             | 設定内容                                                       |
| ---- | ---------------- | -------------------------------------------------------------- |
| npm  | ⚙️ 設定要        | `npm config set ignore-scripts true`                           |
| pnpm | ✅ v11デフォルト | `strictDepBuilds=true`<br>依存関係のスクリプト実行でエラー終了 |
| Bun  | ✅ デフォルト    | 依存関係のスクリプトは原則無効                                 |
| Deno | ✅ デフォルト    | `deno approve-scripts` で明示的に許可                          |

---
layout: fact
---

# 対策4: Minimal Release Age

新バージョンがリリースされてから<br>
インストールできるまでの**ラグ**を意図的に設定する<br>
数日のラグで対策が取られることも多い

---

# 対策4: 各PMの設定

| PM   | 状況             | 設定内容                                                              |
| ---- | ---------------- | --------------------------------------------------------------------- |
| npm  | ⚙️ v11.10以降    | `npm config set min-release-age 1`<br>`.npmrc` に `min-release-age=1` |
| pnpm | ✅ v11デフォルト | `minimumReleaseAge: 1440` (1日=1440分)                                |
| Bun  | ⚙️ 設定要        | `bunfig.toml` に `minimumReleaseAge = 86400` (秒)                     |
| Deno | ⚙️ 設定要        | `deno.json` に `"minimumDependencyAge": 1440` (分)                    |

---
layout: fact
---

# 対策5: 危険なソース指定を禁止

推移的依存関係で **Git リポジトリ** や **tarball** 経由の<br>
悪性スクリプトを取り込む攻撃から防御

---

# 対策5: 各PMの対応状況

| PM   | 状況             | 備考                      |
| ---- | ---------------- | ------------------------- |
| npm  | ❌ 未対応        | —                         |
| pnpm | ✅ v11デフォルト | `blockExoticSubdeps=true` |
| Bun  | ❌ 未対応        | —                         |
| Deno | ❌ 未対応        | —                         |

---
title: Chapter3
layout: chapter-divider
activeChapter: 3
---

---

# pnpm v11 はデフォルトで3つの対策が適用済み

| 設定                 | デフォルト値 | 内容                                      |
| -------------------- | ------------ | ----------------------------------------- |
| `strictDepBuilds`    | `true`       | 依存関係のライフサイクルスクリプトを禁止  |
| `minimumReleaseAge`  | `1440` (1日) | リリース後1日経過しないとインストール不可 |
| `blockExoticSubdeps` | `true`       | 推移的依存関係の危険なソース指定を禁止    |

---

# pnpm + 追加設定で5つ全て対応

pnpm v11 に追加で必要な設定は **2つだけ**

```sh
# 対策1: バージョンをピン留め
pnpm config set save-exact true

# 対策2: ロックファイルを活用 (CIで実行)
pnpm ci
```

<conclusion>

デフォルトが安全 → **設定漏れのリスクが最も低い**

</conclusion>

---

# まとめ

5つの対策を実施してサプライチェーン攻撃から身を守ろう

1. **バージョンをピン留め** — `save-exact` 設定 + `overrides`
2. **ロックファイルを活用** — `ci` コマンドでインストール
3. **ライフサイクルスクリプトを無効** — pnpm/Bun/Denoはデフォルト対応
4. **Minimal Release Age** — pnpmはデフォルト1日
5. **危険なソース指定を禁止** — pnpmのみデフォルト対応

<conclusion overlay>

pnpmはv11でデフォルト設定が最も充実している

</conclusion>
