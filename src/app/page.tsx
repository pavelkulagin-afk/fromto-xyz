import { Timeline } from "@/components/timeline/Timeline"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "FromTo — от идеи к результату",
  description: "Визуальные трейлы: показывайте путь, а не только финал",
}

const demoTrail = {
  id: "demo-1",
  userId: "demo",
  title: "Как я сделал свой первый сайт",
  description: "Пошаговый путь от нуля до деплоя",
  coverImage: "",
  status: "completed" as const,
  license: "CC-BY-4.0" as const,
  createdAt: "2026-01-15",
  updatedAt: "2026-05-14",
  steps: [
    {
      id: "s1",
      order: 1,
      title: "Идея и планирование",
      description: "Определил цель: лендинг для портфолио. Набросал структуру в заметках.",
      createdAt: "2026-01-15",
      timeSpentMinutes: 30,
    },
    {
      id: "s2",
      order: 2,
      title: "Настройка окружения",
      description: "Установил Node.js, создал проект через create-next-app, подключил Tailwind.",
      createdAt: "2026-01-16",
      timeSpentMinutes: 45,
    },
    {
      id: "s3",
      order: 3,
      title: "Верстка компонентов",
      description: "Создал Header, Hero, Features, Footer. Использовал shadcn/ui для кнопок.",
      createdAt: "2026-01-18",
      timeSpentMinutes: 120,
    },
    {
      id: "s4",
      order: 4,
      title: "Деплой",
      description: "Задеплоил на Cloudflare Pages. Настроил домен и HTTPS.",
      createdAt: "2026-01-20",
      timeSpentMinutes: 20,
    },
  ],
}

export default function HomePage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">FromTo</h1>
          <p className="text-lg text-muted-foreground">
            От идеи → к результату. Показывайте каждый шаг.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{demoTrail.title}</CardTitle>
            <p className="text-muted-foreground">{demoTrail.description}</p>
          </CardHeader>
          <CardContent>
            <Timeline trail={demoTrail} />
          </CardContent>
        </Card>

        <div className="text-center">
          <Button size="lg">Создать свой трейл</Button>
          <p className="text-sm text-muted-foreground mt-4">
            Бесплатно • Открытый исходный код • Лицензия {demoTrail.license}
          </p>
        </div>
      </div>
    </main>
  )
}
