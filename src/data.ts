export type Sound = {id:string; group:'simple'|'initial'|'compound'|'nasal'; sample:string; emoji:string; tip:string};
export const sounds:Sound[] = [
 {id:'a',group:'simple',sample:'a',emoji:'🦁',tip:'Open your mouth wide. Keep your tongue relaxed.'},
 {id:'o',group:'simple',sample:'o',emoji:'🫧',tip:'Make a round mouth. Listen carefully and copy the sound.'},
 {id:'e',group:'simple',sample:'e',emoji:'🪿',tip:'Keep your lips relaxed, with your tongue towards the back.'},
 {id:'i',group:'simple',sample:'yi',emoji:'🐜',tip:'Make a little smile. Keep your tongue high and forward.'},
 {id:'u',group:'simple',sample:'wu',emoji:'🐢',tip:'Round your lips into a small circle. Keep your tongue back.'},
 {id:'ü',group:'simple',sample:'yu',emoji:'🐟',tip:'Start with the tongue position for i, then round your lips.'},
 ...('b:ba:🐻 p:pa:🎈 m:ma:🐱 f:fa:🪁 d:da:🥁 t:ta:🐰 n:na:🐮 l:la:🦌 g:ga:🕊️ k:ka:🦘 h:ha:🐯 j:ji:🐔 q:qi:🎈 x:xi:🍉 zh:zhi:🕷️ ch:chi:🚂 sh:shi:🦁 r:ri:☀️ z:zi:🐝 c:ci:🌵 s:si:🐍 y:yi:🌱 w:wu:🏡'.split(' ').map(s=>{const [id,sample,emoji]=s.split(':');return {id,sample,emoji,group:'initial' as const,tip: id==='y'||id==='w' ? 'A spelling helper used at the start of syllables. Listen to the whole example.' : 'Listen to the whole syllable. Can you hear its first sound?'};})),
 ...('ai:ai:🌈 ei:ei:🍃 ui:gui:🐢 ao:ao:🏔️ ou:ou:🐚 iu:liu:💧 ie:ye:🍂 üe:yue:🌙 er:er:👂'.split(' ').map(s=>{const [id,sample,emoji]=s.split(':');return {id,sample,emoji,group:'compound' as const,tip:id==='er'?'Listen for the curled-tongue ending.':'Listen to how the vowel sounds glide together.'};})),
 ...('an:an:⛺ en:en:🌲 in:yin:🎵 un:wen:☁️ ün:yun:☁️ ang:ang:🌻 eng:heng:🪁 ing:ying:⭐ ong:hong:🌈'.split(' ').map(s=>{const [id,sample,emoji]=s.split(':');return {id,sample,emoji,group:'nasal' as const,tip:id.endsWith('ng')?'Let the sound finish at the back of your mouth: ng.':'Let your tongue finish just behind your top teeth: n.'};})),
];
export const groups = [
 {id:'simple',label:'Little vowels',subtitle:'6 simple finals · start here'},
 {id:'initial',label:'First sounds',subtitle:'21 initials + y and w spelling helpers'},
 {id:'compound',label:'Vowel friends',subtitle:'Compound finals + er'},
 {id:'nasal',label:'Nose sounds',subtitle:'Finals ending in n or ng'},
] as const;
export const lessons = [
 {id:'open',title:'Open, round, relax',subtitle:'Meet a, o and e',emoji:'🌱',soundIds:['a','o','e']},
 {id:'smile',title:'Smile & make bubbles',subtitle:'Meet i, u and ü',emoji:'🫧',soundIds:['i','u','ü']},
 {id:'lips',title:'A little lip magic',subtitle:'Meet b, p, m and f',emoji:'🦋',soundIds:['b','p','m','f']},
 {id:'tongue',title:'Tiptoe with your tongue',subtitle:'Meet d, t, n and l',emoji:'🐾',soundIds:['d','t','n','l']},
 {id:'back',title:'A sound safari',subtitle:'Meet g, k and h',emoji:'🐯',soundIds:['g','k','h']},
 {id:'smiles',title:'Three little smiles',subtitle:'Meet j, q and x',emoji:'🍉',soundIds:['j','q','x']},
 {id:'curl',title:'Curl & uncurl',subtitle:'Meet zh, ch, sh, r, z, c and s',emoji:'🐍',soundIds:['zh','ch','sh','r','z','c','s']},
 {id:'helpers',title:'Spelling helpers',subtitle:'Meet y and w',emoji:'🏡',soundIds:['y','w']},
 {id:'glide',title:'Vowels holding hands',subtitle:'Meet ai, ei, ui, ao, ou and iu',emoji:'🌈',soundIds:['ai','ei','ui','ao','ou','iu']},
 {id:'moon',title:'A visit to the moon',subtitle:'Meet ie, üe and er',emoji:'🌙',soundIds:['ie','üe','er']},
 {id:'nose',title:'Follow your nose',subtitle:'Meet an, en, in, un and ün',emoji:'🌼',soundIds:['an','en','in','un','ün']},
 {id:'ring',title:'Let it ring',subtitle:'Meet ang, eng, ing and ong',emoji:'🔔',soundIds:['ang','eng','ing','ong']},
];
export const tones = [
 {id:1,label:'High & flat',action:'Fly straight, like an aeroplane.',symbol:'─',emoji:'✈️',path:'M 12 23 L 128 23',word:'mā',hanzi:'妈',meaning:'mum'},
 {id:2,label:'Going up',action:'Lift your hand towards the sky.',symbol:'╱',emoji:'🚀',path:'M 12 78 L 128 18',word:'má',hanzi:'麻',meaning:'hemp'},
 {id:3,label:'Down & up',action:'Scoop down, then come back up.',symbol:'∨',emoji:'🛝',path:'M 12 35 Q 65 120 128 28',word:'mǎ',hanzi:'马',meaning:'horse'},
 {id:4,label:'Going down',action:'Slide your hand quickly down.',symbol:'╲',emoji:'☄️',path:'M 12 18 L 128 85',word:'mà',hanzi:'骂',meaning:'scold'},
];
export const practiceSyllables = ['ma','ba','mi','tu','yi','wu'];
export function markTone(syllable:string,tone:number):string {
 if(tone<1||tone>4) return syllable;
 const vowels:'a'[]|string[] = ['a','e','o','i','u','ü'];
 const marks=['āáǎà','ēéěè','ōóǒò','īíǐì','ūúǔù','ǖǘǚǜ'];
 let index=syllable.indexOf('a');
 if(index<0) index=syllable.indexOf('e');
 if(index<0 && syllable.includes('ou')) index=syllable.indexOf('o');
 if(index<0) for(let i=syllable.length-1;i>=0;i--) if(vowels.includes(syllable[i])){index=i;break;}
 if(index<0) return syllable;
 const mark=marks[vowels.indexOf(syllable[index])][tone-1];
 return syllable.slice(0,index)+mark+syllable.slice(index+1);
}
export const storageKey='pinyin-garden-progress-v1';
