import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Copy, Trash2, ImageIcon, Search } from "lucide-react";

interface MediaFile {
  name: string;
  fullPath: string;
  url: string;
  size?: number;
  updated_at?: string;
}

const BUCKET = "cms-media";
const FOLDERS = ["", "branding", "tours", "vehicles", "stays", "aviation", "yachts", "security", "offers", "blogs", "home_hero", "home_intro"];

const AdminMedia = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folder, setFolder] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    const path = folder || "";
    const { data, error } = await supabase.storage.from(BUCKET).list(path, { limit: 200, sortBy: { column: "updated_at", order: "desc" } });
    setLoading(false);
    if (error) return toast.error(error.message);
    const mapped: MediaFile[] = (data || [])
      .filter(f => f.name && !f.name.startsWith(".") && f.metadata)
      .map(f => {
        const full = folder ? `${folder}/${f.name}` : f.name;
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(full);
        return { name: f.name, fullPath: full, url: pub.publicUrl, size: (f.metadata as any)?.size, updated_at: f.updated_at };
      });
    setFiles(mapped);
  };

  useEffect(() => { load(); }, [folder]);

  const onUpload = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setUploading(true);
    for (const file of Array.from(fileList)) {
      const ext = file.name.split(".").pop() || "bin";
      const path = `${folder || "uploads"}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file);
      if (error) toast.error(`${file.name}: ${error.message}`);
    }
    setUploading(false);
    toast.success("Uploaded");
    load();
  };

  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied");
  };

  const remove = async (path: string) => {
    if (!confirm("Delete this file?")) return;
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) return toast.error(error.message);
    load();
  };

  const filtered = files.filter(f => !query || f.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Media library</h1>
          <p className="text-xs text-muted-foreground mt-2">Upload, browse and copy URLs for any image used across the site.</p>
        </div>
        <label className="btn-luxury text-xs flex items-center gap-2 cursor-pointer">
          <Upload className="h-3.5 w-3.5"/> {uploading ? "Uploading…" : "Upload files"}
          <input type="file" multiple accept="image/*,video/mp4" className="hidden" onChange={e => onUpload(e.target.files)}/>
        </label>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground w-24">Folder</span>
        {FOLDERS.map(f => (
          <button key={f || "root"} onClick={() => setFolder(f)}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border ${folder === f ? "border-primary bg-primary/10 text-gold" : "border-border/40 text-muted-foreground hover:border-primary/40"}`}>
            {f || "Root"}
          </button>
        ))}
        <div className="ml-auto relative">
          <Search className="h-3.5 w-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"/>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search" className="input-luxury text-xs pl-7 py-1.5"/>
        </div>
      </div>

      <div className="card-luxury p-4">
        {loading ? (
          <p className="p-4 text-xs text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
            <ImageIcon className="h-8 w-8 opacity-40"/>
            No files here yet. Upload above.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filtered.map(f => (
              <div key={f.fullPath} className="border border-border/40 bg-background/50 overflow-hidden group">
                <div className="aspect-square bg-black/20 flex items-center justify-center">
                  {/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f.name) ? (
                    <img src={f.url} alt={f.name} className="w-full h-full object-cover"/>
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground/60"/>
                  )}
                </div>
                <div className="p-2 space-y-1">
                  <p className="text-[10px] truncate" title={f.name}>{f.name}</p>
                  <div className="flex items-center gap-1">
                    <button onClick={() => copy(f.url)} className="flex-1 text-[10px] px-2 py-1 border border-border/40 hover:border-primary/40 hover:text-gold flex items-center justify-center gap-1"><Copy className="h-3 w-3"/>Copy</button>
                    <button onClick={() => remove(f.fullPath)} className="text-destructive hover:text-destructive/80 p-1"><Trash2 className="h-3 w-3"/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMedia;
