import { Leaf } from "lucide-react";

type Props = {
  showWordmark?: boolean;
  className?: string;
};

export default function BrandLogo({ showWordmark = true, className = "" }: Props) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft ring-1 ring-inset ring-primary/20">
        <Leaf className="h-[18px] w-[18px] text-primary" strokeWidth={2.25} />
      </span>
      {showWordmark && (
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          GreenDash
        </span>
      )}
    </div>
  );
}
