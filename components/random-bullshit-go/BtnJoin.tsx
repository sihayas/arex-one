import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/join.module.css";

export default function BtnJoin({ color, icon, label }) {
  return (
    <div className={color}>
      <div className={styles.buttonInner}>
        <Image
          className={styles.arrow}
          src={icon}
          width={20}
          height={20}
          alt="arrow-join"
        />
        <div className={styles.buttonLabel}>{label}</div>
      </div>
    </div>
  );
}
