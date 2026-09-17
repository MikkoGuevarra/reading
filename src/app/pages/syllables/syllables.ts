import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface SyllableStats {
  attempts: number;
  correct: number;
  errors: number;
}

interface SyllableError {
  syllable: string;
  count: number;
}

interface TrainingSession {
  date: string;
  correct: number;
  errors: number;
  accuracy: number;
}

@Component({
  selector: 'app-syllables',
  imports: [RouterLink],
  templateUrl: './syllables.html',
  styleUrl: './syllables.scss',
})
export class Syllables {

  /*
   * =====================================================
   * STORAGE
   * =====================================================
   */

  private readonly statsStorageKey =
    'alyza-reading-syllable-stats';

  private readonly sessionsStorageKey =
    'alyza-reading-syllable-sessions';

  /*
   * Vecchia chiave utilizzata prima
   * del nuovo sistema di statistiche.
   */
  private readonly oldStorageKey =
    'alyza-reading-syllable-errors';


  /*
   * =====================================================
   * GAME SETTINGS
   * =====================================================
   */

  readonly totalQuestions = 20;

  private readonly maxSavedSessions = 30;


  /*
   * =====================================================
   * SYLLABLE GROUPS
   * =====================================================
   */

  readonly syllableGroups = {

    b: [
      'BA',
      'BE',
      'BI',
      'BO',
      'BU',
    ],

    d: [
      'DA',
      'DE',
      'DI',
      'DO',
      'DU',
    ],

    t: [
      'TA',
      'TE',
      'TI',
      'TO',
      'TU',
    ],

    f: [
      'FA',
      'FE',
      'FI',
      'FO',
      'FU',
    ],

    tr: [
      'TRA',
      'TRE',
      'TRI',
      'TRO',
      'TRU',
    ],

    fr: [
      'FRA',
      'FRE',
      'FRI',
      'FRO',
      'FRU',
    ],

  };


  /*
   * =====================================================
   * ALL SYLLABLES
   * =====================================================
   */

  readonly syllables = [

    ...this.syllableGroups.b,

    ...this.syllableGroups.d,

    ...this.syllableGroups.t,

    ...this.syllableGroups.f,

    ...this.syllableGroups.tr,

    ...this.syllableGroups.fr,

  ];


  /*
   * =====================================================
   * CONFUSION PAIRS
   * =====================================================
   */

  readonly confusionPairs: Record<string, string> = {

    // B / D

    BA: 'DA',
    DA: 'BA',

    BE: 'DE',
    DE: 'BE',

    BI: 'DI',
    DI: 'BI',

    BO: 'DO',
    DO: 'BO',

    BU: 'DU',
    DU: 'BU',


    // TRA / FRA

    TRA: 'FRA',
    FRA: 'TRA',

    TRE: 'FRE',
    FRE: 'TRE',

    TRI: 'FRI',
    FRI: 'TRI',

    TRO: 'FRO',
    FRO: 'TRO',

    TRU: 'FRU',
    FRU: 'TRU',

  };


  /*
   * =====================================================
   * GAME STATE
   * =====================================================
   */

  readonly currentSyllable =
    signal('');


  readonly currentQuestion =
    signal(1);


  readonly correctAnswers =
    signal(0);


  readonly wrongAnswers =
    signal(0);


  readonly finished =
    signal(false);


  /*
   * Impedisce di salvare due volte
   * la stessa sessione.
   */
  private sessionSaved = false;


  /*
   * =====================================================
   * SESSION ERRORS
   * =====================================================
   *
   * Questi errori vengono utilizzati
   * solamente nella schermata finale.
   */

  readonly sessionErrors =
    signal<Record<string, number>>({});


  /*
   * =====================================================
   * HISTORICAL STATS
   * =====================================================
   */

  readonly historicalStats =
    signal<Record<string, SyllableStats>>({});


  /*
   * =====================================================
   * SESSION ACCURACY
   * =====================================================
   */

  readonly accuracy = computed(() => {

    const answered =
      this.correctAnswers() +
      this.wrongAnswers();


    if (answered === 0) {
      return 0;
    }


    return Math.round(
      (
        this.correctAnswers() /
        answered
      ) * 100
    );

  });


  /*
   * =====================================================
   * SESSION ERROR LIST
   * =====================================================
   */

  readonly errorList =
    computed<SyllableError[]>(() => {

      return Object
        .entries(
          this.sessionErrors()
        )

        .map(
          ([syllable, count]) => ({
            syllable,
            count,
          })
        )

        .sort(
          (a, b) =>
            b.count - a.count
        );

    });


  /*
   * =====================================================
   * CONSTRUCTOR
   * =====================================================
   */

  constructor() {

    this.loadProgress();

    this.nextSyllable();

  }


  /*
   * =====================================================
   * ANSWER
   * =====================================================
   */

  answer(
    isCorrect: boolean
  ): void {

    if (this.finished()) {
      return;
    }


    const syllable =
      this.currentSyllable();


    /*
     * Registriamo il tentativo
     * nello storico della sillaba.
     */

    this.registerAttempt(
      syllable,
      isCorrect
    );


    /*
     * RISPOSTA CORRETTA
     */

    if (isCorrect) {

      this.correctAnswers.update(
        value => value + 1
      );

    }


    /*
     * RISPOSTA ERRATA
     */

    else {

      this.wrongAnswers.update(
        value => value + 1
      );


      this.registerSessionError(
        syllable
      );

    }


    /*
     * =================================================
     * FINE SESSIONE
     * =================================================
     */

    if (
      this.currentQuestion() >=
      this.totalQuestions
    ) {

      this.finished.set(true);

      this.saveTrainingSession();

      return;

    }


    /*
     * Domanda successiva
     */

    this.currentQuestion.update(
      value => value + 1
    );


    this.nextSyllable();

  }


  /*
   * =====================================================
   * RESTART
   * =====================================================
   */

  restart(): void {

    this.currentQuestion.set(1);

    this.correctAnswers.set(0);

    this.wrongAnswers.set(0);

    this.sessionErrors.set({});

    this.finished.set(false);


    /*
     * Nuova sessione:
     * permettiamo nuovamente il salvataggio.
     */

    this.sessionSaved = false;


    this.nextSyllable();

  }


  /*
   * =====================================================
   * REGISTER ATTEMPT
   * =====================================================
   */

  private registerAttempt(
    syllable: string,
    isCorrect: boolean
  ): void {

    this.historicalStats.update(
      stats => {

        const current =
          stats[syllable] ?? {

            attempts: 0,

            correct: 0,

            errors: 0,

          };


        return {

          ...stats,

          [syllable]: {

            attempts:
              current.attempts + 1,

            correct:
              current.correct +
              (isCorrect ? 1 : 0),

            errors:
              current.errors +
              (isCorrect ? 0 : 1),

          },

        };

      }
    );


    this.saveProgress();

  }


  /*
   * =====================================================
   * REGISTER SESSION ERROR
   * =====================================================
   */

  private registerSessionError(
    syllable: string
  ): void {

    this.sessionErrors.update(
      errors => ({

        ...errors,

        [syllable]:
          (errors[syllable] ?? 0) + 1,

      })
    );

  }


  /*
   * =====================================================
   * SAVE TRAINING SESSION
   * =====================================================
   */

  private saveTrainingSession(): void {

    /*
     * Protezione contro
     * salvataggi duplicati.
     */

    if (this.sessionSaved) {
      return;
    }


    const session: TrainingSession = {

      date:
        new Date().toISOString(),

      correct:
        this.correctAnswers(),

      errors:
        this.wrongAnswers(),

      accuracy:
        this.accuracy(),

    };


    try {

      const saved =
        localStorage.getItem(
          this.sessionsStorageKey
        );


      let sessions:
        TrainingSession[] = [];


      if (saved) {

        sessions =
          JSON.parse(saved);

      }


      /*
       * Mettiamo la sessione più recente
       * all'inizio.
       */

      sessions.unshift(
        session
      );


      /*
       * Conserviamo massimo
       * le ultime 30 sessioni.
       */

      sessions =
        sessions.slice(
          0,
          this.maxSavedSessions
        );


      localStorage.setItem(

        this.sessionsStorageKey,

        JSON.stringify(
          sessions
        )

      );


      this.sessionSaved = true;

    }

    catch (error) {

      console.error(
        'Errore durante il salvataggio della sessione',
        error
      );

    }

  }


  /*
   * =====================================================
   * NEXT SYLLABLE
   * =====================================================
   */

  private nextSyllable(): void {

    const previous =
      this.currentSyllable();


    const pool =
      this.createSmartPool();


    let next = previous;


    /*
     * Evitiamo due sillabe
     * identiche consecutive.
     */

    while (
      next === previous &&
      pool.length > 1
    ) {

      const randomIndex =
        Math.floor(
          Math.random() *
          pool.length
        );


      next =
        pool[randomIndex];

    }


    this.currentSyllable.set(
      next
    );

  }


  /*
   * =====================================================
   * SMART POOL
   * =====================================================
   */

  private createSmartPool(): string[] {

    /*
     * Base:
     * tutte le sillabe.
     */

    const pool = [
      ...this.syllables
    ];


    const stats =
      this.historicalStats();


    for (
      const [
        syllable,
        syllableStats
      ]
      of Object.entries(stats)
    ) {

      /*
       * Prima di 2 tentativi
       * non abbiamo abbastanza informazioni.
       */

      if (
        syllableStats.attempts < 2
      ) {
        continue;
      }


      const syllableAccuracy =
        (
          syllableStats.correct /
          syllableStats.attempts
        ) * 100;


      let reinforcement = 0;


      /*
       * < 50%
       * Molta difficoltà
       */

      if (
        syllableAccuracy < 50
      ) {

        reinforcement = 3;

      }


      /*
       * 50% - 69%
       */

      else if (
        syllableAccuracy < 70
      ) {

        reinforcement = 2;

      }


      /*
       * 70% - 84%
       */

      else if (
        syllableAccuracy < 85
      ) {

        reinforcement = 1;

      }


      /*
       * >= 85%
       *
       * Nessun rinforzo extra.
       */


      for (
        let i = 0;
        i < reinforcement;
        i++
      ) {

        /*
         * Sillaba difficile.
         */

        pool.push(
          syllable
        );


        /*
         * Sillaba simile.
         */

        const pair =
          this.confusionPairs[
            syllable
          ];


        if (pair) {

          pool.push(
            pair
          );

        }

      }

    }


    return pool;

  }


  /*
   * =====================================================
   * SAVE PROGRESS
   * =====================================================
   */

  private saveProgress(): void {

    try {

      localStorage.setItem(

        this.statsStorageKey,

        JSON.stringify(
          this.historicalStats()
        )

      );

    }

    catch (error) {

      console.error(
        'Errore durante il salvataggio dei progressi',
        error
      );

    }

  }


  /*
   * =====================================================
   * LOAD PROGRESS
   * =====================================================
   */

  private loadProgress(): void {

    try {

      /*
       * Cerchiamo prima
       * il nuovo formato.
       */

      const saved =
        localStorage.getItem(
          this.statsStorageKey
        );


      if (saved) {

        const parsed =
          JSON.parse(saved) as
            Record<
              string,
              SyllableStats
            >;


        this.historicalStats.set(
          parsed
        );


        return;

      }


      /*
       * =================================================
       * MIGRAZIONE VECCHI DATI
       * =================================================
       */

      const oldSaved =
        localStorage.getItem(
          this.oldStorageKey
        );


      if (!oldSaved) {
        return;
      }


      const oldErrors =
        JSON.parse(oldSaved) as
          Record<string, number>;


      const migratedStats:
        Record<
          string,
          SyllableStats
        > = {};


      for (
        const [
          syllable,
          errors
        ]
        of Object.entries(oldErrors)
      ) {

        migratedStats[
          syllable
        ] = {

          /*
           * Dei vecchi dati conosciamo
           * solamente gli errori.
           */

          attempts:
            errors,

          correct:
            0,

          errors:
            errors,

        };

      }


      this.historicalStats.set(
        migratedStats
      );


      /*
       * Salviamo nel nuovo formato.
       */

      this.saveProgress();


      /*
       * La vecchia chiave
       * non serve più.
       */

      localStorage.removeItem(
        this.oldStorageKey
      );

    }

    catch (error) {

      console.error(
        'Errore durante il caricamento dei progressi',
        error
      );

    }

  }

}