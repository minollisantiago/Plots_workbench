import { ReactNode } from "react";
import { Loading } from "./loading";

interface Props {
  loading: boolean;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  error?: { info?: { error: string }; error?: string };
  children: ReactNode;
}

export const LoadingContent = ({ loading, loadingComponent, error, errorComponent, children }: Props) => {
  return (
    <>
      {/* Eror message */}
      {error && (errorComponent ? { errorComponent } : <div>{error.error}</div>)};

      {/* Loading */}
      {loading && (loadingComponent || <Loading />)};

      {/* Other children components */}
      {children}
    </>
  )
};
