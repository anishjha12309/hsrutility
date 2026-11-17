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

import pakizaIcon from '../../assets/Pakiza.png';
import arulIcon from '../../assets/arul.png';
import awaazpayIcon from '../../assets/awaazpay.png';

import pakizaSacred from '../../assets/pakiza-sacred-islamic-wallpapers.png';
import pakizaLive from '../../assets/pakiza-dynamic-live-wallpapers.png';
import pakizaRingtones from '../../assets/pakiza-spiritual-ringtones.png';
import pakizaLanguages from '../../assets/pakiza-language-selection.png';
import pakizaUpload from '../../assets/pakiza-community-content-upload.png';

import arulCollections from '../../assets/arul-sacred-wallpaper-collections.png';
import arulHd from '../../assets/arul-full-hd-live-wallpapers.png';
import arulDevotional from '../../assets/arul-devotional-live-wallpapers.png';
import arulTemple from '../../assets/arul-temple-night-wallpapers.png';
import arulPreview from '../../assets/arul-wallpaper-preview-and-apply.png';
import arulRingtones from '../../assets/arul-sacred-ringtones.png';
import arulLanguages from '../../assets/arul-language-and-community-uploads.png';

import awaazpayPassbook from '../../assets/awaazpay-passbook.png';
import awaazpayAutopays from '../../assets/awaazpay-autopays.png';
import awaazpayTransaction from '../../assets/awaazpay-transaction.png';
import awaazpayUpcoming from '../../assets/awaazpay-upcoming.png';
import awaazpayVoice from '../../assets/awaazpay-voice.png';
import awaazpayReliability from '../../assets/awaazpay-reliability.png';

export const APP_ICONS: Record<string, ImageMetadata> = {
  pakiza: pakizaIcon,
  arul: arulIcon,
  awaazpay: awaazpayIcon,
};

const SHOTS: Record<string, ImageMetadata> = {
  'pakiza-sacred-islamic-wallpapers': pakizaSacred,
  'pakiza-dynamic-live-wallpapers': pakizaLive,
  'pakiza-spiritual-ringtones': pakizaRingtones,
  'pakiza-language-selection': pakizaLanguages,
  'pakiza-community-content-upload': pakizaUpload,
  'arul-sacred-wallpaper-collections': arulCollections,
  'arul-full-hd-live-wallpapers': arulHd,
  'arul-devotional-live-wallpapers': arulDevotional,
  'arul-temple-night-wallpapers': arulTemple,
  'arul-wallpaper-preview-and-apply': arulPreview,
  'arul-sacred-ringtones': arulRingtones,
  'arul-language-and-community-uploads': arulLanguages,
  'awaazpay-passbook': awaazpayPassbook,
  'awaazpay-autopays': awaazpayAutopays,
  'awaazpay-transaction': awaazpayTransaction,
  'awaazpay-upcoming': awaazpayUpcoming,
  'awaazpay-voice': awaazpayVoice,
  'awaazpay-reliability': awaazpayReliability,
};

export function shotImage(file: string): ImageMetadata {
  const image = SHOTS[file];
  // Fail at build rather than rendering a broken card in production.
  if (!image) throw new Error(`Unknown screenshot "${file}" — add it to src/lib/media.ts`);
  return image;
}
