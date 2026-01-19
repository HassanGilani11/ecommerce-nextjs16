"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"
import { Suspense } from "react"

function AuthErrorContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const errorCode = searchParams.get('error_code')
    const errorDescription = searchParams.get('error_description')

    const isExpired = errorCode === 'otp_expired' || errorDescription?.toLowerCase().includes('expired')

    return (
        <div className="container relative min-h-[calc(100vh-8rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0 py-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
                <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-xl overflow-hidden">
                    <div className="h-2 bg-rose-500 w-full" />
                    <CardHeader className="space-y-1 text-center pt-8">
                        <div className="mx-auto h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center mb-4">
                            <AlertCircle className="h-6 w-6 text-rose-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900">
                            {isExpired ? "Link Expired" : "Authentication Error"}
                        </CardTitle>
                        <CardDescription className="text-zinc-500 font-medium px-4">
                            {isExpired
                                ? "The security link you clicked has expired or has already been used."
                                : errorDescription || "We encountered an issue while verifying your secondary security code."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Error Details</p>
                            <p className="text-xs font-mono text-zinc-600 break-all leading-relaxed">
                                {errorCode}: {errorDescription || "Unknown authentication failure"}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm text-zinc-600 leading-relaxed text-center px-2">
                                For security reasons, invitation and password reset links are only valid for a short period.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3 pb-8">
                        <Button asChild className="w-full h-11 rounded-xl font-bold uppercase tracking-widest text-[11px] gap-2 shadow-lg shadow-rose-500/10 transition-all hover:scale-[1.02]">
                            <Link href="/login">
                                <RefreshCw className="h-3.5 w-3.5" />
                                Try Login
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full h-11 rounded-xl font-bold uppercase tracking-widest text-[11px] gap-2 text-zinc-500 hover:text-zinc-900">
                            <Link href="/">
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back to Home
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    NextGen E-Commerce Identity Service
                </p>
            </div>
        </div>
    )
}

export default function AuthCodeErrorPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
            </div>
        }>
            <AuthErrorContent />
        </Suspense>
    )
}
