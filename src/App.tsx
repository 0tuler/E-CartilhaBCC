import './Video.tsx';
import { useState, useMemo } from 'react';
//import { PlayerIcon } from './PlayerIcon.tsx';

function VideoComponent({ video }: { video: Video }) {
  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl h-full items-center justify-center gap-8 p-6 overflow-y-auto">
      {/* Container do player*/}
      <div className="h-[75vh] md:h-[80vh] aspect-[9/16] bg-black border border-zinc-800 shrink-0">
        <iframe
          className="w-full h-full"
          src={video.link}
          title={video.titulo}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      {/* Textos, talvez melhorar isso aqui */}
      <div className="flex flex-col text-left w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-3">
          {video.titulo}
        </h2>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed whitespace-pre-line">
          {video.sobre}
        </p>
      </div>
    </div>
  );
}

function MenuBar({
  names,
  selected,
  setS,
}: {
  names: string[];
  selected: string;
  setS: (val: string) => void;
}) {
  return (
    /* Lembrar de adicionar uma funcionalidade para esconder o menu na V2 */
    <aside className="sm:w-[30%] bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0 h-full">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500">
          Tópicos
        </h2>
      </div>
      
      <nav className="flex flex-col p-2 overflow-y-auto">
        {names.map((n) => {
          const isSelected = selected === n;
          return (
            <button
              key={n}
              onClick={() => setS(n)}
              className={`text-left px-3 py-2 my-0.5 rounded text-sm transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              }`}
            >
              {n}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export function App() {
  const [selected, setSelected] = useState<string>("");
  
  // Memoização para não recalcular a lista a cada clique
  const { video_hashlist, names } = useMemo(() => {
    // Modificado para funcionar com o vite ao invés do parcel
    const modules = import.meta.glob('../data/*.json', { eager: true });

    const jsonValues = Object.values(modules).map((mod: any) => mod.default) as Video[];
    const hashlist: Record<string, Video> = {};
    
    jsonValues.forEach((v) => {
      if (v && v.titulo) {
        hashlist[v.titulo] = v;
      }
    });

    return {
      video_hashlist: hashlist,
      names: jsonValues.map((v) => v.titulo)
    };
  }, []);

  return (
    <div className="flex flex-col w-full h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      <header className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center shrink-0">
        <h1 className="text-lg font-semibold text-white">
          Trabalho de HabSoc <span className="text-sm font-normal text-zinc-500 ml-1">V1</span>
        </h1>
      </header>

      <div className="flex flex-row flex-1 overflow-hidden">
        <MenuBar names={names} selected={selected} setS={setSelected} />

        <main className="flex-1 flex flex-col justify-center items-center w-full h-full overflow-hidden">
          {selected !== "" && video_hashlist[selected] ? (
            <VideoComponent video={video_hashlist[selected]} />
          ) : (
            /* Estado vazio, antes do usuario selecionar o video */
            <div className="flex flex-col items-center text-center p-8 text-zinc-500">
              <h2 className="text-lg font-medium text-zinc-300 mb-1">
                Nenhum tópico selecionado
              </h2>
              <p className="text-sm">
                Selecione um tópico no menu lateral para visualizar o vídeo.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
