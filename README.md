# 結継（ゆいつぎ）

日本の伝統文化・技術を守るための動画視聴・配信プラットフォームです。
後継者不足で失われていく技術・文化を守るための動画視聴・配信のプラットフォームです。

## 技術スタック

- **フロントエンド**: Next.js 15.5.2, React 19.1.0, TypeScript
- **スタイリング**: Tailwind CSS 4, Eczarフォント
- **データベース**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **認証**: Supabase Auth
- **ストレージ**: Supabase Storage

## 環境構築手順

### 1. 前提条件

以下のソフトウェアがインストールされていることを確認してください：

- Node.js (v18以上推奨)
- npm または yarn
- Git

### 2. リポジトリのクローン

```bash
git clone <リポジトリURL>
cd team5
```

### 3. 依存関係のインストール

```bash
npm install
```

### 4. Supabaseプロジェクトの設定

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトの設定から以下を取得：
   - Project URL
   - Project API Key (anon/public)
   - Database Password

### 4-1. Supabaseテーブルの作成

SQL Editorで以下のテーブルを作成してください：

```sql
-- profilesテーブルの作成
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  avatar_url text,
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- savesテーブルの作成
CREATE TABLE saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);
```

### 4-2. Supabase Storage設定

1. Storage → Buckets で以下のバケットを作成：
   - `videos` (動画ファイル用)
   - `thumbnails` (サムネイル画像用)
   - `avatars` (アバター画像用)

2. 各バケットのポリシーを設定（認証済みユーザーのみアクセス可能）

### 5. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下の内容を記入：

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# データベース接続URL (Prisma用)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

**注意**: `[YOUR-PASSWORD]` と `[YOUR-PROJECT-REF]` を実際の値に置き換えてください。

### 6. Prismaのセットアップ

```bash
# Prismaクライアントの生成
npx prisma generate

# データベースマイグレーションの実行
npx prisma db push
```

### 7. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスして動作確認してください。

## プロジェクト構造

```
team5/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # グローバルスタイル
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # ホームページ
│   │   ├── login/             # ログインページ
│   │   │   └── page.tsx
│   │   ├── signup/            # サインアップページ
│   │   │   └── page.tsx
│   │   ├── upload/            # 動画投稿ページ
│   │   │   └── page.tsx
│   │   └── videos/            # 動画関連ページ
│   │       ├── page.tsx       # 動画一覧ページ
│   │       └── [id]/          # 動画詳細ページ（動的ルート）
│   │           └── page.tsx
│   └── lib/                   # ユーティリティ関数
│       ├── prisma.ts          # Prismaクライアント
│       └── supabase.ts        # Supabaseクライアント
├── prisma/
│   └── schema.prisma          # データベーススキーマ
├── public/                    # 静的ファイル
│   ├── *.png                  # 画像ファイル
│   └── *.svg                  # SVGアイコン
├── .env.local                 # 環境変数（要作成）
└── README.md                  # このファイル
```

## データベーススキーマ

### 主要なテーブル

- **users**: ユーザー認証情報（Supabase Auth連携）
- **profiles**: 投稿者詳細情報（username, avatar_url）
- **videos**: 動画データ（title, description, video_url, thumbnail_url）
- **categories**: カテゴリ（伝統工芸の種類）
- **comments**: コメント（text, user_id, video_id）
- **likes**: いいね（user_id, video_id）
- **saves**: 保存済み動画（user_id, video_id）

### テーブル間のリレーション

```
users (1) ←→ (1) profiles
users (1) ←→ (N) videos
users (1) ←→ (N) comments
users (1) ←→ (N) likes
users (1) ←→ (N) saves

categories (1) ←→ (N) videos

videos (1) ←→ (N) comments
videos (1) ←→ (N) likes
videos (1) ←→ (N) saves
```

## 実装済み機能

### ✅ **完了済み**
- ホームページ（カルーセル、統計表示）
- 動画一覧ページ
- 動画詳細ページ（動的ルート）
- 動画投稿ページ（フォーム、ファイル検証機能）
- ログイン・サインアップページ
- Eczarフォントの適用
- レスポンシブデザイン
- ブランディング（結継ロゴの統一）
- ヘッダーナビゲーションの統一
- データベーススキーマ設計（Prisma + Supabase）
- タグシステムの設計
- Supabase Storageポリシー設定

### 🔄 **実装中・未実装**
- 認証機能（Supabase Auth連携）
- 動画アップロード機能（Supabase Storage連携）
- 動画再生機能
- コメント・いいね・保存機能
- 検索・フィルタ機能
- プロフィール機能
- データベースマイグレーション

## 次の実装予定

### 優先度の高いものから順に：

1. **データベーススキーマ修正** ⚠️ **進行中**
   - Supabaseテーブルの修正（カラム名、データ型）
   - 新しいテーブルの作成（tags, video_tags）
   - Prismaマイグレーションの実行

2. **認証機能実装**
   - ログイン・サインアップの実装
   - 認証状態の管理
   - プロテクトされたルートの設定

3. **動画機能実装**
   - 動画アップロード機能（Supabase Storage連携）
   - 動画再生機能
   - サムネイル生成

4. **インタラクション機能**
   - コメント機能
   - いいね機能
   - 保存機能
   - 検索機能

5. **プロフィール機能**
   - ユーザープロフィール表示
   - プロフィール編集
   - アバターアップロード

## 開発時の注意事項

1. **環境変数**: `.env.local` ファイルは絶対にコミットしないでください
2. **データベース**: 本番環境では必ずバックアップを取ってください
3. **認証**: Supabase Authの設定は本番環境で適切に行ってください
4. **ストレージ**: Supabase Storageのポリシー設定を適切に行ってください

## トラブルシューティング

### よくある問題

1. **Prismaクライアントエラー**
   ```bash
   npx prisma generate
   ```

2. **データベース接続エラー**
   - `.env.local` の `DATABASE_URL` を確認
   - Supabaseプロジェクトがアクティブか確認

3. **依存関係エラー**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## 貢献方法

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 連絡先

質問や提案がある場合は、Issueを作成してください。