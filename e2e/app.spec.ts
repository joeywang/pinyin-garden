import {test,expect} from '@playwright/test';
import fs from 'node:fs';
const screenshotDir='screenshots';
test('real audio, guided lesson, progress, all chart recordings, tone game and mobile layout',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:1440,height:1080});await page.goto('/');
 await expect(page.getByRole('heading',{name:'Little sounds. Big adventures.'})).toBeVisible();
 fs.mkdirSync(screenshotDir,{recursive:true});await page.screenshot({path:screenshotDir+'/desktop.png',fullPage:true});
 await page.getByRole('button',{name:'Start first lesson'}).click();
 await expect(page.getByRole('button',{name:'Next sound'})).toBeDisabled();
 await page.evaluate(()=>{const OldAudio=window.Audio; (window as any).__audios=[]; window.Audio=class extends OldAudio{constructor(src?:string){super(src);(window as any).__audios.push(this);}};});
 for(let i=0;i<3;i++){
  await page.getByRole('button',{name:'Hear this sound'}).click();
  await expect.poll(()=>page.evaluate(()=>{const a=(window as any).__audios.at(-1);return !!a&&a.currentTime>0&&a.duration>0&&!a.error;})).toBe(true);
  await page.getByRole('button',{name:i===2?'Plant my flower':'Next sound'}).click();
 }
 await expect(page.getByText('Your garden is growing!')).toBeVisible();
 await page.reload();await expect(page.getByText('1 / 12 flowers')).toBeVisible();
 await page.getByRole('button',{name:'Sound chart',exact:true}).click();
 await expect(page.getByRole('button',{name:'Hear ü',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Hear ü',exact:true}).click();
 await expect(page.getByText('Recorded example:')).toContainText('yū');
 await page.getByRole('button',{name:'Example tone 4'}).click();
 await expect(page.getByText('Recorded example:')).toContainText('yù');
 await page.screenshot({path:screenshotDir+'/chart.png',fullPage:true});
 const manifest=await(await page.request.get('/audio-manifest.json')).json();
 for(const f of manifest.files){const r=await page.request.get('/audio/'+f.file);expect(r.status()).toBe(200);expect(r.headers()['content-type']).toContain('audio');expect((await r.body()).length).toBe(f.bytes);}
 await page.getByRole('button',{name:'Tone playground',exact:true}).click();
 await page.screenshot({path:screenshotDir+'/tones.png',fullPage:true});
 // Make questions repeatable, without replacing any audio or server response.
 await page.evaluate(()=>{Math.random=()=>0;});
 await page.getByRole('button',{name:'Let’s play'}).click();
 await expect(page.getByRole('button',{name:'Choose tone 1'})).toBeDisabled();
 for(let i=0;i<5;i++){
  await page.getByRole('button',{name:'Hear mystery sound'}).click();
  await page.getByRole('button',{name:'Choose tone 2'}).click();
  await expect(page.getByText('Good trying! Listen again and move your hand with the sound.')).toBeVisible();
  await page.getByRole('button',{name:'Choose tone 1'}).click();
  await page.getByRole('button',{name:i===4?'Grow my garden':'Next mystery sound'}).click();
 }
 await expect(page.getByRole('heading',{name:'Five little sounds explored!'})).toBeVisible();
 await page.getByRole('button',{name:'For grown-ups'}).click();
 await expect(page.getByText('5 listening rounds completed.')).toBeVisible();
 for(const width of [360,390,768]){
  await page.setViewportSize({width,height:844});
  for(const name of ['My learning path','Sound chart','Tone playground','For grown-ups']){
   await page.getByRole('button',{name,exact:true}).click();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
 }
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'My learning path',exact:true}).click();
 await page.screenshot({path:screenshotDir+'/mobile.png',fullPage:true});
 expect(errors).toEqual([]);
});
test('an unavailable recording gives a visible error and cannot advance the lesson',async({page})=>{
 await page.route('**/audio/*.mp3',r=>r.abort());await page.goto('/');
 await page.getByRole('button',{name:'Start first lesson'}).click();await page.getByRole('button',{name:'Hear this sound'}).click();
 await expect(page.getByRole('alert')).toContainText('could not play');
 await expect(page.getByRole('button',{name:'Next sound'})).toBeDisabled();
});
