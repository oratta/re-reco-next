#!/bin/bash

# 使用方法をチェック
if [ "$#" -ne 2 ]; then
    echo "使用方法: $0 <コピー元フォルダ> <コピー先フォルダ>"
    exit 1
fi

# 引数を変数に格納
SOURCE_DIR="$1"
DEST_DIR="$2"

# コピー元フォルダの存在確認
if [ ! -d "$SOURCE_DIR" ]; then
    echo "エラー: コピー元フォルダ '$SOURCE_DIR' が見つかりません。"
    exit 1
fi

# コピー先フォルダの作成（存在しない場合）
mkdir -p "$DEST_DIR"

# コピー先フォルダ内の既存ファイルを全て削除
echo "コピー先フォルダをクリーンアップしています..."
rm -rf "${DEST_DIR:?}"/*

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

    # ファイル名を抽出
    filename=$(basename "$file")

    # ファイル名が既に存在する場合、ユニークな名前を生成
    if [ -e "$DEST_DIR/$filename" ]; then
        counter=1
        extension="${filename##*.}"
        filename="${filename%.*}"
        while [ -e "$DEST_DIR/${filename}_${counter}.${extension}" ]; do
            counter=$((counter + 1))
        done
        new_filename="${filename}_${counter}.${extension}"
    else
        new_filename="$filename"
    fi

    # ファイルをコピー
    cp "$file" "$DEST_DIR/$new_filename"
done

echo "コピーが完了しました。"

# 元のディレクトリ構造の生成
echo "元のディレクトリ構造を生成しています..."
tree_file="$DEST_DIR/original_directory_structure.txt"

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