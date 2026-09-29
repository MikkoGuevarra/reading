export type ComprehensionDifficulty =
  | 'easy'
  | 'medium'
  | 'hard';

export interface ComprehensionQuestion {
  question: string;
  answer: string;
}

export interface ComprehensionStory {
  id: string;
  title: string;
  text: string;
  difficulty: ComprehensionDifficulty;
  questions: ComprehensionQuestion[];
}

export const COMPREHENSION_STORIES: ComprehensionStory[] = [

  {
    id: 'merenda-dimenticata',
    title: 'La merenda dimenticata',
    difficulty: 'easy',

    text:
      'Questa mattina Sofia è arrivata a scuola e ha aperto lo zaino. ' +
      'Cercava la sua merenda, ma non riusciva a trovarla. ' +
      'Poi si è ricordata di averla lasciata sul tavolo della cucina. ' +
      'La sua amica Giulia ha deciso di dividere con lei la propria merenda.',

    questions: [
      {
        question: 'Che cosa cercava Sofia nello zaino?',
        answer: 'Sofia cercava la sua merenda nello zaino.',
      },
      {
        question: 'Perché Sofia non trovava la merenda?',
        answer:
          'Sofia non trovava la merenda perché l’aveva lasciata sul tavolo della cucina.',
      },
      {
        question: 'Che cosa ha fatto Giulia?',
        answer:
          'Giulia ha deciso di dividere la propria merenda con Sofia.',
      },
    ],
  },

  {
    id: 'quaderno-scomparso',
    title: 'Il quaderno scomparso',
    difficulty: 'easy',

    text:
      'Luca doveva fare i compiti, ma non trovava il quaderno di italiano. ' +
      'Ha guardato nello zaino, sulla scrivania e sotto il letto. ' +
      'Alla fine sua sorella gli ha ricordato che il quaderno era rimasto in cucina. ' +
      'Luca lo ha trovato vicino alla scatola dei colori.',

    questions: [
      {
        question: 'Che cosa non riusciva a trovare Luca?',
        answer:
          'Luca non riusciva a trovare il quaderno di italiano.',
      },
      {
        question: 'Dove ha cercato il quaderno?',
        answer:
          'Luca ha cercato il quaderno nello zaino, sulla scrivania e sotto il letto.',
      },
      {
        question: 'Dove si trovava il quaderno?',
        answer:
          'Il quaderno si trovava in cucina, vicino alla scatola dei colori.',
      },
    ],
  },

  {
    id: 'pioggia-improvvisa',
    title: 'La pioggia improvvisa',
    difficulty: 'easy',

    text:
      'Anna e Marco stavano giocando nel parco. ' +
      'All’improvviso il cielo è diventato scuro e ha cominciato a piovere. ' +
      'I due bambini hanno raccolto velocemente i loro giochi ' +
      'e sono corsi sotto un grande albero ad aspettare la mamma.',

    questions: [
      {
        question: 'Dove stavano giocando Anna e Marco?',
        answer:
          'Anna e Marco stavano giocando nel parco.',
      },
      {
        question: 'Che cosa è successo all’improvviso?',
        answer:
          'All’improvviso il cielo è diventato scuro e ha cominciato a piovere.',
      },
      {
        question: 'Che cosa hanno fatto i bambini?',
        answer:
          'I bambini hanno raccolto i giochi e sono corsi sotto un grande albero.',
      },
    ],
  },

  {
    id: 'cucciolo-parco',
    title: 'Il cucciolo nel parco',
    difficulty: 'medium',

    text:
      'Durante una passeggiata al parco, Elisa ha sentito uno strano rumore ' +
      'provenire da dietro una panchina. Avvicinandosi lentamente, ha scoperto ' +
      'un piccolo cucciolo che tremava per il freddo. Elisa ha chiamato suo padre ' +
      'e insieme hanno cercato il proprietario. Poco dopo è arrivata una signora ' +
      'che stava cercando il suo cagnolino da quasi un’ora.',

    questions: [
      {
        question: 'Da dove proveniva lo strano rumore?',
        answer:
          'Lo strano rumore proveniva da dietro una panchina.',
      },
      {
        question: 'Perché il cucciolo tremava?',
        answer:
          'Il cucciolo tremava perché aveva freddo.',
      },
      {
        question: 'Chi era la signora arrivata poco dopo?',
        answer:
          'Era la proprietaria del cagnolino che lo stava cercando.',
      },
    ],
  },

  {
    id: 'gita-bosco',
    title: 'Una passeggiata nel bosco',
    difficulty: 'medium',

    text:
      'Domenica mattina Matteo è andato nel bosco con i suoi genitori. ' +
      'Durante la passeggiata hanno visto uno scoiattolo arrampicarsi velocemente ' +
      'su un albero. Matteo avrebbe voluto avvicinarsi, ma suo padre gli ha spiegato ' +
      'che era meglio rimanere in silenzio per non spaventarlo. ' +
      'Così si sono fermati a osservarlo da lontano.',

    questions: [
      {
        question: 'Con chi è andato nel bosco Matteo?',
        answer:
          'Matteo è andato nel bosco con i suoi genitori.',
      },
      {
        question: 'Che animale hanno visto?',
        answer:
          'Hanno visto uno scoiattolo.',
      },
      {
        question: 'Perché Matteo non si è avvicinato?',
        answer:
          'Matteo non si è avvicinato per non spaventare lo scoiattolo.',
      },
    ],
  },

  {
    id: 'sorpresa-nonna',
    title: 'Una sorpresa per la nonna',
    difficulty: 'hard',

    text:
      'Sabato sarebbe stato il compleanno della nonna e Martina voleva prepararle ' +
      'una sorpresa. Dopo la scuola è andata con suo padre a comprare gli ingredienti ' +
      'per una torta al cioccolato. Quando sono tornati a casa, Martina ha cominciato ' +
      'a prepararla senza dire nulla alla nonna. Il giorno seguente tutta la famiglia ' +
      'si è riunita per festeggiare. Quando Martina ha portato la torta in tavola, ' +
      'la nonna si è emozionata e l’ha abbracciata.',

    questions: [
      {
        question: 'Perché Martina è andata a comprare gli ingredienti?',
        answer:
          'Martina è andata a comprare gli ingredienti per preparare una torta alla nonna.',
      },
      {
        question: 'Perché Martina non ha detto nulla alla nonna?',
        answer:
          'Martina non ha detto nulla perché voleva farle una sorpresa.',
      },
      {
        question: 'Come ha reagito la nonna quando ha visto la torta?',
        answer:
          'La nonna si è emozionata e ha abbracciato Martina.',
      },
    ],
  },

];