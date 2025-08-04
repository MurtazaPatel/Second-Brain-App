import axios from "axios";
import { useEffect, useState } from "react";


export type content = {
    _id:  string;
    type: string;
    link: string;
    title: string;
    tags: customTag[];

}

export type customTag = {
    _id:  string;
    title: string
}

export   function useContent(){
    const [contents, SetContents] = useState([])
    const token = localStorage.getItem("token")

    function refresh(){
        axios.get("/api/v1/content/",{
            headers:{
                "Authorization":token
            }
        }).then((res)=>{
            SetContents(res.data.contents)
        })
    }

    useEffect(()=>{
        refresh()
       const interval = setTimeout(refresh,10000)
       return () => clearInterval(interval)
    },[])
    return contents
}