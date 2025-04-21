// pages/auth/login.tsx
import { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (data.success) {
                toast({
                    title: "Login successful.",
                    description: "Welcome back!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });

                // Redirect to the home page or any other page after successful login
                router.push("/");
            } else {
                toast({
                    title: "Login failed.",
                    description: data.error || "Please check your credentials.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: "Error.",
                description: "Something went wrong.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={4} maxW="400px" mx="auto" mt={10} borderWidth={1} borderRadius="md">
            <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        mb={4}
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        mb={4}
                    />
                </FormControl>
                <Button type="submit" colorScheme="teal" isFullWidth isLoading={loading}>
                    Login
                </Button>
            </form>
            <Text mt={4} textAlign="center">
                Don't have an account?{" "}
                <Button variant="link" onClick={() => router.push("/auth/register")}>
                    Register here
                </Button>
            </Text>
        </Box>
    );
};

export default Login;
