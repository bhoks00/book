import { useQuery } from "@tanstack/react-query";

import axios from 'axios'
export const axiosInstance = axios.create({
    baseURL:`${process.env.NEXT_PUBLIC_API_URL}`,
    withCredentials: true,

})





export const useFetchData = (path:string,key:string,gcTime?:number, staleTime?:number)=>{
    return useQuery({
    queryKey:[key],

    queryFn: async()=>{
        const response = await axiosInstance.get(path)
        console.log("DEBUG : response = ",response.data)
        return response.data
    },
    gcTime:gcTime?gcTime:2000,
    staleTime:staleTime?staleTime:2000,
    
})
}

import { useMutation } from "@tanstack/react-query"

export const useMutateData = (path:string,key:string)=>{
    return useMutation({
        mutationKey:[key],
        mutationFn:async(body)=>{
            const response = await axiosInstance.post(path,body)
            console.log("DEBUG : response = ",response.data)
            return response.data         
        }
        
            
    })
}


export const usePatchData = (path:string,key:string)=>{
    return useMutation({
        mutationKey:[key],
        mutationFn:async(body)=>{
            const response = await axiosInstance.patch(path,body)
            console.log("DEBUG : response = ",response.data)
            return response.data         
        }
            
    })
}



export const useDeleteData = (path:string,key:string)=>{
    return useMutation({
        mutationKey:[key],
        mutationFn:async(body)=>{
            const response = await axiosInstance.delete(path)
            console.log("DEBUG : response = ",response.data)
            return response.data         
        }
            
    })
}