import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 16, ...rest }: P, children: React.ReactNode) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IcLock = (p: P) =>
  base(p, <><rect x="5" y="10.5" width="14" height="9.5" rx="1.5" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /><path d="M12 14.5v2" /></>);

export const IcKey = (p: P) =>
  base(p, <><circle cx="8" cy="15.5" r="4" /><path d="M11 12.5 20 3.5M17 7l2.5 2.5M14.5 9.5 17 12" /></>);

export const IcPencil = (p: P) =>
  base(p, <><path d="M4 20l1-4.5L16.5 4a2.1 2.1 0 0 1 3 0l.5.5a2.1 2.1 0 0 1 0 3L8.5 19z" /><path d="M14.5 6l3 3" /></>);

export const IcTrash = (p: P) =>
  base(p, <><path d="M4.5 6.5h15M9.5 6V4.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V6" /><path d="M6.5 6.5 7.5 20a1 1 0 0 0 1 .9h7a1 1 0 0 0 1-.9l1-13.5" /><path d="M10.2 10.5v6M13.8 10.5v6" /></>);

export const IcPlus = (p: P) => base(p, <path d="M12 5v14M5 12h14" />);

export const IcX = (p: P) => base(p, <path d="M6 6l12 12M18 6L6 18" />);

export const IcCheck = (p: P) => base(p, <path d="M4.5 12.5 10 18 19.5 6.5" />);

export const IcDownload = (p: P) =>
  base(p, <><path d="M12 3.5v11M7.5 10.5l4.5 4.5 4.5-4.5" /><path d="M4.5 19.5h15" /></>);

export const IcUpload = (p: P) =>
  base(p, <><path d="M12 15V4M7.5 8 12 3.5 16.5 8" /><path d="M4.5 19.5h15" /></>);

export const IcSearch = (p: P) =>
  base(p, <><circle cx="10.5" cy="10.5" r="6" /><path d="M15.2 15.2 20 20" /></>);

export const IcDoc = (p: P) =>
  base(p, <><path d="M6 3.5h8l4 4V20.5H6z" /><path d="M14 3.5v4h4" /><path d="M9 12.5h6M9 15.5h6" /></>);

export const IcChip = (p: P) =>
  base(p, <><rect x="7" y="7" width="10" height="10" rx="1.5" /><rect x="10.2" y="10.2" width="3.6" height="3.6" /><path d="M9.5 7V3.5M14.5 7V3.5M9.5 20.5V17M14.5 20.5V17M7 9.5H3.5M7 14.5H3.5M20.5 9.5H17M20.5 14.5H17" /></>);

export const IcAlert = (p: P) =>
  base(p, <><path d="M12 4 2.8 19.5h18.4z" /><path d="M12 10v4.2M12 16.8v.4" /></>);

export const IcInfo = (p: P) =>
  base(p, <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 7.6v.4" /></>);

export const IcArrow = (p: P) => base(p, <path d="M4 12h15M13.5 6 19.5 12l-6 6" />);

export const IcReset = (p: P) =>
  base(p, <><path d="M4.5 8A8.5 8.5 0 1 1 3.6 13" /><path d="M4.5 3.5V8H9" /></>);

export const IcChevD = (p: P) => base(p, <path d="M6 9.5 12 15.5 18 9.5" />);

export const IcChevU = (p: P) => base(p, <path d="M6 14.5 12 8.5 18 14.5" />);

export const IcEye = (p: P) =>
  base(p, <><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="2.8" /></>);

export const IcStamp = (p: P) =>
  base(p, <><rect x="4" y="13.5" width="16" height="6" rx="1" /><path d="M9.5 13.5v-2a2.5 2.5 0 0 1 5 0v2M12 11.5V6.8" /><circle cx="12" cy="5.4" r="1.6" /></>);

export const IcLayer = (p: P) =>
  base(p, <><path d="M12 3.5 21 8l-9 4.5L3 8z" /><path d="M3 12.5 12 17l9-4.5" /><path d="M3 16.5 12 21l9-4.5" /></>);

export const IcImage = (p: P) =>
  base(p, <><rect x="3.5" y="4.5" width="17" height="15" rx="1.5" /><circle cx="9" cy="9.5" r="1.6" /><path d="M4.5 17.5 10 12l3.5 3.5 3-3 3 3" /></>);

export const IcLink = (p: P) =>
  base(p, <><path d="M10 14a4 4 0 0 0 6 .5l2.5-2.5a4 4 0 1 0-5.7-5.7L11.5 7.5" /><path d="M14 10a4 4 0 0 0-6-.5l-2.5 2.5a4 4 0 1 0 5.7 5.7l1.3-1.2" /></>);
