#!/bin/zsh
set -e

echo "Starting Prisma migrations and updates..."

npx prisma migrate dev --name change_forigin_key_as_code --create-only || { echo "Error during migrate dev"; exit 1; }
npx prisma migrate reset || { echo "Error during migrate reset"; exit 1; }
npx prisma generate || { echo "Error during prisma generate"; exit 1; }
npx prisma db push || { echo "Error during db push"; exit 1; }

echo "All Prisma commands completed successfully."