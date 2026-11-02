import './Video.tsx';
import { useState, useMemo, useEffect } from 'react';
import MenuIcon from './MenuIcon_opt.svg?react';


// Player de video, verificar depois se há necessidade de colocar todos esses allows
function VideoPlayer({ video }: { video: Video }) {
  return (
    <div className="animate-appear flex flex-col md:flex-row w-full max-w-5xl h-full items-center justify-center gap-8 p-6 overflow-y-auto">
      {/* Container do player*/}
      <div className="h-[75vh] md:h-[80vh] aspect-9/16 bg-black border border-zinc-800 shrink-0">
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

// Barra de tópicos a serem selecionados
function TopicsBar({
  enabled,
  setEnabled,
  names,
  selected,
  setS,
}: {
  enable: boolean;
  setEnabled: (flag: boolean) => void;
  names: string[];
  selected: string;
  setS: (val: string) => void;
}) {

  const [shouldRender, setShouldRender] = useState(enabled);

  useEffect(() => {
    if (enabled) setShouldRender(true);
  }, [enabled]);

  const onAnimationEnd = () => {
    if (!enabled) setShouldRender(false);
  };

  if (!shouldRender) return null;
  // Menu escondido adicionado
  return <aside 
      onAnimationEnd={onAnimationEnd}
      className={`${enabled ? 'animate-fade-in-right' : 'animate-fade-out-left'} w-full sm:w-[30%] bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0 h-full`}
    >
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
              onClick={() => {setS(n); setEnabled((flag) => !flag)}}
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
}

// Selecionador de tópicos
function TopicsToggle({topicsEnabler} : {topicsEnabler: (val: boolean) => void}) {
  const size: number = 32;
  return(
    <button onClick={() => topicsEnabler((flag) => !flag)} className="w-fit h-fit">
    <MenuIcon width={size} height={size} className="text-white hover:animate-pulse hover:text-zinc-500 hover:border-2 hover:rounded" />
    </button> 
  )
}

export function App() {
  const [selected, setSelected] = useState<string>("");
  const [topicsEnable, setTopicsEnable] = useState<boolean>(false);
  
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
    {/*Header do menu*/}
    <header className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center shrink-0">
        <div className="flex flex-row items-center justify-center align-middle w-full">
        <TopicsToggle topicsEnabler={setTopicsEnable}/>
        <div className="my-0 mx-auto">
          <div className="flex flex-row items-center text-lg font-semibold text-white">
              <h1>{selected === "" ? "Selecione um tópico" : selected}</h1>
          </div>  
        </div>

        <span className="text-md font-bold">V2</span>
        </div>
      </header>
      {/*Barra de tópicos e VideoPlayer */}
      <div className="flex flex-row flex-1 overflow-hidden">
        <TopicsBar enabled={topicsEnable} setEnabled={setTopicsEnable} names={names} selected={selected} setS={setSelected} />

        <main className="flex-1 flex flex-col justify-center items-center w-full h-full overflow-hidden">
          {selected !== "" && video_hashlist[selected] ? (
            <VideoPlayer video={video_hashlist[selected]} />
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
