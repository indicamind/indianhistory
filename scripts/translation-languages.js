const LANGUAGES = ['hi', 'bn', 'ta', 'te', 'mr', 'ur', 'gu', 'kn', 'ml', 'pa', 'sa', 'es', 'fr', 'ar', 'zh', 'pt', 'or', 'si', 'ja', 'ne', 'id', 'th', 'de', 'fa', 'ru', 'ks'];

// These editions can be selected with a complete interface while their
// remaining published content is clearly presented as English previews.
// All 25 supported translation editions have their published corpora complete, so they now use the full release gate.
const IN_PROGRESS_LANGUAGES = new Set();

module.exports = { LANGUAGES, IN_PROGRESS_LANGUAGES };
