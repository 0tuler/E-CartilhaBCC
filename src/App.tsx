import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import type { Video } from './Video.tsx';
import type { Dispatch, SetStateAction } from 'react';
import { useState, useMemo, useEffect } from 'react';
import MenuIcon from './MenuIcon_opt.svg?react';
import HelpButton from './HelpButton_opt.svg?react';
import Markdown from 'react-markdown'

// Player de video, preciso melhorar isso aqui
function VideoPlayer({ video, markdownText }: { video: Video, markdownText: string }) {
  

  return (
    <div className="animate-appear flex flex-col w-full max-w-5xl items-center justify-center gap-8 p-6 overflow-scroll">
      {/* Container do player */}
      <div className="w-full h-[80vh] md:h-[80vh] aspect-9/16 bg-player border shrink-0 border-divider">
        <iframe
          className="w-full h-full md:max-h-[80vh] overflow-visible"
          src={video.link}
          title={video.titulo}
          frameBorder="0"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      {/* Textos */}
      <div className="flex flex-col w-full max-w-[98%] text-justify text-lg">
        <h2 className="text-2xl font-bold text-title mb-3">
          {video.titulo}
        </h2>
        <Markdown>{markdownText}</Markdown>
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
  setSelected,
}: {
  enabled: boolean;
  setEnabled: Dispatch<SetStateAction<boolean>>;
  names: string[];
  selected: string;
  setSelected: (val: string) => void;
}) {

  const [shouldRender, setShouldRender] = useState(enabled);

  useEffect(() => {
    if (enabled) setShouldRender(true);
  }, [enabled]);

  const onAnimationEnd = () => {
    if (!enabled) setShouldRender(false);
  };

  if (!shouldRender) return null;
  
  return (
    <aside 
      onAnimationEnd={onAnimationEnd}
      className={`${enabled ? 'animate-fade-in-right' : 'animate-fade-out-left'} w-full sm:w-[30%] bg-surface border-r border-divider flex flex-col shrink-0 h-screen`}
    >
      <div className="p-4 border-b border-divider">
        <h2 className="text-sm font-bold uppercase tracking-wide text-selected">
          Tópicos
        </h2>
      </div>
      
      <nav className="flex flex-col p-2 overflow-y-auto">
        {names.map((n) => {
          const isSelected = selected === n;
          return (
            <button
              key={n}
              onClick={() => {setSelected(n); setEnabled((flag) => !flag)}}
              className={`text-left px-3 py-2 my-0.5 rounded text-sm transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-surface-active text-title font-medium'
                  : 'text-secondary hover:bg-surface-active/50 hover:text-hover'
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

// Selecionador de tópicos
function TopicsToggle({topicsEnabler} : {topicsEnabler: Dispatch<SetStateAction<boolean>>}) {
  const size: number = 36;
  return(
    <button onClick={() => topicsEnabler((flag) => !flag)} className="w-fit h-fit">
      <MenuIcon width={size} height={size} className="text-title hover:animate-pulse hover:text-hover hover:rounded" />
    </button> 
  )
}

function EmptyState() {
  return <div className="h-screen flex flex-col justify-center items-center text-center p-8 text-muted">
  <h2 className="text-2xl font-bold text-selected mb-1">
  Nenhum tópico selecionado
  </h2>
  <p className="text-lg font-bold">
  Selecione um tópico no menu lateral para visualizar o vídeo.<br/>
  Clique no botão de menu no canto superior direito para visualizar os tópicos disponíveis <br/>
  caso esqueça como utilizar a aplicativo, clique no botão de ajuda no topo esquerdo.
    </p>
  </div>
}

// Decidindo se mantenho
function HelpMenu({enabled}: {enabled: boolean}) {
  
  const [shouldRender, setShouldRender] = useState(enabled);

  useEffect(() => {
    if (enabled) setShouldRender(true);
  }, [enabled]);

  const onAnimationEnd = () => {
    if (!enabled) setShouldRender(false);
  };

  if (!shouldRender) return null;

  return <aside 
      onAnimationEnd={onAnimationEnd}
      // Borda alterada de border-r para border-l
      className={`${enabled ? 'animate-fade-in-left' : 'animate-fade-out-right'} w-full sm:w-[30%] bg-surface border-l border-divider flex flex-col shrink-0 h-full`}
    >
      <div className="p-4 border-b border-divider">
        <h2 className="text-sm font-bold uppercase tracking-wide text-selected">
          Menu de Ajuda
        </h2>
      </div>
      
      <nav className="flex flex-col justify-around p-2 overflow-y-auto">
        Clique no botão de 3 barras para selecionar um tópico, um video aparecerá com os detalhes.
      </nav>
    </aside>
}

function HelpPopUp({
  enabled,
  setEnabled
}: {
  enabled: boolean;
  setEnabled: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={enabled} onClose={() => setEnabled(false)} className="relative z-50">
      {/* Fundo escuro semitransparente) */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        aria-hidden="true" 
      />

      {/* Container para centralizar o painel do Modal */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-11/12 max-w-md space-y-4 border border-divider bg-surface p-6 rounded-xl shadow-2xl flex flex-col">
          
          <div className="flex justify-between items-center border-b border-divider pb-4">
            <DialogTitle className="font-bold uppercase tracking-wide text-selected">
              <HelpButton width={36} height={36} className=""/> Menu de Ajuda
            </DialogTitle>
            
            {/* Botão para fechar */}
            <button 
              onClick={() => setEnabled(false)}
              className="text-secondary hover:text-title hover:bg-divider px-2 py-1 rounded transition-colors"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>

          <Description className="text-parah leading-relaxed text-center py-4">
            Clique no botão de 3 barras no canto superior esquerdo para selecionar um tópico. Um vídeo aparecerá com os detalhes.
          </Description>
          
          <div className="flex justify-end pt-2">
            <button 
              onClick={() => setEnabled(false)}
              className="bg-surface-active hover:bg-divider hover:text-hover text-title px-4 py-2 rounded font-medium transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export function App() {
  const [selected, setSelected] = useState<string>("");
  const [topicsEnable, setTopicsEnable] = useState<boolean>(false);
  const [helpEnable, setHelpEnable] = useState<boolean>(false);
  // Memoização para não recalcular a lista a cada clique, markdown adicionado
  const { video_hashlist, md_hashlist, names } = useMemo(() => {
    const jsonModules = import.meta.glob('../data/*.json', { eager: true });
    const mdModules = import.meta.glob('../data/*.md', { query: '?raw', import: 'default', eager: true });
    const jsonValues = Object.values(jsonModules).map((mod: any) => mod.default) as Video[];
    
    const v_hashlist: Record<string, Video> = {};
    const m_hashlist: Record<string, string> = {}; // Hashlist separada para o texto MD
    

    jsonValues.forEach((v) => {
      if (v && v.titulo) {
        v_hashlist[v.titulo] = v;
        
        const pathToMd = v.caminho; 
        if (pathToMd && mdModules[pathToMd]) {
          m_hashlist[v.titulo] = mdModules[pathToMd] as string;
        } else {
          m_hashlist[v.titulo] = "*Texto não encontrado para este vídeo.*";
        }
      }
    });

    return {
      video_hashlist: v_hashlist,
      md_hashlist: m_hashlist,
      names: jsonValues.map((v) => v.titulo)
    };
  }, []);

  return (
    <div className="flex flex-col w-full bg-background text-base font-sans">
      {/* Header do menu */}
      <header className="px-6 py-4 bg-surface border-b border-divider flex items-center shrink-0">
        <div className="flex flex-row items-center justify-between align-middle w-full">
          <TopicsToggle topicsEnabler={setTopicsEnable}/>
          <div className="my-0 mx-auto">
            <div className="flex flex-row items-center text-lg sm:text-2xl font-semibold text-title">
                <h1>{selected === "" ? "E-Cartilha BCC" : selected}</h1>
            </div>  
          </div>

          <HelpButton 
          width={36} 
          height={36} 
          onClick={() => setHelpEnable((flag) => !flag)} 
          className="text-title hover:animate-pulse hover:text-hover hover:rounded"
          />
        </div>
      </header>
      
      {/* Barra de tópicos e VideoPlayer */}
      <div className="flex flex-row flex-1 overflow-hidden">
        <TopicsBar enabled={topicsEnable} setEnabled={setTopicsEnable} names={names} selected={selected} setSelected={setSelected} />

        <main className="flex-1 flex flex-col justify-center items-center w-full h-full overflow-hidden">
          {selected !== "" && video_hashlist[selected] ? (
            <VideoPlayer video={video_hashlist[selected]} markdownText={md_hashlist[selected]} />
          ) : (
            /* Estado vazio */
            <EmptyState/>
          )}
        </main>
      
        {/*<HelpMenu enabled={helpEnable}/>*/}
      </div>
      <HelpPopUp enabled={helpEnable} setEnabled={setHelpEnable}/>
    </div>
  );
}
