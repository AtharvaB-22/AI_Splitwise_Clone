"use client";

import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="flex items-center gap-2"
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </Button>
  );
}