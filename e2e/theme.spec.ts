import {test,expect} from '@playwright/test';
test('theme follows system, permits explicit choice and remembers it after reload',async({page})=>{
 await page.emulateMedia({colorScheme:'dark'});
 await page.goto('/');
 const control=page.getByRole('combobox',{name:/显示主题|Colour theme/});
 await expect(control).toHaveValue('system');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await control.selectOption('light');
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.reload();await expect(control).toHaveValue('light');
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await control.selectOption('system');
 await page.emulateMedia({colorScheme:'light'});
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.emulateMedia({colorScheme:'dark'});
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await control.selectOption('dark');await page.emulateMedia({colorScheme:'light'});
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.reload();await expect(control).toHaveValue('dark');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
});
test('saved dark theme is applied before the application bundle loads',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('pinyin-garden-theme-v1','dark'));
 await page.route('**/assets/*.js',r=>r.abort());
 await page.goto('/');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
});
test('both palettes remain readable and fit phone and desktop',async({page})=>{
 await page.goto('/');
 for(const mode of ['light','dark']){
  await page.getByRole('combobox',{name:/显示主题|Colour theme/}).selectOption(mode);
  for(const width of [390,1440]){
   await page.setViewportSize({width,height:950});
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   await page.screenshot({path:`screenshots/pinyin-garden-${mode}-${width}.png`,fullPage:true});
  }
  const contrast=await page.getByRole('heading',{level:1}).evaluate(el=>{
   const rgb=(s:string)=>(s.match(/[\d.]+/g)||[]).slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});
   const lum=(s:string)=>{const c=rgb(s);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
   const foreground=lum(getComputedStyle(el).color),background=lum(getComputedStyle(document.documentElement).backgroundColor);return (Math.max(foreground,background)+.05)/(Math.min(foreground,background)+.05);
  });expect(contrast).toBeGreaterThanOrEqual(4.5);
 }
});
test('invalid preferences and denied storage do not prevent theme changes',async({page})=>{
 await page.addInitScript(()=>{localStorage.setItem('pinyin-garden-theme-v1','invalid');});
 await page.goto('/');const control=page.getByRole('combobox',{name:/显示主题|Colour theme/});await expect(control).toHaveValue('system');
 await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw new DOMException('Blocked','SecurityError');};});
 await control.selectOption('dark');await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await expect(page.getByRole('status').filter({hasText:/无法记住|cannot remember/})).toBeVisible();
 await control.focus();await page.keyboard.press('ArrowUp');await page.keyboard.press('Enter');
 await expect(control).toHaveValue('light');await expect(page.locator('html')).toHaveAttribute('data-theme','light');
});
