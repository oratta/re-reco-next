#!/bin/bash

# デフォルト値の設定
DEFAULT_SOURCE_DIR="./src"
DEFAULT_DEST_DIR="./tools/llm_file"

# 引数を変数に格納（デフォルト値を使用）
SOURCE_DIR="${1:-$DEFAULT_SOURCE_DIR}"
DEST_DIR="${2:-$DEFAULT_DEST_DIR}"

# コピー元フォルダの存在確認
if [ ! -d "$SOURCE_DIR" ]; then
    echo "エラー: コピー元フォルダ '$SOURCE_DIR' が見つかりません。"
    exit 1
fi

# コピー先フォルダ内の既存ファイルを全て削除
echo "コピー先フォルダをクリーンアップしています..."
rm -rf "${DEST_DIR:?}"/*

# コピー先フォルダの作成（存在しない場合）
mkdir -p "$DEST_DIR"
mkdir -p "$DEST_DIR/meta"
mkdir -p "$DEST_DIR/option"


# .gitignoreファイルの内容を読み込む
GITIGNORE_FILE="$SOURCE_DIR/.gitignore"
if [ -f "$GITIGNORE_FILE" ]; then
    IGNORE_PATTERNS=$(grep -v '^#' "$GITIGNORE_FILE" | sed '/^\s*$/d' | tr '\n' '|')
else
    IGNORE_PATTERNS=""
fi

# ファイルのコピー
echo "ファイルをコピーしています..."
find "$SOURCE_DIR" -type f | while read -r file; do
    # .gitignoreパターンに一致するファイルをスキップ
    if [[ -n "$IGNORE_PATTERNS" ]] && echo "$file" | grep -qE "$IGNORE_PATTERNS"; then
        continue
    fi

    # ソースディレクトリからの相対パスを取得
    rel_path="${file#$SOURCE_DIR/}"

    # ディレクトリ構造をファイル名に反映し、src_プレフィックスを追加
    new_filename="src_$(echo "$rel_path" | tr '/' '_')"

    # ファイル名が既に存在する場合、ユニークな名前を生成
    if [ -e "$DEST_DIR/$new_filename" ]; then
        counter=1
        extension="${new_filename##*.}"
        base_filename="${new_filename%.*}"
        while [ -e "$DEST_DIR/${base_filename}_${counter}.${extension}" ]; do
            counter=$((counter + 1))
        done
        new_filename="${base_filename}_${counter}.${extension}"
    fi

    # ファイルをコピー
    cp "$file" "$DEST_DIR/$new_filename"
    echo "コピー: $rel_path -> $new_filename"
done

# 追加ファイルのコピー
echo "追加ファイルをコピーしています..."
additional_files=(
    "./prisma/schema.prisma"
    "./.env"
    "./jest.config.js"
    "./jsconfig.json"
    "./next.config.mjs"
    "./package.json"
#    "./package-lock.json" //ファイルサイズがデカかった
    "./tailwind.config.js"
    "./amplify.yml"
)

for file in "${additional_files[@]}"; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        cp "$file" "$DEST_DIR/option/$filename"
        echo "追加コピー: $file -> option/$filename"
    else
        echo "警告: ファイル $file が見つかりません。"
    fi
done

echo "コピーが完了しました。"

# 元のディレクトリ構造の生成
echo "元のディレクトリ構造を生成しています..."
tree_file="$DEST_DIR/meta/original_directory_structure.txt"

# .gitignoreパターンを除外オプションとして構築
if [ -n "$IGNORE_PATTERNS" ]; then
    IGNORE_OPTIONS=$(echo "$IGNORE_PATTERNS" | sed 's/|/ -I /g; s/^/-I /')
else
    IGNORE_OPTIONS=""
fi

# tree コマンドが利用可能かチェック
if command -v tree &> /dev/null; then
    # tree コマンドを使用してツリー構造を生成
    tree -L 3 $IGNORE_OPTIONS "$SOURCE_DIR" > "$tree_file"
else
    # tree コマンドが利用できない場合は、簡易的なツリー構造を生成
    (
        cd "$SOURCE_DIR" || exit
        echo "$SOURCE_DIR"
        find . -maxdepth 3 -not -path '*/\.*' | sort | sed '1d;s/^\.//;s/\/\([^/]*\)$/|--\1/;s/\/[^/|]*/|  /g' |
        grep -vE "$IGNORE_PATTERNS"
    ) > "$tree_file"
fi

echo "元のディレクトリ構造が $tree_file に保存されました。"