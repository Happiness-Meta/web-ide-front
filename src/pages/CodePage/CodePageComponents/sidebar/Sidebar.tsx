import styles from "./sidebar.module.css";
import sidebarStore from "../../../../store/CodePageStore/sidebarStore";
import EditorSettingBtn from "./editorSettingBtn/EditorSettingBtn";
import Tree from "rc-tree";
import "rc-tree/assets/index.css";

const treeData = [
  {
    key: "1",
    title: "Node 1",
    children: [
      { key: "1-1", title: "Node 1-1" },
      { key: "1-2", title: "Node 1-2" },
    ],
  },
  {
    key: "2",
    title: "Node 2",
  },
];

function Sidebar() {
  const { expandStatus, expandToggle } = sidebarStore();
  const { sidebar } = sidebarStore();
  // const [fileName, setFileName] = useState("");

  // const handleFileName = (event: ChangeEvent<HTMLInputElement>) => {
  //   setFileName(event.target.value);
  // };

  // const fileExtension = fileName.split(".").pop();
  // const iconSrc = `/svg/${fileExtension}.svg`;

  return (
    <div
      className={`${sidebar ? styles.sidebarToggle : undefined} ${
        styles.sidebarSpace
      }`}
    >
      <form className={styles.searchForm}>
        <input
          type="text"
          className={styles.search_input}
          placeholder="Search"
        ></input>
      </form>
      <div className={styles.sidebarSpace_inner}>
        <div className={styles.filesSpace}>
          <div className={styles.filesHeader}>
            <div className={styles.TitleSpace}>
              <div
                className={`material-symbols-outlined ${
                  expandStatus ? styles.expandStatusT : styles.expandStatusF
                }`}
                onClick={expandToggle}
              >
                {expandStatus ? "chevron_right" : "expand_more"}
              </div>
              <p className={styles.filesTitle}>Files</p>
            </div>
            <div className={styles.filesAddSpace}>
              <div className={`material-symbols-outlined ${styles.addFile}`}>
                note_add
              </div>
              <div className={`material-symbols-outlined ${styles.addFolder}`}>
                create_new_folder
              </div>
            </div>
          </div>
          <div
            className={`${expandStatus ? styles.FCExpandStatus : undefined} ${
              styles.fileContainer
            }`}
          >
            <Tree
              treeData={treeData}
              showIcon={true}
              selectable={true}
              draggable={true}
              allowDrop={() => true}
            ></Tree>
            {/* <div>
              <img src={iconSrc} alt="icon" className={styles.fileIcon}></img>
              <input
                type="text"
                value={fileName}
                onChange={handleFileName}
                className={styles.fileName}
              />
            </div> */}
          </div>
        </div>
        <div className={styles.sidebarBottom}>
          <EditorSettingBtn />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
