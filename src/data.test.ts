import {describe,it,expect} from 'vitest';
import {markTone, sounds, lessons, tones} from './data';
describe('pinyin curriculum',()=>{
 it('places tone marks using pinyin spelling rules',()=>{
  expect(markTone('ma',1)).toBe('mā'); expect(markTone('liu',2)).toBe('liú');
  expect(markTone('gui',3)).toBe('guǐ'); expect(markTone('lü',4)).toBe('lǜ');
  expect(markTone('xue',3)).toBe('xuě'); expect(markTone('hao',3)).toBe('hǎo');
 });
 it('starts with six simple finals before introducing initials',()=>{
  expect(lessons[0].soundIds).toEqual(['a','o','e']);
  expect(lessons[1].soundIds).toEqual(['i','u','ü']);
  expect(sounds.filter(s=>s.group==='simple')).toHaveLength(6);
  expect(sounds.filter(s=>s.group==='initial')).toHaveLength(23);
  expect(tones.map(t=>t.id)).toEqual([1,2,3,4]);
 });
 it('has unique sounds and resolvable lesson references',()=>{
  expect(new Set(sounds.map(s=>s.id)).size).toBe(sounds.length);
  for(const lesson of lessons) for(const id of lesson.soundIds) expect(sounds.some(s=>s.id===id)).toBe(true);
 });
});