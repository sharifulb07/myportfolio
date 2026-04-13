"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-(--surface) px-2 py-1">
      <Sun className="size-3.5 text-amber-500" />
      <Switch
        checked={mounted ? isDark : false}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle dark mode"
      />
      <Moon className="size-3.5 text-indigo-400" />
    </div>
  );
}
