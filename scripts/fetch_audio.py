"""Fetch the specific unmodified CC-BY-SA recordings used by the app."""
import concurrent.futures
import hashlib
import json
from pathlib import Path
import re
import time
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
REPO = 'hugolpz/audio-cmn'
api = f'https://api.github.com/repos/{REPO}/commits/master'
commit = json.load(urllib.request.urlopen(api, timeout=30))['sha']
source = (ROOT / 'src/data.ts').read_text()
samples = set(re.findall(r"sample:'([^']+)'", source))
for entry in re.findall(r"'([^']+:[^']+)'\.split\(' '\)", source):
    for item in entry.split(' '):
        samples.add(item.split(':')[1])
samples.update(['ma', 'ba', 'mi', 'tu', 'yi', 'wu'])
output = ROOT / 'public/audio'
output.mkdir(parents=True, exist_ok=True)

def fetch(pair):
    syllable, tone = pair
    name = f'{syllable}{tone}.mp3'
    path = f'64k/syllabs/cmn-{name}'
    url = f'https://raw.githubusercontent.com/{REPO}/{commit}/{path}'
    for attempt in range(3):
        try:
            data = urllib.request.urlopen(url, timeout=30).read()
            if len(data) < 1000 or data[:1] == b'<':
                raise ValueError(f'Invalid audio: {name}')
            (output / name).write_bytes(data)
            return {'file': name, 'source': url, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
        except Exception:
            if attempt == 2:
                raise
            time.sleep(1)

pairs = [(s, t) for s in sorted(samples) for t in range(1, 5)]
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
    manifest = list(pool.map(fetch, pairs))
(ROOT / 'public/audio-manifest.json').write_text(json.dumps({'repository': REPO, 'commit': commit, 'author': 'Chen Wang', 'license': 'CC-BY-SA (version not specified by upstream)', 'modifications': 'None; original files copied unchanged.', 'files': manifest}, indent=2) + '\n')
print(json.dumps({'commit': commit, 'files': len(manifest), 'bytes': sum(x['bytes'] for x in manifest)}))
