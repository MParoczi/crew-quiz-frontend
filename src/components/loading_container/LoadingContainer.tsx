import { Center, Loader } from "@mantine/core";
import { memo } from "react";

import styles from "./loadingContainer.module.css";

import type { ReactNode } from "react";

interface ILoadingContainerProps {
  loading: boolean;
  children: ReactNode;
}

function LoadingContainer(props: ILoadingContainerProps) {
  const { loading, children } = props;

  function renderLoader() {
    return (
      <Center className={styles.loadingCenter}>
        <Loader type="bars" color="greenAccent" size="lg" className={styles.loader} />
      </Center>
    );
  }

  function render() {
    if (loading) {
      return renderLoader();
    }

    return children;
  }

  return render();
}

export default memo(LoadingContainer);
