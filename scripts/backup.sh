#!/bin/bash
set -e

echo "🔄 Запуск бэкапа fromto.xyz..."

# Переменные окружения (должны быть заданы в CI/CD)
: "${SUPABASE_DB_URL:?SUPABASE_DB_URL not set}"
: "${R2_ACCESS_KEY:?R2_ACCESS_KEY not set}"
: "${R2_SECRET_KEY:?R2_SECRET_KEY not set}"
: "${R2_BUCKET:?R2_BUCKET not set}"
: "${R2_ENDPOINT:?R2_ENDPOINT not set}"
: "${BACKUP_PASSWORD:?BACKUP_PASSWORD not set}"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="fromto_backup_${TIMESTAMP}.sql"
RESTIC_REPO="r2://${R2_BUCKET}/backups"

# 1. Создаём дамп БД
echo "📦 Создание дампа БД..."
pg_dump "$SUPABASE_DB_URL" > "$BACKUP_FILE"

# 2. Инициализируем restic (если нужно)
echo "🔐 Инициализация restic..."
export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="$R2_SECRET_KEY"
export AWS_ENDPOINT_URL="$R2_ENDPOINT"
export RESTIC_PASSWORD="$BACKUP_PASSWORD"

restic init --repo "$RESTIC_REPO" 2>/dev/null || true

# 3. Загружаем бэкап
echo "⬆️ Загрузка в R2..."
restic backup --repo "$RESTIC_REPO" "$BACKUP_FILE"

# 4. Очищаем локальный файл
rm -f "$BACKUP_FILE"

# 5. Удаляем старые бэкапы (храним последние 7 дней)
echo "🧹 Очистка старых бэкапов..."
restic forget --repo "$RESTIC_REPO" --keep-daily 7 --prune

echo "✅ Бэкап завершён: $TIMESTAMP"
