import de from '../../public/lang/de.js';
import en from '../../public/lang/en.js';
import es from '../../public/lang/es.js';
import el from '../../public/lang/el.js';
import enGB from '../../public/lang/en-GB.js';
import fr from '../../public/lang/fr.js';
import hi from '../../public/lang/hi.js';
import ms from '../../public/lang/ms.js';
import tr from '../../public/lang/tr.js';
import bn from '../../public/lang/bn.js';
import nl from '../../public/lang/nl.js';
import pl from '../../public/lang/pl.js';
import id from '../../public/lang/id.js';
import it from '../../public/lang/it.js';
import pt from '../../public/lang/pt.js';
import vi from '../../public/lang/vi.js';
import ptBR from '../../public/lang/pt-BR.js';
import hr from '../../public/lang/hr.js';
import arXA from '../../public/lang/ar-XA.js';
import ko from '~/lang/ko.js';
import th from '~/lang/th.js';
import zhCN from '~/lang/zh-CN.js';
import ja from '~/lang/ja.js';
import ru from '~/lang/ru.js';
import enPH from '~/lang/en-PH.js';
import enSG from '~/lang/en-SG.js';
import enIn from '~/lang/en-IN.js';
import uk from '~/lang/uk.js';

export const getI18nInstant = (locale: string) => {
  //TODO: Add more languages
  const localeMap: { [key: string]: any } = {
    en: en,
    vi: vi,
    de: de,
    pt: pt,
    es: es,
    fr: fr,
    it: it,
    'pt-BR': ptBR,
    el: el,
    'en-GB': enGB,
    'en-PH': enPH,
    'en-SG': enSG,
    'en-IN': enIn,
    hi: hi,
    ms: ms,
    tr: tr,
    bn: bn,
    nl: nl,
    pl: pl,
    id: id,
    hr: hr,
    'ar-XA': arXA,
    ko: ko,
    th: th,
    'zh-CN': zhCN,
    ja: ja,
    ru: ru,
    uk: uk
  };

  return localeMap[locale as string] || en;
};
