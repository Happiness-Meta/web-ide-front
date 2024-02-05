import React from "react";
import styles from "./header.module.css";
import sidebarStore from "../../../../store/CodePageStore/sidebarStore";
import ModeToggleBtn from "../../../../globalComponents/modeToggleBtn/ModeToggleBtn";
import ExploreBtn from "../../../../globalComponents/exploreBtn/ExploreBtn";
import globalStore from "../../../../store/globalStore/globalStore";
import AccountBtn from "../../../../globalComponents/AccountBtn/AccountBtn";

function Header() {
  const { sidebar, sidebarToggle } = sidebarStore();
  const { mode } = globalStore();

  return (
    <div className={styles.headerSpace}>
      <div className={styles.leftSide_header}>
        <i
          className={styles.sidebarToggle}
          onClick={sidebarToggle}
          style={mode ? { borderColor: "black" } : { borderColor: "white" }}
        >
          <div
            className={`${
              sidebar ? styles.sidebarToggleInnerT : styles.sidebarToggleInnerF
            }`}
            style={
              sidebar
                ? { backgroundColor: "black", borderColor: "white" }
                : { backgroundColor: "white", borderColor: "black" }
            }
          ></div>
        </i>
        <ExploreBtn />
        <div className={styles.IDE_name}>Earth-IDE-N</div>
      </div>
      <div className={styles.middleSide_header}>
        <div className={styles.runBtn}>
          <i className={`${styles.playIcon} material-icons`}>play_arrow</i>{" "}
          <div className={styles.runText}>Run</div>
        </div>
      </div>
      <div className={styles.rightSide_header}>
        <ModeToggleBtn />
        <AccountBtn />
      </div>
    </div>
  );
}

export default Header;
