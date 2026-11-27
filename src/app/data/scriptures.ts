/** Shared catalogue for the library, search and article-section navigation. */
export const scriptureBooks = [{
  slug: 'bhagavad-gita',
  name: 'Bhagavad Gita',
  shortDescription: 'Krishna and Arjuna’s dialogue on action, knowledge, devotion and liberation.',
  originalTitle: 'श्रीमद्भगवद्गीता',
  /** Display names for the English interface; source titles remain Sanskrit. */
  englishChapterTitles: [
    'Arjuna’s Despair',
    'The Yoga of Knowledge',
    'The Yoga of Action',
    'The Yoga of Knowledge and Renunciation of Action',
    'The Yoga of Renunciation of Action',
    'The Yoga of Meditation',
    'The Yoga of Knowledge and Realization',
    'The Yoga of the Imperishable Brahman',
    'The Yoga of Royal Knowledge and the Royal Secret',
    'The Yoga of Divine Manifestations',
    'The Vision of the Universal Form',
    'The Yoga of Devotion',
    'The Distinction Between the Field and the Knower of the Field',
    'The Distinction Between the Three Qualities of Nature',
    'The Yoga of the Supreme Person',
    'The Distinction Between Divine and Demonic Qualities',
    'The Distinction Between the Three Kinds of Faith',
    'The Yoga of Liberation and Renunciation',
  ],
}] as const;
