import type { ComponentType, SVGProps } from "react";

type Props = {
  title: string;
  subtitle: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export default function PageHeader({ title, subtitle, Icon }: Props) {
  return (
    <div className="flex items-start gap-4 animate-fadeInUp">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#34e36a] to-[#16a34a] text-[#042b13] shadow-[0_10px_26px_-10px_rgba(46,232,95,0.7)]">
        <Icon width={23} height={23} />
      </span>
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)] sm:text-base">{subtitle}</p>
        <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#34e36a] to-transparent" />
      </div>
    </div>
  );
}
