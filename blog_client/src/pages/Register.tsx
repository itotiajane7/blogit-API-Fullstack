import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { Spinner } from "../components/ui/spinner";
import api from "../lib/api";

interface UserInformation {
  firstName: string;
  lastName: string;
  emailAddress: string;
  username: string;
  password: string;
}

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const registerMutation = useMutation({
    mutationKey: ["register-user"],
    mutationFn: async (payload: UserInformation) => {
      const res = await api.post("/auth/register", payload);
      return res.data;
    },
    onSuccess: () => {
      
      setFormData({
        firstName: "",
        lastName: "",
        emailAddress: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
      
      localStorage.setItem("hasRegistered", "true");
      
      navigate("/login");
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data;
      const derivedMessage =
        serverMessage?.message ||
        serverMessage?.error ||
        serverMessage?.errors?.[0]?.message ||
        error?.message;
      setErrorMsg(derivedMessage || "Something went wrong");
    },
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { firstName, lastName, emailAddress, username, password, confirmPassword } = formData;

    
    if (!firstName || !lastName || !emailAddress || !username || !password || !confirmPassword) {
      setErrorMsg("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setErrorMsg("");
    registerMutation.mutate({ firstName, lastName, emailAddress, username, password });
  };

  return (
    <div className="mt-10 flex justify-center">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold">Register</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Fill in your details to create an account
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            {errorMsg && (
              <Alert className="text-red-600">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}

            {registerMutation.isPending && (
              <div className="flex justify-center">
                <Spinner className="size-8" />
              </div>
            )}

            <Input
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
            <Input
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.emailAddress}
              onChange={(e) => handleChange("emailAddress", e.target.value)}
            />
            <Input
              placeholder="Username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "Registering..." : "Register"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Register;
