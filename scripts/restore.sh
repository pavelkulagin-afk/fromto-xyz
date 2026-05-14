#!/bin/bash
set -e

echo "🔙 Восстановление fromto.xyz..."

: "${SUPABASE_DB_URL:?SUPABASE_DB_URL not set}"
: "${R2_ACCESS_KEY:?R2_ACCESS_KEY not set}"
: "${R2_SECRET_KEY:?R2_SECRET_KEY not set}"
: "${R2_BUCKET:?R2_BUCKET not set}"
: "${R2_ENDPOINT:?R2_ENDPOINT not set}"
: "${BACKUP_PASSWORD:?BACKUP_PASSWORD not set}"
: "${BACKUP_ID:?BACKUP_ID not set}"

RESTIC_REPO="r2://${R2_BUCKET}/backups"
export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="$R2_SECRET_KEY"
export AWS_ENDPOINT_URL="$R2_ENDPOINT"
export RESTIC_PASSWORD="$BACKUP_PASSWORD"

# 1. Скачиваем бэкап
echo "⬇️ Загрузка бэкапа $BACKUP_ID..."
restic restore --repo "$RESTIC_REPO" "$BACKUP_ID" --target /tmp/restore

# 2. Находим файл .sql
BACKUP_FILE=$(find /tmp/restore -name "*.sql" | head -n 1)

if [ -z "$BACKUP_FILE" ]; then
  echo "❌ Файл бэкапа не найден"
  exit 1
fi

# 3. Восстанавливаем БД
echo "💾 Восстановление БД..."
psql "$SUPABASE_DB_URL" < "$BACKUP_FILE"

# 4. Очищаем
rm -rf /tmp/restore

echo "✅ Восстановление завершено"
