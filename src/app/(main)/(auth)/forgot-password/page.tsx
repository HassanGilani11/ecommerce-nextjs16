"use client"

import Link from "next/link"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Mail } from "lucide-react"
import { forgotPassword } from "./actions"

const initialState: { error?: string; success?: string } = {}

export default function ForgotPasswordPage() {
    const [state, action, isPending] = useActionState(forgotPassword, initialState)

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }
        if (state?.success) {
            toast.success(state.success)
        }
    }, [state])

    return (
        <div className="container relative min-h-[calc(100vh-8rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0 py-8 sm:py-12">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-xl">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex justify-center mb-4">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                            >
                                <ArrowLeft className="h-3 w-3" />
                                Back to login
                            </Link>
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tighter">Reset Password</CardTitle>
                        <CardDescription>
                            Enter your email and we'll send you a link to reset your password
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={action} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        className="pl-9 h-11 rounded-xl bg-background/50"
                                        disabled={isPending}
                                    />
                                </div>
                            </div>
                            <Button className="w-full h-11 rounded-xl font-bold uppercase tracking-widest text-xs mt-2" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground">
                        Remembered your password?
                        <Link
                            href="/login"
                            className="font-semibold text-primary hover:underline underline-offset-4"
                        >
                            Log in
                        </Link>
                    </CardFooter>
                </Card>
                <p className="px-8 text-center text-xs text-muted-foreground leading-relaxed italic">
                    If you don't receive an email within a few minutes, please check your spam folder or try again.
                </p>
            </div>
        </div>
    )
}
