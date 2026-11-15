# Personality timeline image review

Updated 2026-11-15. Every bubble in the other eighteen English timelines now has an image association: **804 bubbles, 129 distinct images**, including **93 newly sourced local images**. Shivaji’s existing 65 illustrated bubbles are retained. Images can repeat when the same place, person or object is relevant to several entries.

The shared catalogue is `content/data/personality-story-images.json`. Stable chapter identifiers associate the images with both approved narratives and revised English drafts; the narrative manuscripts and their translation hashes are unchanged. All 33 translation editions have authored image-type and subject labels. These associations do not approve the expanded English narratives. Approved stories show the images in normal mode; unapproved narrative versions remain English dev previews.

| Personality | English dev bubbles | Distinct images | Preview |
| --- | ---: | ---: | --- |
| Gautama Buddha | 50 | 13 | [Review](http://localhost:4201/personality/gautama-buddha?dev=true&lang=en#life-timeline) |
| Mahavira | 50 | 8 | [Review](http://localhost:4201/personality/mahavira?dev=true&lang=en#life-timeline) |
| Mahatma Gandhi | 50 | 17 | [Review](http://localhost:4201/personality/mahatma-gandhi?dev=true&lang=en#life-timeline) |
| Akbar | 50 | 17 | [Review](http://localhost:4201/personality/akbar?dev=true&lang=en#life-timeline) |
| Tipu Sultan | 50 | 10 | [Review](http://localhost:4201/personality/tipu-sultan?dev=true&lang=en#life-timeline) |
| Chandragupta Maurya | 50 | 7 | [Review](http://localhost:4201/personality/chandragupta-maurya?dev=true&lang=en#life-timeline) |
| Bindusara | 19 | 8 | [Review](http://localhost:4201/personality/bindusara?dev=true&lang=en#life-timeline) |
| Ashoka | 60 | 26 | [Review](http://localhost:4201/personality/ashoka?dev=true&lang=en#life-timeline) |
| Firuz Shah Tughlaq | 50 | 6 | [Review](http://localhost:4201/personality/firuz-shah-tughlaq?dev=true&lang=en#life-timeline) |
| Rani Durgavati | 50 | 9 | [Review](http://localhost:4201/personality/rani-durgavati?dev=true&lang=en#life-timeline) |
| Rana Kumbha | 50 | 9 | [Review](http://localhost:4201/personality/rana-kumbha?dev=true&lang=en#life-timeline) |
| Rana Sanga | 50 | 8 | [Review](http://localhost:4201/personality/rana-sanga?dev=true&lang=en#life-timeline) |
| Maharana Pratap | 50 | 14 | [Review](http://localhost:4201/personality/maharana-pratap?dev=true&lang=en#life-timeline) |
| Amar Singh I | 50 | 15 | [Review](http://localhost:4201/personality/amar-singh-i?dev=true&lang=en#life-timeline) |
| Udai Singh II | 50 | 14 | [Review](http://localhost:4201/personality/udai-singh-ii?dev=true&lang=en#life-timeline) |
| Raj Singh I | 50 | 13 | [Review](http://localhost:4201/personality/raj-singh-i?dev=true&lang=en#life-timeline) |
| Jaimal | 13 | 6 | [Review](http://localhost:4201/personality/jaimal?dev=true&lang=en#life-timeline) |
| Patta | 12 | 5 | [Review](http://localhost:4201/personality/patta?dev=true&lang=en#life-timeline) |

## Editorial choices

Historical artwork, modern sculpture, manuscripts, coins, archaeological remains, landscapes and historic photographs are identified by type. They illustrate associated subjects rather than pretending to be eyewitness records of every incident. Photograph and map dates are retained where supplied in the displayed label. The Rajputana map is explicitly dated 1909 and provides later geographical context; it does not assert the borders of any medieval ruler.

Ashoka’s bubbles use the corresponding inscription facsimiles from linked articles where available. Gandhi’s photographs are supplemented by associated places. Mewar timelines combine forts, palaces, historic maps and later paintings. Buddhist and Jain timelines use later religious art and associated sacred places. Bindusara’s limited record is illustrated with archaeology, coins and manuscript traditions, without an invented portrait. Incorrectly matched places in search results were rejected, including the Chauragarh pilgrimage site near Pachmarhi.

Images remain on the left of the text on desktop and stack above it on mobile, following the Shivaji layout. They use lazy loading, asynchronous decoding, local WebP pictures with JPEG fallback, fixed image dimensions, and the larger-image dialog. Inline copies fit within 640 × 640 pixels without cropping; the viewer loads the larger original website copy only when opened. The 129 inline WebP images average 52 KB, reducing their combined payload by 66% compared with the larger copies. Creator and licence are visible next to every image; linked originals, licence terms and modification notices appear in the final Image credits.

## Validation

234 tests and all translation checks pass. All nineteen English dev pages were checked in Chromium for complete image coverage, left-side layout, lazy WebP loading, enlargement and credit display. Normal and translated timelines retain their original chapter counts. Mobile stacking was checked at 390 px. Generated assets cover all 476 released personality editions (14 stories × 34 languages), with local JPEG/WebP files and dimensions.

The full root build packages the offline extension and ZIP. The installed extension was checked in an isolated browser profile with networking disabled, including English, Hindi and Korean images, image enlargement and article navigation, with no HTTP(S) requests. Unapproved narrative drafts remain excluded.

## Image provenance

Each image has a neighbouring `.license.json` source record. This table lists the image assets used by the shared catalogue; the public pages show the corresponding credits in their current language.

| Asset | Creator / source credit | Licence | Original |
| --- | --- | --- | --- |
| ashoka-bairat-edict.jpg | Eugen Hultzsch (editor of the 1925 plate) | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Ashoka_Inscriptions_Calcutta_Bairat_rock_inscription.jpg) |
| ashoka-kandahar-bilingual.jpg | Unknown photographer; ancient inscription | Public domain, as marked by Wikimedia Commons | [Source](https://commons.wikimedia.org/wiki/File:AsokaKandahar.jpg) |
| ashoka-plate-1405441576.jpg | Eugen Hultzsch (editor of the 1925 plate) | Public domain; 1925 publication, editor died 1927 | [Source](https://www2.hf.uio.no/polyglotta/public/media/img_to_txt/1405441576.png) |
| ashoka-plate-1405540893.jpg | Eugen Hultzsch (editor of the 1925 plate) | Public domain; 1925 publication, editor died 1927 | [Source](https://www2.hf.uio.no/polyglotta/public/media/img_to_txt/1405540893.png) |
| ashoka-plate-1405541228.jpg | Eugen Hultzsch (editor of the 1925 plate) | Public domain; 1925 publication, editor died 1927 | [Source](https://www2.hf.uio.no/polyglotta/public/media/img_to_txt/1405541228.png) |
| ashoka-plate-1405544759.jpg | Eugen Hultzsch (editor of the 1925 plate) | Public domain; 1925 publication, editor died 1927 | [Source](https://www2.hf.uio.no/polyglotta/public/media/img_to_txt/1405544759.png) |
| ashoka-plate-1405552832.jpg | Eugen Hultzsch (editor of the 1925 plate) | Public domain; 1925 publication, editor died 1927 | [Source](https://www2.hf.uio.no/polyglotta/public/media/img_to_txt/1405552832.png) |
| ashoka-plate-1405670299.jpg | Eugen Hultzsch (editor of the 1925 plate) | Public domain; 1925 publication, editor died 1927 | [Source](https://www2.hf.uio.no/polyglotta/public/media/img_to_txt/1405670299.png) |
| ashoka-plate-1405674156.jpg | Eugen Hultzsch (editor of the 1925 plate) | Public domain; 1925 publication, editor died 1927 | [Source](https://www2.hf.uio.no/polyglotta/public/media/img_to_txt/1405674156.png) |
| ashoka-plate-1405674217.jpg | Eugen Hultzsch (editor of the 1925 plate) | Public domain; 1925 publication, editor died 1927 | [Source](https://www2.hf.uio.no/polyglotta/public/media/img_to_txt/1405674217.png) |
| ashoka-plate-1405674260.jpg | Eugen Hultzsch (editor of the 1925 plate) | Public domain; 1925 publication, editor died 1927 | [Source](https://www2.hf.uio.no/polyglotta/public/media/img_to_txt/1405674260.png) |
| ashoka-plate-1405684950.jpg | Eugen Hultzsch (editor of the 1925 plate) | Public domain; 1925 publication, editor died 1927 | [Source](https://www2.hf.uio.no/polyglotta/public/media/img_to_txt/1405684950.png) |
| ashoka-plate-1405685215.jpg | Eugen Hultzsch (editor of the 1925 plate) | Public domain; 1925 publication, editor died 1927 | [Source](https://www2.hf.uio.no/polyglotta/public/media/img_to_txt/1405685215.png) |
| ashoka-plate-1405685307.jpg | Eugen Hultzsch (editor of the 1925 plate) | Public domain; 1925 publication, editor died 1927 | [Source](https://www2.hf.uio.no/polyglotta/public/media/img_to_txt/1405685307.png) |
| ashoka-queen-edict.jpg | Eugen Hultzsch (editor of the 1925 plate) | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Ashoka_Inscriptions_Queen%27s_edict.jpg) |
| ashoka-sanchi-southern-gateway.jpg | Photo Dharma | Creative Commons Attribution 2.0 Generic (CC BY 2.0) | [Source](https://commons.wikimedia.org/wiki/File:Ashoka%27s_visit_to_the_Ramagrama_stupa_Sanchi_Stupa_1_Southern_gateway.jpg) |
| chanakya-chandragupta-shaheedi-park.jpg | Pur 0 0 (photographer) | CC0 1.0 Universal Public Domain Dedication | [Source](https://commons.wikimedia.org/wiki/File:Sculpture_of_Chanakya_with_Chandragupta_Maurya.jpg) |
| firoz-shah-kotla-ashokan-pillar.jpg | IshiSenpai | Creative Commons Attribution-ShareAlike 4.0 International | [Source](https://commons.wikimedia.org/wiki/File:Feroz_Shah_Kotla_-_Back_View.jpg) |
| firoz-shah-kotla-panorama.jpg | Rangan Datta Wiki | Creative Commons Attribution-ShareAlike 4.0 International | [Source](https://commons.wikimedia.org/wiki/File:Ferozabad_Panorama.jpg) |
| ghazni-kalinjar-landscape.jpg | Ms Sarah Welch | CC0 | [Source](https://commons.wikimedia.org/wiki/File:0121921_Kalinjar_Fort_with_the_view_of_Vidhyachal_valleys,_Uttar_Pradesh_011.jpg) |
| ghazni-kangra-fort.jpg | Brahmavadini | CC BY 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Kangra_Fort,_Kangra,_Himachal_Pradesh.jpg) |
| hemachandra-yogashastra-manuscript.jpg | Medieval manuscript artist; text by Hemachandra; digital image: Cleveland Museum of Art | CC0 1.0 Universal Public Domain Dedication | [Source](https://commons.wikimedia.org/wiki/File:Hemachandra_-_Leaf_from_a_Jain_Manuscript-_Yoga-shastra-_Jain_monk_with_Disciple_and_Two_-_1971.128.1.b_-_Cleveland_Museum_of_Art.jpg) |
| kumbhalgarh-walls-mewar.jpg | Twinkle joshi04 | Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) | [Source](https://commons.wikimedia.org/wiki/File:Aerial_view_of_a_the_Kumbhalgarh_wall.jpg) |
| kumhrar-mauryan-hall-pillar.jpg | Manoj nav (photographer); Pataliputra! (2018 colour and lighting revision) | Public domain, released by the copyright holder (PD-self) | [Source](https://commons.wikimedia.org/wiki/File:Mauryan_Hall_pillar.jpg) |
| maharana-pratap-ravi-varma.jpg | Raja Ravi Varma (1848–1906) | Public domain (PD-Art; PD-old-100), as identified by Wikimedia Commons | [Source](https://commons.wikimedia.org/wiki/File:RajaRaviVarma_MaharanaPratap.jpg) |
| personality-aga-khan.jpg | Rangakuvara | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Aga_Khan_Palace_Gandhi_memorial.jpg) |
| personality-ahar.jpg | Shyamal L. | CC BY 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Ahar_Cenotaphs_3.jpg) |
| personality-ajmer.jpg | Zuck28 | CC BY 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Night_View_of_Ajmer_Sharif_Dargah.jpg) |
| personality-akbar-coin.jpg | Anonymous | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Silver_Rupee_Akbar.jpg) |
| personality-akbar-court.jpg | Basawan | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Court_of_Akbar_from_Akbarnama.jpg) |
| personality-akbar-portrait.jpg | Anonymous Mughal artist | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Contemporary_portrait_of_Akbar_in_1605.jpg) |
| personality-amar-portrait.jpg | anonymous | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Family_portrait_of_Maharana_Amar_Singh_I_of_Mewar.jpg) |
| personality-amar-submission.jpg | Mughal Artist La'lchand | Public domain | [Source](https://commons.wikimedia.org/wiki/File:The_Submission_of_Maharana_Amar_Singh_of_Mewar_to_Prince_Khurram_(Shah_Jahan).jpg) |
| personality-ashoka-lions.jpg | Apurv013 | CC0 | [Source](https://commons.wikimedia.org/wiki/File:Lion_Capital_of_Ashoka_3.jpg) |
| personality-badi-lake.jpg | Surenders25 | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Badi_Lake_Udaipur.jpg) |
| personality-bairam.jpg | Anonymous Mughal artist | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Bairam_Khan_in_1556_(portrait).jpg) |
| personality-barabar.jpg | Thomas Fraser Peppé | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Sudama_and_Lomas_Rishi_Caves_at_Barabar,_Bihar,_1870.jpg) |
| personality-bodhgaya.jpg | Sumitsurai | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Mahabodhi_Temple_South_Wall_(2).jpg) |
| personality-buddha-birth.jpg | Ismoon | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Birth_of_the_Buddha_Shakyamuni._Gandhara.Met.jpg) |
| personality-buddha-departure.jpg | Metropolitan Museum of Art, Open Access | CC0 | [Source](https://commons.wikimedia.org/wiki/File:Drum_panel_with_Great_Departure_and_Temptation_of_the_Buddha_scenes_MET_DP-18911-001.jpg) |
| personality-buddha-fasting.jpg | Percy Brown (1872-1955) | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Fasting_Buddha_Sikri_Yusufzai_stupa,_Lahore_Museum.jpg) |
| personality-buddha-mara.jpg | Anandajoti | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:052_The_Attack_of_Mara.jpg) |
| personality-buddha-parinirvana.jpg | Mahendra3006 | CC BY-SA 3.0 | [Source](https://commons.wikimedia.org/wiki/File:Buddha_in_Kushinagar_08.JPG) |
| personality-buddha-sermon.jpg | Daya Ram Sahni (16 December 1879 – 7 March 1939) | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Buddha_preaching_his_First_Sermon_(Sarnath).jpg) |
| personality-chandragupta-basadi.jpg | Dineshkannambadi | CC BY-SA 3.0 | [Source](https://commons.wikimedia.org/wiki/File:View_of_Chandragupta_Basadi_at_Chandragiri_hill_in_Shravanabelagola.jpg) |
| personality-chavand.jpg | Suresh Kumar | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Ruined_Palace_of_Maharana_Pratap_-_Chavand-02.jpg) |
| personality-chittor-fort.jpg | Rupeshsarkar | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Chittor_Fort_-_Chittorgarh_-_Rajasthan_-_005.jpg) |
| personality-chittor-siege.jpg | Miskina (composition) and Bhura (painting) | Public domain | [Source](https://commons.wikimedia.org/wiki/File:1567-A_mine_explodes_during_the_siege_of_Chitor-left-Akbarnama-large.jpg) |
| personality-daria-daulat.jpg | Ahmad Faiz Mustafa | CC BY-SA 3.0 | [Source](https://commons.wikimedia.org/wiki/File:Daria_Daulat_Bagh_-_View_from_the_entrance.jpg) |
| personality-dhauli.jpg | AmlanTheTramp | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Dhauli_Elephant_Statue.jpg) |
| personality-eklingji.jpg | LBM1948 | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Eklingji_(2002)_01.jpg) |
| personality-fatehpur.jpg | Rameezm raza | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Fatehpur_Sikri_-_Panch_Mahal.jpg) |
| personality-firuz-coin.jpg | SpeakingArch | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Billion_Tanka_of_Firuz_Shah_Tughlaq,_circa_1351-1388_CE,_Mint_Hazrat_Delhi._INHCRF_Coin_Museum,_Nashik,_Maharashtra.jpg) |
| personality-gagron.jpg | Ravikrishnan A K | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Gagron_Fort,_Gagron,_Rajasthan.jpg) |
| personality-gandhi-africa.jpg | Anonymous | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Gandhi_South-Africa.jpg) |
| personality-gandhi-ambulance.jpg | Anonymous | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Gandhi_Boer_War.jpg) |
| personality-gandhi-kasturba.jpg | Anonymous | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Gandhi_and_Kasturbhai_1902.jpg) |
| personality-gandhi-london.jpg | Anonymous | Public domain | [Source](https://commons.wikimedia.org/wiki/File:London_Vegetarian_Society_1891.png) |
| personality-gandhi-natal.jpg | Anonymous | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Natal_Indian_Congress.jpg) |
| personality-gandhi-nehru.jpg | Max Desfor (1913- ) for Associated Press | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Gandhi_and_Nehru_1946.jpg) |
| personality-gandhi-noakhali.jpg | Anonymous | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Gandhi_in_Noakhali,_1946.jpg) |
| personality-gandhi-phoenix.jpg | Anonymous | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Phoenix_settlement.jpg) |
| personality-gandhi-roundtable.jpg | Anonymous | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Gandhi_at_the_Round_Table_Conference.jpg) |
| personality-gandhi-salt.jpg | Anonymous | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Gandhi_at_Dandi_5_April_1930.jpg) |
| personality-gandhi-tolstoy.jpg | Anonymous | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Gandhi_Tolstoy_farm_1912.jpg) |
| personality-gandhi-young.jpg | Anonymous | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Gandhi-1891.jpeg) |
| personality-haldighati.jpg | Chokha | Public domain | [Source](https://commons.wikimedia.org/wiki/File:The_Battle_of_Haldighati_by_Chokha.jpg) |
| personality-hauz-khas.jpg | Varun Shiv Kapur from New Delhi, India | CC BY 2.0 | [Source](https://commons.wikimedia.org/wiki/File:Hauz_Khas_Complex_Madrasa_(3546821653).jpg) |
| personality-hisar.jpg | Madhaverma | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Firoz_Shah_Palace_And_Tehkhana_01.jpg) |
| personality-humayun.jpg | ‘Abd al-Samad (Kabul, c. 1550–1556) | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Contemporary_Humayun_portrait_in_Kabul_(1550-56).jpg) |
| personality-ibadat.jpg | Anonymous | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Jesuits_in_the_%27Ibadat-Khanah%27.jpg) |
| personality-jagdish.jpg | Ingo Mehling | CC BY-SA 3.0 | [Source](https://commons.wikimedia.org/wiki/File:Jagdish_Temple_Udaipur.jpg) |
| personality-jahangir-khurram.jpg | Balchand | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Jahangir_Receives_Prince_Khurram_at_Ajmer_on_His_Return_from_the_Mewar_Campaign.jpg) |
| personality-jaimal-patta.jpg | Beglar, Joseph David (1845-1907) | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Jaimal_phatta_delhi.jpg) |
| personality-jaimal-shot.jpg | Mughal court artists; Victoria and Albert Museum | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Akbar_shoots_Jaimal_at_the_siege_of_Chitor.jpg) |
| personality-jain-cosmos.jpg | Anishshah19 | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Cosmic_man.jpg) |
| personality-jallianwala.jpg | Bernard Gagnon | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Jallianwala_Bagh,_Amritsar_01.jpg) |
| personality-jesuits.jpg | Narsingh | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Akbar_and_the_Jesuits._Miniature_from_Akbarnama_by_Narsingh_(CBL_In_03.263b).jpg) |
| personality-jetavana.jpg | BPG | CC BY-SA 2.5 | [Source](https://commons.wikimedia.org/wiki/File:Jetavana-Gandhakuti2.jpg) |
| personality-khanwa.jpg | Mughal court artists; manuscript commissioned by Abd al-Rahim Khan-i Khanan | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Babur%E2%80%99s_army_in_battle_against_the_army_of_Rana_Sanga_at.jpg) |
| personality-kumbha-portrait.jpg | Anonymous artist; Asiatic Society reproduction | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Kumbha_of_Mewar.jpg) |
| personality-lumbini.jpg | Rangan Datta Wiki | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Lumbini_Maya_Devi_Temple_1.jpg) |
| personality-mahavira-birth.jpg | SpeakingArch | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Kalpasutra_Manuscript_showing_birth_of_Mahavira,_circa_1500_CE,_Gujarat,_V%26A_Museum,_London.jpg) |
| personality-mahavira-dreams.jpg | Anonymous | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Kalpa_sutra-Jina%27s_mother_dreams_c1450.jpg) |
| personality-mahavira-renunciation.jpg | Anishshah19 | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Kalpasutra_Mahavira_Varsidaan.jpg) |
| personality-mahavira-teaching.jpg | Hiart | CC0 | [Source](https://commons.wikimedia.org/wiki/File:Jain_manuscript_page_with_Mahavira_teaching_to_all_creatures,_western_India,_c._1500-1600,_gouache_on_paper,_HAA.jpg) |
| personality-maurya-coin.jpg | Cleveland Museum of Art, Open Access | CC0 | [Source](https://commons.wikimedia.org/wiki/File:Clevelandart_1967.243.jpg) |
| personality-mysore-map.jpg | William Faden (1749-1836) | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Mysore_battle_map.jpg) |
| personality-mysore-rockets.jpg | Robert Home | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Mysore_rocket_man,_by_Robert_Home_(watercolour).jpg) |
| personality-nagaur.jpg | Rituraj.bharti | CC BY-SA 3.0 | [Source](https://commons.wikimedia.org/wiki/File:Nagaur_Fort.JPG) |
| personality-nathdwara.jpg | Anonymous | Public domain | [Source](https://commons.wikimedia.org/wiki/File:A_gathering_at_the_Shrinathji_temple,_c.1880,_in_Mewar_style.jpg) |
| personality-panipat.jpg | Kankar | Public domain | [Source](https://commons.wikimedia.org/wiki/File:The_defeat_of_Hemu,_Akbarnama.jpg) |
| personality-panna-dhai.jpg | Kshatriya Yoddha | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Panna_Dhai.webp) |
| personality-pawapuri.jpg | Sumitsurai | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Jal_Mandir_-_Pawapuri_04.jpg) |
| personality-pollilur.jpg | Anonymous | Public domain | [Source](https://commons.wikimedia.org/wiki/File:The_Battle_of_Pollilur_-_early_19th-century.jpg) |
| personality-porbandar.jpg | Pradhaan.amit | CC BY 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Kirti_mandir_porbandar.jpg) |
| personality-ragamala.jpg | Nasiruddin | Public domain | [Source](https://commons.wikimedia.org/wiki/File:1_Nasiruddin._Malashri_ragini._Page_from_Chawand_Ragamala_series._Chawand,_Mewar,_Rajasthan._dated_1605(inscribed,_Painted_Nasiruddin_at_Chawand_in_1605)._LACMA.jpg) |
| personality-raj-portrait.jpg | Raja Ravi Varma | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Raja_Ravi_Varma,_Maharana_Raj_Singh_-_I.jpg) |
| personality-rajputana-map.jpg | Imperial Gazetteer of India; uploaded by Tom Radulovich | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Rajputana_1909.jpg) |
| personality-rajsamand-carving.jpg | Rahul sadhwani | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Beautiful_carvings_near_Rajsamand_Lake.jpg) |
| personality-rajsamand-ghat.jpg | Sharvarism | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Nau_Chauki_View_Point.jpg) |
| personality-rajsamand-lake.jpg | Rahul sadhwani | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Rajsamand_Lake.jpg) |
| personality-ranakpur.jpg | Nagarjun Kandukuru | CC BY 2.0 | [Source](https://commons.wikimedia.org/wiki/File:Chaumukha_Jain_temple_at_Ranakpur_in_Aravalli_range_near_Udaipur_Rajasthan_India.jpg) |
| personality-sabarmati.jpg | Nizil Shah | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Hriday_Kunj_at_Sabarmati_Ashram.jpg) |
| personality-sanchi.jpg | Bernard Gagnon | CC BY-SA 3.0 | [Source](https://commons.wikimedia.org/wiki/File:Stupa_1,_Sanchi_02.jpg) |
| personality-sanga-portrait.jpg | Anonymous artist; reproduced by Har Bilas Sarda | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Rana_Sanga_of_Mewar.jpg) |
| personality-seleucus.jpg | Metropolitan Museum of Art, Open Access | CC0 | [Source](https://commons.wikimedia.org/wiki/File:Tetradrachm_of_Seleucus_I_MET_DP109171.jpg) |
| personality-seringapatam-plan.jpg | Anonymous | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Plan_of_the_attack_upon_the_NW_angle_of_Seringapatam,_1799.jpg) |
| personality-sevagram.jpg | सुबोध कुलकर्णी | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Bapu_Kuti_in_Sevagram_Ashram1-Wardha-Maharashtra.jpg) |
| personality-shahbazgarhi.jpg | Eugen Hultzsch (29 March 1857 - 16 January 1927) Publication date 1925 | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Shahbazgarhi_Edicts_7_and_12.jpg) |
| personality-sringeri.jpg | R.k manu | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Sringeri_Vidyashankara_temple.jpg) |
| personality-taxila.jpg | Marco Prins | CC0 | [Source](https://commons.wikimedia.org/wiki/File:Bhir_Mound_excavations.jpg) |
| personality-tipu-coins.jpg | Harvinder Chandigarh | CC BY 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Coins_preserved_in_Tipu_sultan_meusium,_Mysore._01.jpg) |
| personality-tipu-hostages.jpg | Mather Brown | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Mather_Brown_(1761-1831)_-_Lord_Cornwallis_Receiving_the_Sons_of_Tipu_as_Hostages_-_O.174_-_Bowes_Museum.jpg) |
| personality-tipu-portrait.jpg | Anonymous | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Tipu_Sultan,_a_portrait_c.1790.jpg) |
| personality-tipu-tiger.jpg | Victoria and Albert Museum | CC BY-SA 3.0 | [Source](https://commons.wikimedia.org/wiki/File:Tipu%27s_Tiger_front_view_2006AH4173.jpg) |
| personality-udai-portrait.jpg | Tanvi12 | CC0 | [Source](https://commons.wikimedia.org/wiki/File:Rana-udai-singh-ii.jpg) |
| personality-vaishali.jpg | Sumitsurai | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Buddha_Relic_Stupa_-_Vaishali_(8).jpg) |
| rani-durgavati-1954-mural.jpg | Beohar Rammanohar Sinha | Public domain, released by the copyright holder’s heirs | [Source](https://commons.wikimedia.org/wiki/File:Maharani_Durgavati.jpg) |
| rani-durgavati-1988-stamp.jpg | India Post, Government of India | Government Open Data License – India (GODL-India) | [Source](https://commons.wikimedia.org/wiki/File:Rani_Durgavati_1988_stamp_of_India.jpg) |
| rani-durgavati-akbarnama-battle.jpg | Kesav Kalan (composition) and Nar Singh (painting); Victoria and Albert Museum, IS.2:36-1896 | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Schlacht_gegen_Rani_Durgavati.jpg) |
| rani-durgavati-madan-mahal.jpg | Chetansoni | Creative Commons Attribution-ShareAlike 4.0 International | [Source](https://commons.wikimedia.org/wiki/File:Madan_mahal.jpg) |
| rani-durgavati-mughal-portrait.jpg | Unknown artist; photograph by Sailko | Creative Commons Attribution 3.0 Unported | [Source](https://commons.wikimedia.org/wiki/File:Miniatura_moghul,_rani_durgavathi.jpg) |
| rani-durgavati-museum-ganesha.jpg | SpeakingArch | Creative Commons Attribution-ShareAlike 4.0 International | [Source](https://commons.wikimedia.org/wiki/File:Sculpture_of_Dancing_Ganesha,_10th_century_CE,_Katni,_Rani_Durgavati_Museum,_Jabalpur,_Madhya_Pradesh.jpg) |
| rani-durgavati-narmada-gorge.jpg | Anshikasjv12 | Creative Commons Attribution-ShareAlike 4.0 International | [Source](https://commons.wikimedia.org/wiki/File:Bhedaghat_(Marble_Rocks)_Near_Jabalpur.jpg) |
| shivaji-agra-fort.jpg | Rohit Sharma | CC BY-SA 4.0 | [Source](https://commons.wikimedia.org/wiki/File:Diwan-i-Khas_in_Agra_Fort.jpg) |
| shivaji-shah-jahan.jpg | Manohar | Public domain | [Source](https://commons.wikimedia.org/wiki/File:Emperor_Shah_Jahan,_1628.jpg) |
| udaipur-city-palace-lake-pichola.jpg | tommy | Creative Commons Attribution-ShareAlike 2.0 Generic (CC BY-SA 2.0) | [Source](https://commons.wikimedia.org/wiki/File:City_Palace_by_lake_Pichola,_Udaipur.jpg) |
| vijay-stambha-chittorgarh-full-view.jpg | PerSona77 | Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0) | [Source](https://commons.wikimedia.org/wiki/File:Victory_tower_in_chittorgarh_fort.jpg) |
