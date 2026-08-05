export type ThemeId = 'arcade' | 'paper' | 'pixel' | 'candy' | 'noir'

export const THEMES: { id: ThemeId; label: string }[] = [
  { id: 'arcade', label: 'Arcade' },
  { id: 'paper', label: 'Paper' },
  { id: 'pixel', label: 'Pixel' },
  { id: 'candy', label: 'Candy' },
  { id: 'noir', label: 'Noir' },
]

export const DEFAULT_THEME: ThemeId = 'arcade'

export const THEME_STORAGE_KEY = 'snake-theme'

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && THEMES.some((theme) => theme.id === value)
}
