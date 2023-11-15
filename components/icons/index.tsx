import React from "react";

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
        fill="rgb(60 60 67 / 0.6)"
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

export function StatLineIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={40}
      height={24}
      fill="none"
      {...props}
    >
      <path
        stroke="#E5E5E6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m32 16-12 .001a4 4 0 0 1-4-4v-4"
      />
    </svg>
  );
}

export function HighlightsIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="none"
      {...props}
    >
      <g fill="#000" stroke="#000" strokeLinejoin="round" clipPath="url(#a)">
        <path d="M5.332 10c3.25 0 4.667-1.367 4.667-4.667 0 3.3 1.407 4.667 4.666 4.667C11.405 10 10 11.407 10 14.667c0-3.26-1.417-4.667-4.667-4.667ZM1.332 4.333c2.09 0 3-.879 3-3 0 2.121.904 3 3 3-2.096 0-3 .905-3 3 0-2.095-.91-3-3-3Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function PositiveIcon({ ...props }) {
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
        fill="#999"
        fillRule="evenodd"
        d="M9 7h5v2H9v5H7V9H2V7h5V2h2v5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function NegativeIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="none"
      {...props}
      className={props.className}
    >
      <path fill="#999" d="M14 7H2v2h12V7Z" />
    </svg>
  );
}

export function SettingsIcon({ ...props }) {
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
        fill="#CCC"
        d="M14.427 5.22c.271.63.447 1.286.526 1.969.006.049.033.07.083.066 1.31-.128 1.26 1.647-.003 1.487a.077.077 0 0 0-.076.04.074.074 0 0 0-.009.028 6.46 6.46 0 0 1-.524 1.974c-.018.041-.006.071.035.09a.766.766 0 0 1-.731 1.291.078.078 0 0 0-.109.014 7.826 7.826 0 0 1-1.421 1.43c-.038.03-.047.067-.025.111.187.374.341.711.01 1.056-.49.512-1.018.22-1.316-.306-.025-.043-.06-.055-.107-.036a6.92 6.92 0 0 1-1.952.519c-.048.006-.068.032-.063.078.144 1.284-1.625 1.3-1.49-.002a.073.073 0 0 0-.066-.083 6.411 6.411 0 0 1-1.971-.522c-.043-.02-.073-.008-.091.035a.767.767 0 0 1-1.292-.733c.033-.04.028-.077-.014-.108a7.542 7.542 0 0 1-1.428-1.422.092.092 0 0 0-.113-.027c-.369.172-.666.349-1.022.044-.564-.483-.263-1.047.287-1.35a.07.07 0 0 0 .032-.037.065.065 0 0 0-.002-.047 6.925 6.925 0 0 1-.529-1.969c-.005-.05-.032-.07-.082-.065-1.281.14-1.291-1.628.006-1.489a.076.076 0 0 0 .084-.067 6.335 6.335 0 0 1 .525-1.974c.017-.04.006-.07-.035-.086-1.15-.463-.4-2.034.747-1.295.036.024.068.018.094-.017.411-.539.885-1.015 1.423-1.427.036-.03.044-.065.023-.106-.077-.16-.18-.31-.2-.475-.086-.67.704-1.095 1.216-.663.122.103.196.243.288.389.026.04.061.05.105.032a6.922 6.922 0 0 1 1.952-.521c.047-.005.068-.031.062-.079-.156-1.25 1.614-1.329 1.488 0a.076.076 0 0 0 .067.084 6.57 6.57 0 0 1 1.966.521c.047.02.08.007.1-.041.484-1.189 2.072-.267 1.29.739-.032.041-.027.079.014.111a7.739 7.739 0 0 1 1.441 1.436.074.074 0 0 0 .1.018c1.12-.744 1.888.811.745 1.287a.075.075 0 0 0-.04.041.073.073 0 0 0 .002.057Zm-4.425 2.627c.026.88-.392 1.614-1.2 1.983a.08.08 0 0 0-.052.079v3.466c0 .043.022.062.064.055 3.573-.54 5.455-4.049 4.344-7.391a.096.096 0 0 0-.099-.065.095.095 0 0 0-.04.013l-2.96 1.757a.111.111 0 0 0-.057.103ZM8.855 6.225l.392.189c.042.02.083.018.123-.005l2.924-1.735c.035-.02.04-.046.014-.077-2.263-2.741-6.3-2.853-8.577-.04-.026.032-.021.058.015.08l3.068 1.675c.037.02.073.02.109-.002.623-.375 1.267-.403 1.932-.085ZM8 8.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Zm-4.069 3.165c.816.941 2.003 1.613 3.252 1.769.045.006.067-.014.067-.059V9.934a.114.114 0 0 0-.062-.101c-.878-.448-1.267-1.174-1.169-2.18a.09.09 0 0 0-.051-.094l-2.97-1.62c-.074-.04-.124-.02-.15.06-.694 2.141-.333 4.03 1.084 5.666Z"
      />
    </svg>
  );
}

export function IndexIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="none"
      {...props}
    >
      <path
        fill="#999"
        d="M4.58.098c.525.238.557.956.124 1.273-.13.094-.345.143-.646.147-1.244.011-2.542-.238-2.545 1.464-.002.61.244 2.08-.78 2.03-.458-.023-.69-.283-.698-.782-.012-.715-.1-1.55.085-2.19C.39 1.107.977.485 1.884.175 2.588-.066 3.55.024 4.351.026c.046 0 .122.024.23.072ZM11.264 1.346c-.47-.338-.3-1.22.346-1.312.285-.04.798-.045 1.538-.012 1.28.054 2.28.639 2.693 1.886.23.697.148 1.671.134 2.467a.572.572 0 0 1-.278.488c-.373.248-.916.162-1.118-.256-.064-.132-.095-.35-.092-.652.002-.59.09-1.369-.178-1.83-.468-.806-1.516-.61-2.294-.61-.343 0-.594-.057-.75-.169ZM2.049 14.253c.464.317 1.336.25 1.874.23.313-.012.532.007.655.057.519.21.559 1.042.105 1.31-.38.225-2.062.16-2.496.056-1.077-.259-1.766-.909-2.068-1.95-.181-.63-.099-1.477-.108-2.19-.01-.809 1.073-1.086 1.419-.367.16.337.081 1.086.08 1.474-.003.636.042 1.041.539 1.38ZM13.951 14.253c-.464.317-1.336.25-1.874.23-.313-.012-.532.007-.655.057-.519.21-.559 1.042-.105 1.31.38.225 2.062.16 2.496.056 1.077-.259 1.766-.909 2.068-1.95.181-.63.099-1.477.108-2.19.01-.809-1.073-1.086-1.419-.367-.16.337-.081 1.086-.08 1.474.003.636-.042 1.041-.539 1.38Z"
      />
    </svg>
  );
}

export function CaptionIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="none"
      {...props}
    >
      <path
        fill="#808084"
        fillRule="evenodd"
        d="M10.053 3.67c.673-.218 1.45-.214 2.084.112 1.466.753 2.1 2.694 1.51 4.75-.265.923-.73 1.82-1.716 2.723-.985.904-2.352 1.438-2.987 1.438a.406.406 0 0 1-.411-.4c0-.221.188-.4.411-.4.725 0 1.372-.394 2.139-.975.586-.445 1.045-1.013 1.298-1.508.486-.948.502-2.283-.282-2.638a1.923 1.923 0 0 1-1.457.65c-1.28 0-2.034-1.029-2.002-1.961.031-.891.597-1.526 1.413-1.79Zm-6.4 0c.673-.218 1.45-.214 2.084.112 1.466.753 2.1 2.694 1.51 4.75-.265.923-.73 1.82-1.716 2.723-.985.904-2.352 1.438-2.987 1.438a.406.406 0 0 1-.411-.4c0-.221.188-.4.411-.4.725 0 1.372-.394 2.139-.975.587-.445 1.045-1.013 1.298-1.508.485-.948.502-2.283-.282-2.638a1.923 1.923 0 0 1-1.457.65c-1.28 0-2.034-1.029-2.002-1.961.031-.891.597-1.526 1.413-1.79Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function LinkButton({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="none"
      {...props}
    >
      <path
        fill={props.color}
        d="M6.001 13.33a5.333 5.333 0 1 0 0-10.666 5.333 5.333 0 0 0 0 10.667Z"
      />
      <path
        fill={props.color}
        d="M11.332 2.844v1.393a3.994 3.994 0 0 1 0 7.533v1.394a5.33 5.33 0 0 0 4-5.16 5.33 5.33 0 0 0-4-5.16Z"
      />
    </svg>
  );
}

export function ArchiveButton({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      {...props}
    >
      <path
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m14.668 14.576 2.167 1.593V7.836l-2.167 1.593"
      />
      <path
        fill={props.color}
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m7.168 12.003 5.667-4.167v8.333l-5.667-4.166Z"
      />
      <rect
        width={23}
        height={23}
        x={23.5}
        y={23.5}
        stroke={props.color}
        rx={11.5}
        transform="rotate(180 23.5 23.5)"
      />
    </svg>
  );
}

export function Triangle({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
    >
      <path d="M5 0L10 10L0 10L5 0Z" fill="#CCC" />
    </svg>
  );
}

export function Curve({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={11}
      height={13}
      fill="none"
      className={props.className}
      {...props}
    >
      <path
        stroke={props.color}
        strokeLinecap="round"
        strokeWidth={2}
        d="M1 12c7.203-.681 9.532-4.062 8.902-11"
      />
    </svg>
  );
}

export function SwapIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      fill="none"
      {...props}
      onClick={props.onClick}
      className={props.className}
    >
      <path
        fill="#CCC"
        stroke="#CCC"
        d="M14.396 6.433c-1.36-1.358-2.727-2.72-4.103-4.086-.79-.785.275-1.853 1.05-1.078a2699.79 2699.79 0 0 0 5.354 5.343c.21.209.31.42.303.636-.024.675-.433.752-1.034.752H2.037c-.326 0-.557-.035-.692-.106C.872 7.649.89 6.822 1.37 6.59c.124-.06.336-.09.636-.09H14.37a.038.038 0 0 0 .036-.024.04.04 0 0 0-.009-.044ZM3.63 11.582c1.353 1.348 2.718 2.71 4.095 4.085.367.368.389.731.065 1.092-.4.447-.885.203-1.259-.169a8480.328 8480.328 0 0 0-5.439-5.424c-.08-.08-.108-.238-.084-.474.063-.601.421-.691.98-.691h13.88c.372 0 .626.03.764.092.486.218.496 1.073-.001 1.318-.12.057-.311.086-.575.087H3.666c-.08 0-.092.028-.036.084Z"
      />
    </svg>
  );
}

export function EditIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={11}
      fill="none"
      {...props}
      className={props.className}
    >
      <path
        fill={props.color}
        d="M11.997 2.132c-.025 1.343-.691 2.777-1.722 3.774-.7.679-1.415 1.344-2.144 1.998-.997.893-2.173 1.44-3.528 1.641-.669.1-1.45.093-2.165.072a.276.276 0 0 0-.199.072c-.35.317-.702.64-1.055.97-.188.175-.338.281-.451.318-.386.126-.857-.288-.703-.658.036-.085.131-.2.287-.342.355-.33.71-.652 1.066-.97a.4.4 0 0 0 .097-.131.368.368 0 0 0 .034-.157c-.005-.628-.015-1.327.087-1.906.388-2.194 1.904-3.385 3.722-5.007A6.829 6.829 0 0 1 8.6.165C9.45-.003 10.679-.04 11.554.04c.26.024.398.176.413.457.029.544.039 1.09.03 1.635ZM8.29 2.8c.495-.142.961.433.542.821A1539.743 1539.743 0 0 1 3.517 8.51c-.062.056-.05.084.038.084 1.39-.003 2.6-.442 3.63-1.32a74.449 74.449 0 0 0 2.103-1.885c1.307-1.209 1.696-2.63 1.577-4.287a.033.033 0 0 0-.011-.023.04.04 0 0 0-.025-.01c-1.676-.076-3.128.189-4.422 1.216-.521.415-1.167.998-1.935 1.751-.562.55-.948.996-1.16 1.336a4.408 4.408 0 0 0-.673 2.375c0 .086.034.098.1.038 1.712-1.57 3.43-3.143 5.156-4.716.166-.15.297-.24.395-.268Z"
      />
    </svg>
  );
}

export function AddIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <path
        fill="#3C3C43"
        fillOpacity={0.3}
        fillRule="evenodd"
        d="M10 1.042a8.958 8.958 0 1 0 0 17.916 8.958 8.958 0 0 0 0-17.916Zm.625 5.625a.625.625 0 1 0-1.25 0v2.708H6.667a.625.625 0 0 0 0 1.25h2.708v2.708a.625.625 0 1 0 1.25 0v-2.708h2.708a.625.625 0 1 0 0-1.25h-2.708V6.667Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function ChainIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <rect
        width={17.838}
        height={17.838}
        fill="#C4C4C7"
        rx={8.919}
        transform="matrix(-1 0 0 1 17.838 0)"
      />
      <circle
        cx={1.081}
        cy={1.081}
        r={1.081}
        fill="#C4C4C7"
        transform="matrix(-1 0 0 1 20 17.838)"
      />
      <circle
        cx={2.162}
        cy={2.162}
        r={2.162}
        fill="#C4C4C7"
        transform="matrix(-1 0 0 1 17.838 13.514)"
      />
    </svg>
  );
}
