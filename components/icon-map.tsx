import {
  BookOpen,
  ArrowUpFromLine,
  ArrowDownToLine,
  Landmark,
  PiggyBank,
  Boxes,
  Users,
  FileBarChart,
  Sparkles,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  ArrowUpFromLine,
  ArrowDownToLine,
  Landmark,
  PiggyBank,
  Boxes,
  Users,
  FileBarChart,
  Sparkles,
  LayoutGrid,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? LayoutGrid;
}
