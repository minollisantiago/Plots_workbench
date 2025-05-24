import { ReactNode } from "react";
import { Loading } from "./loading";

interface Props {
  loading: boolean;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  error?: { info?: { error: string }; error?: string };
  children: ReactNode;
}

// TODO: Create the custom errorComponent, you can use this as a starting example:
// https://github.com/elie222/inbox-zero/blob/379aead40c41827b6d7dea269e8c8300a0825090/apps/web/components/ErrorDisplay.tsx#L10

export const LoadingContent = ({ loading, loadingComponent, error, errorComponent, children }: Props) => {
  return (
    <>
      {/* Eror message */}
      {error && (errorComponent ? { errorComponent } : <div>{error.error}</div>)}

      {/* Loading */}
      {loading && (loadingComponent || <Loading />)}

      {/* Other children components */}
      {children}
    </>
  )
};
