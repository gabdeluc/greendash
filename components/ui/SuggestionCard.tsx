import { Lightbulb, Sparkles, TrendingUp } from "lucide-react";

type Props = {
  type: "warning" | "success" | "info";
  title: string;
  body: string;
};

const styles = {
  warning: {
    icon: TrendingUp,
    iconColor: "text-gas",
    iconBg: "bg-gas-soft",
  },
  success: {
    icon: Sparkles,
    iconColor: "text-primary",
    iconBg: "bg-primary-soft",
  },
  info: {
    icon: Lightbulb,
    iconColor: "text-water",
    iconBg: "bg-water-soft",
  },
};

export default function SuggestionCard({ type, title, body }: Props) {
  const s = styles[type];
  const Icon = s.icon;

  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-border-strong">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${s.iconBg}`}
      >
        <Icon className={`h-[18px] w-[18px] ${s.iconColor}`} strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
    </div>
  );
}
