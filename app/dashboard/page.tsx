"use client";

import { TaskList } from "@/components/task-list";
import { useTotalStoryPoint } from "@/hooks/useTasksQuery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

function StoryPointCard({ title, storyPoint, loading }: { title: string; storyPoint: number; loading: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-3xl font-bold text-gray-400">...</p>
        ) : (
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">{storyPoint}</p>
            <span className="text-sm text-muted-foreground">SP</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const today = dayjs().format('YYYY-MM-DD');
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

  const { data: todayStoryPoint = 0, isLoading: loadingToday } = useTotalStoryPoint({
    completed: 'true',
    created_after: today,
    created_before: today,
  });

  const { data: yesterdayStoryPoint = 0, isLoading: loadingYesterday } = useTotalStoryPoint({
    completed: 'true',
    created_after: yesterday,
    created_before: yesterday,
  });

  const handleLogout = async () => {
    document.cookie = "asana_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "asana_user_gid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "asana_workspace_gid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "asana_user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Daily Report Asana</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StoryPointCard
            title="Story Point Selesai Kemarin"
            storyPoint={yesterdayStoryPoint}
            loading={loadingYesterday}
          />
          <StoryPointCard
            title="Story Point Selesai Hari Ini"
            storyPoint={todayStoryPoint}
            loading={loadingToday}
          />
        </div>

        <TaskList />
      </div>
    </div>
  );
}
