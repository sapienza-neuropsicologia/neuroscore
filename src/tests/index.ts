import type { TestRegistry } from '#/model/registry'
import { FiguraRey } from './figurarey'
import { MMSE } from './mmse'
import { SeiDicembre } from './seidicembre'

export * from './areas'

export const TEST_REGISTRY: TestRegistry = {
  mmse: MMSE,
  seidicembre: SeiDicembre,
  figurarey: FiguraRey
}
