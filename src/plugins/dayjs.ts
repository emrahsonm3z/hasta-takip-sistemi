import 'dayjs/locale/en'
import 'dayjs/locale/tr'

import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)

export function setDayjsLocale(language: string): void {
  dayjs.locale(language === 'tr' ? 'tr' : 'en')
}
