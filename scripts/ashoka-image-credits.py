"""Write provenance for public-domain Ashokan inscription facsimiles."""

from pathlib import Path
import json

media = Path(__file__).resolve().parents[1] / 'content' / 'media' / 'images'
for image in sorted(media.glob('ashoka-plate-*.jpg')):
    plate_id = image.stem.removeprefix('ashoka-plate-')
    data = {
        'file': image.name,
        'title': 'Facsimile of an Ashokan inscription',
        'author': 'Eugen Hultzsch (editor of the 1925 plate)',
        'source': 'Bibliotheca Polyglotta, University of Oslo; E. Hultzsch, Inscriptions of Asoka (1925)',
        'sourcePageUrl': f'https://www2.hf.uio.no/polyglotta/public/media/img_to_txt/{plate_id}.png',
        'publication': 'https://archive.org/details/InscriptionsOfAsoka.NewEditionByE.Hultzsch',
        'license': 'Public domain; 1925 publication, editor died 1927',
        'modifications': 'Resized to 2200 pixels maximum and converted to JPEG for this site.',
    }
    image.with_suffix('.license.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')

for name, source in [
    ('ashoka-bairat-edict.jpg', 'Ashoka_Inscriptions_Calcutta_Bairat_rock_inscription.jpg'),
    ('ashoka-queen-edict.jpg', "Ashoka_Inscriptions_Queen%27s_edict.jpg"),
]:
    data = {
        'file': name,
        'title': 'Facsimile of an Ashokan inscription',
        'author': 'Eugen Hultzsch (editor of the 1925 plate)',
        'source': 'Wikimedia Commons; E. Hultzsch, Inscriptions of Asoka (1925)',
        'sourcePageUrl': f'https://commons.wikimedia.org/wiki/File:{source}',
        'publication': 'https://archive.org/details/InscriptionsOfAsoka.NewEditionByE.Hultzsch',
        'license': 'Public domain',
        'modifications': 'None; rehosted from Wikimedia Commons.',
    }
    (media / name.replace('.jpg', '.license.json')).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
