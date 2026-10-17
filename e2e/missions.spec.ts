import {test,expect} from '@playwright/test';import {markTone,storageKey} from '../src/data';
test('complete both five-discovery missions with real recordings and saved badges',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 await page.evaluate(()=>{const Original=window.Audio;(window as any).__missionAudio=[];window.Audio=class extends Original{constructor(src?:string){super(src);(window as any).__missionAudio.push(this);}};});
 await page.getByRole('button',{name:'Sound missions',exact:true}).click();
 await page.getByRole('button',{name:'Start spelling detective'}).click();
 for(let i=0;i<5;i++){
  const choices=page.getByRole('button',{name:/^Spelling choice:/});await expect(choices.first()).toBeDisabled();
  await page.getByRole('button',{name:'Play mystery syllable'}).click();await expect(choices.first()).toBeEnabled();
  const filename=await page.evaluate(()=>(window as any).__missionAudio.at(-1).src.split('/').at(-1));const match=filename.match(/^([a-z]+)([1-4])\.mp3$/)!;
  const answer=markTone(match[1],Number(match[2]));
  // Choose a known non-answer from the rendered options, then retry.
  for(const c of await choices.all())if((await c.getAttribute('aria-label'))!==`Spelling choice: ${answer}`){await c.click();break;}
  await expect(page.getByRole('button',{name:i===4?'Collect this mission':'Next discovery',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:`Spelling choice: ${answer}`,exact:true}).click();await page.getByRole('button',{name:i===4?'Collect this mission':'Next discovery',exact:true}).click();
 }
 await expect(page.getByText('Five discoveries collected!')).toBeVisible();
 await page.getByRole('button',{name:'Start tone twins'}).click();
 for(let i=0;i<5;i++){
  await expect(page.getByRole('button',{name:'Same tone',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'Play sound A'}).click();
  await expect(page.getByText(/✓ A heard/)).toBeVisible();const a=await page.evaluate(()=>(window as any).__missionAudio.at(-1).src);
  await expect(page.getByRole('button',{name:'Same tone',exact:true})).toBeDisabled();await page.getByRole('button',{name:'Play sound B'}).click();await expect(page.getByRole('button',{name:'Same tone',exact:true})).toBeEnabled();const b=await page.evaluate(()=>(window as any).__missionAudio.at(-1).src);
  await page.getByRole('button',{name:a===b?'Same tone':'Different tones',exact:true}).click();await page.getByRole('button',{name:i===4?'Collect this mission':'Next discovery',exact:true}).click();
 }
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('pinyin-missions-v1')!))).toEqual(['spelling','twins']);
 await page.reload();await page.getByRole('button',{name:'Sound missions',exact:true}).click();await expect(page.getByText(/Explored: 2 \/ 2/)).toBeVisible();expect(errors).toEqual([]);
});
test('failed recordings, round cancellation and theme switching keep gates honest',async({page})=>{
 await page.route('**/audio/*.mp3',r=>r.abort());await page.goto('/');await page.getByRole('button',{name:'Sound missions',exact:true}).click();await page.getByRole('button',{name:'Start spelling detective'}).click();await page.getByRole('button',{name:'Play mystery syllable'}).click();await expect(page.getByRole('alert')).toContainText('could not play');await expect(page.getByRole('button',{name:/^Spelling choice:/}).first()).toBeDisabled();
 await page.unroute('**/audio/*.mp3');await page.getByRole('button',{name:'Play mystery syllable'}).click();await expect(page.getByRole('button',{name:/^Spelling choice:/}).first()).toBeEnabled();
 await page.getByRole('button',{name:'Start tone twins'}).click();await expect(page.getByRole('button',{name:'Same tone',exact:true})).toBeDisabled();
 for(const mode of ['light','dark']){await page.getByRole('combobox',{name:'Colour theme'}).selectOption(mode);for(const width of [360,390,768,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}await page.screenshot({path:`screenshots/sound-missions-${mode}.png`,fullPage:true});}
 expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),storageKey)).toEqual({completed:[],toneRounds:0});
});

test('a parent reset is reflected by another open mission tab',async({page,context})=>{
 await page.goto('/');await page.getByRole('button',{name:'Sound missions',exact:true}).click();
 const other=await context.newPage();await other.goto('/');await other.evaluate(()=>localStorage.setItem('pinyin-missions-v1','["spelling"]'));
 await expect(page.getByText(/Explored: 1 \/ 2/)).toBeVisible();
 await other.getByRole('button',{name:'For grown-ups'}).click();other.once('dialog',dialog=>dialog.accept());await other.getByRole('button',{name:'Reset this device’s garden',exact:true}).click();
 await expect(page.getByText(/Explored: 0 \/ 2/)).toBeVisible();expect(await page.evaluate(()=>localStorage.getItem('pinyin-missions-v1'))).toBeNull();await other.close();
});
