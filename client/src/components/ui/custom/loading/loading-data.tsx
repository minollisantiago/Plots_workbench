import { ReactNode } from "react";
import { Loading } from "./loading";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface Props {
  children?: ReactNode
}

export const LoadingData = ({ children }: Props) => {
  return (
    <Dialog open={true}>
      <DialogContent hideClose={true} className="bg-transparent outline-none shadow-none border-none">
        <div className="flex place-content-center">
          <DialogTitle className="font-mono">Loading test data, dont be a bitch...</DialogTitle>
        </div>
        {children ?? <Loading loaderSize={"2.5rem"} />}
      </DialogContent>
    </Dialog>
  );
};
