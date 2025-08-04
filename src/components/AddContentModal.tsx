import { MinusIcon, PaperAirplaneIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "./Button";
import { useRef, useState } from "react";
import { InputBox } from "./InputBox";
import { LuBrain } from "react-icons/lu";
import axios from "axios";


interface AddContentModalProps {
  open: boolean;
  onClose: () => void;
}



//controlled component
export function AddContentModal({ open, onClose }: AddContentModalProps) {

  const [tags, setTags] = useState(['']);
  const handleAddTag = () => {
    setTags([...tags, '']);
  };
  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((tag, i) => i !== index));
  };


  const titleRef = useRef<HTMLInputElement>(null)
  const BodyTypeRef = useRef<HTMLInputElement>(null)
  const LinkRef = useRef<HTMLInputElement>(null)
  const TagsRef = useRef<(HTMLInputElement | null)[]>([]);
  const DateRef = useRef<HTMLInputElement>(null);

  async function handleSubmit() {
    const title = titleRef.current?.value;
    const bodyType = BodyTypeRef.current?.value;
    const link = LinkRef.current?.value;
    const tags = TagsRef.current?.map((input) => input?.value).filter(Boolean);
    const token = localStorage.getItem("token");

    if (!title || !bodyType || !link || !tags) {
      alert("Please fill all the fields");
      return;
    }

    try {
      const res = await axios.post("/api/v1/content/", {
        type: bodyType,
        title,
        link,
        tags,
      }, {
        headers: {
          authorization: token,
        },
      });

      if (res.status === 200) {
        alert(res.data);
        console.log("success ");
        onClose();
      } else if (res.status === 403) {
        alert("Similar Link exists !!");
        console.log("Similar Link exists !!" );
      } else if (res.status === 400) {
        alert("Something went wrong while creating new content !!");
        console.log("Something went wrong while creating new content !!");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative bg-white w-[700px] max-h-[600px] overflow-auto rounded-md p-6 shadow-lg">
            <div className="flex justify-end">
              <div className="flex items-center justify-center gap-2 mb-4 w-[90%]" >
                <LuBrain className="h-10 w-10 text-purple-500" />
                <span className="font-semibold text-xl">
                  Add Content
                </span>
              </div>
              <Button
                variant="secondary"
                startIcon={XMarkIcon}
                onClick={onClose}
                className="mb-4" text={""} />
            </div>
            <div className="flex flex-col gap-4">
              <InputBox type="text" placeholder="Title" ref={titleRef} />
              <InputBox type="text" placeholder="Body Type"   ref={BodyTypeRef} />
              <InputBox type="text" placeholder="Link"  ref={LinkRef}  />
              <div className="flex flex-col gap-2">
                {tags.map((tag, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <InputBox
                      type="text"
                      placeholder="Tag"
                      value={tag}
                      onChange={(e) =>
                        setTags(
                          tags.map((t, i) => (i === index ? e.target.value : t))
                        )
                      }
                      ref={(el :HTMLInputElement) => (TagsRef.current[index] = el)}
                    />
                    {tags.length > 1 && (
                      <Button
                        variant="secondary"
                        startIcon={MinusIcon}
                        onClick={() => handleRemoveTag(index)} text={"Remove"} />
                    )}
                  </div>
                ))}
                <Button
                  variant="primary"
                  startIcon={PlusIcon}
                  onClick={handleAddTag} text={""} />
              </div>
              <InputBox type="date" placeholder="Date"  ref={DateRef}/>
            </div>
            <div className="mt-6 flex justify-center text-center">
              <Button
                variant="primary"
                onClick={handleSubmit}
                text="Submit"
                startIcon={PaperAirplaneIcon}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
