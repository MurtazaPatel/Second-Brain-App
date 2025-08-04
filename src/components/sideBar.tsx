import { DocumentTextIcon, HashtagIcon, MicrophoneIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { AiOutlineInstagram, AiOutlineX, AiOutlineYoutube } from "react-icons/ai";
import { LuBrain } from "react-icons/lu";

const IconStyle= "h-6 w-6"

const sideBarItems = [
    { name: "Tweets" , icon:<AiOutlineX className={IconStyle}/>},
    { name: "Videos" , icon:<AiOutlineYoutube className={IconStyle}/>},
    { name: "Documents" , icon:<DocumentTextIcon className={IconStyle}/>},
    { name: "Articles" , icon:<PhotoIcon className={IconStyle}/>},
    { name: "Audio" , icon:<MicrophoneIcon className={IconStyle}/>},
    { name: "Instagram Posts" , icon:<AiOutlineInstagram className={IconStyle}/>},
    { name: "Tags" , icon:<HashtagIcon className={IconStyle}/>}
]

export function SideBar(){
    return <div className="h-screen w-72  bg-white border-r fixed left-0 top-0 ">
        <div className="flex flex-col h-full gap-2">
        <div className="flex items-center justify-center m-4 gap-2 cursor-pointer ">
            <LuBrain className="h-10 w-10 text-purple-500" />
            <p className="text-2xl text-black font-semibold"> Second Brain</p>
        </div>
        <div className="flex flex-col">
           
            {sideBarItems.map((item) => {
                return (
                    <div className="flex justify-start items-center gap-4 p-4 cursor-pointer hover:bg-gray-100 transition-all duration-300">
                        {item.icon}
                        <span className="text-lg text-gray-800 font-light">{item.name}</span>
                    </div>
                )

            }    
            )}
            </div>
        </div>
    </div>
}