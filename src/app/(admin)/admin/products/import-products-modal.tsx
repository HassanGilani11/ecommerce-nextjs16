"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Upload,
    FileText,
    AlertCircle,
    CheckCircle2,
    Loader2,
    X,
    Table as TableIcon
} from "lucide-react"
import { importProductsFromCSV } from "./import-export-actions"
import { toast } from "sonner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface ImportProductsModalProps {
    onSuccess?: () => void
}

export function ImportProductsModal({ onSuccess }: ImportProductsModalProps) {
    const [open, setOpen] = React.useState(false)
    const [step, setStep] = React.useState<"select" | "preview" | "uploading" | "result">("select")
    const [file, setFile] = React.useState<File | null>(null)
    const [previewData, setPreviewData] = React.useState<any[]>([])
    const [headers, setHeaders] = React.useState<string[]>([])
    const [isImporting, setIsImporting] = React.useState(false)
    const [importResult, setImportResult] = React.useState<{ message: string, errors: string[] } | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const reset = () => {
        setStep("select")
        setFile(null)
        setPreviewData([])
        setHeaders([])
        setImportResult(null)
        setIsImporting(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return
        if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
            toast.error("Please select a valid CSV file.")
            return
        }

        setFile(selectedFile)
        parsePreview(selectedFile)
    }

    const parsePreview = (file: File) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target?.result as string
            const lines = text.split(/\r?\n/).filter(line => line.trim())
            if (lines.length < 1) {
                toast.error("CSV file is empty.")
                return
            }

            // Simple CSV parser for preview (same logic as server)
            const getValues = (line: string) => {
                const result = []
                let current = ""
                let inQuotes = false
                for (let i = 0; i < line.length; i++) {
                    const char = line[i]
                    if (char === '"') {
                        if (inQuotes && line[i + 1] === '"') {
                            current += '"'
                            i++
                        } else {
                            inQuotes = !inQuotes
                        }
                    } else if (char === ',' && !inQuotes) {
                        result.push(current)
                        current = ""
                    } else {
                        current += char
                    }
                }
                result.push(current)
                return result
            }

            const headerRow = getValues(lines[0]).map(h => h.trim().replace(/"/g, ''))
            const dataRows = lines.slice(1).map(line => {
                const values = getValues(line)
                const row: any = {}
                headerRow.forEach((h, i) => { row[h] = values[i] })
                return row
            })

            setHeaders(headerRow)
            setPreviewData(dataRows)
            setStep("preview")
        }
        reader.readAsText(file)
    }

    const handleImport = async () => {
        if (!file) return
        setIsImporting(true)
        setStep("uploading")

        const reader = new FileReader()
        reader.onload = async (e) => {
            const text = e.target?.result as string
            try {
                const result = await importProductsFromCSV(text)
                if (result.success) {
                    setImportResult({ message: result.message, errors: result.errors || [] })
                    setStep("result")
                    onSuccess?.()
                } else {
                    toast.error(result.error || "Failed to import products")
                    setStep("preview")
                }
            } catch (err) {
                toast.error("An error occurred during import")
                setStep("preview")
            } finally {
                setIsImporting(false)
            }
        }
        reader.readAsText(file)
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (!val) reset()
        }}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="h-12 rounded-2xl gap-2 border-zinc-200 hover:bg-zinc-50 font-semibold px-4"
                >
                    <Upload className="h-4 w-4" />
                    Import CSV
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-6xl rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden">
                <DialogHeader className="p-8 bg-zinc-50 border-b border-zinc-100">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-lg">
                            <Upload className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black tracking-tight">Import Products</DialogTitle>
                            <DialogDescription className="text-zinc-500 font-medium">Bulk upload your product catalog via CSV file.</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {step === "select" && (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-zinc-200 rounded-[3rem] p-10 sm:p-20 text-center hover:bg-zinc-50/50 transition-all cursor-pointer group bg-zinc-50/20"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".csv"
                                onChange={handleFileChange}
                            />
                            <div className="h-24 w-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500 shadow-sm border border-zinc-100">
                                <FileText className="h-10 w-10 text-zinc-900" />
                            </div>
                            <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Drop your CSV here</h3>
                            <p className="text-zinc-500 mt-2 font-medium">Or click to browse files from your computer</p>
                        </div>
                    )}

                    {step === "preview" && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-zinc-900">
                                    <TableIcon className="h-5 w-5 text-zinc-400" />
                                    <h3 className="font-bold text-xl tracking-tight">Data Preview</h3>
                                    <span className="text-sm font-medium text-zinc-400">({previewData.length} rows found)</span>
                                </div>
                                <Badge variant="secondary" className="rounded-xl bg-zinc-100 text-zinc-600 font-bold px-4 py-2 w-fit border-none text-xs">
                                    {file?.name}
                                </Badge>
                            </div>

                            <div className="rounded-3xl border border-zinc-100 overflow-hidden shadow-sm bg-white">
                                <div className="overflow-x-auto custom-scrollbar">
                                    <Table>
                                        <TableHeader className="bg-zinc-50/50">
                                            <TableRow className="hover:bg-transparent border-zinc-100">
                                                {headers.map((h) => (
                                                    <TableHead key={h} className="text-[10px] font-bold uppercase tracking-widest py-5 px-6 whitespace-nowrap text-zinc-500 border-r border-zinc-100/50 last:border-r-0">
                                                        {h}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {previewData.map((row, i) => (
                                                <TableRow key={i} className="border-zinc-50 hover:bg-zinc-50/30 transition-colors">
                                                    {headers.map((h) => (
                                                        <TableCell key={h} className="text-[11px] text-zinc-600 font-medium px-6 py-4 whitespace-nowrap border-r border-zinc-50/50 last:border-r-0 max-w-[300px] truncate">
                                                            {row[h] || <span className="text-zinc-300 italic">empty</span>}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <div className="bg-zinc-900 rounded-[2rem] p-6 flex gap-4 border border-zinc-800 shadow-xl">
                                <AlertCircle className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-white uppercase tracking-widest">Importer Ready</p>
                                    <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                                        We'll match your products by <span className="text-white font-bold">slug</span>. Any missing categories, brands, or tags will be automatically created. Please ensure your columns are correctly named.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === "uploading" && (
                        <div className="py-20 text-center space-y-6">
                            <div className="flex justify-center">
                                <div className="relative h-24 w-24">
                                    <div className="absolute inset-0 rounded-full border-4 border-zinc-100" />
                                    <div className="absolute inset-0 rounded-full border-4 border-t-zinc-900 animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Upload className="h-8 w-8 text-zinc-900 animate-bounce" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-zinc-900">Processing Catalog...</h3>
                                <p className="text-zinc-500 mt-2 font-medium">We're mapping your products and creating tags.</p>
                            </div>
                        </div>
                    )}

                    {step === "result" && (
                        <div className="py-12 text-center space-y-8">
                            <div className="h-24 w-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Import Complete!</h3>
                                <p className="text-zinc-500 mt-2 font-medium">{importResult?.message}</p>
                            </div>

                            {importResult?.errors && importResult.errors.length > 0 && (
                                <div className="max-w-md mx-auto rounded-2xl bg-rose-50 p-4 border border-rose-100 text-left">
                                    <p className="text-xs font-bold text-rose-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        Some issues occurred:
                                    </p>
                                    <ul className="space-y-1">
                                        {importResult.errors.map((err, i) => (
                                            <li key={i} className="text-[11px] text-rose-600 font-medium leading-tight">• {err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <Button
                                onClick={() => setOpen(false)}
                                className="h-14 w-full max-w-xs rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20"
                            >
                                Done
                            </Button>
                        </div>
                    )}
                </div>

                {step === "preview" && (
                    <DialogFooter className="p-6 sm:p-8 bg-zinc-50 border-t border-zinc-100 flex flex-col sm:flex-row gap-3 sm:justify-between items-center">
                        <Button
                            variant="ghost"
                            onClick={reset}
                            className="w-full sm:w-auto rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-[10px] text-zinc-500"
                        >
                            Select Different File
                        </Button>
                        <Button
                            onClick={handleImport}
                            disabled={isImporting}
                            className="w-full sm:w-auto rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-black/10 transition-all hover:scale-[1.02] active:scale-95"
                        >
                            {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                            Start Import Now
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}
