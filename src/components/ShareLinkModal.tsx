import { LuBrain } from "react-icons/lu";
import { Button } from "./Button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

interface ShareLinkModalProps {
  open: boolean;
  onClose: () => void;
  link:string;
}

export function ShareLinkModal({ open, onClose, link }: ShareLinkModalProps) {
  function handleCopy() {
    navigator.clipboard.writeText(link).then(
      () => {
        alert("Link copied to clipboard!");
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  }


  return (
    <div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative bg-white w-[700px] max-h-[600px] overflow-auto rounded-md p-6 shadow-lg">
            <div className="flex justify-end">
              <div className="flex items-center justify-center gap-2 mb-4 w-[90%]">
                <LuBrain className="h-10 w-10 text-purple-500" />
                <span className="font-semibold text-xl">Share Content</span>
              </div>
              <Button
                variant="secondary"
                startIcon={XMarkIcon}
                onClick={onClose}
                className="mb-4"
                text=""
              />
            </div>
            <div className="flex flex-col gap-4">
              Share Link: {link}
            </div>
            <div className="mt-6 flex justify-center text-center">
              <Button
                variant="secondary"
                onClick={handleCopy}
                text="Copy"
                startIcon={DocumentDuplicateIcon}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
