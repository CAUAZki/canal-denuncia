function Icon({ children, size = 20, className = '', ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ShieldIcon = (props) => (
  <Icon {...props}>
    <path d="M12 3l7 2.6v5.6c0 4.7-3 8.3-7 9.8-4-1.5-7-5.1-7-9.8V5.6L12 3z" />
    <path d="M9.3 12.1l1.9 1.9 3.5-4" />
  </Icon>
);

export const LockIcon = (props) => (
  <Icon {...props}>
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7.5a4 4 0 018 0V10" />
  </Icon>
);

export const FilePlusIcon = (props) => (
  <Icon {...props}>
    <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" />
    <path d="M14 3v5h5" />
    <path d="M12 12v5M9.5 14.5h5" />
  </Icon>
);

export const SearchIcon = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Icon>
);

export const CheckCircleIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.4l2.3 2.3 4.7-5" />
  </Icon>
);

export const AlertTriangleIcon = (props) => (
  <Icon {...props}>
    <path d="M12 4l9 16H3L12 4z" />
    <path d="M12 10v4.5M12 17.4v.2" />
  </Icon>
);

export const UsersIcon = (props) => (
  <Icon {...props}>
    <circle cx="9" cy="9" r="3.2" />
    <path d="M3.5 20a5.5 5.5 0 0111 0" />
    <path d="M16 5.4a3.2 3.2 0 010 6.2M17.8 20a5.5 5.5 0 00-2.6-4.6" />
  </Icon>
);

export const MailIcon = (props) => (
  <Icon {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3.5 6.5l8.5 6 8.5-6" />
  </Icon>
);

export const PhoneIcon = (props) => (
  <Icon {...props}>
    <path d="M7.2 3.8h2.3l1.2 3.2-1.7 1.4a12.5 12.5 0 005.6 5.6l1.4-1.7 3.2 1.2v2.3a2.4 2.4 0 01-2.6 2.4A16.8 16.8 0 014.8 6.4 2.4 2.4 0 017.2 3.8z" />
  </Icon>
);

export const ArrowRightIcon = (props) => (
  <Icon {...props}>
    <path d="M4 12h15M13.5 6.5L20 12l-6.5 5.5" />
  </Icon>
);

export const CopyIcon = (props) => (
  <Icon {...props}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M15 5.5A1.5 1.5 0 0013.5 4h-8A1.5 1.5 0 004 5.5v8A1.5 1.5 0 005.5 15" />
  </Icon>
);

export const SparklesIcon = (props) => (
  <Icon {...props}>
    <path d="M12 4l1.6 4.1L18 9.7l-4.4 1.6L12 15.4l-1.6-4.1L6 9.7l4.4-1.6L12 4z" />
    <path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" />
  </Icon>
);

export const ClockIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.2l3.2 2" />
  </Icon>
);

export const ScaleIcon = (props) => (
  <Icon {...props}>
    <path d="M12 4v16M7 20h10" />
    <path d="M6 8h12M6 8l-2.5 5h5L6 8zM18 8l-2.5 5h5L18 8z" />
  </Icon>
);

export const EyeOffIcon = (props) => (
  <Icon {...props}>
    <path d="M3 3l18 18" />
    <path d="M10.6 5.2A9.9 9.9 0 0112 5c5 0 9 4.4 9 7 0 1-.8 2.4-2.1 3.7M6.2 6.6C4.2 8.1 3 10.2 3 12c0 2.6 4 7 9 7a9.6 9.6 0 004.3-1" />
    <path d="M9.9 9.9a3 3 0 004.2 4.2" />
  </Icon>
);

export const MenuIcon = (props) => (
  <Icon {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const CloseIcon = (props) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);

export const LogOutIcon = (props) => (
  <Icon {...props}>
    <path d="M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3" />
    <path d="M10 8l-4 4 4 4M6 12h9" />
  </Icon>
);

export const DashboardIcon = (props) => (
  <Icon {...props}>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </Icon>
);

export const ListIcon = (props) => (
  <Icon {...props}>
    <path d="M8 6h13M8 12h13M8 18h13" />
    <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
  </Icon>
);

export const HistoryIcon = (props) => (
  <Icon {...props}>
    <path d="M3.5 12a8.5 8.5 0 108.5-8.5A8.4 8.4 0 005.6 6.4L3.5 8.6" />
    <path d="M3.5 4.5v4.1h4.1M12 8v4.4l2.8 1.7" />
  </Icon>
);

export const PaperclipIcon = (props) => (
  <Icon {...props}>
    <path d="M20 11.5l-7.6 7.6a4.6 4.6 0 01-6.5-6.5l8-8a3.2 3.2 0 014.6 4.6l-8 8a1.9 1.9 0 01-2.7-2.7l7.3-7.3" />
  </Icon>
);

export const SendIcon = (props) => (
  <Icon {...props}>
    <path d="M21 4L3 11l7 2.5L12.5 21 21 4z" />
    <path d="M10 13.5L21 4" />
  </Icon>
);

export const NoteIcon = (props) => (
  <Icon {...props}>
    <path d="M5 4h11l3 3v13H5z" />
    <path d="M8.5 10h7M8.5 14h7" />
  </Icon>
);

export const InfoIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.8v.2" />
  </Icon>
);

export const CheckIcon = (props) => (
  <Icon {...props}>
    <path d="M4.5 12.5l5 5L20 6.5" />
  </Icon>
);

export const BuildingIcon = (props) => (
  <Icon {...props}>
    <path d="M4 20V6a2 2 0 012-2h7a2 2 0 012 2v14" />
    <path d="M15 10h3a2 2 0 012 2v8M8 8h3M8 12h3M8 16h3M3 20h18" />
  </Icon>
);

export const DataIcon = (props) => (
  <Icon {...props}>
    <ellipse cx="12" cy="6" rx="7" ry="3" />
    <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
    <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
  </Icon>
);

export const ShieldAlertIcon = (props) => (
  <Icon {...props}>
    <path d="M12 3l7 2.6v5.6c0 4.7-3 8.3-7 9.8-4-1.5-7-5.1-7-9.8V5.6L12 3z" />
    <path d="M12 8.5v4M12 15.6v.2" />
  </Icon>
);

export const CalendarIcon = (props) => (
  <Icon {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </Icon>
);

export const ShieldOffIcon = (props) => (
  <Icon {...props}>
    <path d="M12 3l7 2.6v5.6c0 1-.2 2-.5 2.9M12 21c-4-1.5-7-5.1-7-9.8V5.6L7.5 4.6" />
    <path d="M3 3l18 18" />
  </Icon>
);
