"""Research-time generator for the Ashoka article drafts from reviewed source notes.

Input is the saved Bibliotheca Polyglotta transcription extracted with
parse-ashoka-source.py. The generated Markdown remains the editorial source.
"""

from html import escape, unescape
from pathlib import Path
import json
import re


ROOT = Path(__file__).resolve().parents[1]
SOURCE = json.loads(Path('/private/tmp/ashoka-source.json').read_text())
OUT = ROOT / 'content' / 'articles'
DATE = '2026-10-16T00:00:00.000Z'
ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV']
ROCK = [
    ('Animal sacrifice and the royal kitchen', 'Ashoka restricts animal sacrifice and says slaughter in the royal kitchen has sharply declined.', 'The opening rock edict connects public ritual with the king’s own kitchen. It records a reduction in the animals killed for food and promises to end even the remaining slaughter.'),
    ('Care for people and animals', 'The king describes medical treatment, useful plants, wells, and roadside trees for people and animals.', 'This edict presents welfare as a policy across Ashoka’s territory and among neighboring peoples. Its list of southern polities and a Greek king also shows the geographical reach claimed for the policy.'),
    ('Five-year tours of instruction', 'Officials are ordered to travel every five years and teach conduct toward parents, others, and living beings.', 'The order names three classes of officials and combines their regular administrative tours with moral instruction. It links public policy to family duties, generosity, restraint, and modest spending.'),
    ('The sound of dhamma', 'Ashoka contrasts violence and the old drum of war with the public spread of dhamma.', 'The fourth edict presents moral change as a result of royal instruction and describes the king’s wish that descendants continue it. Its account is a royal claim about improvement, not independent proof that violence ceased.'),
    ('Officers of dhamma', 'Ashoka describes appointing dhamma-mahamatras to work across religious groups and among vulnerable people.', 'This text is an unusually direct statement about the administration of dhamma. The officials are said to serve people of different communities and to attend to prisoners and others in difficulty.'),
    ('Reports at every hour', 'Ashoka says officials may report the people’s affairs to him wherever he is and at any time.', 'The king describes an administrative system for receiving reports even during meals or travel. He frames tireless attention to public business as a duty to all people.'),
    ('All religious groups', 'The king says members of all religious groups should be able to live throughout his realm.', 'This short edict values self-control and purity of mind across sects. It also warns that giving alone is insufficient without gratitude and disciplined conduct.'),
    ('Journeys for dhamma', 'Ashoka replaces royal pleasure tours with journeys involving gifts, visits to elders, and moral discussion.', 'The inscription contrasts earlier hunting excursions with Ashoka’s visit to Sambodhi after ten years of consecration. It then describes tours centered on giving and conversation about dhamma.'),
    ('Rituals and moral practice', 'The king questions customary ceremonies and recommends the continuing practice of dhamma instead.', 'This edict discusses rites associated with illness, marriage, birth, and travel. It argues that conduct toward servants, teachers, and living beings is a more lasting ceremony than occasional ritual.'),
    ('Fame is not enough', 'Ashoka says renown matters only when it helps people follow dhamma.', 'The king rejects glory as an end in itself and links his public reputation to moral behavior in present and future generations. The edict also stresses the effort demanded of rulers.'),
    ('The gift of dhamma', 'The king calls ethical conduct the highest kind of gift and social bond.', 'This short inscription explains dhamma through courtesy to servants, respect for parents, generosity, and avoiding harm to animals. It says these practices bring benefit in this life and beyond.'),
    ('Restraint in religious speech', 'Ashoka honors different religious groups and urges people to avoid careless attacks on other traditions.', 'The edict makes restraint of speech central to intergroup respect. It asks people to listen to and learn from other traditions while still supporting their own.'),
    ('After the conquest of Kalinga', 'Ashoka describes the suffering caused by the conquest of Kalinga and praises conquest by dhamma.', 'The thirteenth rock edict is the key inscription about Kalinga. It records killing, deportation, and grief, then sets moral influence above military victory, while still warning peoples on the frontier of royal power.'),
    ('Why the edicts differ', 'The king explains why inscriptions vary in length and wording from place to place.', 'This closing edict says that some messages were abbreviated, repeated, or adapted to local conditions. It also acknowledges that an inscription could contain omissions or a writer’s mistake.'),
]
PILLAR = [
    ('The rule of dhamma', 'Ashoka says moral rule requires effort, self-examination, and concern for this life and the next.', 'The first pillar edict introduces the later pillar series and connects just rule with zeal for dhamma. It also charges officials with helping the people.'),
    ('What dhamma means', 'The king defines dhamma through compassion, generosity, truthfulness, purity, and avoiding wrongdoing.', 'This edict gives one of the clearest brief definitions of Ashoka’s dhamma. It names moral qualities rather than a single religious doctrine.'),
    ('Examine your own faults', 'Ashoka urges people to notice their own anger, cruelty, pride, and envy as well as their good actions.', 'The third pillar edict turns attention from public gifts to personal self-scrutiny. The king warns that people tend to notice virtue in themselves and overlook wrongdoing.'),
    ('Justice and the rajukas', 'The king grants local officers authority while asking them to administer justice with fairness and restraint.', 'This edict concerns rajukas, officials responsible for many people. It discusses discretion in rewards and punishments and a three-day respite before an execution, showing that Ashoka’s moral program still operated within a penal state.'),
    ('Protection of animals', 'Ashoka names protected animals and limits slaughter, branding, and fishing on specified days.', 'The fifth pillar edict sets out concrete restrictions on killing and harming animals. Its species names are sometimes uncertain, and the rules include many exceptions and calendrical limits.'),
    ('Edicts for public welfare', 'The king reviews earlier inscriptions and says instructions on dhamma should be made known to all communities.', 'This edict looks back to the rock inscriptions and the king’s continuing effort to promote welfare. It explicitly discusses the circulation of instructions and respect for different groups.'),
    ('A royal review of dhamma', 'Ashoka reviews his policies on welfare, religious respect, officers, public works, and persuasion.', 'The longest pillar edict is a retrospective statement of policy. It names wells, shade trees, rest houses, medical care, officials, and gifts, while arguing that moral progress comes chiefly through persuasion.'),
]
SPECIAL = [
    ('ashoka-separate-rock-edict-1', 'Separate Rock Edict I: Justice in Kalinga', 'Ashoka instructs officials in newly conquered Kalinga to avoid arbitrary punishment and treat people fairly.', 'Addressed to officials at Tosali, this separate edict focuses on impartial justice and periodic inspection after the conquest of Kalinga. The Dhauli and Jaugada versions differ in their local addressees.', 364, 2, '1405670299', 'Dhauli'),
    ('ashoka-separate-rock-edict-2', 'Separate Rock Edict II: Trust on the frontier', 'Ashoka tells Kalinga’s officials to reassure people beyond the border and govern with patience.', 'The second separate edict asks officials to win the confidence of unconquered neighbors. It presents the king as a father to his subjects, while also relying on officers to make that claim credible.', 364, 4, '1405671324', 'Dhauli'),
    ('ashoka-minor-rock-edict-1', 'Minor Rock Edict I: Ashoka’s effort', 'Ashoka describes his commitment as a Buddhist lay follower and urges people of every rank to work earnestly.', 'The first minor rock edict survives in several local versions. The Rūpnāth version used here records the king’s own religious effort and asks both powerful and ordinary people to strive.', 399, 2, '1405685307', 'Rūpnāth'),
    ('ashoka-minor-rock-edict-2', 'Minor Rock Edict II: Everyday duties', 'The king urges obedience to parents and elders, truthfulness, and gentle treatment of living beings.', 'This brief companion to Minor Rock Edict I appears in southern inscriptions. The Brahmagiri version closes with an instruction to continue these moral practices.', 400, 2, '1405686323', 'Brahmagiri'),
    ('ashoka-bairat-edict', 'Bairat Edict: Texts for the Buddhist community', 'Ashoka recommends named Buddhist teachings to monks, nuns, and lay followers.', 'Also called the Bhabru edict, this message is addressed to the Buddhist Saṃgha. It names teachings the king considered especially valuable, making it distinct from the more general public language of many major edicts.', 383, 2, 'bairat', 'Bairat'),
    ('ashoka-schism-edict', 'Schism Edict: Unity of the Saṃgha', 'Ashoka orders officials to act against monks or nuns who divide the Buddhist community.', 'Versions of this minor pillar edict survive at Sarnath, Sanchi, and Kauśāmbī. The fuller Sarnath copy used here gives directions about publicizing the order to monastics and lay followers.', 377, 'sarnath', '1405684950', 'Sarnath'),
    ('ashoka-queens-edict', 'Queen’s Edict: Gifts of Karuvaki', 'Ashoka orders donations by Queen Karuvaki to be recorded in her name.', 'The queen’s edict on the Allahabad–Kauśāmbī pillar names Karuvaki as the mother of Tivala. It is a rare inscription that identifies a Mauryan royal woman by name.', 375, 'queen', 'queen', 'Allahabad–Kauśāmbī'),
    ('ashoka-lumbini-edict', 'Lumbini Pillar Edict: The Buddha’s birthplace', 'Ashoka records a visit to Lumbini and favorable tax treatment for the village where the Buddha was born.', 'The Rummindei pillar inscription identifies the place as the Buddha’s birthplace. Its damaged wording about taxation is interpreted in more than one way, so the exact fiscal measure remains debated.', 378, 2, '1405685215', 'Lumbini'),
    ('ashoka-nigali-sagar-edict', 'Nigali Sagar Pillar Edict: The Konakamana stupa', 'Ashoka records enlarging a stupa for the Buddha Konakamana and later visiting the site.', 'This short pillar inscription records two acts at different regnal dates: enlargement of the stupa and the king’s later visit. The facsimile shares a plate with the Lumbini inscription.', 378, 4, '1405685215', 'Nigali Sagar'),
]


def quote_yaml(value):
    return json.dumps(value, ensure_ascii=False)


def split_clauses(text):
    return [part.strip() for part in re.split(r'(?=\([A-Z]{1,2}\)\s)', text) if part.strip()]


def special_text(kind):
    page = (ROOT / f'/private/tmp/ashoka-uio-{kind}.html').read_text()
    blocks = re.findall(r"<div class='BolkContainer'>(.*?)<div class='clear'></div></div><div class='clear'></div>", page, re.S)
    block = blocks[2]
    columns = re.findall(r"<div class='(?:Magadhī|English)'>(.*?)</div></div>", block, re.S)
    def plain(value):
        value = re.sub(r'<script.*?</script>', '', value, flags=re.S)
        return re.sub(r'\s+', ' ', unescape(re.sub(r'<[^>]+>', ' ', value))).strip()
    if kind == 375:
        return plain(columns[0]), plain(columns[1])
    return plain(columns[4]), plain(columns[5])


def render(slug, title, excerpt, about, original, english, site, images, volume, category):
    if not original or not english or len(english) < 30:
        raise ValueError(f'Missing text for {slug}')
    image_markup = []
    for image in images:
        filename = f'ashoka-plate-{image}.jpg' if image.isdigit() else f'ashoka-{image}-edict.jpg'
        img_src = f'/assets/media/images/{filename}'
        alt = f'Brahmi inscription facsimile from {site} in Hultzsch’s 1925 edition'
        image_markup.append(f'<figure class="article-figure inscription-plate">\n  <img src="{img_src}" alt="{escape(alt)}" loading="lazy" decoding="async" />\n  <figcaption>{escape(site)} inscription facsimile. E. Hultzsch, <em>Inscriptions of Asoka</em> (1925), public domain.</figcaption>\n</figure>')
    source_url = f'https://www2.hf.uio.no/polyglotta/index.php?mid=0&page=fulltext&vid={volume}&view=fulltext'
    source_link = f'[Bibliotheca Polyglotta edition]({source_url})'
    body = f'''## About this edict

{about}

## Original script

{chr(10).join(image_markup)}

## Roman transliteration

The text below follows the {site} version in Hultzsch’s edition. Square brackets show restored or uncertain letters; dots mark damaged or missing text. Other surviving copies can differ.

<p class="inscription-transliteration" lang="pra-Latn">{escape(original)}</p>

## English translation

This is E. Hultzsch’s 1925 translation of the same version. Its terminology and bracketed restorations reflect that historical edition.

{chr(10).join('> ' + clause for clause in split_clauses(english))}

## Sources

- E. Hultzsch, [*Inscriptions of Asoka* (1925)](https://archive.org/details/InscriptionsOfAsoka.NewEditionByE.Hultzsch), *Corpus Inscriptionum Indicarum*, volume I.
- {source_link}, University of Oslo (Magadhi transliteration, English translation, and inscription facsimiles).
'''
    front = f'''---
title: {quote_yaml(title)}
slug: {slug}
excerpt: {quote_yaml(excerpt)}
publishedAt: {DATE}
updatedAt: {DATE}
period: early-historic
polity: maurya
personalities: [ashoka]
relatedTo: ashoka-edicts
tags: [Ashoka, edicts, {quote_yaml(category)}]
themes: []
books: []
---

'''
    (OUT / f'{slug}.md').write_text(front + body)
    return slug, title, excerpt, category


articles = []
rock_source = SOURCE['ashoka-uio-362']
for n, (topic, excerpt, about) in enumerate(ROCK, 1):
    site = 'Kalsi' if n in {5, 9, 10, 13} else 'Girnar'
    index = (33 if site == 'Kalsi' else 3) + 2 * (n - 1)
    item = rock_source[index]
    if site == 'Kalsi':
        images = ['1405552832', '1405553660'] if n == 13 else ['1405552832']
    else:
        images = [['1405441576'], ['1405441576'], ['1405540893'], ['1405540893'], ['1405540893'], ['1405541228'], ['1405541228'], ['1405541228'], ['1405544759'], ['1405544759'], ['1405544759'], ['1405544759'], ['1405552070'], ['1405552070']][n-1]
    articles.append(render(f'ashoka-major-rock-edict-{n}', f'Major Rock Edict {ROMAN[n]}: {topic}', excerpt, about, item['original'], item['english'], site, images, 362, 'major rock edict'))

for n, (topic, excerpt, about) in enumerate(PILLAR, 1):
    item = SOURCE['ashoka-uio-370'][2 * n]
    image = '1405674085' if n <= 3 else '1405674156' if n == 4 else '1405674217' if n == 5 else '1405674260'
    articles.append(render(f'ashoka-major-pillar-edict-{n}', f'Major Pillar Edict {ROMAN[n]}: {topic}', excerpt, about, item['original'], item['english'], 'Delhi–Topra', [image], 370, 'major pillar edict'))

for slug, title, excerpt, about, volume, index, image, site in SPECIAL:
    if index == 'queen': original, english = special_text(375)
    elif index == 'sarnath': original, english = special_text(377)
    else:
        item = SOURCE[f'ashoka-uio-{volume}'][index]
        original, english = item['original'], item['english']
    category = 'separate rock edict' if 'separate-rock' in slug else 'minor rock edict' if 'minor-rock' in slug or 'bairat' in slug else 'minor pillar edict'
    articles.append(render(slug, title, excerpt, about, original, english, site, [image], volume, category))

groups = [('Major rock edicts I–XIV', 'major rock edict'), ('Separate rock edicts I–II', 'separate rock edict'), ('Major pillar edicts I–VII', 'major pillar edict'), ('Minor rock edicts and Bairat message', 'minor rock edict'), ('Minor pillar edicts', 'minor pillar edict')]
lines = ['Ashoka’s inscriptions survive in copies at several sites. This guide gives one article per **distinct edict text**, not one article for each stone. Each article shows an original-script facsimile, the Roman transliteration of a named site version, a complete English translation from Hultzsch’s 1925 edition, and a short explanation. Damaged passages are marked as they appear in the edition.', '', 'The fourteen major rock edicts and seven major pillar edicts are numbered in modern scholarship. The separate Kalinga edicts and the shorter rock and pillar messages use their conventional names. The image on a page may show neighboring texts on the same stone or plate.', '']
for heading, category in groups:
    lines.append(f'## {heading}\n')
    for slug, title, excerpt, cat in articles:
        if cat == category:
            lines.append(f'- [{title}](/article/{slug}) — {excerpt}')
    lines.append('')
lines += ['## Reading the inscriptions', '', 'Ashoka commonly calls himself Devānāṃpriya Priyadarśin (“Beloved of the Gods, Piyadasi”). The surviving texts are mainly in regional forms of Prakrit; the northwestern copies use Kharoṣṭhī script, while many other copies use Brāhmī. Spellings, damaged passages, and even wording can vary between sites. The transliteration and translation in each article follow the version named there.', '', 'The cave-dedication inscriptions and the Greek and Aramaic inscriptions are separate parts of Ashoka’s wider epigraphic record; this index covers the standard edict series and the named minor edicts listed above.', '', '## Sources', '', '- E. Hultzsch, [*Inscriptions of Asoka* (1925)](https://archive.org/details/InscriptionsOfAsoka.NewEditionByE.Hultzsch), *Corpus Inscriptionum Indicarum*, volume I.', '- University of Oslo, [Bibliotheca Polyglotta Ashoka Library](https://www2.hf.uio.no/polyglotta/index.php?bid=14&page=library), edited from Hultzsch’s texts and translations.']
index_body = '\n'.join(lines) + '\n'
index_front = f'''---
title: "Ashoka’s edicts: complete guide to the major and minor texts"
slug: ashoka-edicts
excerpt: "Browse Ashoka’s major rock, separate rock, major pillar, and minor edicts. Each text has its own article with a facsimile, transliteration, translation, and explanation."
publishedAt: {DATE}
updatedAt: {DATE}
period: early-historic
polity: maurya
personalities: [ashoka]
tags: [Ashoka, edicts, inscriptions]
themes: []
books: []
---

'''
(OUT / 'ashoka-edicts.md').write_text(index_front + index_body)
print(f'Wrote {len(articles)} edict articles and one guide')
