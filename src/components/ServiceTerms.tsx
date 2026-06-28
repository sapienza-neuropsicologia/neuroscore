import { type PropsWithChildren, useCallback, useState } from 'react'
import { Button } from '#/sapneuro-ui/components'
import { PageContainer } from './PageContainer'

const SERVICE_TERMS_VERSION = '1'

export function ServiceTermsChecker({ children }: PropsWithChildren) {
  const [termsAccepted, setTermsAccepted] = useState(() => {
    return localStorage.getItem('terms.accepted') === SERVICE_TERMS_VERSION
  })
  const acceptTerms = useCallback(() => {
    localStorage.setItem('terms.accepted', SERVICE_TERMS_VERSION)
    setTermsAccepted(true)
  }, [])
  return termsAccepted ? children : <ServiceTerms acceptTerms={acceptTerms} />
}

function ServiceTerms({ acceptTerms }: { acceptTerms: () => void }) {
  return (
    <PageContainer
      title="Termini di servizio"
      description="Leggi attentamente prima di procedere"
      footer={
        <>
          <div>Per continuare, accetta i termini di servizio</div>
          <Button variant="outline" onClick={acceptTerms}>
            Accetta
          </Button>
        </>
      }
      scrollable={true}
    >
      <h1 className="text-l font-semibold tracking-tight mt-6">Descrizione</h1>
      <p className="leading-5 not-first:mt-5 text-sm">
        Questa applicazione permette di velocizzare ed entro certi limiti di
        automatizzare lo scoring di alcuni test neuropsicologici disponibili in
        lingua italiana, aiutando il neuropsicologo a calcolare i punteggi
        grezzi, corretti ed equivalenti e a creare una tabella stampabile con
        l'esito della valutazione e gli esiti dettagliati dei singoli test.
      </p>
      <p className="leading-5 not-first:mt-5 text-sm">
        Allo stato attuale, l'applicazione ha un intento esplicitamente
        dimostrativo, include pochi test, e non garantisce che i calcoli
        effettuati siano sempre corretti. L'applicazione viene fornita "così
        com'è" ("as is"), e ciò implica che è responsabilità dell'utente
        verificare le informazioni immesse e i risultati ottenuti. L'utente è
        l'unico responsabile del tipo di uso che farà dei dati ottenuti da
        questa applicazione.
      </p>
      <h1 className="text-l font-semibold tracking-tight mt-6">Privacy</h1>
      <p className="leading-5 not-first:mt-5 text-sm">
        L'applicazione consente di creare una scheda per ciascun paziente con i
        suoi dati anagrafici, ed associarlo ad una o più valutazioni
        neuropsicologiche, ciascuna comprendente uno o più test. Nell'attuale
        versione a scopo dimostrativo, nessun dato immesso lascia mai il browser
        dell'utente. I dati inseriti vengono salvati nella memoria permamente
        del browser e quindi sono recuperabili solo dallo stesso utente sullo
        stesso computer utilizzando lo stesso browser con lo stesso profilo
        utente.
      </p>
      <p className="leading-5 not-first:mt-5 text-sm">
        L'applicazione non utilizza cookie e non salva alcun dato oltre a quelli
        esplicitamente inseriti dall'utente. E' pertanto responsabilità
        dell'utente, qualora intenda inserire informazioni personali di
        pazienti, inclusi i loro punteggi ai test, ottenere il debito consenso
        dal paziente e provvedere a mantenere i dati (cioè, il proprio computer
        ed eventuali backup) in modo sicuro.
      </p>
      <h1 className="text-l font-semibold tracking-tight mt-6">
        Accettazione dei termini
      </h1>
      <p className="leading-5 not-first:mt-5 text-sm">
        Accedendo e utilizzando questo sito web, accetti e concordi di essere
        vincolato dai termini e dalle disposizioni del presente accordo.
        Inoltre, quando utilizzi i servizi particolari di questo sito web, sarai
        soggetto a tutte le linee guida o regole applicabili a tali servizi.
      </p>
    </PageContainer>
  )
}
