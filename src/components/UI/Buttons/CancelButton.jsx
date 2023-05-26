import styles from "./CancelButton.module.css";

const CancelButton = (props) => {
  return (
    <button type={props.type} className={styles.btn} onClick={props.onClick} disabled={props.disabled}>
      {props.children}
    </button>
  );
};

export default CancelButton;
