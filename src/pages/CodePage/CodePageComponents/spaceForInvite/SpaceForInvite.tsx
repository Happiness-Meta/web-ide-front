import { RefObject, useEffect, useRef, useState } from "react";
import styles from "./spaceForInvite.module.css";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import editorStore from "@/store/CodePageStore/editorStore";
import userAxiosWithAuth from "@/utils/useAxiosWIthAuth";

const SpaceForInvite = () => {
  const infoSpaceRef: RefObject<HTMLDivElement> = useRef(null);

  const { toggleInviteSpace } = editorStore();
  const { repoId } = useParams();
  const [url, setUrl] = useState("");
  const [password, setPassword] = useState("");

  const goInvite = useMutation({
    mutationFn: async () => {
      try {
        const response = await userAxiosWithAuth.get(
          `/api/repos/${repoId}/invite`
        );
        setUrl(response.data.data.repoUrl);
        setPassword(response.data.data.repoPassword);
      } catch (error) {
        console.error(error);
      }
    },
  });

  useEffect(() => {
    goInvite.mutate();
  }, []);

  const splitPw = password.split("");

  return (
    <div className={styles.body}>
      <div ref={infoSpaceRef} className={styles.infoSpace}>
        <div className={styles.spaceEach}>
          <label className={styles.texts}>URL</label>
          <input className={styles.input} defaultValue={url} />
        </div>
        <div className={styles.spaceEach}>
          <label className={styles.texts}>Key</label>
          <div className={styles.pwSpace}>
            <span className={styles.pwEachSpace}>{splitPw[0]}</span>
            <span className={styles.pwEachSpace}>{splitPw[1]}</span>
            <span className={styles.pwEachSpace}>{splitPw[2]}</span>
            <span className={styles.pwEachSpace}>{splitPw[3]}</span>
          </div>
        </div>
        <button className={styles.closeBtn} onClick={toggleInviteSpace}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SpaceForInvite;
