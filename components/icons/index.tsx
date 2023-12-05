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
        fill="#000"
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
    >
      <path
        fill="#999"
        d="M1.191 1.33a.99.99 0 0 0 .077-.293c.04-.4.25-.687.688-.664.125.007.228.072.347.094.51.093.959-.005 1.343-.294.284-.214.6-.253.868.016.127.129.174.313.288.455.218.273.49.467.814.583.146.052.306.046.447.096.283.099.424.298.424.597 0 .172-.095.322-.114.491-.055.494.052.914.322 1.26.302.387.164.823-.265 1.02-.431.197-.804.741-.852 1.218-.034.344-.262.6-.62.601-.163.001-.29-.079-.447-.104a1.685 1.685 0 0 0-1.362.345c-.332.258-.755.121-.938-.254-.203-.416-.657-.81-1.152-.886-.113-.018-.228-.027-.332-.077-.328-.16-.435-.49-.303-.83.153-.397.067-.914-.121-1.281-.077-.15-.205-.266-.262-.425-.124-.343.045-.637.354-.788.353-.172.618-.466.796-.88Zm3.684 2.09c0-.395-.156-.774-.435-1.053A1.481 1.481 0 0 0 1.907 3.42c0 .395.156.774.435 1.053A1.481 1.481 0 0 0 4.875 3.42Z"
      />
      <path
        fill="#000"
        d="M7.079 13.94a1.332 1.332 0 0 0-.265-.095c-.713-.173-1.044-.856-.777-1.534.035-.09.063-.185.081-.284a3.128 3.128 0 0 0-.127-1.651c-.066-.186-.203-.372-.252-.54-.132-.458-.028-.845.314-1.164a.978.978 0 0 1 .264-.172c.732-.333 1.334-1.053 1.548-1.84.043-.156.14-.311.25-.426.333-.353.784-.415 1.233-.245.607.23 1.548.184 2.137-.136a2.8 2.8 0 0 1 .268-.129 1.069 1.069 0 0 1 1.392.54c.324.729 1.017 1.303 1.712 1.522.178.056.315.116.413.18.412.273.591.831.4 1.3a1.606 1.606 0 0 0-.093.299c-.14.71-.062 1.36.236 1.947.09.177.144.317.165.42.1.502-.15.991-.605 1.202a2.913 2.913 0 0 0-1.522 1.75 1.459 1.459 0 0 1-.17.384 1.063 1.063 0 0 1-1.145.44c-.18-.043-.346-.122-.53-.153a3.055 3.055 0 0 0-1.654.157c-.207.082-.382.22-.605.262-.551.105-.993-.15-1.232-.647-.29-.603-.768-1.065-1.436-1.388Zm6.395-3.107a2.718 2.718 0 0 0-.79-1.915 2.697 2.697 0 0 0-1.907-.794 2.687 2.687 0 0 0-1.907.794 2.71 2.71 0 0 0-.79 1.915c0 .719.284 1.408.79 1.916a2.691 2.691 0 0 0 3.814 0c.506-.508.79-1.197.79-1.916Z"
      />
    </svg>
  );
}

export function CardsIcon({ ...props }) {
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
        d="M9.313 4.385c.947.402 1.656 1.333 1.662 2.437.008 1.363.01 2.908.005 4.635a.08.08 0 0 0 .017.05.07.07 0 0 0 .043.025c.832.136 1.364-.24 1.598-1.128.481-1.832.991-3.723 1.53-5.674.21-.76-.203-1.37-.903-1.553-1.757-.462-3.448-.911-5.072-1.348-.656-.176-1.358.144-1.562.84-.134.455-.269.948-.405 1.479-.012.05.006.075.054.075.606.01 1.171.009 1.696-.003.598-.015 1.044.04 1.337.165Z"
      />
      <path
        fill="#000"
        d="M3.029 5.336h5.497c.691 0 1.251.553 1.251 1.236v6.417c0 .682-.56 1.236-1.25 1.236H3.028a1.244 1.244 0 0 1-1.252-1.236V6.572c0-.683.56-1.236 1.252-1.236Z"
      />
    </svg>
  );
}

export function WispIcon({ ...props }) {
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

export function ChainIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      fill="none"
      {...props}
    >
      <rect
        width={16.054}
        height={16.054}
        fill="#C4C4C7"
        rx={8.027}
        transform="matrix(-1 0 0 1 16.054 0)"
      />
      <circle
        cx={0.973}
        cy={0.973}
        r={0.973}
        fill="#C4C4C7"
        transform="matrix(-1 0 0 1 18 16.054)"
      />
      <circle
        cx={1.946}
        cy={1.946}
        r={1.946}
        fill="#C4C4C7"
        transform="matrix(-1 0 0 1 16.054 12.162)"
      />
    </svg>
  );
}

export function BloomIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      {...props}
    >
      <path
        fill={props.color}
        d="M20.843 16.217c-.398 0-.749.189-.98.477L12.7 12.558h6.19a.898.898 0 0 0 .88.714.906.906 0 1 0-.783-1.357.899.899 0 0 0-.096.262h-6.197l4.735-2.73a1.431 1.431 0 0 0 1.138.561 1.442 1.442 0 0 0 .723-2.687 1.442 1.442 0 0 0-1.968.527 1.435 1.435 0 0 0-.078 1.266l-4.732 2.729 4.492-7.781a.89.89 0 0 0 .274.048.897.897 0 0 0 .785-.453.905.905 0 1 0-1.39.218l-4.494 7.782V5.53a1.26 1.26 0 0 0 1.072-1.242c0-.696-.566-1.262-1.262-1.262-.696 0-1.262.566-1.262 1.262 0 .63.467 1.15 1.072 1.242v6.128L7.304 3.873a.899.899 0 0 0 .3-.668.906.906 0 1 0-.905.905c.096 0 .188-.02.275-.048l4.489 7.775L7.75 9.654a1.442 1.442 0 0 0-1.33-1.99c-.795 0-1.44.646-1.44 1.44a1.434 1.434 0 0 0 2.575.877l3.735 2.196H2.292a.905.905 0 1 0-.884 1.095.906.906 0 0 0 .884-.714h8.98l-3.95 2.278a1.255 1.255 0 0 0-2.242.785c0 .696.566 1.262 1.262 1.262.695 0 1.262-.566 1.262-1.262a1.25 1.25 0 0 0-.09-.457l3.933-2.268-3.899 6.445a.897.897 0 0 0-.73.073.906.906 0 0 0 .904 1.567.906.906 0 0 0 .331-1.236.895.895 0 0 0-.176-.212l3.922-6.483v5.488a1.438 1.438 0 0 0-.53.18 1.431 1.431 0 0 0-.671.875 1.441 1.441 0 1 0 1.764-1.018c-.06-.016-.122-.022-.183-.03v-5.448l2.576 4.597a.9.9 0 0 0-.178 1.124.9.9 0 0 0 .785.452.898.898 0 0 0 .873-.67.9.9 0 0 0-.091-.687.9.9 0 0 0-1.058-.408l-2.593-4.626 7.176 4.143a1.251 1.251 0 0 0-.088.457c0 .696.566 1.262 1.262 1.262.695 0 1.261-.566 1.261-1.262 0-.696-.566-1.262-1.261-1.262Z"
      />
      <path
        fill={props.color}
        d="M3.683 8.25a.727.727 0 1 0-.002-1.454.727.727 0 0 0 .002 1.454ZM21.308 7.714a.727.727 0 1 0-.001-1.453.727.727 0 0 0 .001 1.453ZM11.99 22.4a.727.727 0 0 0 0 1.453.727.727 0 0 0 0-1.453ZM11.99.165a.727.727 0 0 0 0 1.452.727.727 0 0 0 0-1.452Z"
      />
    </svg>
  );
}

export function RecentIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      {...props}
    >
      <path
        fill={props.color}
        d="m17.957 22.73-5.98-.011L6 22.71l2.996-5.172 2.996-5.176 2.98 5.184 2.985 5.183Zm-5.965-10.367L8.996 7.191 6 2.02l5.977-.012L17.953 2l-2.98 5.184-2.98 5.18Zm-.004-1.191 2.297-3.988 2.293-3.993-4.601.008-4.602.008 2.305 3.98 2.308 3.985Z"
      />
    </svg>
  );
}
