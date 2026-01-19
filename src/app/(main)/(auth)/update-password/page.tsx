"use client"

import Link from "next/link"
import { useActionState, useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { ArrowLeft, Loader2, Lock } from "lucide-react"
import { updatePassword } from "./actions"
import { createClient } from "@/lib/supabase/client"

const initialState: { error?: string; success?: string } = {}

export default function UpdatePasswordPage() {
    const [state, action, isPending] = useActionState(updatePassword, initialState)
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isExchanging, setIsExchanging] = useState(true)

    useEffect(() => {
        const checkSession = async () => {
            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                // If no session, check if we have a hash fragment (sometimes used by Supabase magic links)
                // But for PKCE flow with server callback, we should have a cookie session by now.
                toast.error("Session invalid or expired. Please request a new link.")
                router.push('/forgot-password')
            } else {
                setIsExchanging(false)
            }
        }
        checkSession()
    }, [router])


    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }
        if (state?.success) {
            toast.success(state.success)
            setTimeout(() => {
                router.push("/login")
            }, 2000)
        }
    }, [state, router])

    if (isExchanging) {
        return (
            <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="container relative min-h-[calc(100vh-8rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0 py-8 sm:py-12">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-xl">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-3xl font-bold tracking-tighter">New Password</CardTitle>
                        <CardDescription>
                            Enter your new password below to secure your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={action} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="pl-9 h-11 rounded-xl bg-background/50"
                                        disabled={isPending}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        className="pl-9 h-11 rounded-xl bg-background/50"
                                        disabled={isPending}
                                    />
                                </div>
                            </div>
                            <Button className="w-full h-11 rounded-xl font-bold uppercase tracking-widest text-xs mt-2" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Password"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-xs hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="h-3 w-3" />
                            Back to login
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
