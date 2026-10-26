"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://cdffffgheikcmstcmcl.supabase.co",
  "sb_publishable_otcfh8jx0UppsEePiD3egw_BE_P7vRF"
)

export default function NubeAdmin() {
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.storage.from("archivos").list("", { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })
    if(data) setFiles(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const onUpload = async (e:any) => {
    const file = e.target.files[0]
    if(!file) return
    if(file.size > 50*1024*1024) return alert("Máximo 50MB - Supabase Free")
    const { error } = await supabase.storage.from("archivos").upload(file.name, file, { upsert: true })
    if(error) alert(error.message)
    else load()
  }

  const onDelete = async (name:string) => {
    if(!confirm(`¿Borrar ${name} para siempre?`)) return
    await supabase.storage.from("archivos").remove([name])
    load()
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white p-6 md:p-10 font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black tracking-tighter">STARMARC<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500"> CLOUD OS</span></h1>
        <label className="cursor-pointer px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 font-bold text-sm shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-105 transition">
          + Subir Archivo
          <input type="file" className="hidden" onChange={onUpload} />
        </label>
      </div>

      {/* STATS INNOVADOR */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <div className="p-[1px] rounded-[22px] bg-gradient-to-b from-violet-500/50 to-transparent">
          <div className="bg-zinc-900 rounded-[21px] p-6">
            <p className="text-zinc-500 text-[10px] tracking-[0.2em]">TOTAL EN ARCHIVOS</p>
            <p className="text-5xl font-black mt-2">{loading ? "..." : files.length}</p>
          </div>
        </div>
        <div className="p-[1px] rounded-[22px] bg-gradient-to-b from-blue-500/50 to-transparent">
          <div className="bg-zinc-900 rounded-[21px] p-6">
            <p className="text-zinc-500 text-[10px] tracking-[0.2em]">BUCKET ACTIVO</p>
            <p className="text-2xl font-bold mt-2 text-blue-300">archivos</p>
            <p className="text-violet-400 text-xs mt-1">Público • 50MB</p>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-[22px] p-6">
          <p className="text-zinc-500 text-[10px] tracking-[0.2em]">STATUS</p>
          <p className="text-lg font-bold mt-2">Admin Total Control</p>
          <p className="text-green-400 text-xs mt-1">● starmarc-studio Conectado</p>
        </div>
      </div>

      {/* LISTA */}
      <div className="mt-10 rounded-[22px] bg-zinc-900/60 border border-zinc-800 backdrop-blur overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="font-bold tracking-wide">Control Total de la Nube</h2>
          <span className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-400">{loading ? "Cargando..." : "Live"}</span>
        </div>
        {files.map(f => (
          <div key={f.name} className="flex justify-between items-center p-5 hover:bg-violet-500/[0.07] border-b border-zinc-800/40 group transition">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center font-black">S</div>
              <div>
                <p className="text-sm font-bold">{f.name}</p>
                <p className="text-[11px] text-zinc-500">{f.metadata?.size ? (f.metadata.size/1024/1024).toFixed(2)+" MB • " : ""}{new Date(f.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { navigator.clipboard.writeText(`https://cdffffgheikcmstcmcl.supabase.co/storage/v1/object/public/archivos/${f.name}`); alert("Link copiado") }} className="text-xs px-4 py-2 rounded-full bg-zinc-800 group-hover:bg-violet-600 transition">Copiar Link</button>
              <button onClick={() => onDelete(f.name)} className="text-xs px-4 py-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20">Eliminar</button>
            </div>
          </div>
        ))}
        {!loading && files.length===0 && <p className="p-12 text-center text-zinc-500 text-sm">Tu nube está vacía. Sube tu primer archivo arriba.</p>}
      </div>
    </div>
  )
}
