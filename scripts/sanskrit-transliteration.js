// IAST from the same Devanagari text that is displayed by the reader.
// This avoids mixing the spelling or numbering of different editions.
const consonants = Object.fromEntries([... 'कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहळ'].map((letter, i) => [letter, ['k','kh','g','gh','ṅ','c','ch','j','jh','ñ','ṭ','ṭh','ḍ','ḍh','ṇ','t','th','d','dh','n','p','ph','b','bh','m','y','r','l','v','ś','ṣ','s','h','ḷ'][i]]));
const vowels = {'अ':'a','आ':'ā','इ':'i','ई':'ī','उ':'u','ऊ':'ū','ऋ':'ṛ','ॠ':'ṝ','ऌ':'ḷ','ॡ':'ḹ','ए':'e','ऐ':'ai','ओ':'o','औ':'au'};
const signs = {'ा':'ā','ि':'i','ी':'ī','ु':'u','ू':'ū','ृ':'ṛ','ॄ':'ṝ','ॢ':'ḷ','ॣ':'ḹ','े':'e','ै':'ai','ो':'o','ौ':'au'};
const marks = {'ं':'ṃ','ः':'ḥ','ँ':'m̐','ऽ':'’','ॐ':'oṃ','।':'|','॥':'||'};
function toIAST(text) {
  const letters = [...text.normalize('NFC').replace(/[\u200b-\u200d\ufeff]/g, '')];
  let result = '';
  for (let i = 0; i < letters.length; i++) {
    const c = letters[i];
    if (consonants[c]) {
      result += consonants[c];
      if (signs[letters[i + 1]]) result += signs[letters[++i]];
      else if (letters[i + 1] === '्') i++;
      else result += 'a';
    } else if (vowels[c]) result += vowels[c];
    else if (marks[c]) result += marks[c];
    else if (/[०-९]/.test(c)) result += String(c.charCodeAt(0) - 0x0966);
    else if (/[\u0900-\u097f]/.test(c)) throw new Error('Unsupported Devanagari character: ' + c);
    else result += c;
  }
  return result.replace(/\|\|/g, ' || ').replace(/(?<!\|)\|(?!\|)/g, ' | ').replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').trim();
}
module.exports = { toIAST };
