export function StarIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 1"
      viewBox="0 0 32 32"
      {...props}
    >
      <path
        fill={props.color}
        d="M16.5.7C16.5 12.3 12.5 16 1 16c11.6 0 15.5 3.9 15.5 15.4 0-11.5 3.8-15.4 15.4-15.4C20.3 16 16.5 12.2 16.5.6Z"
      />
    </svg>
  );
}

export function PlayIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color}
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.6 3a.4.4 0 0 0-.6.4v9.2a.4.4 0 0 0 .6.4l7.8-4.7a.4.4 0 0 0 0-.6L4.6 3Z"
      />
    </svg>
  );
}

export function ExitIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill="#999"
        d="M2.6 1.8a.6.6 0 0 0-.8.8l2.6 2.6H2.2a.6.6 0 1 0 0 1.2h3.6a.6.6 0 0 0 .6-.6V2.2a.6.6 0 0 0-1.2 0v2.2L2.6 1.8Zm8.2.4a.6.6 0 1 0-1.2 0v3.6c0 .3.3.6.6.6h3.6a.6.6 0 0 0 0-1.2h-2.2l2.6-2.6a.6.6 0 0 0-.8-.8l-2.6 2.6V2.2Zm-8.2 12 2.6-2.6v2.2a.6.6 0 0 0 1.2 0v-3.6a.6.6 0 0 0-.6-.6H2.2a.6.6 0 1 0 0 1.2h2.2l-2.6 2.6a.6.6 0 1 0 .8.8Zm8.2-2.6 2.6 2.6a.6.6 0 1 0 .8-.8l-2.6-2.6h2.2a.6.6 0 0 0 0-1.2h-3.6a.6.6 0 0 0-.6.6v3.6a.6.6 0 0 0 1.2 0v-2.2Z"
      />
    </svg>
  );
}

export function ReviewIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 23 23"
      width={40}
      height={40}
      {...props}
    >
      <path
        fill={props.color}
        fillRule="evenodd"
        d="M13.4 7.1c.7-.2 1.4-.2 2 .1 1.4.8 2 2.6 1.4 4.5-.3.9-.7 1.7-1.6 2.6-1 .8-2.2 1.3-2.8 1.3a.4.4 0 0 1-.4-.4c0-.2.2-.4.4-.4.7 0 1.3-.3 2-.9.5-.4 1-1 1.2-1.4.5-.9.5-2.1-.3-2.5-.3.4-.8.7-1.3.7-1.2 0-2-1-1.9-1.9 0-.8.6-1.4 1.3-1.7Zm-6 0c.7-.2 1.4-.2 2 .1 1.4.8 2 2.6 1.4 4.5-.3.9-.7 1.7-1.6 2.6-1 .8-2.2 1.3-2.8 1.3a.4.4 0 0 1-.4-.4c0-.2.2-.4.4-.4.7 0 1.3-.3 2-.9.5-.4 1-1 1.2-1.4.5-.9.5-2.1-.3-2.5-.3.4-.8.7-1.3.7-1.2 0-2-1-1.9-1.9 0-.8.6-1.4 1.3-1.7Z"
        clipRule="evenodd"
      />
      <rect
        width={21}
        height={20.6}
        x={1}
        y={1}
        stroke={props.color}
        strokeWidth={1}
        rx={10.3}
      />
    </svg>
  );
}

export function ReplayStaticIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 72 72"
      {...props}
      fill={props.color}
    >
      <path d="M36 12c-4 0-7.7 1-11 2.7a4 4 0 0 0-1.3 6c1.2 1.5 3.2 2 5 1.1A16 16 0 0 1 51.8 34h-3a1.8 1.8 0 0 0-1.6 2.9l7.2 10.3c.7 1.1 2.3 1.1 3 0L64.7 37c.8-1.2 0-2.9-1.5-2.9h-3.3A24 24 0 0 0 36 12zM16 24c-.6 0-1.1.2-1.5.8L7.3 35c-.8 1.2 0 2.9 1.5 2.9h3.3A24 24 0 0 0 47 57.3a4 4 0 0 0 1.3-6 3.9 3.9 0 0 0-5-1.1A16 16 0 0 1 20.2 38h3c1.5 0 2.4-1.7 1.6-2.9l-7.2-10.3c-.4-.6-1-.8-1.5-.8z" />
    </svg>
  );
}

export function DividerIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 5 5"
      {...props}
    >
      <path fill={props.color} d="M1 5 0 4l4-4 1 1-4 4Zm3 0L0 1l1-1 4 4-1 1Z" />
    </svg>
  );
}

export function PlusIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      viewBox="0 0 32 32"
      {...props}
    >
      <path fill="none" d="M0 0h32v32H0z" />
      <path fill={props.color} d="M30 12H20V2h-8v10H2v8h10v10h8V20h10z" />
    </svg>
  );
}

export function ReviewClefIcon({ ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" {...props}>
      <path
        fill={props.color}
        d="M47.9 0c-24.4 0-34 16.3-34 29.4a11.6 11.6 0 1 0 11.6-11.6c-2.2 0-2.9-.7-2.3-1.5 3.4-5 10.5-9.7 23-9.7 18 0 33 18.3 33 40.9 0 32.9-26 64.9-54.4 76.7l2 3.8C57 116.6 88.2 84.5 88.2 46.5 88.3 15.5 65.5 0 48 0zM114 56.5a9 9 0 1 1-18.1 0 9 9 0 0 1 18.1 0m0-31.4a9.1 9.1 0 1 1-18.1 0 9.1 9.1 0 0 1 18.1 0"
      />
    </svg>
  );
}

export function ThreadIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="prefix__Layer_1"
      data-name="Layer 1"
      viewBox="0 0 24 24"
      {...props}
    >
      <defs>
        <clipPath id="prefix__clippath">
          <path fill="none" d="M0 0h24v24H0z" />
        </clipPath>
        <style>
          {`.prefix__cls-2{fill:none;stroke:${props.color};stroke-linecap:round;stroke-linejoin:round}`}
        </style>
      </defs>
      <g clipPath="url(#prefix__clippath)">
        <path
          d="M11.5 4v12.2a3.8 3.8 0 0 1-2.3 3.5 3.8 3.8 0 1 1-1.4-7.2H20"
          className="prefix__cls-2"
        />
      </g>
    </svg>
  );
}

export function LoveIcon({ ...props }) {
  return (
    <svg
      className="transition-colors duration-300"
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      viewBox="0 0 64 64"
      width="16"
      height="16"
      fill={props.color}
      {...props}
    >
      <path
        d="M41.8 10.7c5.5 0 14.2 4.3 14.2 16 0 7.3-3.9 12-9.1 17.4-4.3 4.5-10.7 8.8-10.9 9a7.2 7.2 0 0 1-8 0c-.3-.2-6.6-4.5-10.9-9C11.9 38.7 8 34 8 26.7c0-11.7 8.7-16 14.2-16 3.5 0 6.8 1.1 9.8 3.3 3-2.2 6.3-3.3 9.8-3.3zm0 28.4c4.9-5.1 7.1-8.1 7.1-12.4 0-7.5-5.3-8.9-7.1-8.9-3.1 0-5.5 1.7-7.2 3.4a3.6 3.6 0 0 1-5.2 0 10.3 10.3 0 0 0-7.2-3.4c-1.8 0-7.1 1.4-7.1 8.9 0 4.3 2.2 7.3 7.1 12.4 3.8 4 9.8 8 9.8 8s5.9-4 9.8-8z"
        className="prefix__st0"
      />
      <ellipse cx={25.7} cy={30.2} className="prefix__st0" rx={14} ry={13.6} />
      <ellipse cx={37.8} cy={28.7} className="prefix__st0" rx={14} ry={13.6} />
      <ellipse cx={30.5} cy={35.9} className="prefix__st0" rx={14} ry={13.6} />
    </svg>
  );
}

export function AsteriskIcon({ ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
      <path
        d="m17.7 17 6.2 8.4-2.4 1.6-5.5-8.7-5.5 8.7-2.3-1.6 6.2-8.4-9.3-2.4L6 12l9.1 3.2L14.5 5h3L17 15.2l9-3.2.8 2.7Z"
        fill={props.color}
      />
    </svg>
  );
}

export function StarsIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 1"
      viewBox="0 0 32 32"
      {...props}
    >
      <path
        fill={props.color}
        d="M12.8 30.6a.6.6 0 0 1-.6-.6c0-8.6-2-10.5-10.5-10.5a.6.6 0 1 1 0-1.2c8.6 0 10.5-2 10.5-10.6a.6.6 0 1 1 1.2 0c0 8.6 2 10.6 10.6 10.6a.6.6 0 1 1 0 1.2c-8.6 0-10.6 2-10.6 10.5a.6.6 0 0 1-.6.6ZM7.6 19a6.7 6.7 0 0 1 5.2 5.2A6.7 6.7 0 0 1 18 19a6.7 6.7 0 0 1-5.2-5.2A6.7 6.7 0 0 1 7.6 19ZM30.3 7c-4.3 0-5.2-1-5.2-5.3a.6.6 0 1 0-1.2 0c0 4.4-1 5.3-5.3 5.3a.6.6 0 0 0 0 1.2c4.4 0 5.3.9 5.3 5.2a.6.6 0 0 0 1.2 0c0-4.3.9-5.2 5.2-5.2a.6.6 0 1 0 0-1.2Z"
      />
    </svg>
  );
}

export function HomeIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      className="prefix__icon prefix__icon-tabler prefix__icon-tabler-circle-dotted absolute left-6 z-10"
      viewBox="0 0 24 24"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M7.5 4.2h0M4.2 7.5h0M3 12h0M4.2 16.5h0M7.5 19.8h0M12 21h0M16.5 19.8h0M19.8 16.5h0M21 12h0M19.8 7.5h0M16.5 4.2h0M12 3h0" />
    </svg>
  );
}

export function BreadcrumbTriangle({ ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path d="M256 0a256 256 0 1 0 0 512 256 256 0 0 0 0-512zm116.5 276.5-144 88A24 24 0 0 1 192 344V168a24 24 0 0 1 36.5-20.5l144 88a24 24 0 0 1 0 41z" />
    </svg>
  );
}

export function BreadcrumbSquare({ ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path d="M256 0a256 256 0 1 0 0 512 256 256 0 0 0 0-512zm96 328a24 24 0 0 1-24 24H184a24 24 0 0 1-24-24V184a24 24 0 0 1 24-24h144a24 24 0 0 1 24 24v144z" />
    </svg>
  );
}

export function BreadcrumbCircle({ ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path d="M256 0a256 256 0 1 0 0 512 256 256 0 0 0 0-512zm96 256c0 53-43 96-96 96s-96-43.9-96-96 43-96 96-96 96 43.1 96 96z" />
    </svg>
  );
}

export function ReplyIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={props.color}
      className="prefix__bi prefix__bi-reply-fill"
      viewBox="0 0 16 16"
      {...props}
    >
      <path d="M6 11.9 1.3 8.6a.7.7 0 0 1 0-1.2L5.9 4a.7.7 0 0 1 1.1.6V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.3c0 .5-.6.9-1 .6z" />
    </svg>
  );
}
