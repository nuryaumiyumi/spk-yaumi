import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const HomeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </svg>
);

export const CriteriaIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const AlternatifIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21c5-2 7-6 7-11V5l-4 1c-3 .8-5 3-5 6" />
    <path d="M12 21c-3-1.2-5-3.6-5.6-7" />
    <path d="M11 8c-1.5-2.2-4-3-7-3 .2 3 1.6 5 4 6" />
  </svg>
);

export const PerhitunganIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="2.5" width="16" height="19" rx="2" />
    <path d="M8 6.5h8" />
    <path d="M8 11h2M14 11h2M8 15h2M14 15h2M8 18.5h2M14 18.5h2" />
  </svg>
);

export const HasilIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M8 21h8" />
    <path d="M12 17v4" />
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
    <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" />
  </svg>
);

export const LaporanIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 2.5h8l4 4V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" />
    <path d="M13 2.5V7h4.5" />
    <path d="M8.5 13h7M8.5 16.5h7" />
  </svg>
);

export const InfoIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 7.5h.01" />
  </svg>
);

export const BellIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const RocketIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 0 0-3 0" />
    <path d="M12 15 9 12c1-4 3.5-7.5 8-8 .5 4.5-3 7-8 8z" />
    <path d="M9 12H5l3-4h3M12 15v4l4-3v-4" />
  </svg>
);

export const SparkIcon = (p: IconProps) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M13 2 4.5 13.5H11L9.5 22 19 9.5h-6.8L13 2z" />
  </svg>
);

export const LeafIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 20s1-9 8-13c4-2.5 8-2 8-2s.5 4-2 8c-4 7-13 8-13 8z" />
    <path d="M4 20c4-6 8-9 12-11" />
  </svg>
);

export const PlantIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21v-9" />
    <path d="M12 13c0-3 2-5 6-5 0 3-2 5-6 5z" />
    <path d="M12 15c0-3-2-5-6-5 0 3 2 5 6 5z" />
    <path d="M8 21h8" />
  </svg>
);

export const ScaleIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3v18" />
    <path d="M7 7h10l-5-3-5 3z" opacity="0.001" />
    <path d="M6 6h12" />
    <path d="M6 6 3 13h6L6 6zM18 6l-3 7h6l-3-7z" />
    <path d="M2.5 13a3.5 3.5 0 0 0 7 0M14.5 13a3.5 3.5 0 0 0 7 0" />
    <path d="M8 21h8" />
  </svg>
);

export const TargetIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const PrintIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 9V3h12v6" />
    <rect x="3" y="9" width="18" height="8" rx="2" />
    <path d="M7 17h10v4H7z" />
  </svg>
);

export const DownloadIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M4 20h16" />
  </svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const MenuIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m5 13 4 4L19 7" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6 18 18M18 6 6 18" />
  </svg>
);

export const EditIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

export const TrashIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h16" />
    <path d="M10 11v6M14 11v6" />
    <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    <path d="M9 7V4h6v3" />
  </svg>
);

/* Brand mark — stylised red chili (matches the reference mockup logo) */
export const ChiliIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width={20} height={20} fill="none" {...p}>
    <path
      d="M12.4 6.4c-.7-.9-.6-2.2.3-3 .9-.9 2.4-.9 3.6-.2-.4 1.4-1.6 2.4-3 2.5"
      fill="#22c55e"
    />
    <path
      d="M13 3.4c-.2 1 .3 1.9 1.2 2.3"
      stroke="#15803d"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M13.8 5.9c2.3.7 3.8 2.9 3.8 5.8 0 4.7-3.9 8.6-8.6 8.6-1.9 0-3.5-1.5-3.5-3.5 0-1.8 1.4-3.2 3.2-3.3 2.7-.1 4.9-2.4 4.9-5.2 0-.8-.1-1.6-.3-2.3.2-.1.4-.1.5 0z"
      fill="#ef4444"
    />
    <path
      d="M9 17c-.8.1-1.4.7-1.5 1.5"
      stroke="#fecaca"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

/* Sigma (Σ) — lambang penjumlahan, untuk menu Detail Perhitungan */
export const SigmaIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M17 4H6l6 8-6 8h11" />
  </svg>
);

export const ChartBarIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 3v16a1 1 0 0 0 1 1h16" />
    <path d="M8 20v-5M13 20v-9M18 20v-6" />
  </svg>
);
