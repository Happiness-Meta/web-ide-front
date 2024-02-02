import React from "react";
import styles from "./Repositories.module.css";
import RepoPage from "../../RepoPage";
import RepoComponent from "./RepoComponent";

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
    <RepoPage>
      <RepoComponent />
    </RepoPage>
  );
};

export default Repositories;
