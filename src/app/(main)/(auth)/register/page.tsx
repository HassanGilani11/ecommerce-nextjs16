import Link from "next/link"
import { getSettings } from "@/actions/get-settings"
import { RegisterForm } from "./register-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { UserX } from "lucide-react"

export default async function RegisterPage() {
    const settings = await getSettings()
    const isRegistrationEnabled = settings?.enable_registration

    return (
        <div className="container relative min-h-[calc(100vh-8rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0 py-8 sm:py-12">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                {isRegistrationEnabled ? (
                    <RegisterForm />
                ) : (
                    <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-xl py-8">
                        <CardHeader className="text-center space-y-4">
                            <div className="mx-auto h-16 w-16 rounded-[2rem] bg-zinc-100 flex items-center justify-center">
                                <UserX className="h-8 w-8 text-zinc-400" />
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-black tracking-tight">Registration Closed</CardTitle>
                                <CardDescription className="font-medium">
                                    Account creation is currently disabled by the administrator.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Please check back later or contact support if you have any questions.
                            </p>
                            <div className="mt-8">
                                <Link href="/" className="text-xs font-bold uppercase tracking-widest bg-zinc-900 text-white px-8 py-3 rounded-2xl hover:bg-zinc-800 transition-colors shadow-lg">
                                    Return Home
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

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
