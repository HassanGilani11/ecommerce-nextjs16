import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Construction } from "lucide-react"

export default function MaintenancePage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-center">
                    <div className="h-20 w-20 rounded-[2.5rem] bg-zinc-900 flex items-center justify-center shadow-xl shadow-zinc-200">
                        <Construction className="h-10 w-10 text-white" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black tracking-tighter text-zinc-900 lowercase">
                        Maintenance Mode
                    </h1>
                    <p className="text-zinc-500 font-medium leading-relaxed">
                        We're currently performing some scheduled maintenance to improve your experience. We'll be back online shortly!
                    </p>
                </div>

                <div className="pt-4">
                    <Link href="/">
                        <Button className="rounded-2xl h-12 px-8 font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-zinc-200 transition-all hover:scale-105 active:scale-95">
                            Try Refreshing
                        </Button>
                    </Link>
                </div>

                <div className="pt-8 border-t border-zinc-100 flex justify-center gap-6">
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                        Support: admin@example.com
                    </div>
                </div>
            </div>
        </div>
    )
}
