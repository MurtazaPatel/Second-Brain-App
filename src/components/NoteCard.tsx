import { DocumentTextIcon, MicrophoneIcon, PhotoIcon, ShareIcon } from "@heroicons/react/24/outline"
import { TrashIcon } from "@heroicons/react/24/outline"
import type { Icon } from "./Button";
import {  AiOutlineInstagram, AiOutlineX, AiOutlineYoutube } from "react-icons/ai";
import type { ReactElement } from "react";


interface CardProps {
    title: string;
    titleIcon: string;
    body: {
        type: string
        link:string,
    };
    tags: string[];
    date: Date;
}
type TitleIcons = Record<string,Icon>


let titleIcon: TitleIcons = {
    "article": DocumentTextIcon,
    "video": AiOutlineYoutube,
    "tweet": AiOutlineX,
    "image":PhotoIcon,
    "audio":MicrophoneIcon,
    "instaPost":AiOutlineInstagram
}



const iconStyle = "text-gray-400 h-4 w-4 "
const defaultIconStyle = "h-6 w-6 flex justify-center items-center cursor-pointer rounded-md transition-all duration-300 hover:bg-gray-400  hover:bg-opacity-15"
 
const getYouTubeEmbedUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
  
      // Handle youtu.be URLs (e.g., https://youtu.be/hv3GKosCnn4?si=...)
      if (urlObj.hostname === "youtu.be") {
        const videoId = urlObj.pathname.slice(1); // Extract video ID from path (e.g., hv3GKosCnn4)
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
  
      // Handle www.youtube.com URLs (e.g., https://www.youtube.com/watch?v=hv3GKosCnn4)
      if (urlObj.hostname === "www.youtube.com" || urlObj.hostname === "youtube.com") {
        const videoId = urlObj.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
  
      // Fallback to original URL if not recognized
      return url;
    } catch {
      // Return original URL if parsing fails
      return url;
    }
  };

  // Helper function to load Twitter widgets script and process tweets


export function NoteCard(props: CardProps) {
    const Tags: string[] = props.tags.map((tag) => {
        return "#" + tag + " ";
    })
    const TitleIcon = titleIcon[props.titleIcon as string]
    const _date: string = props.date?.toDateString() as string

    const renderBody = (): ReactElement => {
        switch (props.body.type) {
          case "video":
                
            return (
              <iframe
                className="w-full h-40"
                src={getYouTubeEmbedUrl(props.body.link)}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            );
          case "tweet":
            return (
                <div>
                <blockquote className="twitter-tweet h-4" data-dnt="true">
                  <a href={props.body.link.replace("x.com","twitter.com")}></a>
                </blockquote>
                <div className="text-gray-400 text-sm">
                  {props.body.link.startsWith("https://x.com/") || props.body.link.startsWith("https://twitter.com/")
                    ? "Loading tweet..."
                    : "Invalid tweet URL"}
                </div>
              </div>
            );
          case "image":
            return <img src={props.body.link} alt={props.title} className="w-full h-40 object-cover" />;
          case "audio":
            return <audio controls src={props.body.link} className="w-full" />;
          default:
            return <div>Unsupported content type</div>;
        }
      };
  
    

    return <div className=" relative w-full h-[400px] max-w-[300px] p-4 rounded-2xl border-2 shadow-lg 
  flex flex-col justify-between items-center gap-4 
  transition-all duration-300 hover:shadow-2xl 
  backdrop-blur-sm bg-white/10 overflow-auto" >
        <div className="flex justify-between w-full items-center gap-3  mt-1 ">
            <div className="  flex justify-center items-center ">
                <div>
                    <TitleIcon className="text-gray-600 h-5 w-5" />
                </div>
                <div className="translate-x-2 text-lg font-medium">
                    {props.title}
                </div>
            </div>
            <div className="flex justify-end gap-2 w-[30%] ">
                <span className={defaultIconStyle}>
                   <a href={props.body.link} target="_blank" >
                   <ShareIcon className={iconStyle} />
                   </a>
                </span>
                <span className={defaultIconStyle}>
                    <TrashIcon className={iconStyle} />
                </span>
            </div>
        </div>
        <div className="w-fit flex flex-col justify-between items-center gap-3">
            <div >
            {renderBody()}
           </div>
            <span className="flex gap-2">

                {Tags.map((tag) => {
                    return <div className="rounded-2xl text-[12px] bg-purple-300 text-purple-500 py-1 px-[10px] w-fit  ">
                        {tag}
                    </div>
                })}
            </span>
        </div>
        <div className="text-gray-400 text-sm">
            Added on {_date}
        </div>
    </div>
}




