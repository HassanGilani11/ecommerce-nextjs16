"use client"

import * as React from "react"
import Link from "next/link"
import { useActionState } from "react"
import { register } from "./actions"
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
import { AlertCircle, Loader2 } from "lucide-react"

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(register, null)

    return (
        <div className="container relative min-h-[calc(100vh-8rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0 py-8 sm:py-12">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-xl">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-3xl font-bold tracking-tighter">Create Account</CardTitle>
                        <CardDescription>
                            Join our community of minimalist enthusiasts
                        </CardDescription>
                    </CardHeader>
                    <form action={formAction}>
                        <CardContent className="grid gap-4">
                            {state?.error && (
                                <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-start gap-2 text-rose-600 text-xs font-medium animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    {state.error}
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    className="h-11 rounded-xl bg-background/50"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="h-11 rounded-xl bg-background/50"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="h-11 rounded-xl bg-background/50"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-11 rounded-xl font-bold uppercase tracking-widest text-xs mt-2"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                            <div className="relative mt-2">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-muted-foreground/20" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-transparent px-2 text-muted-foreground">
                                        Or sign up with
                                    </span>
                                </div>
                            </div>
                            <Button variant="outline" type="button" className="w-full h-11 rounded-xl font-semibold bg-background/40">
                                Github
                            </Button>
                        </CardContent>
                    </form>
                    <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground">
                        Already have an account?
                        <Link
                            href="/login"
                            className="font-semibold text-primary hover:underline underline-offset-4"
                        >
                            Log in
                        </Link>
                    </CardFooter>
                </Card>
                <p className="px-8 text-center text-xs text-muted-foreground leading-relaxed italic">
                    By clicking "Create Account", you agree to our{" "}
                    <Link
                        href="/terms"
                        className="underline underline-offset-4 hover:text-primary transition-colors"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy"
                        className="underline underline-offset-4 hover:text-primary transition-colors"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    )
}
