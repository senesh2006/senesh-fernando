"use client"

import { useState, useRef } from "react"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void
  currentImageUrl?: string
  className?: string
  label?: string
}

export function ImageUploader({ 
  onUploadComplete, 
  currentImageUrl, 
  className,
  label = "Upload Image" 
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    // Preview
    const reader = new FileReader()
    reader.onload = (e) => setPreviewUrl(e.target?.result as string)
    reader.readAsDataURL(file)

    setIsUploading(true)
    try {
      const response = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}`,
        {
          method: "POST",
          body: file,
        }
      )

      if (response.ok) {
        const blob = await response.json()
        onUploadComplete(blob.url)
        toast.success("Image uploaded successfully")
      } else {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }
    } catch (error: any) {
      console.error("Upload failed:", error)
      toast.error(`Upload failed: ${error.message}`)
      setPreviewUrl(currentImageUrl || null) // Reset to previous
    } finally {
      setIsUploading(false)
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => {
    setIsDragging(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-xs font-mono uppercase text-muted-foreground">{label}</label>}
      
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative group border-2 border-dashed rounded-lg transition-all duration-200 overflow-hidden flex flex-col items-center justify-center min-h-[120px]",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/50",
          previewUrl ? "p-0" : "p-4"
        )}
      >
        {previewUrl ? (
          <>
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-auto max-h-[300px] object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                Change
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  setPreviewUrl(null)
                  onUploadComplete("")
                }}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="p-3 rounded-full bg-secondary">
              <Upload className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono uppercase">Drag & drop or click to upload</span>
          </button>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 z-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-[10px] font-mono animate-pulse">Uploading...</span>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  )
}
