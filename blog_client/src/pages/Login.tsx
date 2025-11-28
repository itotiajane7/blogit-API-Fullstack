import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useMutation } from "@tanstack/react-query";
import api from "../lib/api";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { Spinner } from "../components/ui/spinner";
import useUserStore from '../store/useAuthStore';

interface UserInformation{
  emailAddress: string,
  password:string
}

const LoginForm = ()=>{
    const [emailAddress, setEmailAddress]=useState("")
    const [password, setPassword]=useState("")
    const [errorMsg, setErrorMsg]=useState("")
    
    const loginMutation = useMutation<any,any,UserInformation>({
        mutationKey:[`login-user-key`],
        mutationFn: async (payload:UserInformation)=>{
            const res = await api.post("/auth/login",payload);
            return res.data;
        },
        onSuccess: (data)=>{
            setEmailAddress("");
            setPassword("");
            setErrorMsg("");
            useUserStore.getState().setUser(data.data); 
        },
        onError: (error:any)=>{
            const serverMessage = error?.response?.data;
            const derivedMessage =
              serverMessage?.message ||
              serverMessage?.error ||
              serverMessage?.errors?.[0]?.message ||
              error?.message;
            setErrorMsg(derivedMessage || `Something Went Wrong During Login`)
          },
    })
    
    const handleSubmit =(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(!emailAddress || !password){
            setErrorMsg(`Please Provide All Data `)
            return
        }
        setErrorMsg("");

        loginMutation.mutate({
            emailAddress,
            password
        });
    };
    
    return (
        <>
        <div className='mt-20'>
            <Card className="w-full max-w-sm mx-auto">
                <form onSubmit={handleSubmit}>
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-center text-2xl font-semibold" >Login User</CardTitle>
                        <CardDescription>
                            {errorMsg && (
                                <Alert className="text-red-600 text-xl text-center mb-2.5">
                                    <AlertTitle>Oh no!</AlertTitle>
                                    <AlertDescription className="text-red-600 text-xl text-center">
                                        {errorMsg}
                                    </AlertDescription>
                                </Alert>
                            )}
                        {loginMutation.isPending && (
                          <div className="flex justify-center items-center">
                        <Spinner className="size-20" />
                         </div>
                         )}
                         
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                        <Input type="text" value={emailAddress} onChange={(e)=>(setEmailAddress(e.target.value))} placeholder="Email Address" />
                        <Input type="password" value={password} onChange={(e)=>(setPassword(e.target.value))} placeholder="Password" />
                        </div>
                        
                    </CardContent>
                    <CardFooter>
                        <Button className='w-full py-2 mt-5' type='submit' disabled={loginMutation.isPending}>
                        {loginMutation.isPending ? "Logging In..." : "Login"}
                      </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
        </>
    )
}

export default LoginForm;