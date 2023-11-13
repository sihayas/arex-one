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
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <path
        fill="#999"
        d="M5.592 4.134c.048.404.12.803.215 1.197.313 1.29 1.676 1.043 2.603 1.338.178.057.256.176.232.355a.155.155 0 0 1-.112.13c-.546.148-1.045.251-1.657.42-.752.207-.977.62-1.152 1.381-.106.462-.09 1.168-.395 1.387a.138.138 0 0 1-.19-.029c-.282-.369-.249-.896-.338-1.333-.08-.395-.177-.678-.29-.85-.44-.676-1.443-.756-2.244-.876a.674.674 0 0 1-.407-.23.08.08 0 0 1-.02-.068c.026-.148.106-.24.24-.278.532-.149 1.19-.219 1.807-.462.863-.34.975-1.362 1.035-2.177.01-.132.106-.417.254-.478.323-.134.397.382.42.573ZM9.726.378c.03.256.076.51.137.759.2.82 1.066.662 1.656.85.114.036.163.11.148.225a.098.098 0 0 1-.072.082c-.347.094-.665.16-1.054.266-.478.132-.622.394-.733.877-.067.293-.058.741-.251.88a.088.088 0 0 1-.121-.018c-.18-.234-.159-.57-.215-.846-.052-.25-.113-.43-.184-.54-.28-.429-.92-.48-1.429-.555a.429.429 0 0 1-.259-.146.051.051 0 0 1-.012-.044c.016-.094.067-.152.152-.176.339-.095.758-.139 1.15-.293.55-.216.62-.864.658-1.382.007-.083.068-.265.162-.303.206-.085.253.243.267.364ZM5.036 12.6c1.115-.121 2.094-.266 3.076-.64 1.223-.466 1.835-1.424 2.147-2.652.226-.888.397-1.787.513-2.697.033-.258.187-.402.462-.433.336-.038.41.418.441.657.088.662.198 1.322.33 1.977.248 1.224.77 2.395 1.906 2.968 1.039.523 2.304.713 3.45.822.184.018.58.081.692.26.102.162.062.53-.174.585-.356.085-.716.15-1.08.196-1.042.132-1.951.28-2.844.724-1.218.607-1.642 1.699-1.936 2.992a20.05 20.05 0 0 0-.366 2.142c-.077.664-.8.679-.89-.038a19.058 19.058 0 0 0-.51-2.63c-.406-1.468-1.208-2.322-2.663-2.77-.674-.208-1.54-.376-2.597-.503-.178-.021-.353-.076-.522-.12a.192.192 0 0 1-.139-.145c-.133-.605.24-.644.704-.694Z"
      />
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
      width={24}
      height={24}
      fill="none"
      {...props}
    >
      <path
        fill="#CCC"
        d="M9.22 5.573a6.976 6.976 0 0 1 1.969-.526c.049-.006.07-.033.066-.082-.128-1.312 1.647-1.262 1.487.002a.075.075 0 0 0 .016.057.075.075 0 0 0 .052.028c.686.07 1.344.245 1.974.524.041.018.071.006.09-.035a.766.766 0 0 1 1.291.731.077.077 0 0 0 .014.109 7.825 7.825 0 0 1 1.43 1.421c.03.038.067.047.111.025.374-.187.711-.341 1.056-.01.512.49.22 1.018-.306 1.316-.043.025-.055.06-.036.107a6.92 6.92 0 0 1 .519 1.952c.006.048.032.069.078.063 1.284-.144 1.3 1.625-.002 1.49a.074.074 0 0 0-.083.066 6.41 6.41 0 0 1-.522 1.971c-.02.043-.008.073.035.091a.767.767 0 0 1-.733 1.292c-.04-.033-.077-.028-.108.014a7.542 7.542 0 0 1-1.422 1.428.092.092 0 0 0-.027.113c.172.369.349.666.044 1.022-.483.564-1.047.263-1.35-.287a.07.07 0 0 0-.037-.032.065.065 0 0 0-.047.002c-.63.273-1.287.45-1.969.529-.05.005-.07.032-.065.082.14 1.281-1.628 1.291-1.489-.006a.076.076 0 0 0-.067-.084 6.339 6.339 0 0 1-1.974-.525c-.041-.017-.07-.006-.086.035-.463 1.15-2.034.4-1.295-.747.024-.036.018-.067-.017-.094a7.593 7.593 0 0 1-1.427-1.423c-.03-.036-.065-.044-.106-.023-.16.077-.31.18-.475.2-.67.086-1.095-.704-.663-1.216.103-.122.243-.196.389-.288.04-.026.05-.061.032-.105a6.922 6.922 0 0 1-.521-1.952c-.005-.047-.031-.068-.079-.062-1.25.156-1.328-1.614 0-1.488a.076.076 0 0 0 .084-.067 6.57 6.57 0 0 1 .521-1.966c.02-.047.007-.08-.041-.1-1.189-.484-.267-2.072.739-1.29.041.032.079.027.111-.014A7.738 7.738 0 0 1 7.817 6.38a.074.074 0 0 0 .018-.1c-.744-1.12.811-1.888 1.287-.745a.074.074 0 0 0 .098.038Zm2.627 4.425c.88-.026 1.614.392 1.983 1.2a.08.08 0 0 0 .079.052h3.466c.043 0 .062-.022.055-.064-.54-3.573-4.049-5.455-7.391-4.344a.094.094 0 0 0-.06.057.095.095 0 0 0 .008.082l1.757 2.96a.11.11 0 0 0 .103.057Zm-1.622 1.147.189-.392a.126.126 0 0 0-.005-.123L8.674 7.706c-.02-.035-.046-.04-.077-.014-2.74 2.263-2.853 6.3-.04 8.576.032.027.058.022.08-.015l1.675-3.067a.102.102 0 0 0-.002-.109c-.375-.623-.403-1.267-.085-1.932ZM12.5 12a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0Zm3.165 4.069c.941-.815 1.613-2.003 1.769-3.252.006-.045-.014-.067-.059-.067h-3.441a.114.114 0 0 0-.101.062c-.448.878-1.174 1.267-2.18 1.169a.09.09 0 0 0-.094.051l-1.62 2.97c-.04.074-.02.124.06.15 2.141.694 4.03.333 5.666-1.084Z"
      />
      <rect
        width={23}
        height={23}
        x={0.5}
        y={0.5}
        stroke="#000"
        strokeOpacity={0.05}
        rx={11.5}
        transform="matrix(0 1 1 0 0 0)"
      />
    </svg>
  );
}

export function SignalsIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="none"
      className={props.className}
      {...props}
    >
      <path
        fill="#CCC"
        d="M9.828 12.074A222.81 222.81 0 0 1 11 7.66c.158-.574.41-.658.998-.66 1.05 0 2.1-.004 3.15-.008.526-.002.809.229.848.693.054.628-.452.818-1.008.816a271.68 271.68 0 0 0-2.606.003c-.042 0-.069.02-.08.062-.607 2.287-1.215 4.571-1.826 6.854-.113.427-.488.672-.92.547-.292-.085-.484-.315-.575-.691-.922-3.821-1.844-7.644-2.765-11.469a.03.03 0 0 0-.06 0c-.384 1.351-.771 2.708-1.16 4.068-.14.481-.384.623-.893.624-1.106.002-2.212-.005-3.317-.023-.52-.008-.783-.25-.786-.724-.005-.635.515-.754 1.068-.751.852.003 1.703.002 2.552-.003.042 0 .07-.02.081-.06.604-2.106 1.205-4.21 1.803-6.311.128-.452.476-.734.948-.588.285.088.473.32.563.694l2.736 11.34a.04.04 0 0 0 .038.03.04.04 0 0 0 .039-.03Z"
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

export function RecordsButton({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      {...props}
    >
      <g fill={props.color} clipPath="url(#a)">
        <path d="M12 5.5A6.5 6.5 0 1 1 5.5 12 6.512 6.512 0 0 1 12 5.5Zm0 12A5.5 5.5 0 1 0 6.5 12a5.506 5.506 0 0 0 5.5 5.5Z" />
        <path d="M12 16.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z" />
      </g>
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
