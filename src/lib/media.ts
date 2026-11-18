/**
 * Image registry.
 *
 * astro:assets needs a static import to hash, resize and re-encode a file at build
 * time, so the images cannot be looked up from a runtime string. Keeping every
 * import in one map means `src/lib/site.ts` stays plain data (a `file:` string per
 * shot) and pages resolve it through `shotImage()`.
 *
 * Adding a screenshot: drop the PNG in /assets, import it here, and reference the
 * basename from the app's `shots` array in site.ts.
 */

import arulIcon from '../../assets/arul.png';
import alertpaisaIcon from '../../assets/alertpaisa.png';


import arulCollections from '../../assets/arul-sacred-wallpaper-collections.png';
import arulHd from '../../assets/arul-full-hd-live-wallpapers.png';
import arulDevotional from '../../assets/arul-devotional-live-wallpapers.png';
import arulTemple from '../../assets/arul-temple-night-wallpapers.png';
import arulPreview from '../../assets/arul-wallpaper-preview-and-apply.png';
import arulRingtones from '../../assets/arul-sacred-ringtones.png';
import arulLanguages from '../../assets/arul-language-and-community-uploads.png';

import alertpaisaPassbook from '../../assets/alertpaisa-passbook.png';
import alertpaisaAutopays from '../../assets/alertpaisa-autopays.png';
import alertpaisaTransaction from '../../assets/alertpaisa-transaction.png';
import alertpaisaUpcoming from '../../assets/alertpaisa-upcoming.png';
import alertpaisaVoice from '../../assets/alertpaisa-voice.png';
import alertpaisaReliability from '../../assets/alertpaisa-reliability.png';

export const APP_ICONS: Record<string, ImageMetadata> = {
  arul: arulIcon,
  alertpaisa: alertpaisaIcon,
};

const SHOTS: Record<string, ImageMetadata> = {
  'arul-sacred-wallpaper-collections': arulCollections,
  'arul-full-hd-live-wallpapers': arulHd,
  'arul-devotional-live-wallpapers': arulDevotional,
  'arul-temple-night-wallpapers': arulTemple,
  'arul-wallpaper-preview-and-apply': arulPreview,
  'arul-sacred-ringtones': arulRingtones,
  'arul-language-and-community-uploads': arulLanguages,
  'alertpaisa-passbook': alertpaisaPassbook,
  'alertpaisa-autopays': alertpaisaAutopays,
  'alertpaisa-transaction': alertpaisaTransaction,
  'alertpaisa-upcoming': alertpaisaUpcoming,
  'alertpaisa-voice': alertpaisaVoice,
  'alertpaisa-reliability': alertpaisaReliability,
};

export function shotImage(file: string): ImageMetadata {
  const image = SHOTS[file];
  // Fail at build rather than rendering a broken card in production.
  if (!image) throw new Error(`Unknown screenshot "${file}" — add it to src/lib/media.ts`);
  return image;
}
