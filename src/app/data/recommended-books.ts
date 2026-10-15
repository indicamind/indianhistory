import { amazonHistoryBooks } from './amazon-history-books';
import { worldHistoryBooks } from './world-history-books';
import { RecommendedBook } from '../models/book.model';

export const recommendedBooks: RecommendedBook[] = [
  {
    title: 'The Rigveda: Historical Analysis',
    author: 'Shrikant G. Talageri',
    category: 'Ancient & medieval',
    description:
      'A detailed study of the Rigveda for readers interested in Vedic chronology, textual layers, and debates around early Indo-Aryan history.',
    amazonUrl: 'https://www.amazon.in/dp/8177421492',
    affiliateUrl:
      'https://www.amazon.in/Rigveda-Historical-Analysis-Shrikant-Talageri/dp/8177421492?crid=15P8ZOSZD79T4&dib=eyJ2IjoiMSJ9.ak9FIdOc1I5WnG19bkFA_b5knaeRbISYP76hCrxVZjO6q_7Pp8vRkbJ4z-vjGeMUE9zOvN_fMXPoibHdF2Hw6A.aKYlGhACkN_IgcUtWboDh7knnRjSivLvF6bglad4M_g&dib_tag=se&keywords=shrikant+talageri&qid=1780590927&sprefix=shrikanth+tal%2Caps%2C609&sr=8-2&linkCode=ll2&tag=indiahistor01-21&linkId=bacf233a01d1466af7bbbf36b4554180&ref_=as_li_ss_tl',
    imageUrl: 'assets/media/books/rigveda-historical-analysis.jpg',
    imageAlt: 'Cover of The Rigveda: Historical Analysis by Shrikant G. Talageri',
    format: 'Paperback',
    publisher: 'Aditya Prakashan',
    publicationDate: '1 January 2015',
    pages: 328,
    customRank: 1,
    isbn10: '8177421492',
    isbn13: '978-8177421491',
  },
  {
    title: 'The Rigvedic People: Invaders? Immigrants? or Indigenous?',
    author: 'B.B. Lal',
    category: 'Ancient & medieval',
    description:
      'An archaeological and literary argument about the Rigvedic people, Harappan culture, and debates over invasion, migration, and indigenous continuity.',
    amazonUrl: 'https://www.amazon.in/dp/8173055351',
    affiliateUrl:
      'https://www.amazon.in/Rigvedic-People-Invaders-Immigrants-Indigenous/dp/8173055351?crid=KMXFUCM43AX5&dib=eyJ2IjoiMSJ9.9FSoCgtYk5hhwlpMt_fO71np9rOsVi9yEbRuq02KAaud6S52doAPFIEouCYzM_YpzLIDKGzhDOlcF4ENEGLHD2Rkrn4cTY5pw8NSKAPwOfIOiIu1PYN2tB-9DKMnlkLa2ezRKAFKsMu38X4a71jNVkqHK6nDRK9kutXzy7_0wZrSdkkagQvUo0t4GgeiSM4uOZsX6dn3DmxtxDzz4CtsFutUnXj5COwIZ_rcUd4tVqc.8rP4hq4obbjgOf92AulBeOpvXLCEllGWgsjVnZ17hC8&dib_tag=se&keywords=bb+lal&qid=1781019184&s=books&sprefix=rig+veda+bb+lal%2Cstripbooks%2C729&sr=1-1&linkCode=ll2&tag=indiahistor01-21&linkId=98ca34df5be2c3f10ce5d1491fc8f851&ref_=as_li_ss_tl',
    imageUrl: 'assets/media/books/rigvedic-people.jpg',
    imageAlt: 'Cover of The Rigvedic People by B.B. Lal',
    format: 'Hardcover',
    publisher: 'Aryan Books International',
    publicationDate: '2 February 2015',
    pages: 186,
    customRank: 2,
    isbn10: '8173055351',
    isbn13: '978-8173055355',
  },
  {
    title: 'Rivers of Rgveda: A Geographic Exploration',
    author: 'Jijith Nadumuri Ravi',
    category: 'Ancient & medieval',
    description:
      'A geographic exploration of Rigvedic rivers and landscapes, used by Out of India Theory proponents to locate Rigvedic memory within the Indian subcontinent.',
    amazonUrl: 'https://www.amazon.in/dp/B09QM23FZY',
    affiliateUrl:
      'https://www.amazon.in/Rivers-Rgveda-Jijith-Nadumuri-Ravi/dp/B09QM23FZY?dib=eyJ2IjoiMSJ9.7TJjSU0jMr6YwlYA_XF9ArMbe-GdaVGpZ4feW5cK2Hk.1IHW7VHaIXvMms_NMudJDDkG4l1o3Y7E6Wd2R1SwzxQ&dib_tag=se&keywords=Rivers+of+Rgveda+Jijith+Nadumuri+Ravi&qid=1781028252&sr=8-1&linkCode=ll2&tag=indiahistor01-21&linkId=f1fde4460eb35b170822c46b0170ed39&ref_=as_li_ss_tl',
    imageUrl: 'assets/media/books/rivers-of-rgveda.png',
    imageAlt: 'Cover of Rivers of Rgveda by Jijith Nadumuri Ravi',
    format: 'Paperback',
    publisher: 'Notion Press',
    publicationDate: '2022',
    pages: 362,
    customRank: 3,
    isbn10: 'B09QM23FZY',
    isbn13: 'ASIN B09QM23FZY',
  },
  {
    title: 'The Hindus of Hindustan: A Civilizational Journey',
    author: 'Meenakshi Jain',
    category: 'General history',
    description:
      'A civilizational history tracing religious, cultural, and territorial continuities in India from ancient sacred literature through later historical transformations.',
    amazonUrl: 'https://www.amazon.in/dp/8173056811',
    affiliateUrl:
      'https://www.amazon.in/HINDUS-HINDUSTAN-Civilizational-Journey/dp/8173056811?crid=3HNXUR4N1U81J&dib=eyJ2IjoiMSJ9.kdodgcm7vWH1ZwN1kLtKUH4HeWe_i4Jk0sYUpokD6kWwh98ey8MIK01_iPCS9rV9SNrwgVX_VptzOo3B7aR0ITAf0fIXQS3YEd6F8d98cg_BeCnJQBd7Zszn77abQYCjI1WjMmCv3FN7Mfwd9tvY1DNBH1ANY4PQbwpl6_4Lys0VdC2zpgYI6E0jyDo_gFC9w1je3M1PIq8ilObFzAuv2AxtlzUg8zo5U-EXYih4yFw.DdmS2uEP3SkNokycz2oZWgwAkeKNxax1ejSLZQkVx2I&dib_tag=se&keywords=meenakshi+jain+books&qid=1780596544&sprefix=meenakshi+%2Caps%2C590&sr=8-4&linkCode=ll2&tag=indiahistor01-21&linkId=8b67060ba25ecc9ee91f0c5ebe46c986&ref_=as_li_ss_tl',
    imageUrl: 'assets/media/books/hindus-of-hindustan.jpg',
    imageAlt: 'Cover of The Hindus of Hindustan: A Civilizational Journey by Meenakshi Jain',
    format: 'Hardcover',
    publisher: 'Aryan Books International',
    publicationDate: '1 January 2023',
    pages: 334,
    customRank: 4,
    isbn10: '8173056811',
    isbn13: '978-8173056819',
  },
  {
    title: 'How Maritime Trade and the Indian Subcontinent Shaped the World: Ice Age to Mid-Eighth Century',
    author: 'Nick Collins',
    category: 'Economic history',
    description:
      'A wide-ranging history of early maritime exchange that places the Indian subcontinent and Indian Ocean networks at the centre of long-distance trade and cultural contact.',
    amazonUrl: 'https://www.amazon.in/dp/9347691194',
    affiliateUrl:
      'https://www.amazon.in/Maritime-Trade-Indian-Subcontinent-Shaped/dp/9347691194?crid=1XC60B7LF695&dib=eyJ2IjoiMSJ9.JMSKvJ00v73O5jmeHcaTZnjkYemGlz4JU_3CJaWaz4ZG4VBZ0QBV2wzzIb2wBL45VCdtZlfHwl2_w9dwbdWue7giGbPh9TEih17cR9TuuQw.t3NBNOWnyjJeKfOdMBdUaWrY-a0ZKDVP4-2IPXzm2gs&dib_tag=se&keywords=nick+collins+maritime+trade&qid=1787319524&sprefix=nick+maritime%2Caps%2C768&sr=8-1&linkCode=ll2&tag=indiahistor01-21&linkId=e53f6b2c56ebdaa65128598cc098aa7d&ref_=as_li_ss_tl',
    imageUrl: 'assets/media/books/how-maritime-trade-shaped-world.jpg',
    imageAlt: 'Cover of How Maritime Trade and the Indian Subcontinent Shaped the World by Nick Collins',
    format: 'Paperback',
    publisher: 'Garuda Prakashan',
    publicationDate: '2025',
    pages: 396,
    customRank: 5,
    isbn10: '9347691194',
    isbn13: '9789347691195',
  },
  {
    title: 'The Millennium Maritime Trade Revolution, 700–1700: How Asia Lost Maritime Supremacy',
    author: 'Nick Collins',
    category: 'Economic history',
    description:
      'The second volume follows Asian and European maritime networks from 700 to 1700 and examines the long shift in commercial power toward northern Europe.',
    amazonUrl: 'https://www.amazon.in/dp/9347691100',
    affiliateUrl:
      'https://www.amazon.in/Millennium-Maritime-Trade-Revolution-700-1700/dp/9347691100?crid=K0RUGLX4I9TV&dib=eyJ2IjoiMSJ9.waAsxHbQ459NVeOY5Citlwqk4HBYmVZnH4kbmhJQpN4.s7QBvyKl9lJOTr_wHPIvAcKHMdgEeYT78YeeeZ9_u-E&dib_tag=se&keywords=The+Millennium+Maritime+Trade+Revolution&qid=1787324106&sprefix=%2Caps%2C845&sr=8-1&linkCode=ll2&tag=indiahistor01-21&linkId=4fd40f881d3b4838926c574c2b8a8d67&ref_=as_li_ss_tl',
    imageUrl: 'assets/media/books/millennium-maritime-trade-revolution.jpg',
    imageAlt: 'Cover of The Millennium Maritime Trade Revolution, 700–1700 by Nick Collins',
    format: 'Paperback',
    publisher: 'Garuda Prakashan',
    publicationDate: '2024',
    pages: 362,
    customRank: 6,
    isbn10: '9347691100',
    isbn13: '9789347691102',
  },
  {
    title: 'The Ascent of Maritime Trade: 1700–2025—Enlightening the World',
    author: 'Nick Collins',
    category: 'Economic history',
    description:
      'The concluding volume traces maritime commerce from 1700 to the present, connecting shipping, industrial growth, geopolitics and modern globalisation.',
    amazonUrl: 'https://www.amazon.in/dp/9347691240',
    affiliateUrl:
      'https://www.amazon.in/Ascent-Maritime-Trade-Enlightening-World/dp/9347691240?crid=1XC60B7LF695&dib=eyJ2IjoiMSJ9.JMSKvJ00v73O5jmeHcaTZnjkYemGlz4JU_3CJaWaz4ZG4VBZ0QBV2wzzIb2wBL45VCdtZlfHwl2_w9dwbdWue7giGbPh9TEih17cR9TuuQw.t3NBNOWnyjJeKfOdMBdUaWrY-a0ZKDVP4-2IPXzm2gs&dib_tag=se&keywords=nick+collins+maritime+trade&qid=1787319524&sprefix=nick+maritime%2Caps%2C768&sr=8-3&linkCode=ll2&tag=indiahistor01-21&linkId=deb97339338849417e03b0439a8498d1&ref_=as_li_ss_tl',
    imageUrl: 'assets/media/books/ascent-maritime-trade.jpg',
    imageAlt: 'Cover of The Ascent of Maritime Trade: 1700–2025 by Nick Collins',
    format: 'Paperback',
    publisher: 'Garuda Prakashan',
    publicationDate: '2026',
    pages: 368,
    customRank: 7,
    isbn10: '9347691240',
    isbn13: '9789347691249',
  },
  {
    title: 'A History of India',
    author: 'Romila Thapar',
    category: 'Ancient & medieval',
    description: 'A survey of Indian history through 1300 CE, with attention to cultural change.',
    amazonUrl: 'https://www.amazon.in/dp/0140138358',
    // Add affiliateUrl here when available; the pending label then disappears automatically.
    imageUrl: 'assets/media/books/history-of-india-thapar.jpg',
    imageAlt: 'Cover of A History of India by Romila Thapar',
    format: 'Paperback',
    publisher: 'Penguin',
    publicationDate: '28 June 1990',
    pages: 384,
    customRank: 8,
    isbn10: '0140138358',
    isbn13: '978-0140138351',
  },
  ...amazonHistoryBooks,
  ...worldHistoryBooks,
];

export function booksForMode(isDevMode: boolean): RecommendedBook[] {
  return isDevMode ? recommendedBooks : recommendedBooks.filter(book => !!book.affiliateUrl);
}
