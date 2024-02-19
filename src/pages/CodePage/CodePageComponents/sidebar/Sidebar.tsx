import styles from "./sidebar.module.css";
import sidebarStore from "../../../../store/CodePageStore/sidebarStore";
import EditorSettingBtn from "./editorSettingBtn/EditorSettingBtn";
import editorStore from "../../../../store/CodePageStore/editorStore";
import { CreateHandler, Tree, TreeApi } from "react-arborist";
import { useEffect, useRef, useState } from "react";
import Node from "../../../../globalComponents/node/Node";
import { v4 as uuidv4 } from "uuid";
import { useMutation } from "@tanstack/react-query";
import { LeafType } from "../../../../types/typesForFileTree";
import userAxiosWithAuth from "../../../../utils/useAxiosWIthAuth";
import FileTreeStore from "../../../../store/FileTreeStore/FileTreeStore";
import { useParams } from "react-router-dom";

function Sidebar() {
  const { sidebar, expandStatus, expandToggle } = sidebarStore();
  const { rightSpace, toggleRightSpace, terminal, toggleTerminal } =
    editorStore();
  const { fileTree, getNodes, addNode } = FileTreeStore();

  const [term, setTerm] = useState("");

  const treeRef = useRef<TreeApi<LeafType>>(null);

  const onCreate: CreateHandler<LeafType> = ({ type, parentId }) => {
    const newNode: LeafType = {
      id: uuidv4(),
      name: "",
      type: type === "internal" ? "DIRECTORY" : "FILE",
      parentId: parentId === null ? "root" : parentId,
      content: "",
    };
    addNode(newNode);
    return newNode;
  };
  console.log();
  // const addNode = (newNode: leafType) => {
  //   treeData = [...treeData, newNode];
  // };

  const { repoId } = useParams();

  const getData = useMutation({
    mutationFn: async () => {
      try {
        const response = await userAxiosWithAuth.get(
          `/api/repos/${repoId}/files`
        );
        getNodes(response.data.fileData);
      } catch (error) {
        console.log(error);
      }
    },
  });

  // useEffect(() => {
  //   getData.mutate();
  // }, []);

  return (
    <div
      className={`${sidebar ? styles.sidebarToggle : undefined} ${
        styles.sidebarSpace
      }`}
    >
      <div className={styles.searchForm}>
        <input
          type="text"
          className={styles.search_input}
          placeholder="Search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        ></input>
      </div>
      <div className={styles.sidebarSpace_inner}>
        <div className={styles.filesSpace}>
          <div className={styles.filesHeader}>
            <div className={styles.TitleSpace} onClick={expandToggle}>
              <div
                className={`material-symbols-outlined ${
                  expandStatus ? styles.expandStatusT : styles.expandStatusF
                }`}
              >
                {expandStatus ? "chevron_right" : "expand_more"}
              </div>
              <p className={styles.filesTitle}>Files</p>
            </div>
            <div className={styles.filesAddSpace}>
              <div
                className={`material-symbols-outlined ${styles.addFile}`}
                onClick={() => treeRef.current?.createLeaf()}
                title="New Files..."
              >
                note_add
              </div>
              <div
                className={`material-symbols-outlined ${styles.addFolder}`}
                onClick={() => addNode}
                title="New Folders..."
              >
                create_new_folder
              </div>
            </div>
          </div>
          <div
            className={`${expandStatus ? styles.FC_ExpandStatus : undefined} ${
              styles.fileContainer
            }`}
          >
            <Tree
              ref={treeRef}
              className={styles.react_arborist}
              rowClassName={styles.arborist_row}
              width={"100%"}
              height={1000}
              indent={10}
              data={fileTree}
              searchTerm={term}
              searchMatch={(node, term) =>
                node.data.name.toLowerCase().includes(term.toLowerCase())
              }
              // onRename={}
              onCreate={onCreate}
            >
              {Node}
            </Tree>
          </div>
        </div>
        <div className={styles.sidebarBottom}>
          <div className={styles.sidebarBottomInner}>
            <EditorSettingBtn />
            <i
              className={`${styles.bottomIcons1} material-symbols-outlined`}
              style={rightSpace ? { opacity: 0.5 } : undefined}
              onClick={toggleRightSpace}
            >
              forum
            </i>
            <i
              className={`${styles.bottomIcons2} material-symbols-outlined`}
              style={terminal ? { opacity: 0.5 } : undefined}
              onClick={toggleTerminal}
            >
              terminal
            </i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
