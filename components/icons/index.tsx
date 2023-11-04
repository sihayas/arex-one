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

export function EntryBlob({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={13}
      height={48}
      fill="none"
      {...props}
      className={props.className}
    >
      <path
        fill="#F4F4F4"
        fillRule="evenodd"
        d="M12.998.5c0 1.712.009 3.424-.01 5.137-.018 1.639-.043 3.473-.645 5.069-.65 1.722-1.787 2.863-3.124 4.01-.962.827-3.015 2.45-4.006 3.24-.812.647-2.418 1.913-3.195 2.605C1.04 21.43 0 22.506 0 24c0 1.494 1.04 2.569 2.016 3.438.776.692 2.383 1.958 3.195 2.605.991.79 3.044 2.412 4.006 3.24 1.338 1.149 2.474 2.288 3.124 4.01.6 1.596.627 3.43.645 5.069.019 1.712.01 3.425.01 5.137"
        clipRule="evenodd"
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

export function CrossIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="#CCC"
      className="bi bi-x"
      viewBox="0 0 16 16"
    >
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
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
      className={props.className}
      {...props}
    >
      <path
        fill="#CCC"
        d="M4.58.098c.525.238.557.956.124 1.273-.13.094-.345.143-.646.147-1.244.011-2.542-.238-2.545 1.464-.002.61.244 2.08-.78 2.03-.458-.023-.69-.283-.698-.782-.012-.715-.1-1.55.085-2.19C.39 1.107.977.485 1.884.175 2.588-.066 3.55.024 4.351.026c.046 0 .122.024.23.072ZM11.264 1.346c-.47-.338-.3-1.22.346-1.312.285-.04.798-.045 1.538-.012 1.28.054 2.28.639 2.693 1.886.23.697.148 1.671.134 2.467a.572.572 0 0 1-.278.488c-.373.248-.916.162-1.118-.256-.064-.132-.095-.35-.092-.652.002-.59.09-1.369-.178-1.83-.468-.806-1.516-.61-2.294-.61-.343 0-.594-.057-.75-.169ZM10.198 11.338c-1.113.657-2.225.814-3.336.473-2.46-.758-3.66-3.594-2.291-5.856 1.628-2.69 5.474-2.56 6.96.186.579 1.068.616 2.237.112 3.507-.061.155-.224.352-.297.545a.095.095 0 0 0 .024.111c.756.751 1.51 1.503 2.26 2.257.21.21.33.405.36.583.114.71-.794 1.103-1.328.567a530.57 530.57 0 0 0-2.36-2.36c-.032-.03-.067-.035-.104-.013Zm.297-3.344A2.49 2.49 0 0 0 8 5.502a2.497 2.497 0 0 0-2.496 2.492A2.49 2.49 0 0 0 8 10.486a2.497 2.497 0 0 0 2.495-2.492ZM2.049 14.253c.464.317 1.336.25 1.874.23.313-.012.532.007.655.057.519.21.559 1.042.105 1.31-.38.225-2.062.16-2.496.056-1.077-.259-1.766-.909-2.068-1.95-.181-.63-.099-1.477-.108-2.19-.01-.809 1.073-1.086 1.419-.367.16.337.081 1.086.08 1.474-.003.636.042 1.041.539 1.38Z"
      />
    </svg>
  );
}
