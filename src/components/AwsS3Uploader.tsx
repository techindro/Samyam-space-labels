import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, HardDrive, CheckCircle2, AlertCircle, Copy, Check, FileCheck, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFileToS3, isS3Configured, S3UploadResult } from "@/lib/aws-s3";

export default function AwsS3Uploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<S3UploadResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const configured = isS3Configured();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadResult(null);

    if (!configured) {
      // Simulate demo upload when S3 credentials are not yet entered in .env
      setTimeout(() => {
        const demoBucket = "samyam-satellite-datasets";
        const demoRegion = "us-east-1";
        const demoKey = `satellite-datasets/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
        const demoUrl = `https://${demoBucket}.s3.${demoRegion}.amazonaws.com/${demoKey}`;

        setUploadResult({
          success: true,
          fileUrl: demoUrl,
          key: demoKey,
        });
        setUploading(false);
      }, 1200);
      return;
    }

    const result = await uploadFileToS3(file);
    setUploadResult(result);
    setUploading(false);
  };

  const handleCopyUrl = () => {
    if (uploadResult?.fileUrl) {
      navigator.clipboard.writeText(uploadResult.fileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 rounded-2xl border border-border/60 shadow-xl bg-card/60 backdrop-blur-md relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-secondary text-foreground">
            <HardDrive className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold">Amazon S3 Satellite Storage Ingestion</h3>
            <p className="text-xs text-muted-foreground">Directly stream GeoTIFF, SAR radar, & imagery datasets into AWS S3</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {configured ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-semibold">
              <CheckCircle2 size={12} /> AWS S3 Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-muted-foreground border border-border text-xs font-semibold">
              <AlertCircle size={12} /> S3 Simulation Ready
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <label
          htmlFor="aws-s3-file-input"
          className="border-2 border-dashed border-border/80 hover:border-foreground/40 rounded-xl p-8 text-center cursor-pointer transition-all bg-secondary/20 hover:bg-secondary/40 flex flex-col items-center justify-center gap-2"
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm font-semibold">
            {file ? file.name : "Click or drag & drop Satellite Image / Dataset file here"}
          </div>
          <div className="text-xs text-muted-foreground">
            Supports GeoTIFF, JPEG, PNG, COCO JSON, SAR radar raw frames (up to 5GB)
          </div>
          <input
            id="aws-s3-file-input"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {file && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border/40 text-xs">
            <div className="flex items-center gap-2 truncate">
              <FileCheck size={16} className="text-foreground shrink-0" />
              <span className="font-medium truncate">{file.name}</span>
              <span className="text-muted-foreground shrink-0">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
            </div>
            <Button
              size="sm"
              onClick={handleUpload}
              disabled={uploading}
              className="bg-black dark:bg-white text-white dark:text-black font-semibold shrink-0"
            >
              {uploading ? (
                <>
                  <RefreshCw size={14} className="animate-spin mr-1.5" /> Uploading to S3...
                </>
              ) : (
                "Upload to AWS S3"
              )}
            </Button>
          </div>
        )}

        {uploadResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border text-xs space-y-2 ${
              uploadResult.success
                ? "bg-secondary/40 border-border text-foreground"
                : "bg-destructive/10 border-destructive/20 text-destructive"
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span>{uploadResult.success ? "S3 Ingestion Successful!" : "Upload Failed"}</span>
              {uploadResult.fileUrl && (
                <a
                  href={uploadResult.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs underline"
                >
                  View File <ExternalLink size={12} />
                </a>
              )}
            </div>

            {uploadResult.success ? (
              <div className="space-y-1.5">
                <p className="text-muted-foreground">S3 Object Key: <code className="bg-background px-1.5 py-0.5 rounded border border-border font-mono">{uploadResult.key}</code></p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={uploadResult.fileUrl}
                    className="flex-1 bg-background px-2.5 py-1 rounded border border-border font-mono text-[11px]"
                  />
                  <Button size="sm" variant="outline" onClick={handleCopyUrl} className="h-7 text-[11px] px-2.5">
                    {copied ? <Check size={12} className="text-emerald-500 mr-1" /> : <Copy size={12} className="mr-1" />}
                    {copied ? "Copied!" : "Copy S3 URL"}
                  </Button>
                </div>
              </div>
            ) : (
              <p>{uploadResult.error}</p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
