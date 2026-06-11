import type { PropsWithChildren } from 'react'
import type { Saved } from '#/model'
import type { TestRegistry, TestResults, TestType } from '#/model/registry'
import { LinkBadge } from './LinkBadge'
import { SectionPill } from './SectionPill'

export function AvailableTests({
  registry,
  assessmentId,
  results = []
}: PropsWithChildren<{
  registry: TestRegistry
  assessmentId: string
  results?: Saved<TestResults>[]
}>) {
  const completedTypes = new Set(results.map((entry) => entry.type))
  const allTypes = Object.keys(registry) as TestType[]

  const available = allTypes
    .filter((key) => !completedTypes.has(key))
    .map((key) => registry[key])
    .sort((a, b) => a.priority - b.priority)

  return available.length > 0 ? (
    <>
      <SectionPill>Aggiungi test</SectionPill>
      <div className="space-y-3">
        {available.map((test) => (
          <LinkBadge
            key={test.type}
            to="/assessments/$assessmentId/test/$testType"
            params={{ assessmentId, testType: test.type }}
            title={test.title}
            subtitle={test.subtitle}
          />
        ))}
      </div>
    </>
  ) : null
}
