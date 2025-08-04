import { EyeIcon, EyeSlashIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "../components/Button";
import { InputBox } from "../components/InputBox";
import { LuBrain, LuLogIn } from "react-icons/lu";
import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";



export function Signup() {

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate()

    async function signup(){
        
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
       
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`,
               { 
                    username: username,
                    password: password
                }
            )
        if(response.status === 200){
            alert("Signup successful")
            navigate("/signin")
        } else if(response.status === 403){
            alert("User with the given Username already exists, please signin!!")
        }else{
            alert("Something went wrong")
        }
            
       
       
     
    }


    return <div className="h-screen w-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 min-h-[300px] w-[400px] rounded-lg shadow-md flex flex-col gap-4">
            <span className="font-bold text-2xl flex gap-3 -translate-x-2 justify-center items-center pb-3">
                <LuBrain className="h-10 w-10 text-purple-500" />
                Sign Up
            </span>
            <InputBox type="text" placeholder="Username" ref={usernameRef}/>
            <div className="relative">
                <InputBox type="password" placeholder="Password" ref={passwordRef} />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 text-gray-400 hover:text-gray-900 flex items-center"
                    onClick={() => {
                        const input = document.querySelector<HTMLInputElement>('.relative input')!;
                        input.type = input.type === 'password' ? 'text' : 'password';
                        const eyeIcon = document.querySelector<SVGSVGElement>('.relative svg')!;
                        eyeIcon.classList.toggle('hidden');
                        const eyeSlashIcon = document.querySelector<SVGSVGElement>('.relative svg + svg')!;
                        eyeSlashIcon.classList.toggle('hidden');
                    }}
                >
                    <EyeIcon className="h-6 w-6 pb-1" />
                    <EyeSlashIcon className="h-6 w-6 pb-1 hidden" />
                </button>
            </div>
            <Button text="Sign up" variant="primary" onClick={signup} startIcon={UserCircleIcon} loading={false} />
            <div className="flex flex-col items-center gap-1 w-full justify-center">
               <div className="text-md font-light">
              Alreadt have a Second Brain ?
                </div> 
                <div>
                <Button text="Sign in" variant="primary" startIcon={LuLogIn} onClick={()=>{navigate("/signin")}}/>
                </div>
            </div>
        </div>
    </div>
}
