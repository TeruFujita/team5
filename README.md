# 伝統文化動画プラットフォーム

日本の伝統文化・技術を守るための動画視聴・配信プラットフォームです。

## 技術スタック

- **フロントエンド**: Next.js 15.5.2, React 19.1.0, TypeScript
- **スタイリング**: Tailwind CSS 4
- **データベース**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **認証**: Supabase Auth

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
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css     # グローバルスタイル
│   │   ├── layout.tsx      # ルートレイアウト
│   │   └── page.tsx        # ホームページ
│   └── lib/                # ユーティリティ関数
├── prisma/
│   └── schema.prisma       # データベーススキーマ
├── public/                 # 静的ファイル
├── .env.local             # 環境変数（要作成）
└── README.md              # このファイル
```

## データベーススキーマ

### 主要なテーブル

- **users**: ユーザー情報
- **videos**: 動画データ
- **categories**: カテゴリ（伝統工芸の種類）
- **comments**: コメント
- **likes**: いいね

## 開発時の注意事項

1. **環境変数**: `.env.local` ファイルは絶対にコミットしないでください
2. **データベース**: 本番環境では必ずバックアップを取ってください
3. **認証**: Supabase Authの設定は本番環境で適切に行ってください

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