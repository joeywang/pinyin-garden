import {useEffect, useRef, useState} from 'react';
import {groups, lessons, markTone, practiceSyllables, sounds, storageKey, tones, type Sound} from './data';
import ThemeControl,{useTheme} from './ThemeControl';
import './style.css';
import './theme.css';

declare global {interface Window {__PINYIN_AUDIO__?:Record<string,string>;__PINYIN_MANIFEST__?:string;}}
type Page='learn'|'chart'|'tones'|'parents';
type Progress={completed:string[]; toneRounds:number};
const emptyProgress:Progress={completed:[],toneRounds:0};
function readProgress():Progress {
 try {const value=JSON.parse(localStorage.getItem(storageKey)||'null');return {completed:Array.isArray(value?.completed)?[...new Set<string>(value.completed.filter((id:unknown)=>lessons.some(l=>l.id===id)))]:[],toneRounds:Number.isSafeInteger(value?.toneRounds)&&value.toneRounds>=0?value.toneRounds:0};}catch{return emptyProgress;}
}
function Speaker(){return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg>;}
function GardenArt(){return <svg className="garden-art" viewBox="0 0 560 390" role="img" aria-label="A friendly panda in a garden of pinyin flowers">
 <defs><linearGradient id="sky" x2="0" y2="1"><stop stopColor="#e9efcf"/><stop offset="1" stopColor="#f4edd9"/></linearGradient></defs>
 <path d="M54 309C-14 191 48 33 202 28c118-47 283 25 300 155 30 135-55 175-244 164-106 9-166 4-204-38Z" fill="url(#sky)"/>
 <circle cx="410" cy="86" r="34" fill="#f3cd78"/><g fill="#fffdf6"><ellipse cx="133" cy="95" rx="40" ry="13"/><ellipse cx="117" cy="83" rx="18" ry="21"/><ellipse cx="143" cy="84" rx="23" ry="26"/><ellipse cx="335" cy="146" rx="34" ry="12"/><ellipse cx="326" cy="135" rx="16" ry="20"/></g>
 <path d="M63 303q115-92 237-20 137-68 212 24-43 51-233 41-147 5-216-45" fill="#bacb8b"/><ellipse cx="287" cy="334" rx="166" ry="22" fill="#95ae73" opacity=".35"/>
 <g stroke="#4b7954" strokeWidth="6" strokeLinecap="round"><path d="M119 306V217m338 87v-92M174 316v-61"/><path d="M118 274q-42-22-29-35 30 2 29 35m340-4q30-31 39-17-11 23-39 17" fill="#79a56b"/></g>
 <g fill="#f1b6a0"><circle cx="118" cy="205" r="28"/><circle cx="90" cy="225" r="24"/><circle cx="144" cy="228" r="24"/><circle cx="115" cy="248" r="23"/></g><circle cx="118" cy="226" r="19" fill="#ffe1a0"/>
 <g fill="#e3bbdd"><circle cx="456" cy="188" r="23"/><circle cx="432" cy="208" r="22"/><circle cx="478" cy="210" r="22"/><circle cx="455" cy="232" r="23"/></g><circle cx="455" cy="209" r="16" fill="#ffe3a4"/>
 <g fill="#fff5cc"><circle cx="174" cy="245" r="17"/><circle cx="158" cy="260" r="16"/><circle cx="189" cy="260" r="16"/></g><circle cx="174" cy="259" r="10" fill="#daa65b"/>
 <ellipse cx="295" cy="285" rx="75" ry="57" fill="#fcfbef"/><ellipse cx="248" cy="299" rx="24" ry="34" fill="#374d42" transform="rotate(23 248 299)"/><ellipse cx="344" cy="298" rx="24" ry="34" fill="#374d42" transform="rotate(-23 344 298)"/>
 <circle cx="243" cy="170" r="27" fill="#374d42"/><circle cx="345" cy="170" r="27" fill="#374d42"/><ellipse cx="295" cy="213" rx="80" ry="68" fill="#fffdf3"/>
 <ellipse cx="261" cy="210" rx="20" ry="26" fill="#374d42" transform="rotate(27 261 210)"/><ellipse cx="329" cy="210" rx="20" ry="26" fill="#374d42" transform="rotate(-27 329 210)"/>
 <circle cx="265" cy="209" r="6" fill="white"/><circle cx="325" cy="209" r="6" fill="white"/><ellipse cx="295" cy="234" rx="11" ry="8" fill="#374d42"/><path d="M284 247q11 12 22 0" fill="none" stroke="#374d42" strokeWidth="4" strokeLinecap="round"/><ellipse cx="245" cy="239" rx="12" ry="7" fill="#efbdac"/><ellipse cx="346" cy="239" rx="12" ry="7" fill="#efbdac"/>
 <g fill="#527658"><path d="m213 117 7-15 7 15-7 15Z"/><path d="m379 272 6-12 6 12-6 12Z"/></g>
 <g fontFamily="Georgia,serif" fontSize="32" fontWeight="bold" textAnchor="middle" fill="#45634b"><text x="118" y="236">a</text><text x="456" y="219">o</text><text x="173" y="267" fontSize="25">e</text></g>
 <path d="M360 59q13-22 24-5-4 13-24 5m0 0q-17-14-22 0 6 12 22 0" fill="#b795bc"/><path d="m360 58-3 16" stroke="#6d6071" strokeWidth="2"/>
</svg>;}
function ToneLine({tone}:{tone:typeof tones[number]}){return <svg viewBox="0 0 140 108" className="tone-line" aria-hidden="true"><path d="M10 94H130" stroke="currentColor" opacity=".12" strokeDasharray="4 5"/><path d={tone.path} fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/></svg>;}
function newQuestion(){return {syllable:practiceSyllables[Math.floor(Math.random()*practiceSyllables.length)],tone:1+Math.floor(Math.random()*4)};}

export default function App(){
 const themePreference=useTheme();
 const [page,setPage]=useState<Page>('learn');
 const [progress,setProgress]=useState(readProgress);
 const [saveError,setSaveError]=useState(false);
 const [lessonIndex,setLessonIndex]=useState<number|null>(null);
 const [step,setStep]=useState(0);
 const [heard,setHeard]=useState(false);
 const [celebrate,setCelebrate]=useState(false);
 const [audioError,setAudioError]=useState('');
 const [playing,setPlaying]=useState('');
 const player=useRef<HTMLAudioElement|null>(null);
 const request=useRef(0);
 const [tone,setTone]=useState(1);
 const [group,setGroup]=useState('simple');
 const [selected,setSelected]=useState<Sound>(sounds[0]);
 const [question,setQuestion]=useState(newQuestion);
 const [questionHeard,setQuestionHeard]=useState(false);
 const [answer,setAnswer]=useState<'correct'|'retry'|null>(null);
 const [round,setRound]=useState(0);
 const [gameFinished,setGameFinished]=useState(false);
 const [gameStarted,setGameStarted]=useState(false);
 useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(progress));setSaveError(false);}catch{setSaveError(true);}},[progress]);
 useEffect(()=>()=>{request.current++;player.current?.pause();},[]);
 function stopAudio(){request.current++;player.current?.pause();player.current=null;setPlaying('');setAudioError('');}
 async function play(sample:string,t:number):Promise<boolean>{
  stopAudio();const current=request.current;
  const audio=new Audio(window.__PINYIN_AUDIO__?.[`${sample}${t}.mp3`] ?? `${import.meta.env.BASE_URL}audio/${sample}${t}.mp3`);player.current=audio;
  audio.onended=()=>{if(current===request.current)setPlaying('');};
  audio.onerror=()=>{if(current===request.current){setAudioError('We could not play that sound. Check your volume and tap to try again.');setPlaying('');}};
  setPlaying(`${sample}${t}`);
  try{await audio.play();return current===request.current;}
  catch{if(current===request.current){setAudioError('We could not play that sound. Check your volume and tap to try again.');setPlaying('');}return false;}
 }
 function navigate(next:Page){stopAudio();setPage(next);setLessonIndex(null);setCelebrate(false);}
 function startLesson(index:number){stopAudio();setPage('learn');setLessonIndex(index);setStep(0);setHeard(false);setCelebrate(false);}
 function nextStep(){
  stopAudio();const lesson=lessons[lessonIndex!];
  if(step===lesson.soundIds.length-1){setProgress(p=>({...p,completed:[...new Set([...p.completed,lesson.id])]}));setLessonIndex(null);setCelebrate(true);}
  else {setStep(s=>s+1);setHeard(false);}
 }
 function startGame(){stopAudio();setQuestion(newQuestion());setRound(0);setQuestionHeard(false);setAnswer(null);setGameFinished(false);setGameStarted(true);}
 function nextRound(){
  stopAudio();
  if(round===4){setGameFinished(true);setProgress(p=>({...p,toneRounds:p.toneRounds+5}));}
  else {setRound(r=>r+1);setQuestion(newQuestion());setQuestionHeard(false);setAnswer(null);}
 }
 const nextLesson=lessons.findIndex(l=>!progress.completed.includes(l.id));
 const currentLesson=lessonIndex!==null?lessons[lessonIndex]:null;
 const currentSound=currentLesson?sounds.find(s=>s.id===currentLesson.soundIds[step])!:null;
 return <div className="app-shell">
  <a href="#main" className="skip-link">Skip to content</a>
  <header className="header">
   <button className="brand" onClick={()=>navigate('learn')} aria-label="Pinyin Garden home"><span className="brand-icon">🌱</span><span>Pinyin <b>Garden</b><small>小小拼音 · 大大世界</small></span></button>
   <nav aria-label="Main navigation">{([{id:'learn',label:'My learning path',icon:'☀'},{id:'chart',label:'Sound chart',icon:'▦'},{id:'tones',label:'Tone playground',icon:'♫'}] as const).map(n=><button key={n.id} className={page===n.id?'nav-button active':'nav-button'} aria-current={page===n.id?'page':undefined} onClick={()=>navigate(n.id)}><span aria-hidden="true">{n.icon}</span>{n.label}</button>)}</nav>
   <button className={`parent-button ${page==='parents'?'active':''}`} onClick={()=>navigate('parents')}>For grown-ups <span aria-hidden="true">↗</span></button>
  </header>
  <div className="appearance-bar"><ThemeControl theme={themePreference}/></div>
  <main id="main" tabIndex={-1}>
   {audioError&&<div className="error-banner" role="alert">{audioError}</div>}
   {saveError&&<div className="error-banner" role="status">This browser cannot save progress. You can still play; flowers may disappear when you close this page.</div>}
   {page==='learn'&&currentLesson&&currentSound?<section className="lesson-view">
    <button className="text-button" onClick={()=>navigate('learn')}>← Back to the garden</button>
    <div className="section-intro"><span className="eyebrow">LET’S LISTEN TOGETHER</span><h1>{currentLesson.title}</h1><p>Sound {step+1} of {currentLesson.soundIds.length} · Listen, watch your mouth, then have a go.</p></div>
    <div className="lesson-progress" aria-label={`Sound ${step+1} of ${currentLesson.soundIds.length}`}>{currentLesson.soundIds.map((id,i)=><span key={id} className={i<=step?'filled':''}/>)}</div>
    <div className="lesson-card"><span className="lesson-emoji" aria-hidden="true">{currentSound.emoji}</span><span lang="zh-Latn" className="giant-pinyin">{currentSound.id}</span><p className="mouth-tip">{currentSound.tip}</p><p className="sample-note">{currentSound.id===currentSound.sample?`Hear ${markTone(currentSound.sample,1)} in the first tone.`:<>Hear <b lang="zh-Latn">{markTone(currentSound.sample,1)}</b> — a whole syllable with this sound.</>}</p>
     <button className="primary" aria-label="Hear this sound" onClick={async()=>{const ok=await play(currentSound.sample,1);if(ok)setHeard(true);}}><Speaker/>{playing?'Listen again':'Hear this sound'}</button>
     <p className="gentle-note">Your turn! Copy the sound. There’s no rush.</p>
    </div>
    <div className="lesson-bottom"><button className="secondary" disabled={step===0} onClick={()=>{stopAudio();setStep(s=>s-1);setHeard(false);}}>Previous</button><button className="primary" disabled={!heard} onClick={nextStep}>{step===currentLesson.soundIds.length-1?'Plant my flower':'Next sound'} <span aria-hidden="true">→</span></button></div>
   </section>:page==='learn'?<>
    {celebrate&&<div className="celebration" role="status"><span aria-hidden="true">🌼</span><div><b>Your garden is growing!</b><p>You explored a new family of sounds. A lovely place to stop—or try a little more.</p></div><button className="text-button" onClick={()=>setCelebrate(false)} aria-label="Dismiss celebration">×</button></div>}
    <section className="hero"><div className="hero-copy"><span className="eyebrow"><span className="green-dot"/> A LITTLE EVERY DAY. A WORLD OF DISCOVERY.</span><h1>Little sounds.<br/><em>Big adventures.</em></h1><p>A playful first step into Mandarin.<br/>Listen, have a go, and grow your very own pinyin garden.</p><button className="primary large" onClick={()=>startLesson(nextLesson<0?0:nextLesson)}>{progress.completed.length?'Keep exploring':'Start first lesson'} <span aria-hidden="true">→</span></button><div className="hero-meta"><span>◷ 3–5 little minutes</span><span>🌿 Learn together, at your pace</span></div></div><div className="hero-picture"><GardenArt/><span className="picture-caption">Hello, little explorer! 你好呀</span></div></section>
    <section className="learning-section"><div className="section-heading"><div><span className="eyebrow">ONE LITTLE STEP AT A TIME</span><h2>Your growing path</h2></div><div className="progress-pill">🌼 {progress.completed.length} / {lessons.length} flowers</div></div><p className="section-description">Start with vowels, then meet their friends. Every lesson is ready when you are.</p>
     <div className="lesson-grid">{lessons.map((l,i)=>{const completed=progress.completed.includes(l.id);return <button key={l.id} className={`path-card ${completed?'completed':i===(nextLesson<0?0:nextLesson)?'recommended':''}`} onClick={()=>startLesson(i)} aria-label={`${l.title}: ${l.subtitle}${completed?' · completed':''}`}><div className="path-top"><span className="path-icon" aria-hidden="true">{l.emoji}</span><span className="step-label">{completed?'✓ EXPLORED':`STEP ${String(i+1).padStart(2,'0')}`}</span></div><h3>{l.title}</h3><p>{l.subtitle}</p><span className="card-bottom">{completed?'Visit again':i===(nextLesson<0?0:nextLesson)?'Let’s begin':'Explore sounds'}<span aria-hidden="true">↗</span></span></button>;})}</div>
    </section>
    <section className="play-banner"><span className="banner-icon" aria-hidden="true">🎵</span><div><span className="eyebrow">MAKE YOUR VOICE MOVE</span><h2>Four tones. A whole new playground.</h2><p>Fly high, climb up, scoop down, slide away. Hear how a sound changes!</p></div><button className="secondary" onClick={()=>navigate('tones')}>Play with tones <span aria-hidden="true">→</span></button></section>
    <div className="parent-tip"><span aria-hidden="true">💛</span><p><b>A little note for grown-ups</b> Pinyin letters don’t always sound like English letters. Listen first, copy together, and celebrate the trying.</p></div>
   </>:null}

   {page==='chart'&&<section className="chart-section"><div className="section-intro"><span className="eyebrow">A GARDEN FULL OF SOUNDS</span><h1>Tap. Listen. Have a go.</h1><p>Explore the building blocks of pinyin. Start with the little vowels.</p></div>
    <div className="chart-layout"><div><div className="group-tabs" role="group" aria-label="Sound groups">{groups.map(g=><button key={g.id} aria-pressed={group===g.id} className={group===g.id?'selected':''} onClick={()=>{stopAudio();setGroup(g.id);setSelected(sounds.find(s=>s.group===g.id)!);}}>{g.label}</button>)}</div><h2>{groups.find(g=>g.id===group)?.subtitle}</h2><div className="sound-grid">{sounds.filter(s=>s.group===group).map(s=><button key={s.id} className={`sound-tile ${selected.id===s.id?'selected':''}`} aria-label={`Hear ${s.id}`} aria-pressed={selected.id===s.id} onClick={()=>{setSelected(s);void play(s.sample,tone);}}><span aria-hidden="true">{s.emoji}</span><b lang="zh-Latn">{s.id}</b><Speaker/></button>)}</div></div>
     <aside className="sound-detail"><span className="eyebrow">LET’S TRY THIS ONE</span><span className="detail-emoji" aria-hidden="true">{selected.emoji}</span><div lang="zh-Latn" className="detail-pinyin">{selected.id}</div><p>{selected.tip}</p><p className="sample-note">Recorded example: <b lang="zh-Latn">{markTone(selected.sample,tone)}</b>{selected.id!==selected.sample?' (whole syllable)':''}</p><button className="primary" onClick={()=>void play(selected.sample,tone)}><Speaker/>Hear again</button><div className="tone-select" role="group" aria-label="Example tone">{tones.map(t=><button key={t.id} aria-pressed={tone===t.id} className={tone===t.id?'selected':''} onClick={()=>{setTone(t.id);void play(selected.sample,t.id);}} aria-label={`Example tone ${t.id}`}>{markTone('a',t.id)}<small>Tone {t.id}</small></button>)}</div></aside>
    </div><div className="parent-tip"><span aria-hidden="true">🌱</span><p>This is a beginner’s sound chart, not every possible syllable. Initials are heard in whole-syllable examples, not as English letter names. For i, u and ü, hear yī, wū and yū.</p></div>
   </section>}

   {page==='tones'&&<section className="tones-section"><div className="section-intro"><span className="eyebrow">LISTEN WITH YOUR EARS. PLAY WITH YOUR HANDS.</span><h1>A little melody in every word.</h1><p>Trace each shape in the air as you listen. The same sound can mean different things!</p></div>
    <div className="tone-grid">{tones.map(t=><button key={t.id} className={`tone-card tone-${t.id}`} aria-label={`Hear tone ${t.id}: ${t.label}`} onClick={()=>void play('ma',t.id)}><span className="tone-heading">TONE {t.id}<span aria-hidden="true">{t.emoji}</span></span><ToneLine tone={t}/><h2>{t.label}</h2><p>{t.action}</p><div className="tone-word"><b lang="zh-Latn">{t.word}</b><span lang="zh-Hans">{t.hanzi}</span><small>{t.meaning}</small><Speaker/></div></button>)}</div>
    <p className="tone-footnote">These are the four full tones. There’s also a short, light neutral tone to explore later. In everyday speech, third tone is often low; here we practise its full shape in isolation.</p>
    <section className="game-panel" aria-label="Tone listening game"><div className="section-heading"><div><span className="eyebrow">LITTLE LISTENING GAME</span><h2>Which way did the sound go?</h2></div><span className="progress-pill">{gameStarted&&!gameFinished?`${round+1} / 5 sounds`:'No timer. No rush.'}</span></div>
     {!gameStarted?<div className="game-start"><span aria-hidden="true">🐼</span><p>Listen to a mystery sound. Then tap the shape you heard.<br/>You can listen as many times as you like.</p><button className="primary" onClick={startGame}>Let’s play <span aria-hidden="true">→</span></button></div>:gameFinished?<div className="game-start" role="status"><span aria-hidden="true">🌻</span><h3>Five little sounds explored!</h3><p>You used your listening ears. Brilliant trying!</p><button className="primary" onClick={startGame}>Play again</button></div>:<><button className="mystery-sound" onClick={async()=>{const ok=await play(question.syllable,question.tone);if(ok)setQuestionHeard(true);}} aria-label="Hear mystery sound"><Speaker/>Hear the mystery sound</button><p className="gentle-note">{questionHeard?'Tap the shape that matches.':'Listen first. Then the shapes are ready for you.'}</p><div className="answer-grid">{tones.map(t=><button key={t.id} className={`answer tone-${t.id}`} disabled={!questionHeard||answer==='correct'} aria-label={`Choose tone ${t.id}`} onClick={()=>setAnswer(t.id===question.tone?'correct':'retry')}><ToneLine tone={t}/><span>{t.label}</span></button>)}</div><div className="game-feedback" role="status">{answer==='retry'?<p>Good trying! Listen again and move your hand with the sound.</p>:answer==='correct'?<><p>🌼 You found it! <b lang="zh-Latn">{markTone(question.syllable,question.tone)}</b> — tone {question.tone}.</p><button className="primary" onClick={nextRound}>{round===4?'Grow my garden':'Next mystery sound'} <span aria-hidden="true">→</span></button></>:<p>Every listen helps your ears grow.</p>}</div></>}
    </section>
   </section>}

   {page==='parents'&&<section className="parents-section"><div className="section-intro"><span className="eyebrow">YOU’RE THEIR FAVOURITE LEARNING PARTNER</span><h1>Small moments, shared together.</h1><p>Made for a young child learning Mandarin in an English-speaking world.</p></div><div className="parent-grid"><article><span className="parent-article-icon">💛</span><h2>A gentle 3–5 minute routine</h2><ol><li>Choose one little lesson. A grown-up reads the guidance aloud.</li><li>Listen, copy the mouth shape, and take turns.</li><li>Try a tone using a hand movement, not a test score.</li><li>Stop while it’s still fun. Repeating is learning.</li></ol><p>The pictures are playful memory buddies, not translations or examples of words pronounced with that sound.</p></article><article><span className="parent-article-icon">🔊</span><h2>Real recordings, not letter names</h2><p>Tap-to-hear uses bundled Mandarin syllable recordings by <b>Chen Wang</b>, from <a href="https://github.com/hugolpz/audio-cmn" target="_blank" rel="noreferrer">audio-cmn</a>. Files are unmodified and attributed under the upstream CC-BY-SA license; the source does not specify a version.</p><p>Initials are demonstrated inside whole syllables. Final examples may use spelling helpers: i → yi, u → wu, ü → yu, üe → yue, ün → yun. The dots on ü are omitted after j, q, x and y.</p><p>ui, iu and un are shortened spellings used after initials. Their fuller forms are uei, iou and uen. Tone marks are placed on the correct written vowel.</p><p><a href={window.__PINYIN_MANIFEST__ ?? `${import.meta.env.BASE_URL}audio-manifest.json`} target="_blank" rel="noreferrer">View recording sources & checksums ↗</a></p></article><article><span className="parent-article-icon">🌼</span><h2>Your device, your little garden</h2><p><b>{progress.completed.length} lessons explored</b> · {progress.toneRounds} listening rounds completed.</p><p>Only lesson completion and completed game rounds are saved in this browser’s local storage. There are no accounts, analytics, adverts, microphone recordings, or LLM calls. Progress is not synced across devices.</p><p>Flowers celebrate exploration, not pronunciation mastery. This app does not assess your child’s spoken pronunciation.</p><button className="secondary" onClick={()=>{if(window.confirm('Clear the flowers and listening progress on this browser?')){setProgress({...emptyProgress});setGameStarted(false);}}}>Reset this device’s garden</button></article><article><span className="parent-article-icon">📖</span><h2>A first step, not a full course</h2><p>Includes 6 simple finals, 21 initials, the y/w spelling helpers, 9 compound/special finals and 9 nasal finals. The path keeps later sounds available for grown-up-led exploration.</p><p>Four-tone listening is included. Neutral tone, tone changes in connected speech, character reading, handwriting, and speaking assessment are not taught in this first version.</p><p>Reference: <a href="https://resources.allsetlearning.com/chinese/pronunciation/Pinyin_chart" target="_blank" rel="noreferrer">AllSet Learning pinyin chart</a>. Teaching copy and illustrations here are original. Before classroom use, a Mandarin early-years teacher should review the sequence and recordings.</p></article></div></section>}
  </main>
  <footer><span className="footer-brand">🌱 Pinyin Garden</span><span>Small steps. Happy sounds. Together.</span><button className="text-button" onClick={()=>navigate('parents')}>Made for little learners & their grown-ups ↗</button></footer>
 </div>;
}
