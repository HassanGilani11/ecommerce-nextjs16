import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="container mx-auto py-12 sm:py-20 grid lg:grid-cols-2 gap-16 sm:gap-24">
            {/* Contact Info */}
            <div className="space-y-8 sm:space-y-12">
                <div className="space-y-4">
                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tighter">Get in touch.</h1>
                    <p className="text-muted-foreground text-lg">
                        Have a question about an order or want to collaborate? We'd love to hear from you.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                            <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Email</p>
                            <p className="text-lg">support@avant-garde.com</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                            <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Phone</p>
                            <p className="text-lg">+1 (555) 123-4567</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                            <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Studio</p>
                            <p className="text-lg">123 Minimalist Way, Design District, NY 10001</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Form */}
            <div className="bg-secondary/20 p-8 sm:p-12 rounded-3xl border border-secondary">
                <form className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</label>
                            <Input placeholder="John Doe" className="bg-transparent border-t-0 border-x-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary border-muted" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                            <Input placeholder="john@example.com" type="email" className="bg-transparent border-t-0 border-x-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary border-muted" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message</label>
                        <Textarea placeholder="How can we help?" className="min-h-[150px] bg-transparent border-t-0 border-x-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary border-muted resize-none" />
                    </div>
                    <Button className="w-full rounded-full h-12 text-sm font-bold uppercase tracking-widest">Send Message</Button>
                </form>
            </div>
        </div>
    )
}
