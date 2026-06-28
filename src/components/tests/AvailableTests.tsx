import { Link } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'
import { SectionPill } from '#/components/SectionPill'
import type { Saved } from '#/model'
import type { TestRegistry, TestResults, TestType } from '#/model/registry'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle
} from '#/sapneuro-ui/components'

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
    <ItemGroup>
      <SectionPill>Aggiungi test</SectionPill>
      <div className="space-y-3">
        {available.map((test) => (
          <Item key={test.type} variant="outline" size="sm" asChild>
            <Link
              to="/assessments/$assessmentId/test/$testType"
              params={{ assessmentId, testType: test.type }}
            >
              <ItemContent>
                <ItemTitle> {test.title}</ItemTitle>
                <ItemDescription> {test.description}</ItemDescription>
              </ItemContent>
            </Link>
          </Item>
        ))}
      </div>
    </ItemGroup>
  ) : null
}
