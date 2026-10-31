const LANGUAGES = ['hi', 'bn', 'ta', 'te', 'mr', 'ur', 'gu', 'kn', 'ml', 'pa', 'sa', 'es', 'fr', 'ar', 'zh', 'pt', 'or', 'si', 'ja', 'ne', 'id', 'th', 'de', 'fa', 'ru', 'ks', 'ko', 'vi', 'tr', 'it', 'ms', 'sw', 'fil'];

// These editions can be selected with a complete interface while their
// remaining published content is clearly presented as English previews.
// New editions use the full release gate and stay hidden until their interface,
// articles, and blogs are complete. Do not add them here to bypass that gate.
const IN_PROGRESS_LANGUAGES = new Set();

module.exports = { LANGUAGES, IN_PROGRESS_LANGUAGES };
