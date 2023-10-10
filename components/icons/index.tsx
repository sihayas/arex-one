export function LoveIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      fill="none"
      {...props}
      className={props.className}
    >
      <g fill={props.color} clipPath="url(#a)">
        <path d="M3.5.501c-1.2 0-3.5 1-3.5 4 0 1.8 1 3 2.3 4.3 1 1.2 2.7 2.3 2.7 2.3a1.8 1.8 0 0 0 2 0s1.7-1.1 2.7-2.3c1.3-1.3 2.3-2.5 2.3-4.3 0-3-2.2-4-3.6-4a4 4 0 0 0-2.4.8 4 4 0 0 0-2.5-.8Zm0 7.1c-1.2-1.3-1.7-2-1.7-3.1 0-1.9 1.3-2.2 1.7-2.2.8 0 1.4.4 1.8.8a1 1 0 0 0 1.4 0c.4-.4 1-.8 1.7-.8.5 0 1.8.3 1.8 2.2 0 1-.5 1.8-1.8 3.1-.9 1-2.4 2-2.4 2s-1.5-1-2.5-2Z" />
        <path d="M7.6 8.8C5.6 8.8 4 7.3 4 5.4S5.5 2 7.5 2 11 3.5 11 5.4 9.5 8.8 7.6 8.8Z" />
        <path d="M4.6 8.402c-2 0-3.6-1.5-3.6-3.4s1.5-3.4 3.5-3.4 3.5 1.5 3.5 3.4-1.5 3.4-3.4 3.4Z" />
        <path d="M6.398 10.198c-2 0-3.5-1.5-3.5-3.4s1.5-3.4 3.5-3.4 3.5 1.5 3.5 3.4-1.6 3.4-3.5 3.4Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 .5h12v11H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function AsteriskIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      fill="none"
      {...props}
    >
      <path
        fill="rgb(60 60 67 / 0.9)"
        d="m6.967 6.545 3.428 4.581L9.069 12 6.027 7.255 2.985 12l-1.272-.874 3.428-4.58L0 5.236l.497-1.419L5.53 5.563 5.197 0h1.66L6.58 5.563l4.977-1.745L12 5.29 6.967 6.545Z"
      />
    </svg>
  );
}

export function StatsIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={11}
      height={10}
      fill="none"
      {...props}
      className={props.className}
    >
      <path
        fill={props.color}
        fillRule="evenodd"
        d="M4.545.082 4.342 2.52h2.972L7.524 0l.988.082-.203 2.438h2.147v.992h-2.23l-.248 2.976H9.96v.992H7.896L7.686 10l-.988-.082L6.9 7.48H3.929L3.719 10l-.988-.082.203-2.438H.539v-.992h2.478l.247-2.976h-2.23V2.52h2.313L3.557 0l.988.082Zm-.285 3.43-.248 2.976h2.971l.248-2.976H4.26Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function StarOneIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="none"
      {...props}
      className={props.className}
    >
      <path
        fill="#333"
        d="M8 0c0 6 2 8 8 8-6 0-8 2-8 8 0-6-2-8-8-8 6 0 8-2 8-8Z"
      />
    </svg>
  );
}

export function StarTwoIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 21 21"
      {...props}
    >
      <path
        fill={props.color}
        d="M10.1 3.3c.3 2.6.4 4.2 1 5.2 1 1.3 2.7 1.4 5.9 1.7-3.1.4-4.8.5-5.8 1.7-.7 1-.8 2.6-1 5.2-.5-3.4-.6-5-2-6-1-.5-2.6-.6-5-.9 3-.3 4.6-.4 5.6-1.3.9-1 1-2.7 1.3-5.6Z"
      />
      <path
        fill={props.color}
        d="M15.1 1.2c.2 1.5.3 2.4.6 3 .6.8 1.6.8 3.4 1-1.8.2-2.8.3-3.3 1-.5.6-.5 1.5-.7 3-.2-2-.3-3-1.1-3.5-.6-.3-1.5-.3-2.9-.5 1.7-.2 2.7-.2 3.3-.8.5-.5.5-1.5.7-3.2Z"
      />
    </svg>
  );
}

export function StarThreeIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 21 21"
      {...props}
    >
      <path
        fill={props.color}
        d="M10.1 3.3c.3 2.6.4 4.2 1 5.2 1 1.3 2.7 1.4 5.9 1.7-3.1.4-4.8.5-5.8 1.7-.7 1-.8 2.6-1 5.2-.5-3.4-.6-5-2-6-1-.5-2.6-.6-5-.9 3-.3 4.6-.4 5.6-1.3.9-1 1-2.7 1.3-5.6Z"
      />
      <path
        fill={props.color}
        d="M15.1 1.2c.2 1.5.3 2.4.6 3 .6.8 1.6.8 3.4 1-1.8.2-2.8.3-3.3 1-.5.6-.5 1.5-.7 3-.2-2-.3-3-1.1-3.5-.6-.3-1.5-.3-2.9-.5 1.7-.2 2.7-.2 3.3-.8.5-.5.5-1.5.7-3.2Zm-10 17.4c-.1-1.2-.2-2-.5-2.5-.5-.7-1.3-.7-2.9-.9 1.6-.2 2.4-.2 2.9-.8.3-.5.4-1.3.5-2.6.2 1.7.2 2.5 1 3 .5.2 1.2.3 2.4.4-1.4.2-2.3.2-2.8.7-.4.5-.4 1.3-.6 2.7Z"
      />
    </svg>
  );
}

export function StarFourIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 21 21"
      {...props}
    >
      <path
        fill={props.color}
        d="M10.1 3.3c.3 2.6.4 4.2 1 5.2 1 1.3 2.7 1.4 5.9 1.7-3.1.4-4.8.5-5.8 1.7-.7 1-.8 2.6-1 5.2-.5-3.4-.6-5-2-6-1-.5-2.6-.6-5-.9 3-.3 4.6-.4 5.6-1.3.9-1 1-2.7 1.3-5.6Z"
      />
      <path
        fill={props.color}
        d="M15.1 1.2c.2 1.5.3 2.4.6 3 .6.8 1.6.8 3.4 1-1.8.2-2.8.3-3.3 1-.5.6-.5 1.5-.7 3-.2-2-.3-3-1.1-3.5-.6-.3-1.5-.3-2.9-.5 1.7-.2 2.7-.2 3.3-.8.5-.5.5-1.5.7-3.2Zm0 10.2c.1 1 .2 1.7.4 2.1.5.6 1.2.6 2.5.7-1.3.2-2 .2-2.4.7-.3.4-.4 1.1-.5 2.2-.1-1.4-.2-2.1-.8-2.5-.4-.2-1-.3-2-.4 1.2-.1 1.9-.2 2.3-.5.3-.5.4-1.2.5-2.3Zm-10 7.2c-.1-1.2-.2-2-.5-2.5-.5-.7-1.3-.7-2.9-.9 1.6-.2 2.4-.2 2.9-.8.3-.5.4-1.3.5-2.6.2 1.7.2 2.5 1 3 .5.2 1.2.3 2.4.4-1.4.2-2.3.2-2.8.7-.4.5-.4 1.3-.6 2.7Z"
      />
    </svg>
  );
}

export function ArrowIcon({ ...props }) {
  return (
    <svg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      width={5}
      height={9}
      fill="none"
      {...props}
    >
      <path
        fill="#CCC"
        d="M0 .498a.493.493 0 0 0 .143.35L3.74 4.439.143 8.031a.495.495 0 0 0 .7.7l3.941-3.942a.493.493 0 0 0 0-.7L.843.148A.493.493 0 0 0 0 .498Z"
      />
    </svg>
  );
}

export function SendIcon({ ...props }) {
  return (
    <svg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill={props.color}
        d="M14.9 8.9 1.5 14.4a.7.7 0 0 1-.7 0 .8.8 0 0 1-.3-.7v-3.5a.8.8 0 0 1 .6-.7L8.4 8a.1.1 0 0 0 0-.2L1 6.5a.8.8 0 0 1-.6-.7V2.2a.7.7 0 0 1 .7-.7h.3L15 7.2A1 1 0 0 1 15 9Z"
      />
    </svg>
  );
}

export function EntryBlob({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 13 47"
      {...props}
    >
      <path
        fill="#F4F4F4"
        fillRule="evenodd"
        d="M13 0v5.1c0 1.7 0 3.5-.7 5.1a9.8 9.8 0 0 1-3 4l-4 3.3L2 20c-1 .8-2 2-2 3.4 0 1.5 1 2.6 2 3.4l3.2 2.6 4 3.3a9.8 9.8 0 0 1 3.1 4c.6 1.6.7 3.4.7 5V47"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function EntryBlobAlbum({ ...props }) {
  return (
    <svg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      width={47}
      height={13}
      fill="none"
      {...props}
    >
      <path
        fill="#F4F4F4"
        fillRule="evenodd"
        d="M0 .002c1.712 0 3.424-.009 5.137.01C6.776.03 8.61.055 10.206.657c1.722.65 2.863 1.786 4.01 3.124.827.962 2.45 3.015 3.24 4.006.647.812 1.913 2.418 2.605 3.195.87.978 1.945 2.017 3.44 2.017 1.494 0 2.569-1.04 3.438-2.016.692-.776 1.958-2.383 2.605-3.195.79-.991 2.412-3.044 3.24-4.006 1.149-1.337 2.288-2.474 4.01-3.124 1.596-.6 3.43-.627 5.069-.645 1.712-.019 3.425-.01 5.137-.01"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function StatLineIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={24}
      fill="none"
      {...props}
    >
      <path
        stroke="#E5E5E6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M28 16h-8a4 4 0 0 1-4-4V8"
      />
    </svg>
  );
}

export function HighlightsIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      fill="none"
      {...props}
      className={props.className}
    >
      <path
        fill="#CCC"
        d="M4.896 5.034c-.627-.203-.478-1.095.176-1.101 1.737-.016 2.533-1.606 2.6-3.123.006-.15.003-.314.05-.445.167-.469.864-.495 1.044-.027.022.056.037.185.047.387.073 1.524.8 3.171 2.575 3.204.815.014.793 1.126.041 1.129-1.801.007-2.591 1.733-2.618 3.277a.986.986 0 0 1-.037.29c-.121.342-.496.462-.804.3-.25-.132-.285-.346-.29-.631-.033-1.514-.81-3.181-2.553-3.232a.912.912 0 0 1-.231-.028ZM5.447 8.44c.392.018.63.352.52.732-.096.334-.335.363-.658.396-.913.093-1.703.944-1.753 1.849-.027.492-.495.758-.91.463-.188-.133-.193-.285-.218-.543-.08-.832-.724-1.494-1.505-1.73-.16-.049-.417-.02-.589-.095-.363-.157-.433-.554-.213-.869.173-.247.45-.184.703-.235.716-.143 1.293-.699 1.529-1.379.138-.398-.026-.902.547-1.021a.574.574 0 0 1 .616.335c.018.045.031.135.04.268.066.97.943 1.784 1.891 1.829Z"
      />
    </svg>
  );
}

export function PositiveIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={10}
      height={10}
      fill="none"
      {...props}
    >
      <path
        stroke="#CCC"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M1.148 4.92h4m0 0h4m-4 0v-4m0 4v4"
      />
    </svg>
  );
}

export function NegativeIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={11}
      height={2}
      fill="none"
      {...props}
    >
      <path
        stroke="#CCC"
        strokeLinecap="round"
        strokeWidth={1.5}
        d="M1.293.92h8"
      />
    </svg>
  );
}
