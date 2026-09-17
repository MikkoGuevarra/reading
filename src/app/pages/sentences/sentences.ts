import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type SentenceDifficulty =
  | 'easy'
  | 'medium'
  | 'hard';

interface ReadingSentence {
  text: string;
  difficulty: SentenceDifficulty;
}

@Component({
  selector: 'app-sentences',
  imports: [RouterLink],
  templateUrl: './sentences.html',
  styleUrl: './sentences.scss',
})
export class Sentences {

  /*
   * =====================================================
   * SETTINGS
   * =====================================================
   */

  readonly totalQuestions = 15;


  /*
   * =====================================================
   * SENTENCES
   * =====================================================
   */

  readonly sentences: ReadingSentence[] = [

    {
      text: 'La bambina raccoglie le conchiglie sulla spiaggia.',
      difficulty: 'easy',
    },
    {
      text: 'Questa mattina abbiamo preparato una buona colazione.',
      difficulty: 'easy',
    },
    {
      text: 'Il ghiaccio nel bicchiere si sta sciogliendo.',
      difficulty: 'easy',
    },
    {
      text: 'La mamma apparecchia la tavola prima di cena.',
      difficulty: 'easy',
    },
    {
      text: 'Dopo la pioggia è apparso un bellissimo arcobaleno.',
      difficulty: 'easy',
    },

    {
      text: 'Quando siamo arrivati al parco, i bambini stavano già giocando.',
      difficulty: 'medium',
    },
    {
      text: 'Improvvisamente cominciò a piovere e tutti corsero dentro casa.',
      difficulty: 'medium',
    },
    {
      text: 'Dopo aver finito i compiti, Marco uscì in giardino a giocare.',
      difficulty: 'medium',
    },
    {
      text: 'Sulla spiaggia abbiamo raccolto conchiglie di forme e colori diversi.',
      difficulty: 'medium',
    },
    {
      text: 'Nonostante facesse freddo, i bambini continuarono a giocare fuori.',
      difficulty: 'medium',
    },

    {
      text: 'Sebbene fosse molto stanca, Martina decise di terminare i compiti prima di andare a dormire.',
      difficulty: 'hard',
    },
    {
      text: 'Quando finalmente smise di piovere, i bambini uscirono in giardino per osservare l’arcobaleno.',
      difficulty: 'hard',
    },
    {
      text: 'Mentre attraversavano tranquillamente il bosco, sentirono improvvisamente uno strano rumore provenire dagli alberi.',
      difficulty: 'hard',
    },
    {
      text: 'La maestra spiegò attentamente l’esercizio, ma alcuni bambini chiesero di ascoltare nuovamente le istruzioni.',
      difficulty: 'hard',
    },
    {
      text: 'La bambina aprì il vecchio libro con curiosità e cominciò a leggere la misteriosa storia che aveva trovato.',
      difficulty: 'hard',
    },

  ];


  /*
   * =====================================================
   * STATE
   * =====================================================
   */

  readonly currentQuestion = signal(1);

  readonly fluentAnswers = signal(0);

  readonly difficultAnswers = signal(0);

  readonly finished = signal(false);

  readonly currentSentence = signal<ReadingSentence>(
    this.sentences[0]
  );


  /*
   * =====================================================
   * SESSION
   * =====================================================
   */

  private sessionQueue: ReadingSentence[] = [];

  private sessionIndex = 0;


  /*
   * =====================================================
   * SCORE
   * =====================================================
   */

  readonly accuracy = computed(() => {

    const answered =
      this.fluentAnswers() +
      this.difficultAnswers();

    if (answered === 0) {
      return 0;
    }

    return Math.round(
      (this.fluentAnswers() / answered) * 100
    );

  });


  /*
   * =====================================================
   * CONSTRUCTOR
   * =====================================================
   */

  constructor() {
    this.createSession();
  }


  /*
   * =====================================================
   * ANSWER
   * =====================================================
   */

  answer(isFluent: boolean): void {

    if (this.finished()) {
      return;
    }

    if (isFluent) {

      this.fluentAnswers.update(
        value => value + 1
      );

    } else {

      this.difficultAnswers.update(
        value => value + 1
      );

    }


    /*
     * Ultima frase.
     */

    if (
      this.sessionIndex >=
      this.sessionQueue.length - 1
    ) {

      this.finished.set(true);

      return;
    }


    /*
     * Prossima frase.
     */

    this.sessionIndex++;

    this.currentQuestion.set(
      this.sessionIndex + 1
    );

    this.currentSentence.set(
      this.sessionQueue[this.sessionIndex]
    );

  }


  /*
   * =====================================================
   * RESTART
   * =====================================================
   */

  restart(): void {

    this.currentQuestion.set(1);

    this.fluentAnswers.set(0);

    this.difficultAnswers.set(0);

    this.finished.set(false);

    this.createSession();

  }


  /*
   * =====================================================
   * CREATE SESSION
   * =====================================================
   */

  private createSession(): void {

    /*
     * Mischiamo le frasi.
     */

    const shuffled =
      this.shuffle(this.sentences);


    /*
     * Prendiamo massimo 15 frasi.
     */

    this.sessionQueue =
      shuffled.slice(
        0,
        this.totalQuestions
      );


    this.sessionIndex = 0;

    this.currentQuestion.set(1);

    this.currentSentence.set(
      this.sessionQueue[0]
    );

  }


  /*
   * =====================================================
   * SHUFFLE
   * =====================================================
   */

  private shuffle<T>(
    items: T[]
  ): T[] {

    const result = [...items];

    for (
      let i = result.length - 1;
      i > 0;
      i--
    ) {

      const randomIndex =
        Math.floor(
          Math.random() * (i + 1)
        );

      [
        result[i],
        result[randomIndex],
      ] = [
        result[randomIndex],
        result[i],
      ];

    }

    return result;

  }

}