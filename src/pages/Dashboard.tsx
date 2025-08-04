
import { PlusIcon, ShareIcon } from "@heroicons/react/24/outline";
import { Button, type Icon } from "../components/Button";
import { NoteCard } from "../components/NoteCard";
import { SideBar } from "../components/sideBar";
import { AddContentModal } from "../components/AddContentModal";
import { ShareLinkModal } from "../components/ShareLinkModal";
import { useState } from "react";
import { useContent, type content, type customTag } from "../hooks/useContent";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function DashBoard() {
  const [shareOpen, setShareOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  async function handleShare() {
    setIsSharing(true);
    try {
      const res = await axios.post(
        "/api/v1/brain/share",
        { share: true },
        { headers: { Authorization: localStorage.getItem("token")} }
      );

      if (res.status === 200 && res.data?.link) {
        setShareLink(`${BACKEND_URL}/api/v1/brain/${res.data.link}`);
        setShareOpen(true);
      } else {
        alert("Unexpected response from server.");
      }
    } catch (error: any) {
      if (error) {
        if (error.response.status === 403) {
          alert("Unauthorized access. Please check your credentials.");
        } else if (error.response.status === 400) {
          alert("Bad request. Please try again.");
        } else {
          alert("Oops, something went wrong! "+ error.response);
        }
      } else {
        alert("Network error. Please check your connection.");
      }
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br  to-purple-50">
      <div className="w-72 bg-white shadow-md border-r transition-shadow duration-200 hover:shadow-lg">
        <SideBar />
      </div>
      <AddContentModal open={addOpen} onClose={() => setAddOpen(false)} />
      <ShareLinkModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        link={shareLink}
      />
      <div className="flex flex-col flex-grow overflow-hidden">
        <div className="flex justify-end gap-3 p-4 bg-white shadow-sm border-b sticky top-0 z-10">
          <Button
            text="Share Brain"
            variant="secondary"
            onClick={handleShare}
            startIcon={ShareIcon}
            loading={isSharing}
            aria-label="Share Brain"
          />
          <Button
            text="Add content"
            variant="primary"
            onClick={() => {
              setAddOpen(true);
              console.log("Add content...");
            }}
            startIcon={PlusIcon}
            aria-label="Add content"
          />
        </div>
        <ContentArea />
      </div>
    </div>
  );
}

function ContentArea() {
  const contents: content[] = useContent();
  const date = new Date();

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto bg-transparent">
      {contents && contents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white p-4 rounded-md shadow-md">
          {contents.map((content: content, index: number) => (
            <div
              key={content._id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <NoteCard
                title={content.title}
                titleIcon={content.type}
                body={{ type: content.type, link: content.link }}
                date={date}
                tags={
                  Array.isArray(content.tags)
                    ? (content.tags as customTag[]).map((tag) => tag.title ?? "")
                    : []
                }
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <p className="text-lg font-medium">No content available</p>
          <p className="text-sm">Click "Add content" to start adding notes!</p>
        </div>
      )}
    </div>
  );
}
