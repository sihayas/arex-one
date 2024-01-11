import React from "react";

export function LoveIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={14}
      height={14}
      fill="none"
      {...props}
      className={props.className}
    >
      <path
        fill={props.color}
        d="M14 5.729C14 2.183 11.317 1 9.917 1A4.626 4.626 0 0 0 7 1.947 4.627 4.627 0 0 0 4.2 1C2.567 1.001 0 2.183 0 5.73c0 2.127 1.167 3.545 2.683 5.081 1.167 1.419 3.15 2.719 3.15 2.719a2.081 2.081 0 0 0 2.334 0s1.983-1.3 3.15-2.719C12.833 9.274 14 7.856 14 5.73Z"
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

export function LinkIcon({ ...props }) {
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
      width={14}
      height={14}
      fill="none"
      {...props}
    >
      <path
        fill="#999"
        d="M13.999 3.751v-.065a.62.62 0 0 0-.618-.62l-1.375-.003a.62.62 0 0 0-.62.618v.066c-.001.342.276.62.618.62l1.374.003a.62.62 0 0 0 .62-.619ZM12.415 10.868c.436-1.008.355-1.988-.244-2.942-.183-.291-.44-.5-.658-.751a.624.624 0 0 1-.078-.649c.269-.575.852-.47 1.227-.07 1.138 1.211 1.55 2.576 1.235 4.095-.435 2.096-2.385 3.578-4.548 3.438-1.141-.075-2.137-.552-2.987-1.433-.269-.279-.336-.656-.067-.953a.619.619 0 0 1 .636-.206c.352.08.62.538.937.737 1.127.707 2.242.742 3.343.106a2.837 2.837 0 0 0 1.204-1.372ZM10.935 1.995l.003-1.372a.62.62 0 0 0-.62-.622h-.063a.62.62 0 0 0-.622.62l-.002 1.372a.62.62 0 0 0 .62.622h.063a.62.62 0 0 0 .621-.62ZM6.487.545c.453.25.861.578 1.224.985.58.652-.397 1.547-1.037.821C5.501 1.021 3.4.961 2.177 2.247 1.172 3.305 1.04 4.856 1.833 6.074c.16.246.373.463.589.664.277.259.26.683.006.95-.242.252-.644.245-.9.014C.109 6.416-.381 4.524.317 2.754 1.281.31 4.193-.722 6.487.545ZM4.37 13.38l.002-1.373a.62.62 0 0 0-.62-.622H3.69a.62.62 0 0 0-.621.62l-.003 1.372a.62.62 0 0 0 .62.622h.063a.62.62 0 0 0 .622-.62ZM2.618 10.327v-.068a.62.62 0 0 0-.615-.624L.63 9.625a.62.62 0 0 0-.624.616v.068a.62.62 0 0 0 .615.623l1.374.01a.62.62 0 0 0 .624-.615Z"
      />
    </svg>
  );
}

// For heart button
export function BubbleIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={28}
      height={28}
      fill="none"
      {...props}
    >
      <path
        fill={props.color}
        fillRule="evenodd"
        d="M14 28c7.732 0 14-6.268 14-14S21.732 0 14 0 0 6.268 0 14c0 2.434.621 4.723 1.714 6.717a4 4 0 1 0 5.569 5.569A13.937 13.937 0 0 0 14 28Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function TailIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={15}
      height={6}
      fill="none"
      {...props}
      className={props.className}
    >
      <path
        fill="#FFF"
        d="M4.5 4C5 2 1.667.5 0 0h15c-1.833 1.333-5.914 4.457-8 5.5C6 6 3.882 6.473 4.5 4Z"
      />
    </svg>
  );
}

// Dynamic Nav Icons
export function TargetIndexIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={9}
      height={9}
      fill="none"
      className={props.className}
      {...props}
    >
      <circle cx={4.5} cy={4.5} r={3.75} stroke="#FFF" strokeWidth={1.5} />
    </svg>
  );
}

export function TargetGoIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={8}
      height={8}
      fill="none"
      {...props}
    >
      <path
        fill="#fff"
        d="M5.67 1.426c.016-.056-.005-.085-.063-.086a68.03 68.03 0 0 0-2.13.003C2.407 1.36 2.434 0 3.354 0c1.292 0 2.6 0 3.923.003.455 0 .725.3.723.725a581.545 581.545 0 0 0-.002 3.941c.003.872-1.353.931-1.34-.135.008-.691.009-1.397.002-2.118a.069.069 0 0 0-.013-.039c-.053-.083-.094-.083-.122 0a.27.27 0 0 1-.068.107C4.684 4.254 2.913 6.027 1.143 7.8c-.492.495-1.338-.01-1.102-.678a.978.978 0 0 1 .244-.36c1.866-1.859 3.62-3.612 5.26-5.258a.144.144 0 0 1 .076-.04c.027-.005.043-.018.049-.04Z"
      />
    </svg>
  );
}

export function TargetAddIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={9}
      height={9}
      fill="none"
      {...props}
    >
      <path
        fill="#FFF"
        d="M5.943 4.156c.782.008 1.634.008 2.555-.002 1.357-.015 1.313 1.686.115 1.691-.867.005-1.762.006-2.685.003a.07.07 0 0 0-.07.07 97.267 97.267 0 0 0 0 2.564c.02 1.363-1.683 1.338-1.69.115-.006-.866-.007-1.749-.003-2.647a.103.103 0 0 0-.103-.103c-.884.004-1.787.003-2.707-.003C.225 5.837.26 4.178 1.299 4.167c.833-.01 1.77-.011 2.811-.006a.054.054 0 0 0 .054-.055c-.001-.795-.003-1.652-.007-2.57-.003-.563.262-1.082.912-1.021.503.047.759.336.765.865.011.89.018 1.785.02 2.686 0 .059.03.089.089.09Z"
      />
    </svg>
  );
}

export function TargetBackIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      fill="none"
      {...props}
    >
      <path
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6.25 16.25v-2.5a2 2 0 0 0-2-2h-2.5M11.75 16.25v-2.5a2 2 0 0 1 2-2h2.5M11.75 1.75v2.5a2 2 0 0 0 2 2h2.5M6.25 1.75v2.5a2 2 0 0 1-2 2h-2.5"
      />
    </svg>
  );
}

export function TargetArtifactIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={9}
      height={9}
      fill="none"
      {...props}
    >
      <path
        fill="#FFF"
        d="M5.548 1.797c.666.278 1.164.92 1.169 1.683.005.94.006 2.007.003 3.2 0 .012.004.024.012.034.008.01.018.015.03.017.585.094.96-.165 1.123-.778.34-1.265.698-2.57 1.076-3.918.148-.524-.142-.945-.635-1.072A635.685 635.685 0 0 1 4.76.033c-.461-.122-.954.1-1.098.58-.094.314-.189.654-.284 1.02-.009.035.003.052.037.053.426.007.824.006 1.193-.003.42-.01.734.028.94.114Z"
      />
      <path
        fill="#FFF"
        d="M.88 2.25h3.865c.486 0 .88.42.88.938v4.874c0 .518-.394.938-.88.938H.88C.394 9 0 8.58 0 8.062V3.188c0-.518.394-.938.88-.938Z"
      />
    </svg>
  );
}

export function NotificationIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={6}
      height={12}
      fill="none"
      {...props}
    >
      <path
        fill={props.color}
        d="m5.981 7.117-3.31-7a.204.204 0 0 0-.103-.1.214.214 0 0 0-.144-.009.206.206 0 0 0-.116.085.195.195 0 0 0-.03.137l.783 4.918-2.813-.544a.214.214 0 0 0-.203.072.197.197 0 0 0-.026.207l3.31 7c.02.044.057.08.103.1.045.019.097.022.144.009a.207.207 0 0 0 .116-.085.195.195 0 0 0 .03-.137l-.783-4.918 2.813.544a.214.214 0 0 0 .203-.072.197.197 0 0 0 .026-.207Z"
      />
    </svg>
  );
}

// Album Sort Icons
export function StarlightIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="none"
      {...props}
    >
      <path
        fill="#000"
        d="m4.61 15.69 1.468-1.438a.463.463 0 0 0 .014-.643l-.014-.015a.436.436 0 0 0-.627-.015l-1.467 1.438a.463.463 0 0 0-.014.642l.014.015c.17.182.45.189.627.015ZM7.028 13.318l.143-.147a.439.439 0 0 0 .001-.609l-.04-.041a.413.413 0 0 0-.594-.001l-.144.146a.439.439 0 0 0 0 .61l.04.04c.163.17.43.17.594.002ZM8.256 12.118l1.626-1.593a.463.463 0 0 0 .014-.643l-.013-.014a.436.436 0 0 0-.627-.015L7.63 11.446a.463.463 0 0 0-.014.643l.013.015c.17.181.45.188.627.014ZM.939 11.17l.212-.203a.442.442 0 0 0 .022-.613l-.037-.04a.416.416 0 0 0-.598-.023l-.212.202a.442.442 0 0 0-.022.613l.037.04c.159.176.427.186.598.023ZM2.518 9.714l2.79-2.557a.466.466 0 0 0 .035-.647l-.01-.01a.44.44 0 0 0-.63-.036L1.913 9.02a.466.466 0 0 0-.035.647l.01.01a.44.44 0 0 0 .63.036ZM.953 7.706l4.423-4.258a.469.469 0 0 0 .02-.651l-.007-.007a.442.442 0 0 0-.635-.02L.33 7.026a.469.469 0 0 0-.02.652l.007.007c.17.185.454.194.635.02ZM6.493 2.39l.283-.276a.446.446 0 0 0 .016-.619L6.76 1.46a.42.42 0 0 0-.604-.016l-.284.276a.446.446 0 0 0-.015.618l.032.036a.42.42 0 0 0 .604.016ZM14.814 4.314c-3.356 0-4.128-.772-4.128-4.128a.186.186 0 1 0-.372 0c0 3.356-.772 4.128-4.128 4.128a.186.186 0 1 0 0 .372c3.356 0 4.128.772 4.128 4.128a.186.186 0 1 0 .372 0c0-3.356.772-4.128 4.128-4.128a.186.186 0 0 0 0-.372ZM15.876 12.876c-2.237 0-2.752-.514-2.752-2.752a.124.124 0 1 0-.248 0c0 2.237-.515 2.752-2.752 2.752a.124.124 0 0 0-.088.212.124.124 0 0 0 .088.036c2.237 0 2.752.515 2.752 2.752a.124.124 0 1 0 .248 0c0-2.237.515-2.752 2.752-2.752a.124.124 0 0 0 .088-.212.124.124 0 0 0-.088-.036ZM7.133 9.438c-1.118 0-1.376-.257-1.376-1.376a.062.062 0 0 0-.124 0c0 1.119-.257 1.376-1.376 1.376a.062.062 0 0 0 0 .124c1.119 0 1.376.257 1.376 1.376a.062.062 0 1 0 .124 0c0-1.119.258-1.376 1.376-1.376a.062.062 0 1 0 0-.124Z"
      />
    </svg>
  );
}

export function LeafIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="none"
      {...props}
    >
      <path
        fill="#000"
        d="M7.941 11.69h.004a.008.008 0 0 0 .003-.006c.038-.885.116-1.752.31-2.608.513-2.28 1.663-4.131 3.447-5.557.357-.286.75-.537 1.115-.812.45-.34.83-.676 1.14-1.009.43-.462.862-1.048.894-1.68.002-.022.008-.024.02-.006.508.8.822 1.731.98 2.665a9.557 9.557 0 0 1-.126 3.933c-.343 1.383-1.079 2.666-2.3 3.418-.7.43-1.464.734-2.287.956-.433.117-.873.23-1.318.34-.325.079-.606.184-.842.316-.36.201-.437.663-.482 1.048-.108.923-.077 1.904-.01 2.814.01.157.02.317.028.48 0 .012-.005.018-.016.018h-.862c-.013 0-.02-.007-.02-.02.002-1.027-.075-2.057-.303-3.05a4.353 4.353 0 0 0-.4-1.096 1.353 1.353 0 0 0-.84-.688l-1.214-.35a9.866 9.866 0 0 1-2.028-.838 5.735 5.735 0 0 1-.65-.411C.841 8.548.065 6.823.004 5.144c-.031-.825.148-1.71.627-2.39.01-.015.017-.013.023.004.127.419.426.717.778.956.695.473 1.495.73 2.222 1.14 1.288.724 2.277 1.844 2.988 3.16.612 1.132 1.038 2.399 1.292 3.67 0 .004.003.007.007.007Z"
      />
    </svg>
  );
}

export function FlowerIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="none"
      {...props}
    >
      <path
        fill="#000"
        d="M10.918 7.11c.232 1.841-.484 3.6-1.535 5.07-.372.519-.761.975-1.169 1.366-.178.17-.369.073-.52-.082-1.17-1.201-2.123-2.676-2.503-4.313-.254-1.096-.187-2.202.176-3.298.403-1.22 1.122-2.346 1.969-3.3.15-.17.3-.324.448-.464.174-.163.366-.08.517.075 1.316 1.36 2.38 3.07 2.617 4.946Z"
      />
      <path
        fill="#000"
        d="M6.535 13.16c-1.133-.47-2.156-1.12-2.963-1.99-.852-.915-1.367-2.053-1.544-3.411C1.854 6.43 1.992 5 2.355 3.723c.038-.133.116-.212.235-.239a.65.65 0 0 1 .3.03 10.59 10.59 0 0 1 2.34.963.022.022 0 0 1 .005.016 6.543 6.543 0 0 0-.632 4.93c.34 1.372 1.055 2.635 1.944 3.72.018.022.014.028-.012.018ZM9.486 13.114c.116-.135.224-.282.33-.426.712-.966 1.274-2.046 1.573-3.212a6.591 6.591 0 0 0-.028-3.429 8.234 8.234 0 0 0-.592-1.54.022.022 0 0 1-.001-.016.02.02 0 0 1 .01-.011 10.356 10.356 0 0 1 2.439-.986c.246-.066.386.063.45.294.409 1.5.53 3.172.179 4.691a5.804 5.804 0 0 1-1.377 2.656c-.814.891-1.858 1.554-2.959 2.014-.056.024-.064.012-.024-.035Z"
      />
      <path
        fill="#000"
        d="M3.698 13.685C2.802 13.37 2.05 12.782 1.445 12 .83 11.207.362 10.22.084 9.24A2.88 2.88 0 0 1 0 8.91a.34.34 0 0 1 .25-.352c.392-.118.789-.208 1.191-.27a.022.022 0 0 1 .026.018c.268 1.467.938 2.698 2.008 3.693.915.851 2.021 1.487 3.175 1.917.028.01.027.017-.002.02-.987.127-2.022.074-2.951-.252ZM13.197 11.276c.693-.853 1.138-1.878 1.334-2.973.001-.004.003-.008.007-.01a.016.016 0 0 1 .012-.004c.411.06.806.15 1.186.267.2.061.3.225.246.44-.283 1.114-.812 2.25-1.521 3.123-.617.758-1.338 1.28-2.163 1.567-.941.327-1.96.38-2.943.252-.035-.004-.036-.013-.003-.025 1.467-.545 2.852-1.413 3.845-2.637Z"
      />
    </svg>
  );
}

export function FireIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="none"
      {...props}
    >
      <path
        fill="#000"
        d="M11.758 6.151a5.053 5.053 0 0 1-.957 1.336c-.218.226-.345.36-.381.402-1.35 1.57-1.813 3.594-1.66 5.667.061.823.214 1.632.459 2.425.006.02.001.024-.016.012a9.042 9.042 0 0 1-3.856-6.712c-.085-1.138.09-2.719 1.045-3.464 1.359-1.06 2.536-2.392 3.326-3.95a8.093 8.093 0 0 0 .685-1.852c.004-.018.012-.02.023-.006 1.345 1.638 2.337 4.05 1.332 6.142Z"
      />
      <path
        fill="#000"
        d="M6.218 15.436c-2.277-.944-3.57-3.501-3.134-6.004A5.46 5.46 0 0 1 4.13 7.026c.172-.226.352-.45.551-.648.018-.017.024-.014.018.011-.502 2.126-.327 4.297.552 6.261a10.067 10.067 0 0 0 2.142 3.092c.009.009.007.012-.005.011-.39-.05-.78-.156-1.17-.317ZM12.997 9.695c-.03 2.347-1.233 4.452-2.806 6.056l-.003.002h-.004l-.002-.002-.002-.003a11.67 11.67 0 0 1-.479-2.297c-.07-.67-.068-1.496.266-2.102.06-.11.165-.24.316-.392a10.75 10.75 0 0 0 1.435-1.79c.343-.541.644-1.195.608-1.852a.06.06 0 0 1 .01-.037c.02-.03.04-.036.064-.019.16.117.277.434.338.622.182.556.268 1.161.26 1.814Z"
      />
    </svg>
  );
}

// Rating Icons

export function HalfStar({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      fill="none"
      {...props}
    >
      <path
        fill="#000"
        d="M9 16.172a.668.668 0 0 1-.667-.667c0-4.856-.983-5.838-5.838-5.838a.667.667 0 1 1 0-1.334c4.855 0 5.838-.983 5.838-5.838a.667.667 0 1 1 1.334 0c0 4.855.982 5.838 5.838 5.838a.667.667 0 0 1 0 1.334c-4.856 0-5.838.982-5.838 5.838a.667.667 0 0 1-.667.667ZM6.931 9A3.88 3.88 0 0 1 9 11.069 3.88 3.88 0 0 1 11.069 9 3.88 3.88 0 0 1 9 6.931 3.88 3.88 0 0 1 6.931 9Z"
      />
    </svg>
  );
}

export function OneStar({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      fill="none"
      {...props}
    >
      <path
        fill="#000"
        d="M15.805 8.634c-5.236 0-6.44-1.204-6.44-6.44a.366.366 0 1 0-.73 0c0 5.236-1.204 6.44-6.44 6.44a.366.366 0 1 0 0 .732c5.236 0 6.44 1.204 6.44 6.44a.366.366 0 0 0 .73 0c0-5.236 1.204-6.44 6.44-6.44a.365.365 0 1 0 0-.732Z"
      />
    </svg>
  );
}

export function OneHalfStar({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      fill="none"
      {...props}
    >
      <path
        fill="#000"
        d="M17.798 3.736c-2.874 0-3.535-.66-3.535-3.535a.2.2 0 1 0-.401 0c0 2.875-.661 3.535-3.535 3.535a.2.2 0 0 0-.187.278.2.2 0 0 0 .187.124c2.874 0 3.535.661 3.535 3.536a.2.2 0 1 0 .401 0c0-2.875.661-3.536 3.535-3.536a.2.2 0 0 0 .187-.278.2.2 0 0 0-.187-.124ZM7.172 18a.667.667 0 0 1-.667-.667c0-4.855-.983-5.838-5.838-5.838a.667.667 0 0 1 0-1.334c4.855 0 5.838-.982 5.838-5.838a.667.667 0 0 1 1.334 0c0 4.856.982 5.838 5.838 5.838a.667.667 0 1 1 0 1.334c-4.856 0-5.838.983-5.838 5.838a.667.667 0 0 1-.667.667Zm-2.07-7.172a3.88 3.88 0 0 1 2.07 2.07 3.88 3.88 0 0 1 2.069-2.07A3.88 3.88 0 0 1 7.17 8.76a3.88 3.88 0 0 1-2.068 2.07Z"
      />
    </svg>
  );
}

export function TwoStar({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      fill="none"
      {...props}
    >
      <path
        fill="#000"
        d="M13.976 10.462c-5.235 0-6.438-1.204-6.438-6.44a.366.366 0 1 0-.732 0c0 5.236-1.203 6.44-6.439 6.44a.366.366 0 1 0 0 .732c5.236 0 6.44 1.204 6.44 6.44a.366.366 0 0 0 .73 0c0-5.236 1.204-6.44 6.44-6.44a.366.366 0 1 0 0-.732ZM17.798 3.736c-2.874 0-3.535-.66-3.535-3.535a.2.2 0 1 0-.401 0c0 2.875-.661 3.535-3.535 3.535a.2.2 0 0 0-.187.278.2.2 0 0 0 .187.124c2.874 0 3.535.661 3.535 3.536a.2.2 0 1 0 .401 0c0-2.875.661-3.536 3.535-3.536a.2.2 0 0 0 .187-.278.2.2 0 0 0-.187-.124Z"
      />
    </svg>
  );
}

export function TwoHalfStar({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      fill="none"
      {...props}
    >
      <path
        fill="#000"
        d="M17.798 3.736c-2.874 0-3.535-.66-3.535-3.535a.2.2 0 1 0-.401 0c0 2.875-.661 3.535-3.535 3.535a.2.2 0 0 0-.187.278.2.2 0 0 0 .187.124c2.874 0 3.535.661 3.535 3.536a.2.2 0 1 0 .401 0c0-2.875.661-3.536 3.535-3.536a.2.2 0 0 0 .187-.278.2.2 0 0 0-.187-.124ZM17.827 14.453c-2.464 0-3.03-.567-3.03-3.03a.172.172 0 1 0-.344 0c0 2.463-.566 3.03-3.03 3.03a.172.172 0 1 0 0 .344c2.463 0 3.03.567 3.03 3.03a.172.172 0 1 0 .344 0c0-2.463.566-3.03 3.03-3.03a.172.172 0 1 0 0-.344ZM7.172 16.172a.668.668 0 0 1-.667-.667c0-4.856-.983-5.838-5.838-5.838a.667.667 0 1 1 0-1.334c4.855 0 5.838-.983 5.838-5.838a.667.667 0 0 1 1.334 0c0 4.855.982 5.838 5.838 5.838a.667.667 0 1 1 0 1.334c-4.856 0-5.838.982-5.838 5.838a.667.667 0 0 1-.667.667ZM5.102 9a3.88 3.88 0 0 1 2.07 2.069A3.88 3.88 0 0 1 9.24 9a3.88 3.88 0 0 1-2.07-2.069A3.88 3.88 0 0 1 5.104 9Z"
      />
    </svg>
  );
}

export function ThreeStar({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      fill="none"
      {...props}
    >
      <path
        fill="#000"
        d="M13.976 8.634c-5.235 0-6.438-1.204-6.438-6.44a.366.366 0 1 0-.732 0c0 5.236-1.203 6.44-6.439 6.44a.366.366 0 1 0 0 .732c5.236 0 6.44 1.204 6.44 6.44a.366.366 0 0 0 .73 0c0-5.236 1.204-6.44 6.44-6.44a.366.366 0 1 0 0-.732ZM17.798 3.736c-2.874 0-3.535-.66-3.535-3.535a.2.2 0 1 0-.401 0c0 2.875-.661 3.535-3.535 3.535a.2.2 0 0 0-.187.278.2.2 0 0 0 .187.124c2.874 0 3.535.661 3.535 3.536a.2.2 0 1 0 .401 0c0-2.875.661-3.536 3.535-3.536a.2.2 0 0 0 .187-.278.2.2 0 0 0-.187-.124ZM17.827 14.453c-2.464 0-3.03-.567-3.03-3.03a.172.172 0 1 0-.344 0c0 2.463-.566 3.03-3.03 3.03a.172.172 0 1 0 0 .344c2.463 0 3.03.567 3.03 3.03a.172.172 0 1 0 .344 0c0-2.463.566-3.03 3.03-3.03a.172.172 0 1 0 0-.344Z"
      />
    </svg>
  );
}

export function ThreeHalfStar({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      fill="none"
      {...props}
    >
      <path
        fill="#000"
        d="M7.172 14.344a.667.667 0 0 1-.667-.667c0-4.856-.983-5.838-5.838-5.838a.667.667 0 0 1 0-1.334c4.855 0 5.838-.983 5.838-5.838a.667.667 0 0 1 1.334 0c0 4.855.982 5.838 5.838 5.838a.667.667 0 1 1 0 1.334c-4.856 0-5.838.982-5.838 5.838a.667.667 0 0 1-.667.667Zm-2.07-7.172a3.88 3.88 0 0 1 2.07 2.069A3.88 3.88 0 0 1 9.24 7.17a3.88 3.88 0 0 1-2.07-2.068 3.88 3.88 0 0 1-2.068 2.069ZM17.798 13.861c-2.874 0-3.535-.66-3.535-3.535a.2.2 0 1 0-.401 0c0 2.875-.661 3.535-3.535 3.535a.201.201 0 1 0 0 .402c2.874 0 3.535.661 3.535 3.536a.2.2 0 1 0 .401 0c0-2.875.661-3.536 3.535-3.536a.201.201 0 1 0 0-.402ZM17.827 3.203c-2.464 0-3.03-.567-3.03-3.03a.172.172 0 1 0-.344 0c0 2.463-.566 3.03-3.03 3.03a.172.172 0 1 0 0 .344c2.463 0 3.03.567 3.03 3.03a.172.172 0 1 0 .344 0c0-2.463.566-3.03 3.03-3.03a.172.172 0 1 0 0-.344ZM6.043 15.044c-2.053 0-2.525-.472-2.525-2.526a.144.144 0 1 0-.286 0c0 2.054-.472 2.526-2.525 2.526a.143.143 0 0 0-.134.088.144.144 0 0 0 .134.199c2.053 0 2.525.472 2.525 2.526a.144.144 0 1 0 .286 0c0-2.054.472-2.526 2.525-2.526a.145.145 0 0 0 .134-.089.143.143 0 0 0-.134-.198Z"
      />
    </svg>
  );
}

export function FourStar({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      fill="none"
      {...props}
    >
      <path
        fill="#000"
        d="M13.973 6.806c-5.234 0-6.437-1.204-6.437-6.44a.366.366 0 1 0-.732 0c0 5.236-1.203 6.44-6.437 6.44a.366.366 0 1 0 0 .731c5.234 0 6.437 1.205 6.437 6.44a.366.366 0 1 0 .732 0c0-5.235 1.203-6.44 6.437-6.44a.366.366 0 1 0 0-.731ZM17.798 13.861c-2.874 0-3.535-.66-3.535-3.535a.2.2 0 1 0-.401 0c0 2.875-.661 3.535-3.535 3.535a.201.201 0 1 0 0 .402c2.874 0 3.535.661 3.535 3.536a.2.2 0 1 0 .401 0c0-2.875.661-3.536 3.535-3.536a.201.201 0 1 0 0-.402ZM17.827 3.203c-2.464 0-3.03-.567-3.03-3.03a.172.172 0 1 0-.344 0c0 2.463-.566 3.03-3.03 3.03a.172.172 0 1 0 0 .344c2.463 0 3.03.567 3.03 3.03a.172.172 0 1 0 .344 0c0-2.463.566-3.03 3.03-3.03a.172.172 0 1 0 0-.344ZM6.043 15.044c-2.053 0-2.525-.472-2.525-2.526a.144.144 0 1 0-.286 0c0 2.054-.472 2.526-2.525 2.526a.143.143 0 0 0-.134.088.144.144 0 0 0 .134.199c2.053 0 2.525.472 2.525 2.526a.144.144 0 1 0 .286 0c0-2.054.472-2.526 2.525-2.526a.145.145 0 0 0 .134-.089.143.143 0 0 0-.134-.198Z"
      />
    </svg>
  );
}

export function FourHalfStar({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      fill="none"
      {...props}
    >
      <path
        stroke="#000"
        strokeWidth={0.75}
        d="m8.347 8.73-.453-7.566a.032.032 0 0 1 .01-.025.033.033 0 0 1 .024-.01h2.212a.033.033 0 0 1 .034.035l-.377 7.571a.033.033 0 0 0 .013.028.034.034 0 0 0 .03.004l6.772-2.373a.034.034 0 0 1 .037.01.032.032 0 0 1 .006.012l.59 1.96a.032.032 0 0 1-.012.036.034.034 0 0 1-.012.005l-6.845 1.706a.033.033 0 0 0-.019.051l4.668 6.235a.032.032 0 0 1 .006.025.032.032 0 0 1-.014.021l-1.769 1.165a.032.032 0 0 1-.012.005.033.033 0 0 1-.025-.006.031.031 0 0 1-.01-.009l-4.139-6.455a.033.033 0 0 0-.028-.016.034.034 0 0 0-.029.016l-4.138 6.454a.032.032 0 0 1-.01.01.032.032 0 0 1-.012.005h-.013a.033.033 0 0 1-.012-.005l-1.694-1.164a.033.033 0 0 1-.008-.046l4.669-6.236a.033.033 0 0 0 .005-.031.033.033 0 0 0-.023-.021L.775 8.34a.034.034 0 0 1-.02-.016.032.032 0 0 1-.003-.026l.66-1.887a.034.034 0 0 1 .042-.02l6.848 2.372a.034.034 0 0 0 .042-.017.032.032 0 0 0 .003-.016Z"
      />
    </svg>
  );
}

export function FiveStar({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      fill="none"
      {...props}
    >
      <path
        fill="#000"
        d="m10.45 9.818 5.142 6.872-1.99 1.31-4.562-7.117L4.478 18 2.57 16.69l5.142-6.872L0 7.856l.745-2.129 7.55 2.618L7.796 0h2.489L9.87 8.345l7.466-2.618L18 7.936l-7.55 1.882Z"
      />
    </svg>
  );
}
