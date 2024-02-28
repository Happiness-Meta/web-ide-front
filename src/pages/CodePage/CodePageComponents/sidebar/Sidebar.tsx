import styles from "./sidebar.module.css";
import { CreateHandler, DeleteHandler, Tree, TreeApi } from "react-arborist";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import sidebarStore from "@/store/CodePageStore/sidebarStore";
import editorStore from "@/store/CodePageStore/editorStore";
import FileTreeStore from "@/store/FileTreeStore/FileTreeStore";
import { nodeType } from "@/types/TypesForFileTree";
import userAxiosWithAuth from "@/utils/useAxiosWIthAuth";
import EditorSettingBtn from "./editorSettingBtn/EditorSettingBtn";
import Node from "@/globalComponents/Node/Node";

function Sidebar() {
  const { sidebar, expandStatus, expandToggle } = sidebarStore();
  const { rightSpace, toggleRightSpace, terminal, toggleTerminal } =
    editorStore();
  const { fileTree, getNodes, addNode, deleteNode } = FileTreeStore();

  const [term, setTerm] = useState("");

  const { repoId } = useParams();
  const treeRef = useRef<TreeApi<nodeType>>();

  const onCreate: CreateHandler<nodeType> = ({ type, parentId }) => {
    // postCreate.mutate();
    const newNode: nodeType = {
      id: uuidv4(),
      name: "",
      type: type,
      parentId: parentId === null ? undefined : parentId,
      key: "", //filePath
      content: "",
    };
    addNode(newNode);
    return newNode;
  };

  const onDelete: DeleteHandler<nodeType> = ({ ids }) => {
    deleteNode(ids[0]);
  };

  const getData = useMutation({
    mutationFn: async () => {
      try {
        const response = await userAxiosWithAuth.get(
          `/api/repos/${repoId}/files`
        );
        getNodes(response.data.data.treeData.children);
        //id 의 값을 uuid로,
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    getData.mutate();
  }, []);

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
                onClick={() => {
                  treeRef.current?.createLeaf();
                }}
              >
                note_add
              </div>
              <div
                className={`material-symbols-outlined ${styles.addFolder}`}
                onClick={() => treeRef.current?.createInternal()}
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
              indent={17}
              data={fileTree}
              onCreate={onCreate}
              onDelete={onDelete}
              openByDefault={false}
              searchTerm={term}
              searchMatch={(node, term) =>
                node.data.name.toLowerCase().includes(term.toLowerCase())
              }
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
