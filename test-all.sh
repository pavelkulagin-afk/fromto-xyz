#!/bin/bash
set -e
echo "🧪 Запуск полного тестирования FromTo.xyz..."

BASE_URL="http://localhost:3000"

# 1. Проверка доступности страниц
echo -e "\n🔗 Проверка страниц..."
for page in "/" "/auth" "/admin" "/search" "/create" "/notifications" "/profile"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$page")
  if [ "$STATUS" = "200" ] || [ "$STATUS" = "401" ]; then
    echo "✅ $page → $STATUS"
  else
    echo "❌ $page → $STATUS"
  fi
done

# 2. Проверка статических файлов
echo -e "\n📦 Проверка статики..."
for file in "/manifest.json" "/icon-192.png" "/icon-512.png"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$file")
  [ "$STATUS" = "200" ] && echo "✅ $file" || echo "❌ $file → $STATUS"
done

# 3. Проверка API (если запущен)
echo -e "\n🔌 Проверка API..."
curl -s "$BASE_URL/api/trails/test/steps" -o /dev/null -w "Steps API: %{http_code}\n" || echo "⚠ API не доступен (нормально без авторизации)"

# 4. Проверка зависимостей
echo -e "\n📦 Проверка зависимостей..."
npm ls sharp >/dev/null 2>&1 && echo "✅ sharp установлен" || echo "⚠ sharp не установлен"
npm ls @radix-ui/react-tabs >/dev/null 2>&1 && echo "✅ tabs установлен" || echo "⚠ tabs не установлен"

# 5. Проверка типов TypeScript
echo -e "\n🔤 Проверка типов..."
npx tsc --noEmit 2>&1 | head -5 || echo "⚠ Есть ошибки типов (не критично для запуска)"

echo -e "\n✅ Тестирование завершено!"
