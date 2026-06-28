import { useCallback } from 'react'
import { SectionPill } from '#/components/SectionPill'
import { TestScores } from '#/components/tests/TestScores'
import { useCurrentTest } from '#/model'
import { type SeiDicembreResults, setRecallText, toggleCheck } from './scoring'

export function SeiDicembreForm() {
  const { assessment, results, setResults } = useCurrentTest<'seidicembre'>()

  const toggleRecall = useCallback(
    (which: 'imm' | 'dif', key: keyof SeiDicembreResults['immChecks']) => {
      setResults(toggleCheck(assessment.patient, results, which, key))
    },
    [assessment, results, setResults]
  )

  const updateRecallText = useCallback(
    (which: 'imm' | 'dif', text: string) => {
      setResults(setRecallText(results, which, text))
    },
    [results, setResults]
  )

  return (
    <div className="print:[&_.section-pill]:mb-0.5 print:[&_.section-pill]:mt-0.5">
      <div className="print:hidden">
        <SectionPill>Istruzioni di somministrazione</SectionPill>
        <div className="rounded-md border border-[#e8d8cc] bg-white p-3 text-sm text-[#6f5a4f] print:border-[#888] print:text-black">
          L'Esaminatore dice al Soggetto: “Ora le leggerò un raccontino. Non
          appena ho finito, mi ripeta tutto ciò che ricorda”. L’Esaminatore
          legge il raccontino e, dopo un intervallo di 30” durante il quale il
          soggetto è impegnato in una conversazione, chiede al soggetto tutto
          ciò che ricorda (Rievocazione Immediata). Dopo ulteriori 20 minuti,
          occupati da attività interferente non verbale, viene richiesta al
          soggetto la seconda ripetizione (Rievocazione Differita). In entrambe
          le rievocazioni non sono posti limiti di tempo. Se il soggetto
          interrompe precocemente la rievocazione, l’esaminatore può
          sollecitarlo a rievocare quante più informazioni ricorda.
        </div>
      </div>

      <div>
        <div className="print:hidden">
          <SectionPill>Brano</SectionPill>
        </div>
        <div className="rounded-md border border-[#e8d8cc] bg-[#fffaf7] p-3 text-sm leading-6 print:mt-0.5 print:rounded-none print:border-[#888] print:bg-white print:px-2 print:py-1 print:text-[10px] print:leading-3.5">
          Sei dicembre. La scorsa settimana un fiume straripò in una piccola
          città situata a 20 km da Torino. L'acqua invase le strade e le case.
          Quattordici persone annegarono e seicento si ammalarono a causa
          dell'umidità e del freddo. Nel tentativo di salvare un ragazzo, un
          uomo si ferì le mani.
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-4 print:mt-1 print:grid-cols-2 print:gap-2 lg:grid-cols-2">
        <RecallBlock
          title={`Rievocazione immediata (${results.imm.raw.toFixed(1)}/8.0)`}
          text={results.immText}
          state={results.immChecks}
          onTextChange={(text) => updateRecallText('imm', text)}
          onToggle={(k) => toggleRecall('imm', k)}
        />
        <RecallBlock
          title={`Rievocazione differita (${results.dif.raw.toFixed(1)}/8.0)`}
          text={results.difText}
          state={results.difChecks}
          onTextChange={(text) => updateRecallText('dif', text)}
          onToggle={(k) => toggleRecall('dif', k)}
        />
      </div>

      <TestScores
        scores={{
          Immediata: results.imm,
          Differita: results.dif,
          Totale: {
            raw: results.tot,
            corrected: NaN,
            es: NaN,
            note: ''
          },
          Oblio: results.obl
        }}
      />
    </div>
  )
}

function RecallBlock(props: {
  title: string
  text: string
  state: SeiDicembreResults['immChecks']
  onTextChange: (text: string) => void
  onToggle: (key: keyof SeiDicembreResults['immChecks']) => void
}) {
  return (
    <div className="print:mb-0.5">
      <SectionPill>{props.title}</SectionPill>
      <div className="mb-2 print:mb-0.5">
        <textarea
          className="w-full rounded-md border border-[#e8d8cc] bg-white px-3 py-2 text-sm text-[#2c1f1a] placeholder:text-[#9c8b81] focus:border-[#b88c73] focus:outline-none focus:ring-2 focus:ring-[#b88c73]/30 print:min-h-32 print:rounded-none print:border-[#888] print:px-2 print:py-1 print:text-[10px] print:leading-3.5 print:text-black"
          rows={4}
          placeholder="Riporta qui la rievocazione del paziente..."
          value={props.text}
          onChange={(e) => props.onTextChange(e.target.value)}
        />
      </div>
      <div className="divide-y divide-[#e8d8cc] border-y border-[#e8d8cc] print:divide-[#ddd] print:border-[#ddd]">
        <CheckRow
          label="Straripamento (3 pt)"
          note="Assegnare punteggio pieno anche a: “alluvione”, “allagamento”, “inondazione”, “nubifragio”, “ci fu la piena di un fiume”, “ci furono
grandi piogge”, “il fiume uscì dal letto”, “il fiume uscì fuori”"
          checked={props.state.strarip}
          onChange={() => props.onToggle('strarip')}
        />
        <CheckRow
          label="“Piccola città” o “vicino Torino” (+0.3)"
          note="Considerare corretti anche “paese” e “cittadina”,
oppure se viene riferita la distanza (20 +/- 10 km);
se viene riferito “a Torino” non assegnare punteggio"
          disabled={!props.state.strarip}
          checked={props.state.strarip && props.state.city}
          onChange={() => props.onToggle('city')}
        />
        <CheckRow
          label="“La scorsa settimana” o “il 6 dicembre” (+0.3)"
          note="Considerare corretto anche “i primi di
dicembre”"
          disabled={!props.state.strarip}
          checked={props.state.strarip && props.state.time}
          onChange={() => props.onToggle('time')}
        />
        <CheckRow
          label="Morti (2 pt)"
          note="Considerare corretto anche “annegati”, “vittime” o “affogati”.
          Attenzione: l’evento “morti” merita punteggio solo se è riferito allo straripamento del
fiume e non se è in relazione alla persona che ha tentato di compiere il salvataggio."
          checked={props.state.morti}
          onChange={() => props.onToggle('morti')}
        />
        <CheckRow
          label="Dettaglio numero morti (+0.2)"
          note="Assegnare se viene riportato un numero di morti pari a 14 +/- 5."
          disabled={!props.state.morti}
          checked={props.state.morti && props.state.mortiNum}
          onChange={() => props.onToggle('mortiNum')}
        />
        <CheckRow
          label="Ammalati (1 pt)"
          note="Considerare corretto anche “ci fu un’epidemia” e “si raffreddarono”.
          Attenzione: l’evento “ammalati” merita punteggio solo se è riferito allo straripamento del
fiume e non se è in relazione alla persona che ha tentato di compiere il salvataggio."
          checked={props.state.amm}
          onChange={() => props.onToggle('amm')}
        />
        <CheckRow
          label="Dettaglio numero ammalati (+0.1)"
          note="Assegnare se viene riportato un numero di ammalati pari a 600 +/- 100."
          disabled={!props.state.amm}
          checked={props.state.amm && props.state.ammNum}
          onChange={() => props.onToggle('ammNum')}
        />
        <CheckRow
          label="Tentativo di salvataggio (1 pt)"
          note="Dai per buono anche “per salvare”, “un uomo cercò di
prestare soccorso/aiuto”"
          checked={props.state.salv}
          onChange={() => props.onToggle('salv')}
        />
        <CheckRow
          label="“Ferimento” o “ragazzo” (+0.1)"
          note="Il particolare “ragazzo” merita punteggio solo se è menzionato che lui è salvato e non se viene
detto che è lui a prestare soccorso."
          disabled={!props.state.salv}
          checked={props.state.salv && props.state.salvDet}
          onChange={() => props.onToggle('salvDet')}
        />
      </div>
    </div>
  )
}

function CheckRow(props: {
  label: string
  note?: string
  checked: boolean
  disabled?: boolean
  onChange: () => void
}) {
  return (
    <label className="grid grid-cols-[1fr_auto] gap-3 py-2 print:gap-1 print:py-0">
      <div>
        <div className="text-sm leading-6 print:text-[10px] print:leading-3">
          {props.label}
        </div>
        {props.note ? (
          <div className="text-xs text-[#6f5a4f] print:hidden">
            {props.note}
          </div>
        ) : null}
      </div>
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-[#8e2f3f] print:mt-0.5 print:h-2.5 print:w-2.5 print:accent-black cursor-pointer"
        checked={props.checked}
        onChange={props.onChange}
        disabled={props.disabled}
      />
    </label>
  )
}
