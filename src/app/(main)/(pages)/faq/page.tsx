import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const FAQS = [
    {
        question: "How should I care for my garments?",
        answer: "Most of our cotton and linen items are machine washable on a cold, gentle cycle. We recommend air drying to preserve the life of the fibers and maintain the garment's shape. Leather items should be professionally cleaned."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for all unworn, unwashed items in their original packaging. Returns are free for domestic orders. International returns may incur a shipping fee."
    },
    {
        question: "When will my order ship?",
        answer: "Standard orders ship within 2 business days. Express orders placed before 12 PM EST are shipped the same day. You will receive a tracking number via email once your order has left our studio."
    },
    {
        question: "Do you offer international shipping?",
        answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and estimated delivery times are calculated at checkout based on your location."
    },
    {
        question: "How do I find my size?",
        answer: "Each product page features a detailed size guide with specific measurements. Our pieces are typically designed with a modern, relaxed fit. If you're between sizes, we recommend sizing down for a more tailored look."
    }
]

export default function FAQPage() {
    return (
        <div className="container mx-auto py-12 sm:py-24 max-w-3xl space-y-12">
            <div className="space-y-4 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">Common Questions</h1>
                <p className="text-muted-foreground text-lg">Everything you need to know about our products and services.</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b border-secondary py-2">
                        <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline hover:text-primary transition-colors py-4">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed text-base pt-2 pb-6">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            <div className="mt-16 p-8 bg-secondary/20 rounded-3xl text-center space-y-4">
                <h3 className="text-xl font-bold tracking-tight">Still have questions?</h3>
                <p className="text-muted-foreground">Our support team is available Monday through Friday, 9am - 6pm EST.</p>
                <div className="pt-4">
                    <a href="/contact" className="text-primary font-bold uppercase tracking-widest text-sm hover:underline">Contact Support</a>
                </div>
            </div>
        </div>
    )
}
