export interface Period {
  slug: string;
  name: string;
  range: string;
  shortDescription: string;
  description: string;
  children?: Period[];
}

export const periods: Period[] = [
  {
    slug: 'prehistory',
    name: 'Prehistory & the Stone Age',
    range: 'c. 2.6 million years ago – 3300 BCE',
    shortDescription:
      'From the first stone tools and migrations out of Africa to the beginnings of agriculture and settled life.',
    description:
      'The Indian subcontinent preserves evidence of human presence stretching back more than two million years. This immense prehistoric span encompasses the entire Stone Age — from the earliest tool-making hominins who left Africa, through the arrival and expansion of anatomically modern humans, to the development of microlith technologies and the first farming villages that would eventually give rise to urban civilization.',
    children: [
      {
        slug: 'paleolithic',
        name: 'Paleolithic Age',
        range: 'c. 2.6 mya – 10,000 BCE',
        shortDescription:
          'Earliest tool-making hominins and the arrival of anatomically modern humans from Africa.',
        description:
          'Divided into Lower, Middle, and Upper phases. The critical development for later populations was the migration of Homo sapiens out of Africa in one or more waves beginning roughly 70,000–50,000 years ago. Important rock shelter and open-air sites (Bhimbetka, Jwalapuram, etc.) preserve stone tools, art, and evidence of adaptation to diverse environments.',
        children: [
          {
            slug: 'lower-paleolithic',
            name: 'Lower Paleolithic',
            range: 'c. 2.6 mya – 300,000 ya',
            shortDescription: 'The earliest stone-tool traditions, including Acheulean handaxes and cleavers.',
            description:
              'The Lower Paleolithic preserves the subcontinent’s earliest stone-tool traditions. Acheulean handaxes, cleavers, flakes, and manufacturing debris occur at sites including Attirampakkam and across the Siwalik hills, Narmada valley, Rajasthan, and the Deccan. The identity of the hominins who made many of these tools remains uncertain.'
          },
          {
            slug: 'middle-paleolithic',
            name: 'Middle Paleolithic',
            range: 'c. 300,000 – 50,000 ya',
            shortDescription: 'Prepared-core methods and increasingly varied flake-based toolkits.',
            description:
              'Middle Paleolithic toolmakers increasingly relied on prepared cores, points, scrapers, and deliberately shaped flakes. At Attirampakkam, processes marking this transition began around 385,000 years ago, earlier than the conventional boundary suggests. The makers cannot be identified securely because the relevant layers have not yielded hominin fossils.'
          },
          {
            slug: 'upper-paleolithic',
            name: 'Upper Paleolithic',
            range: 'c. 50,000 – 10,000 BCE',
            shortDescription: 'Blade technologies, expanding Homo sapiens populations, and late Ice Age adaptations.',
            description:
              'The Upper Paleolithic spans the expansion of Homo sapiens across diverse South Asian environments and the increasing use of blades and other specialised tools. Its final millennia overlap the dramatic shoreline changes that followed the last Ice Age, when rising seas submerged large areas of the continental shelf.'
          }
        ]
      },
      {
        slug: 'mesolithic',
        name: 'Mesolithic',
        range: 'c. 10,000 – 7000 BCE',
        shortDescription:
          'Post-glacial hunter-gatherers equipped with tiny, precisely made microlith tools.',
        description:
          'Following the end of the last Ice Age, communities across the subcontinent developed highly efficient microlithic toolkits for hunting, fishing, and plant processing. Seasonal camps and increasing knowledge of local ecologies are visible in sites from the Ganges plains to the Deccan and Sri Lanka.'
      },
      {
        slug: 'neolithic',
        name: 'Neolithic',
        range: 'c. 7000 – 3300 BCE',
        shortDescription:
          'The Neolithic revolution: farming, animal domestication, and the first permanent villages.',
        description:
          'In the northwest, at Mehrgarh and related sites, people began cultivating wheat and barley and herding sheep, goats, and cattle. Mud-brick architecture, pottery, ornaments, and long-distance exchange networks appear — the direct precursors to the Sindhu Saraswati Vedic Civilization.'
      }
    ]
  },
  {
    slug: 'indus-valley',
    name: 'Sindhu Saraswati Vedic Civilization',
    range: 'c. 3300 – 1300 BCE',
    shortDescription:
      'The Bronze Age urban culture of the Indus and Saraswati valleys (Sindhu-Saraswati), representing the material expression of early Vedic civilization.',
    description:
      'Also known as the Harappan or Indus Valley Civilization. Centered on the Indus and Ghaggar-Hakra (Saraswati) river systems, it featured remarkably uniform urban planning, baked-brick architecture, advanced drainage and water management, standardized weights and measures, seals, and long-distance trade. The script remains undeciphered. In this view, the Indo-Aryans (Vedic people) were indigenous to the Indian subcontinent. The Vedic period overlaps substantially with the urban Sindhu-Saraswati phase; the Rigveda and early Vedic culture are contemporary with the mature Harappan cities (c. 2500–1900 BCE). There was no Aryan invasion or large-scale migration into India. Instead, the Vedic Aryans developed here, and groups later migrated outward from India. The decline of the urban centers around 1900–1300 BCE was due to environmental factors (climate change, tectonic activity, shifting river courses), not conquest, and the cultural and linguistic tradition continued without break.',
    children: [
      {
        slug: 'mature-harappan',
        name: 'Mature Phase',
        range: 'c. 2600 – 1900 BCE',
        shortDescription: 'The peak urban phase with the great cities of the Indus-Saraswati region.',
        description:
          'This is the period of the largest planned cities, sophisticated craft production, granaries, the Great Bath at Mohenjo-daro, citadels, and the most extensive trade networks. Standardized artifacts and urban planning define the Mature phase.'
      }
    ]
  },
  {
    slug: 'early-historic',
    name: 'Early Historic Period',
    range: 'c. 600 – 185 BCE',
    shortDescription:
      'The era beginning with the Buddha and Mahavira, the Mahajanapadas, and the Mauryan Empire (following the late Vedic period).',
    description:
      'This period opens with the teachings of the Buddha (c. 563–483 BCE) and Mahavira (c. 599–527 BCE). It follows the late Vedic period and encompasses the second urbanization in the Gangetic plains, the rise of the sixteen Mahajanapadas, the spread of Buddhism and Jainism, and the political unification of much of the subcontinent under the Mauryan dynasty (322–185 BCE).',
    children: [
      {
        slug: 'mauryan',
        name: 'Mauryan Empire',
        range: 'c. 322 – 185 BCE',
        shortDescription:
          'India’s first great empire, uniting much of the subcontinent under centralized rule.',
        description:
          'Founded by Chandragupta Maurya (with Chanakya’s counsel), the empire developed sophisticated administration, espionage, taxation, and road networks. Its most famous ruler, Ashoka (r. c. 268–232 BCE), after the bloody Kalinga War, embraced Buddhism and non-violence. He inscribed moral and administrative edicts on rocks and pillars throughout the realm and sent Buddhist missions abroad. The empire fragmented after Ashoka’s death.'
      }
    ]
  },
  {
    slug: 'classical',
    name: 'Classical Period',
    range: 'c. 320 – 750 CE',
    shortDescription:
      'The Gupta Empire and a golden age of Indian science, literature, and art, followed by powerful regional kingdoms.',
    description:
      'The Gupta dynasty (c. 320–550 CE) is celebrated as a golden age, with major advances in mathematics (including the concept of zero), astronomy (Aryabhata), medicine (Sushruta and Charaka traditions), and Sanskrit literature (Kalidasa). Hindu temple architecture flourished, and the Puranas codified religious narratives. After the Guptas, the subcontinent fragmented into regional powers such as Harsha in the north and the Chalukya and Pallava dynasties in the south, which patronized art, trade, and the spread of Indian culture to Southeast Asia.'
  },
  {
    slug: 'medieval',
    name: 'Medieval Period',
    range: 'c. 750 – 1750 CE',
    shortDescription:
      'Delhi Sultanate, Vijayanagara Empire, and the Mughal Empire, with Indo-Islamic cultural synthesis and monumental architecture.',
    description:
      'This era saw the establishment of Muslim sultanates in the north (Delhi Sultanate from 1206 CE) and the powerful Hindu Vijayanagara Empire in the south (1336–1646). The Mughal Empire (1526–1857) unified much of the subcontinent under a sophisticated administration. The period is marked by a rich synthesis of Persian, Central Asian, and Indian traditions in art, architecture (Qutub Minar, Taj Mahal, forts of Delhi and Agra), cuisine, music, and language (Urdu). The Bhakti and Sufi movements promoted devotional religion and social reform across communities.',
    children: [
      {
        slug: 'mughal',
        name: 'Mughal Empire',
        range: 'c. 1526 – 1857 CE',
        shortDescription:
          'A vast and sophisticated empire known for its administrative system, religious policies, and enduring architectural legacy.',
        description:
          'Founded by Babur, the empire was consolidated and expanded by Akbar, who introduced tolerant religious policies (including Din-i-Ilahi) and efficient revenue systems (Zabt). Shah Jahan’s reign saw the construction of the Taj Mahal and other masterpieces. Aurangzeb extended the empire to its greatest territorial extent but also faced prolonged conflicts. The empire gradually weakened in the 18th century due to succession disputes, regional rebellions (including the Marathas and Sikhs), and the growing influence of European trading companies, formally ending after the 1857 revolt.'
      }
    ]
  },
  {
    slug: 'colonial',
    name: 'Colonial Period',
    range: 'c. 1757 – 1947 CE',
    shortDescription:
      'British colonial domination through the East India Company and the Crown, economic transformation, and the Indian independence movement.',
    description:
      'British political control began with the Battle of Plassey (1757) and the subsequent expansion of the East India Company. Following the widespread revolt of 1857, India came under direct Crown rule. The colonial era brought modern infrastructure (railways, telegraph, universities) and legal institutions, but also deindustrialization, heavy taxation, and several devastating famines. It witnessed the emergence of modern nationalism through the Indian National Congress (1885), social reform movements, and mass campaigns led by Mahatma Gandhi, Jawaharlal Nehru, Sardar Patel, Subhas Chandra Bose, and many others, culminating in independence on 15 August 1947, accompanied by the Partition of India and Pakistan.'
  },
  {
    slug: 'modern',
    name: 'Modern India',
    range: '1947 CE – present',
    shortDescription:
      'Independent India as a constitutional democracy, with economic liberalization, technological rise, and an expanding global role.',
    description:
      'Since independence, India has maintained the world’s largest democracy, adopting a progressive Constitution in 1950. The early decades focused on nation-building, planned economic development, non-alignment in foreign policy (under Nehru), and social justice measures. The Green Revolution transformed agriculture. The 1991 economic liberalization unleashed rapid growth, particularly in information technology and services. India became a nuclear power, a major space agency (ISRO), and an influential voice in international forums (G20 presidency, BRICS, Quad). Contemporary India grapples with challenges of inclusive development, communal harmony, environmental sustainability, and geopolitical positioning, while celebrating its pluralistic heritage and youthful demographic dividend.'
  }
];

export type PolityKind = 'empire' | 'regional-kingdom';

export interface Theme {
  slug: string;
  name: string;
  range: string;
  shortDescription: string;
  description: string;
}

export interface Personality {
  slug: string;
  name: string;
  range: string;
  shortDescription: string;
  description: string;
}

export const themes: Theme[] = [
  {
    slug: 'the-vedas',
    name: 'The Vedas',
    range: 'c. 3300 – 1900 BCE',
    shortDescription: 'Vedic hymns, ritual culture, oral transmission, and the religious ideas that shaped early Indian civilization.',
    description: 'The Vedas preserve a vast body of sacred poetry, ritual practice, philosophy, and social memory transmitted orally across generations. This theme gathers articles on Vedic culture, early Sanskrit traditions, ritual specialists, cosmology, and the long influence of Vedic ideas on later Indian thought.'
  },
  {
    slug: 'indigenous-aryanism-out-of-india-theory',
    name: 'Indigenous Aryanism - Out of India Theory',
    range: 'c. 3300 – 1900 BCE',
    shortDescription: 'Arguments that Vedic Aryans were indigenous to India and that Indo-European dispersals moved outward from the subcontinent.',
    description: 'This theme gathers articles on Indigenous Aryanism and the Out of India Theory, including debates over the Rigveda, the Sindhu-Saraswati or Harappan world, archaeology, river systems, linguistic dispersal, and competing models for Indo-European origins.'
  },
  {
    slug: 'rise-of-buddhism-jainism',
    name: 'Rise of Buddhism & Jainism',
    range: 'c. 6th century BCE onward',
    shortDescription: 'The shramana movements, the Buddha and Mahavira, monastic communities, royal patronage, and the spread of new ethical traditions.',
    description: 'Buddhism and Jainism emerged during a period of urbanization, debate, and social change in the Gangetic plains. This theme follows the lives and teachings of the Buddha and Mahavira, monastic institutions, imperial patronage, pilgrimage sites, and the spread of these traditions across and beyond India.'
  },
  {
    slug: 'islamic-conquest-of-india',
    name: 'Islamic Conquest of India',
    range: 'c. 8th century – 1799 CE',
    shortDescription: 'Arab, Turkic, Afghan, and Central Asian campaigns, sultanates, resistance, and the formation of Indo-Islamic political cultures.',
    description: 'This theme covers the long and uneven expansion of Muslim-ruled polities into the subcontinent, from early Arab incursions to the Delhi Sultanate, Timurid (Mughal) rule, and later powers, extending through Tipu Sultan’s rule in Mysore. It includes campaigns, state formation, regional resistance, cultural exchange, and the political transformations of the medieval and early modern periods.'
  },
  {
    slug: 'colonization-of-india',
    name: 'Colonization of India',
    range: 'c. 1498 – 1947 CE',
    shortDescription: 'European trading companies, British expansion, Crown rule, economic change, resistance, nationalism, and independence.',
    description: 'European colonization reshaped the subcontinent through trade, conquest, administration, extraction, and new institutions. This theme traces the Portuguese arrival, the growth of the East India Company, British Crown rule, social and economic consequences, anticolonial movements, and the road to independence.'
  },
  {
    slug: 'partition-of-india',
    name: 'Partition of India',
    range: '1947 CE',
    shortDescription: 'The division of British India into India and Pakistan, mass migration, communal violence, and the reshaping of South Asian politics.',
    description: 'The Partition of India accompanied independence in 1947, creating the dominions of India and Pakistan and triggering one of the largest forced migrations in modern history. This theme covers the political negotiations, boundary-making, refugee movements, communal violence, princely state questions, and the enduring consequences for India, Pakistan, Bangladesh, and the wider subcontinent.'
  }
];

export const personalities: Personality[] = [
  {
    slug: 'gautama-buddha',
    name: 'Gautama Buddha',
    range: 'c. 6th – 5th century BCE',
    shortDescription: 'Founder of Buddhism, whose teachings on suffering, ethics, and liberation reshaped Indian and Asian religious history.',
    description: 'Gautama Buddha taught in the Gangetic plains during the age of the mahajanapadas. His teachings on the Four Noble Truths, the Middle Way, monastic discipline, and liberation gave rise to Buddhist communities that later spread across Asia.'
  },
  {
    slug: 'mahavira',
    name: 'Mahavira',
    range: 'c. 6th century BCE',
    shortDescription: 'The twenty-fourth Jain tirthankara, associated with ahimsa, ascetic discipline, and the consolidation of Jain teaching.',
    description: 'Mahavira taught a rigorous path of non-violence, self-discipline, and liberation from karmic bondage. His life and teachings helped shape Jain monastic and lay communities across ancient India.'
  },
  {
    slug: 'chandragupta-maurya',
    name: 'Chandragupta Maurya',
    range: 'c. 340 – 297 BCE',
    shortDescription: 'Founder of the Maurya Empire, remembered for unifying large parts of northern India with Chanakya’s counsel.',
    description: 'Chandragupta Maurya overthrew earlier powers in the Gangetic region and founded India’s first major imperial state. His reign is associated with centralized administration, military expansion, and the political foundations inherited by Bindusara and Ashoka.'
  },
  {
    slug: 'bindusara',
    name: 'Bindusara',
    range: 'Early 3rd century BCE',
    shortDescription: 'Second Mauryan emperor, son of Chandragupta Maurya and father of Ashoka.',
    description: 'Bindusara ruled the Maurya Empire between Chandragupta Maurya and Ashoka. Later Jain and Buddhist traditions preserve different legends about his birth and name, recorded centuries after his lifetime.'
  },
  {
    slug: 'ashoka',
    name: 'Ashoka the Great',
    range: 'r. c. 268 – 232 BCE',
    shortDescription: 'Mauryan emperor whose edicts, Buddhist patronage, and moral statecraft shaped the subcontinent and beyond.',
    description: 'Ashoka ruled much of the Indian subcontinent after the Mauryan expansion. Following the Kalinga War, he promoted dhamma, welfare, religious tolerance, and Buddhist missions through inscriptions, monuments, and imperial patronage.'
  },
  {
    slug: 'firuz-shah-tughlaq',
    name: 'Firuz Shah Tughlaq',
    range: 'r. 1351 – 1388 CE',
    shortDescription: 'Sultan of Delhi known for public works, the taxation of Brahmins, and religious persecution.',
    description: 'Firuz Shah Tughlaq ruled the Delhi Sultanate from 1351 to 1388. His reign saw building and irrigation projects alongside religious coercion. Shams-i Siraj Afif records the burning of a Brahmin who refused conversion; the sultan’s own account describes temple destruction and incentives to convert.'
  },
  {
    slug: 'rana-kumbha',
    name: 'Rana Kumbha',
    range: 'r. 1433 – 1468 CE',
    shortDescription: 'Ruler of Mewar, victor against Malwa, and patron of Vijay Stambha and Kumbhalgarh.',
    description: 'Rana Kumbha strengthened Mewar through warfare, fort building, religious patronage, and scholarship during the fifteenth century.'
  },
  {
    slug: 'rana-sanga',
    name: 'Rana Sanga',
    range: 'Early 16th century CE',
    shortDescription: 'Ruler of Mewar who challenged Delhi, Malwa, and the emerging Mughal power.',
    description: 'Rana Sanga led a coalition against Babur at Khanwa in 1527. His defeat checked Mewar\'s wider ambitions, but the kingdom survived.'
  },
  {
    slug: 'udai-singh-ii',
    name: 'Udai Singh II',
    range: '16th century CE',
    shortDescription: 'Ruler of Mewar who founded Udaipur before Akbar captured Chittor.',
    description: 'Udai Singh II founded Udaipur in 1559. He withdrew into the hills during Akbar\'s siege of Chittor, preserving the ruling house.'
  },
  {
    slug: 'maharana-pratap',
    name: 'Maharana Pratap',
    range: 'r. 1572 – 1597 CE',
    shortDescription: 'Ruler of Mewar remembered for Haldighati and sustained resistance to Akbar.',
    description: 'Maharana Pratap continued resistance after Haldighati in 1576 and recovered substantial territory. Chittor and Mandalgarh remained outside his recovery.'
  },
  {
    slug: 'jaimal',
    name: 'Jaimal',
    range: '16th century CE',
    shortDescription: 'Commander remembered for defending Chittor during Akbar\'s siege.',
    description: 'Jaimal helped lead Chittor\'s defence during the Mughal siege of 1567–1568. His stand became central to Mewar\'s memory of valour.'
  },
  {
    slug: 'patta',
    name: 'Patta',
    range: '16th century CE',
    shortDescription: 'Defender of Chittor remembered alongside Jaimal for the fort\'s last stand.',
    description: 'Patta was among the commanders who defended Chittor against Akbar. The fort fell in February 1568 after prolonged resistance.'
  },
  {
    slug: 'amar-singh-i',
    name: 'Amar Singh I',
    range: 'Early 17th century CE',
    shortDescription: 'Pratap\'s successor, whose settlement with the Mughals preserved Mewar\'s hereditary rule.',
    description: 'Amar Singh I accepted Mughal supremacy in 1615 after prolonged warfare. The settlement preserved Mewar\'s ruling house while limiting its independence.'
  },
  {
    slug: 'raj-singh-i',
    name: 'Raj Singh I',
    range: 'r. 1652 – 1680 CE',
    shortDescription: 'Ruler of Mewar during renewed conflict with Aurangzeb.',
    description: 'Raj Singh I ruled Mewar during changing relations with the Mughal court. His reign saw renewed war with Aurangzeb and the invasion of 1680.'
  },
  {
    slug: 'akbar',
    name: 'Akbar',
    range: 'r. 1556 – 1605 CE',
    shortDescription: 'Mughal emperor known for imperial consolidation, administrative reform, and experiments in religious accommodation.',
    description: 'Akbar expanded and stabilized Mughal rule through military campaigns, the mansabdari system, revenue reforms, and alliances with regional elites. His court became known for translation projects, debate, and policies of religious accommodation.'
  },
  {
    slug: 'shivaji',
    name: 'Shivaji',
    range: 'c. 1630 – 1680 CE',
    shortDescription: 'Founder of the Maratha state, known for fort warfare, naval policy, and resistance to larger imperial powers.',
    description: 'Shivaji built a resilient Maratha kingdom in western India through mobile warfare, fort networks, administrative innovation, and symbolic kingship. His career became central to later Maratha expansion and political memory.'
  },
  {
    slug: 'tipu-sultan',
    name: 'Tipu Sultan',
    range: 'r. 1782 – 1799 CE',
    shortDescription: 'Ruler of Mysore who resisted British expansion and pursued military, diplomatic, and administrative modernization.',
    description: 'Tipu Sultan ruled Mysore during intense conflict with the British East India Company and its allies. His reign is associated with military innovation, diplomacy with foreign powers, state-led economic measures, and the Anglo-Mysore Wars.'
  },
  {
    slug: 'mahatma-gandhi',
    name: 'Mahatma Gandhi',
    range: '1869 – 1948 CE',
    shortDescription: 'Leader of mass anticolonial movements who made satyagraha and non-violent resistance central to Indian nationalism.',
    description: 'Mahatma Gandhi transformed Indian nationalism through satyagraha, non-cooperation, civil disobedience, and mass mobilization. His political methods, social campaigns, and moral language shaped the independence movement and global traditions of non-violent protest.'
  }
];

export interface Polity {
  slug: string;
  name: string;
  range: string;
  shortDescription: string;
  description: string;
  kind: PolityKind;
  period: string; // maps to a broad period slug for cross-referencing
  parent?: string; // optional parent polity grouping
}

export const polities: Polity[] = [
  {
    slug: 'maurya',
    name: 'Maurya Empire',
    range: 'c. 322 – 185 BCE',
    shortDescription: 'India’s first pan-subcontinental empire, founded by Chandragupta and expanded under Ashoka.',
    description: 'Unified much of the Indian subcontinent with a centralized administration, extensive road networks, and a sophisticated bureaucracy. Ashoka’s embrace of Buddhism after the Kalinga War led to the spread of dharma through edicts and missionaries.',
    kind: 'empire',
    period: 'early-historic'
  },
  {
    slug: 'gupta',
    name: 'Gupta Empire',
    range: 'c. 320 – 550 CE',
    shortDescription: 'Often called the Golden Age of India, with major advances in science, art, and literature.',
    description: 'Under rulers like Chandragupta I, Samudragupta, and Chandragupta II (Vikramaditya), the empire saw the flourishing of Sanskrit literature (Kalidasa), mathematics (Aryabhata and the concept of zero), astronomy, and Hindu temple architecture. The Puranas were compiled and classical Indian culture reached new heights.',
    kind: 'empire',
    period: 'classical'
  },
  {
    slug: 'chola',
    name: 'Chola Empire',
    range: 'c. 300 BCE – 1279 CE (imperial peak 9th–13th centuries)',
    shortDescription: 'One of the longest-ruling dynasties in Indian history, renowned for its navy, temple architecture, and trade networks.',
    description: 'The imperial Cholas (Rajaraja I and Rajendra I) built a powerful maritime empire that controlled large parts of South India, Sri Lanka, and even raided Southeast Asia. They constructed magnificent temples (Brihadeeswarar at Thanjavur), developed sophisticated irrigation, and promoted Tamil literature and Shaivism.',
    kind: 'empire',
    period: 'medieval'
  },
  {
    slug: 'delhi-sultanate',
    name: 'Delhi Sultanate',
    range: 'c. 1206 – 1526 CE',
    shortDescription: 'A series of five dynasties that established Muslim rule in northern India from Delhi.',
    description: 'Including the Mamluk (Slave), Khilji, Tughlaq, Sayyid, and Lodi dynasties. The period saw the introduction of new administrative systems, Persian culture, Indo-Islamic architecture (Qutub Minar, Alai Darwaza), and the beginning of the Bhakti movement in response to social changes.',
    kind: 'empire',
    period: 'medieval'
  },
  {
    slug: 'vijayanagara',
    name: 'Vijayanagara Empire',
    range: 'c. 1336 – 1646 CE',
    shortDescription: 'The last great Hindu empire of South India, a bulwark against northern sultanates.',
    description: 'Founded by Harihara and Bukka, it reached its zenith under Krishnadevaraya. Famous for the magnificent ruins at Hampi (UNESCO site), patronage of Telugu, Kannada and Sanskrit literature, and a highly organized military and administrative system. It promoted a distinct Dravidian architectural style.',
    kind: 'empire',
    period: 'medieval'
  },
  {
    slug: 'mughal',
    name: 'Mughal Empire',
    range: 'c. 1526 – 1857 CE',
    shortDescription: 'One of the largest and most powerful empires in Indian history, known for its administration, art, and architecture.',
    description: 'Founded by Babur after the First Battle of Panipat. Akbar’s reign is noted for religious tolerance, the mansabdari system, and cultural synthesis. Shah Jahan built the Taj Mahal and Red Fort. Aurangzeb expanded the empire to its greatest extent. The empire left a lasting legacy in art, cuisine, language (Urdu), and monumental architecture.',
    kind: 'empire',
    period: 'medieval'
  },
  {
    slug: 'maratha',
    name: 'Maratha Empire / Confederacy',
    range: 'c. 1674 – 1818 CE',
    shortDescription: 'A powerful Hindu confederacy that rose against Mughal rule and dominated much of the subcontinent.',
    description: 'Founded by Shivaji, who established an independent Maratha kingdom with innovative guerrilla warfare (ganimi kava) and a progressive administration. Under the Peshwas, the Marathas expanded across India, challenging both the Mughals and later the British, until their defeat in the Anglo-Maratha Wars.',
    kind: 'empire',
    period: 'medieval'
  },
  {
    slug: 'sikh',
    name: 'Sikh Empire',
    range: 'c. 1799 – 1849 CE',
    shortDescription: 'A powerful empire in the Punjab founded by Maharaja Ranjit Singh.',
    description: 'Unified the Sikh misls and expanded to include parts of present-day Pakistan, Kashmir, and Himachal. Known for its secular administration, modern army (with European officers), and religious tolerance. The empire ended after the Anglo-Sikh Wars, after which Punjab was annexed by the British.',
    kind: 'empire',
    period: 'colonial'
  },
  {
    slug: 'east-india-company',
    name: 'British East India Company',
    range: 'c. 1757 – 1858 CE',
    shortDescription: 'The corporate entity that gradually established British political control over India.',
    description: 'After the Battle of Plassey (1757) and Buxar (1764), the Company acquired the diwani (revenue rights) of Bengal. Through wars, treaties, and the doctrine of lapse, it annexed large territories. The 1857 Revolt led to the end of Company rule and the assumption of direct governance by the British Crown.',
    kind: 'empire',
    period: 'colonial'
  },
  {
    slug: 'british-raj',
    name: 'British Raj (Crown Rule)',
    range: 'c. 1858 – 1947 CE',
    shortDescription: 'Direct British colonial rule over the Indian subcontinent under the British Crown.',
    description: 'Established after the Government of India Act 1858. Characterized by the Indian Civil Service, railways, telegraph, Western education, and a policy of “divide and rule.” It also saw the growth of Indian nationalism, the Indian National Congress, and the Muslim League, leading to the independence movement and eventual Partition.',
    kind: 'empire',
    period: 'colonial'
  },
  {
    slug: 'pallava',
    name: 'Pallava Kingdom',
    range: 'c. 275 – 897 CE',
    shortDescription: 'South Indian dynasty renowned for rock-cut temples, Sanskrit scholarship, and the port of Mamallapuram.',
    description: 'The Pallavas of Kanchipuram were a major power in the Tamil region during the classical period. They pioneered Dravidian rock-cut architecture (the Pancha Rathas and Shore Temple at Mamallapuram are UNESCO sites) and were great patrons of Sanskrit and Tamil literature. Their naval expeditions and rivalry with the Chalukyas and Cholas shaped early medieval South Indian politics.',
    kind: 'regional-kingdom',
    period: 'classical'
  },
  {
    slug: 'rajputs',
    name: 'Rajputs',
    range: 'Medieval to modern India',
    shortDescription: 'Rajput-ruled states, including Mewar, and their forts, courts, alliances, and resistance.',
    description: 'Explore the distinct histories of Rajput-ruled kingdoms, their forts, courts, dynasties, and changing relationships with neighbouring powers.',
    kind: 'regional-kingdom',
    period: 'medieval'
  },
  {
    slug: 'mewar',
    name: 'Mewar',
    range: 'Medieval to modern India',
    shortDescription: 'The Sisodia kingdom of Chittor and Udaipur, associated with Rana Kumbha and Maharana Pratap.',
    description: 'Explore Mewar through the forts of Chittor and Kumbhalgarh, the court at Udaipur, resistance, political settlements, and integration into Rajasthan.',
    kind: 'regional-kingdom',
    period: 'medieval',
    parent: 'rajputs'
  },
  {
    slug: 'marwar',
    name: 'Marwar (Jodhpur)',
    range: 'Medieval to modern India',
    shortDescription: 'The Rathore kingdom centred on Jodhpur and the stronghold of Mehrangarh.',
    description: 'Explore Marwar through its Rathore rulers, the city of Jodhpur, Mehrangarh Fort, and changing relationships with neighbouring states and empires.',
    kind: 'regional-kingdom',
    period: 'medieval',
    parent: 'rajputs'
  },
  {
    slug: 'amber-jaipur',
    name: 'Amber–Jaipur',
    range: 'Medieval to modern India',
    shortDescription: 'The Kachwaha kingdom with successive capitals at Amber and Jaipur.',
    description: 'Explore the Kachwaha state through Amber Fort, the planned city of Jaipur, royal patronage, diplomacy, and service at the Mughal court.',
    kind: 'regional-kingdom',
    period: 'medieval',
    parent: 'rajputs'
  },
  {
    slug: 'bikaner',
    name: 'Bikaner',
    range: 'Medieval to modern India',
    shortDescription: 'A Rathore kingdom of northern Rajasthan, associated with Rao Bika and Junagarh Fort.',
    description: 'Explore Bikaner through its Rathore dynasty, desert setting, Junagarh Fort, courtly culture, and relationships with larger imperial powers.',
    kind: 'regional-kingdom',
    period: 'medieval',
    parent: 'rajputs'
  },
  {
    slug: 'jaisalmer',
    name: 'Jaisalmer',
    range: 'Medieval to modern India',
    shortDescription: 'The Bhati kingdom of the Thar Desert, known for its hilltop fort and trading connections.',
    description: 'Explore Jaisalmer through its Bhati rulers, fortified city, desert trade routes, temples, and relationships with neighbouring powers.',
    kind: 'regional-kingdom',
    period: 'medieval',
    parent: 'rajputs'
  },
  {
    slug: 'bundi',
    name: 'Bundi',
    range: 'Medieval to modern India',
    shortDescription: 'A Hada Rajput kingdom of Hadoti, known for its forts, palaces, stepwells, and painting.',
    description: 'Explore Bundi through its Hada rulers, Taragarh Fort, palace architecture, water structures, painting traditions, and changing political alliances.',
    kind: 'regional-kingdom',
    period: 'medieval',
    parent: 'rajputs'
  },
  {
    slug: 'kota',
    name: 'Kota',
    range: 'Early modern to modern India',
    shortDescription: 'A Hada Rajput state that emerged from Bundi in the seventeenth century.',
    description: 'Explore Kota through its Hada rulers, the Chambal valley, palace collections, painting traditions, and its history as a distinct state after separation from Bundi.',
    kind: 'regional-kingdom',
    period: 'medieval',
    parent: 'rajputs'
  },
  {
    slug: 'hoysala',
    name: 'Hoysala Kingdom',
    range: 'c. 1026 – 1343 CE',
    shortDescription: 'Karnataka-based dynasty famous for its ornate soapstone temples at Belur, Halebidu, and Somnathpur.',
    description: 'Emerging in the Western Ghats, the Hoysalas under Vishnuvardhana and later rulers built a sophisticated kingdom in present-day Karnataka. Their temples represent the pinnacle of Hoysala architecture with intricate carvings. They played a key role in the politics between the declining Chalukyas and the rising Vijayanagara Empire, and patronized Kannada and Sanskrit literature.',
    kind: 'regional-kingdom',
    period: 'medieval'
  },
  {
    slug: 'kakatiya',
    name: 'Kakatiya Kingdom',
    range: 'c. 1163 – 1323 CE',
    shortDescription: 'Telugu kingdom centered at Warangal, known for irrigation works, the Ramappa Temple, and resistance to Delhi Sultanate.',
    description: 'The Kakatiyas ruled much of present-day Telangana and Andhra. They developed extensive tank irrigation systems that transformed agriculture in the Deccan plateau. Queen Rudrama Devi and Prataparudra are notable rulers. Their capital Warangal (with its famous fort and gateways) and the Ramappa Temple (a UNESCO site) showcase their architectural legacy before their defeat by the Delhi Sultanate forces.',
    kind: 'regional-kingdom',
    period: 'medieval'
  },
  {
    slug: 'ahom',
    name: 'Ahom Kingdom',
    range: 'c. 1228 – 1826 CE',
    shortDescription: 'Long-lasting kingdom in Assam that successfully resisted Mughal expansion and developed a unique administrative system.',
    description: 'Founded by Sukaphaa, the Tai-Ahom migrants established a powerful kingdom in the Brahmaputra valley. They adopted local customs while maintaining a distinct identity. The Ahoms are famous for the Battle of Saraighat (1671) where they defeated the Mughals under Lachit Borphukan. Their paik (labor service) system, extensive chronicles (Buranjis), and hydraulic engineering allowed them to rule for nearly 600 years until British annexation after the First Anglo-Burmese War.',
    kind: 'regional-kingdom',
    period: 'medieval'
  }
];

/** Recursively find a period by slug anywhere in the tree. */
export function findPeriod(slug: string, list: Period[] = periods): Period | undefined {
  for (const p of list) {
    if (p.slug === slug) return p;
    if (p.children) {
      const found = findPeriod(slug, p.children);
      if (found) return found;
    }
  }
  return undefined;
}

/** Find the direct parent of a given slug in the tree. */
export function findParent(slug: string, list: Period[] = periods): Period | undefined {
  for (const p of list) {
    if (p.children) {
      const isDirectChild = p.children.some((c) => c.slug === slug);
      if (isDirectChild) {
        return p;
      }
      const found = findParent(slug, p.children);
      if (found) return found;
    }
  }
  return undefined;
}

/** Return this period’s slug plus all descendant slugs (for article filtering). */
export function getSubtreeSlugs(period: Period): string[] {
  const slugs: string[] = [period.slug];
  if (period.children) {
    for (const child of period.children) {
      slugs.push(...getSubtreeSlugs(child));
    }
  }
  return slugs;
}

/** Get top-level (root) periods. */
export function getTopLevelPeriods(): Period[] {
  return periods;
}
