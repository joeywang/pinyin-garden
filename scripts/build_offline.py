"""Package the production build as one offline HTML file, including recordings."""
import base64
import json
from pathlib import Path
import re
root = Path(__file__).resolve().parents[1]
dist = root / 'dist'
html = (dist / 'index.html').read_text()
js_path = re.search(r'<script[^>]+type="module"[^>]+src="([^"]+)"[^>]*></script>', html).group(1)
css_path = re.search(r'<link[^>]+href="([^"]+\.css)"[^>]*>', html).group(1)
js = (dist / js_path).read_text().replace('</script', r'<\/script')
css = (dist / css_path).read_text()
audio = {p.name: 'data:audio/mpeg;base64,' + base64.b64encode(p.read_bytes()).decode() for p in sorted((dist / 'audio').glob('*.mp3'))}
manifest = json.loads((dist / 'audio-manifest.json').read_text())
bootstrap = 'window.__PINYIN_AUDIO__=' + json.dumps(audio) + ';window.__PINYIN_MANIFEST__=URL.createObjectURL(new Blob([' + json.dumps(json.dumps(manifest)) + '],{type:"application/json"}));'
theme = (dist / 'theme-init.js').read_text()
html = re.sub(r'<script[^>]+src="[^"]*theme-init\.js"[^>]*></script>', lambda _: '<script>' + theme + '</script>', html)
html = re.sub(r'<script[^>]+type="module"[^>]+src="[^"]+"[^>]*></script>', lambda _: '<script>' + bootstrap + '</script><script type="module">' + js + '</script>', html)
html = re.sub(r'<link[^>]+href="[^"]+\.css"[^>]*>', lambda _: '<style>' + css + '</style>', html)
output = root / 'deliverables' / 'Pinyin-Garden.html'
output.parent.mkdir(exist_ok=True)
output.write_text(html)
print(json.dumps({'artifact': str(output), 'audio_files': len(audio), 'bytes': output.stat().st_size}))
