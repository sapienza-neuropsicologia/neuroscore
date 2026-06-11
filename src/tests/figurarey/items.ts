export const scoringItems = [
  {
    label:
      'Assegnare 2 punti se il braccio lungo della croce termina nei pressi della linea mediana orizzontale e quello corto è posto più in alto rispetto al rettangolo',
    note: 'Il trattino di unione con il rettangolo può essere omesso'
  },
  {
    label: 'Il grande rettangolo, armatura della figura',
    note: ''
  },
  {
    label:
      'Assegnare 2 punti se le due linee che formano le diagonali sono continue, dei 4 angoli almeno due consecutivi sono toccati dalle diagonali',
    note: 'Il centro delle diagonali può anche non coincidere con il centro del rettangolo. Assegnare 0 punti se è presente una sola diagonale o due semidiagonali'
  },
  {
    label:
      "Se è presente una sola semimediana considerare l'elemento come deformato, e quindi assegnare 1 punto se ben posto e mezzo punto se mal posto",
    note: ''
  },
  {
    label:
      "Se è presente una sola semimediana considerare l'elemento come deformato, e quindi assegnare 1 punto se ben posto e mezzo punto se mal posto",
    note: ''
  },
  {
    label:
      'Per assegnare 2 punti, i vertici destri del rettangolo devono toccare le due diagonali',
    note: ''
  },
  {
    label: 'Assegnare 2 punti anche se ci sono più segmenti',
    note: "Nel caso l’elemento non sia presente nella posizione corretta è possibile assegnare 1 punto se è comunque presente all’interno del rettangolo un segmento orizzontale, purché termini su una diagonale. Nel caso che una delle linee dell’elemento 8 appaia come un prolungamento dell'elemento 7 non considerare errore"
  },
  {
    label:
      'Assegnare 2 punti se sono presenti solo quattro linee. Assegnare 0 punti nel caso ci sia una sola linea',
    note: 'Nel caso in cui l’elemento 7 appaia come un prolungamento di una delle linee di 8 non considerare errore'
  },
  {
    label:
      'Assegnare 2 punti se il cateto minore è il prolungamento della mediana verticale',
    note: ''
  },
  {
    label:
      'È’ possibile assegnare 2 punti anche se l’elemento supera la semidiagonale, ma assegnare 1 punto nel caso in cui tocchi la mediana orizzontale',
    note: "Assegnare 1 punto se l’elemento non é presente nella posizione corretta ma all'interno del rettangolo 2 c'è un segmento verticale che termina su una diagonale"
  },
  {
    label: 'Assegnare 2 punti se i tre punti sono disposti come nel modello',
    note: 'Se all’interno del cerchio al posto dei tre punti sono presenti tre cerchietti vuoti o comunque altre figure assegnare 1 punto'
  },
  {
    label:
      'Assegnare 1 punto se il numero di linee è diverso da cinque ma assegnare 0 punti nel caso in cui ci sia una sola linea',
    note: "Se le cinque linee non sono tracciate sulla diagonale giusta considerare l'elemento come corretto ma mal posto, quindi assegnare 1 punto"
  },
  {
    label: 'Per assegnare 2 punti i due lati devono essere uguali',
    note: ''
  },
  {
    label:
      'È possibile soprassedere sulle dimensioni del rombo per assegnare 2 punti',
    note: ''
  },
  {
    label:
      'Considerare l’elemento valido, e quindi assegnare 2 punti, solo se è all’interno del triangolo 13',
    note: ''
  },
  {
    label:
      'Assegnare 2 punti se l’elemento è il prolungamento della mediana orizzontale e costituisce l’altezza del triangolo 13',
    note: 'Considerare l’elemento valido solo se è all’interno del rettangolo 13'
  },
  {
    label:
      'Assegnare 2 punti se è presente il trattino di unione con il rettangolo, e questo deve essere la continuazione della mediana verticale 5',
    note: 'Inoltre, il braccio lungo della croce deve almeno oltrepassare la mediana verticale ma non superare la lunghezza del rettangolo 2. Assegnare 1 punto quando l’elemento è situato alla base del quadrato 18'
  },
  {
    label:
      'Assegnare 2 punti se la diagonale è orientata come nel modello. Assegnare 1 punto se sono presenti entrambe le diagonali.',
    note: ''
  }
]

export const scoreLabels = [
  'Corretto e ben posto (+2)',
  'Corretto ma mal posto (+1)',
  'Deformato, incompleto o con aggiunte ma comunque riconoscibile e ben posto (+1)',
  'Deformato, incompleto o con aggiunte ma comunque riconoscibile ma mal posto (0,5 punti)',
  'Irriconoscibile o assente: 0 punti'
]

export const scoreValues = [2, 1, 1, 0.5, 0]
