import {describe,it,expect,vi,beforeEach,afterEach} from 'vitest';
import {render,screen,waitFor,cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import {storageKey} from './data';
beforeEach(()=>{vi.spyOn(HTMLMediaElement.prototype,'play').mockResolvedValue(); vi.spyOn(HTMLMediaElement.prototype,'pause').mockImplementation(()=>{});});
afterEach(()=>{cleanup();vi.restoreAllMocks();});
describe('progress safety',()=>{
 it('discards malformed storage without crashing',()=>{
  localStorage.setItem(storageKey,'not valid JSON');render(<App/>);
  expect(screen.getByText(/0 \/ 12 flowers/)).toBeInTheDocument();
 });
 it('filters unknown lesson ids and deduplicates stored completion',()=>{
  localStorage.setItem(storageKey,JSON.stringify({completed:['open','open','unknown',null],toneRounds:-1}));render(<App/>);
  expect(screen.getByText(/1 \/ 12 flowers/)).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem(storageKey)!)).toEqual({completed:['open'],toneRounds:0});
 });
 it('explains unavailable storage while keeping learning usable',()=>{
  vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('blocked');});render(<App/>);
  expect(screen.getByRole('status')).toHaveTextContent('cannot save progress');
  expect(screen.getByRole('button',{name:'Start first lesson'})).toBeEnabled();
 });
});
describe('first lesson',()=>{
 it('guides a child through listening before saving a completed lesson',async()=>{
  const user=userEvent.setup(); render(<App/>);
  await user.click(screen.getByRole('button',{name:/Start first lesson/i}));
  expect(screen.getByRole('button',{name:'Next sound'})).toBeDisabled();
  for(let i=0;i<3;i++){
   await user.click(screen.getByRole('button',{name:/Hear this sound/i}));
   await waitFor(()=>expect(screen.getByRole('button',{name:i===2?'Plant my flower':'Next sound'})).toBeEnabled());
   await user.click(screen.getByRole('button',{name:i===2?'Plant my flower':'Next sound'}));
  }
  expect(screen.getByText('Your garden is growing!')).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem(storageKey)!).completed).toContain('open');
 });
 it('does not unlock a lesson step when audio fails',async()=>{
  vi.spyOn(HTMLMediaElement.prototype,'play').mockRejectedValue(new Error('unavailable'));
  const user=userEvent.setup();render(<App/>);
  await user.click(screen.getByRole('button',{name:/Start first lesson/i}));
  await user.click(screen.getByRole('button',{name:/Hear this sound/i}));
  expect(await screen.findByRole('alert')).toHaveTextContent('could not play');
  expect(screen.getByRole('button',{name:'Next sound'})).toBeDisabled();
 });
});