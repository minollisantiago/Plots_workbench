import { Loader2Icon } from "lucide-react";

interface Props {
  loaderSize?: string
}

export const Loading = ({ loaderSize = "2rem" }: Props) => {
  return (
    <div className="p-4">
      <Loader2Icon
        className="mx-auto animate-spin"
        style={{ height: loaderSize, width: loaderSize }}
      />
    </div>
  );
};
