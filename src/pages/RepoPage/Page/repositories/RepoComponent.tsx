import React from "react";
import styles from "./Repositories.module.css";
import RepoPage from "../../RepoPage";

const Repositories = () => {
  const repositories = {
    repo1: {
      name: "repo1",
      description: "repo1 description",
      url: "repo1 url",
      stars: 100,
      forks: 100,
    },
    repo2: {
      name: "repo2",
      description: "repo2 description",
      url: "repo2 url",
      stars: 100,
      forks: 100,
    },
    repo3: {
      name: "repo3",
      description: "repo3 description",
      url: "repo3 url",
      stars: 100,
      forks: 100,
    },
    repo4: {
      name: "repo4",
      description: "repo4 description",
      url: "repo4 url",
      stars: 100,
      forks: 100,
    },
  };
  const isEmpty = Object.keys(repositories).length === 0;

  return (
    <div className={styles.repocontainer_wrapper}>
      <h1>Repositories</h1>
      <div>
        {isEmpty ? (
          <p>새 레포지토리 만들기</p>
        ) : (
          <div className={styles.repositoriesContainer}>
            {Object.entries(repositories).map(([key, repo]) => (
              <div key={key} className={styles.repoContainer}>
                <h2>{repo.name}</h2>
                <p>{repo.description}</p>
                <a href={repo.url} target="_blank" rel="noopener noreferrer">
                  Visit
                </a>
                <p>Stars: {repo.stars}</p>
                <p>Forks: {repo.forks}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Repositories;
