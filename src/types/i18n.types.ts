import en from '@/locales/en.json'

type LocaleResources = typeof en

type Primitive = string | number | boolean | null

type DotPaths<T> = T extends Primitive
  ? never
  : {
      [K in keyof T & string]: T[K] extends Primitive ? K : `${K}.${DotPaths<T[K]>}`
    }[keyof T & string]

export type TranslationKey = DotPaths<LocaleResources>

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: { translation: LocaleResources }
  }
}
