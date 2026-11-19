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
import dailypassbookIcon from '../../assets/dailypassbook.png';


import arulCollections from '../../assets/arul-sacred-wallpaper-collections.png';
import arulHd from '../../assets/arul-full-hd-live-wallpapers.png';
import arulDevotional from '../../assets/arul-devotional-live-wallpapers.png';
import arulTemple from '../../assets/arul-temple-night-wallpapers.png';
import arulPreview from '../../assets/arul-wallpaper-preview-and-apply.png';
import arulRingtones from '../../assets/arul-sacred-ringtones.png';
import arulLanguages from '../../assets/arul-language-and-community-uploads.png';

import dailypassbookPassbook from '../../assets/dailypassbook-passbook.png';
import dailypassbookAutopays from '../../assets/dailypassbook-autopays.png';
import dailypassbookTransaction from '../../assets/dailypassbook-transaction.png';
import dailypassbookUpcoming from '../../assets/dailypassbook-upcoming.png';
import dailypassbookVoice from '../../assets/dailypassbook-voice.png';
import dailypassbookReliability from '../../assets/dailypassbook-reliability.png';

export const APP_ICONS: Record<string, ImageMetadata> = {
  arul: arulIcon,
  dailypassbook: dailypassbookIcon,
};

const SHOTS: Record<string, ImageMetadata> = {
  'arul-sacred-wallpaper-collections': arulCollections,
  'arul-full-hd-live-wallpapers': arulHd,
  'arul-devotional-live-wallpapers': arulDevotional,
  'arul-temple-night-wallpapers': arulTemple,
  'arul-wallpaper-preview-and-apply': arulPreview,
  'arul-sacred-ringtones': arulRingtones,
  'arul-language-and-community-uploads': arulLanguages,
  'dailypassbook-passbook': dailypassbookPassbook,
  'dailypassbook-autopays': dailypassbookAutopays,
  'dailypassbook-transaction': dailypassbookTransaction,
  'dailypassbook-upcoming': dailypassbookUpcoming,
  'dailypassbook-voice': dailypassbookVoice,
  'dailypassbook-reliability': dailypassbookReliability,
};

export function shotImage(file: string): ImageMetadata {
  const image = SHOTS[file];
  // Fail at build rather than rendering a broken card in production.
  if (!image) throw new Error(`Unknown screenshot "${file}" — add it to src/lib/media.ts`);
  return image;
}
