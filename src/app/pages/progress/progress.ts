import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type ProgressTab =
  | 'syllables'
  | 'words';

type TrendDirection =
  | 'up'
  | 'down'
  | 'stable';


/* =====================================================
   SYLLABLES
===================================================== */

interface SyllableStats {
  attempts: number;
  correct: number;
  errors: number;
}

interface SyllableProgress {
  syllable: string;
  attempts: number;
  correct: number;
  errors: number;
  accuracy: number;
}

interface ConfusionGroup {
  label: string;
  attempts: number;
  correct: number;
  errors: number;
  accuracy: number;
}

interface SyllableTrainingSession {
  date: string;
  correct: number;
  errors: number;
  accuracy: number;
}


/* =====================================================
   WORDS
===================================================== */

interface WordStats {
  attempts: number;
  correct: number;
  errors: number;
  helps: number;
}

interface WordProgress {
  word: string;
  attempts: number;
  correct: number;
  errors: number;
  helps: number;
  accuracy: number;
  helpRate: number;
}

interface WordTrainingSession {
  date: string;
  correct: number;
  errors: number;
  helps: number;
  accuracy: number;
}


@Component({
  selector: 'app-progress',
  imports: [RouterLink],
  templateUrl: './progress.html',
  styleUrl: './progress.scss',
})
export class Progress {

  /*
   * =====================================================
   * STORAGE
   * =====================================================
   */

  private readonly syllableStatsStorageKey =
    'alyza-reading-syllable-stats';

  private readonly syllableSessionsStorageKey =
    'alyza-reading-syllable-sessions';

  private readonly wordStatsStorageKey =
    'alyza-reading-word-stats';

  private readonly wordSessionsStorageKey =
    'alyza-reading-word-sessions';


  /*
   * =====================================================
   * TAB
   * =====================================================
   */

  readonly activeTab =
    signal<ProgressTab>('syllables');


  setTab(
    tab: ProgressTab
  ): void {

    this.activeTab.set(tab);

  }


  /*
   * =====================================================
   * STATE
   * =====================================================
   */

  readonly syllableStats =
    signal<
      Record<string, SyllableStats>
    >({});


  readonly syllableSessions =
    signal<
      SyllableTrainingSession[]
    >([]);


  readonly wordStats =
    signal<
      Record<string, WordStats>
    >({});


  readonly wordSessions =
    signal<
      WordTrainingSession[]
    >([]);


  /*
   * =====================================================
   * HAS PROGRESS
   * =====================================================
   */

  readonly hasAnyProgress =
    computed(() => {

      return (
        Object.keys(
          this.syllableStats()
        ).length > 0 ||

        this.syllableSessions()
          .length > 0 ||

        Object.keys(
          this.wordStats()
        ).length > 0 ||

        this.wordSessions()
          .length > 0
      );

    });


  readonly hasSyllableProgress =
    computed(() => {

      return (
        Object.keys(
          this.syllableStats()
        ).length > 0 ||

        this.syllableSessions()
          .length > 0
      );

    });


  readonly hasWordProgress =
    computed(() => {

      return (
        Object.keys(
          this.wordStats()
        ).length > 0 ||

        this.wordSessions()
          .length > 0
      );

    });


  /*
   * =====================================================
   * SYLLABLE TOTALS
   * =====================================================
   */

  readonly syllableAttempts =
    computed(() => {

      return Object
        .values(
          this.syllableStats()
        )
        .reduce(
          (total, stats) =>
            total + stats.attempts,
          0
        );

    });


  readonly syllableCorrect =
    computed(() => {

      return Object
        .values(
          this.syllableStats()
        )
        .reduce(
          (total, stats) =>
            total + stats.correct,
          0
        );

    });


  readonly syllableErrors =
    computed(() => {

      return Object
        .values(
          this.syllableStats()
        )
        .reduce(
          (total, stats) =>
            total + stats.errors,
          0
        );

    });


  readonly syllableAccuracy =
    computed(() => {

      const attempts =
        this.syllableAttempts();


      if (attempts === 0) {
        return 0;
      }


      return Math.round(
        (
          this.syllableCorrect() /
          attempts
        ) * 100
      );

    });


  readonly trainedSyllables =
    computed(() => {

      return Object
        .values(
          this.syllableStats()
        )
        .filter(
          stats =>
            stats.attempts > 0
        )
        .length;

    });


  /*
   * =====================================================
   * SYLLABLE LIST
   * =====================================================
   */

  readonly syllableProgress =
    computed<SyllableProgress[]>(() => {

      return Object
        .entries(
          this.syllableStats()
        )

        .map(
          ([syllable, stats]) => {

            const accuracy =
              stats.attempts > 0
                ? Math.round(
                    (
                      stats.correct /
                      stats.attempts
                    ) * 100
                  )
                : 0;


            return {

              syllable,

              attempts:
                stats.attempts,

              correct:
                stats.correct,

              errors:
                stats.errors,

              accuracy,

            };

          }
        )

        .sort(
          (a, b) => {

            if (
              a.accuracy !==
              b.accuracy
            ) {

              return (
                a.accuracy -
                b.accuracy
              );

            }


            return (
              b.errors -
              a.errors
            );

          }
        );

    });


  readonly syllablesNeedPractice =
    computed(() => {

      return this
        .syllableProgress()
        .filter(
          item =>
            item.attempts >= 2 &&
            item.accuracy < 85
        );

    });


  readonly syllablesDoingWell =
    computed(() => {

      return this
        .syllableProgress()
        .filter(
          item =>
            item.attempts >= 2 &&
            item.accuracy >= 85
        )
        .sort(
          (a, b) =>
            b.accuracy -
            a.accuracy
        );

    });


  /*
   * =====================================================
   * CONFUSION GROUPS
   * =====================================================
   */

  readonly confusionGroups =
    computed<ConfusionGroup[]>(() => {

      const stats =
        this.syllableStats();


      const groups = [

        {
          label: 'BA ↔ DA',

          syllables: [
            'BA', 'BE', 'BI', 'BO', 'BU',
            'DA', 'DE', 'DI', 'DO', 'DU',
          ],
        },

        {
          label: 'TRA ↔ FRA',

          syllables: [
            'TRA', 'TRE', 'TRI', 'TRO', 'TRU',
            'FRA', 'FRE', 'FRI', 'FRO', 'FRU',
          ],
        },

      ];


      return groups
        .map(group => {

          let attempts = 0;
          let correct = 0;
          let errors = 0;


          for (
            const syllable
            of group.syllables
          ) {

            const item =
              stats[syllable];


            if (!item) {
              continue;
            }


            attempts +=
              item.attempts;

            correct +=
              item.correct;

            errors +=
              item.errors;

          }


          const accuracy =
            attempts > 0
              ? Math.round(
                  (
                    correct /
                    attempts
                  ) * 100
                )
              : 0;


          return {

            label:
              group.label,

            attempts,

            correct,

            errors,

            accuracy,

          };

        })

        .filter(
          group =>
            group.attempts > 0
        )

        .sort(
          (a, b) =>
            a.accuracy -
            b.accuracy
        );

    });


  /*
   * =====================================================
   * SYLLABLE SESSIONS
   * =====================================================
   */

  readonly recentSyllableSessions =
    computed(() => {

      return this
        .syllableSessions()
        .slice(0, 5);

    });


  readonly syllableTrendDifference =
    computed(() => {

      const sessions =
        this.recentSyllableSessions();


      if (
        sessions.length < 2
      ) {
        return 0;
      }


      return (
        sessions[0].accuracy -
        sessions[1].accuracy
      );

    });


  readonly syllableTrendDirection =
    computed<TrendDirection>(() => {

      return this.getTrendDirection(
        this.syllableTrendDifference()
      );

    });


  /*
   * =====================================================
   * WORD TOTALS
   * =====================================================
   */

  readonly wordAttempts =
    computed(() => {

      return Object
        .values(
          this.wordStats()
        )
        .reduce(
          (total, stats) =>
            total + stats.attempts,
          0
        );

    });


  readonly wordCorrect =
    computed(() => {

      return Object
        .values(
          this.wordStats()
        )
        .reduce(
          (total, stats) =>
            total + stats.correct,
          0
        );

    });


  readonly wordErrors =
    computed(() => {

      return Object
        .values(
          this.wordStats()
        )
        .reduce(
          (total, stats) =>
            total + stats.errors,
          0
        );

    });


  readonly wordHelps =
    computed(() => {

      return Object
        .values(
          this.wordStats()
        )
        .reduce(
          (total, stats) =>
            total + stats.helps,
          0
        );

    });


  readonly wordAccuracy =
    computed(() => {

      const attempts =
        this.wordAttempts();


      if (attempts === 0) {
        return 0;
      }


      return Math.round(
        (
          this.wordCorrect() /
          attempts
        ) * 100
      );

    });


  readonly trainedWords =
    computed(() => {

      return Object
        .values(
          this.wordStats()
        )
        .filter(
          stats =>
            stats.attempts > 0
        )
        .length;

    });


  /*
   * =====================================================
   * WORD LIST
   * =====================================================
   */

  readonly wordProgress =
    computed<WordProgress[]>(() => {

      return Object
        .entries(
          this.wordStats()
        )

        .map(
          ([word, stats]) => {

            const accuracy =
              stats.attempts > 0
                ? Math.round(
                    (
                      stats.correct /
                      stats.attempts
                    ) * 100
                  )
                : 0;


            const helpRate =
              stats.attempts > 0
                ? Math.round(
                    (
                      stats.helps /
                      stats.attempts
                    ) * 100
                  )
                : 0;


            return {

              word,

              attempts:
                stats.attempts,

              correct:
                stats.correct,

              errors:
                stats.errors,

              helps:
                stats.helps,

              accuracy,

              helpRate,

            };

          }
        )

        .sort(
          (a, b) => {

            if (
              a.accuracy !==
              b.accuracy
            ) {

              return (
                a.accuracy -
                b.accuracy
              );

            }


            if (
              a.helpRate !==
              b.helpRate
            ) {

              return (
                b.helpRate -
                a.helpRate
              );

            }


            return (
              b.errors -
              a.errors
            );

          }
        );

    });


  /*
   * Una parola richiede ancora
   * allenamento quando:
   *
   * - precisione < 85%
   * oppure
   * - usa aiuto almeno il 25%
   */

  readonly wordsNeedPractice =
    computed(() => {

      return this
        .wordProgress()
        .filter(
          item =>
            item.attempts >= 2 &&
            (
              item.accuracy < 85 ||
              item.helpRate >= 25
            )
        );

    });


  /*
   * Consideriamo acquisita
   * una parola quando:
   *
   * - almeno 2 tentativi
   * - precisione >= 85%
   * - aiuto < 25%
   */

  readonly wordsDoingWell =
    computed(() => {

      return this
        .wordProgress()
        .filter(
          item =>
            item.attempts >= 2 &&
            item.accuracy >= 85 &&
            item.helpRate < 25
        )
        .sort(
          (a, b) => {

            if (
              a.accuracy !==
              b.accuracy
            ) {

              return (
                b.accuracy -
                a.accuracy
              );

            }


            return (
              a.helpRate -
              b.helpRate
            );

          }
        );

    });


  /*
   * =====================================================
   * WORD SESSIONS
   * =====================================================
   */

  readonly recentWordSessions =
    computed(() => {

      return this
        .wordSessions()
        .slice(0, 5);

    });


  readonly wordTrendDifference =
    computed(() => {

      const sessions =
        this.recentWordSessions();


      if (
        sessions.length < 2
      ) {
        return 0;
      }


      return (
        sessions[0].accuracy -
        sessions[1].accuracy
      );

    });


  readonly wordTrendDirection =
    computed<TrendDirection>(() => {

      return this.getTrendDirection(
        this.wordTrendDifference()
      );

    });


  /*
   * =====================================================
   * CONSTRUCTOR
   * =====================================================
   */

  constructor() {

    this.loadSyllableStats();

    this.loadSyllableSessions();

    this.loadWordStats();

    this.loadWordSessions();

  }


  /*
   * =====================================================
   * DATE
   * =====================================================
   */

  formatSessionDate(
    date: string
  ): string {

    const sessionDate =
      new Date(date);


    if (
      Number.isNaN(
        sessionDate.getTime()
      )
    ) {
      return '';
    }


    return new Intl.DateTimeFormat(
      'it-IT',
      {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }
    ).format(
      sessionDate
    );

  }


  /*
   * =====================================================
   * TREND
   * =====================================================
   */

  private getTrendDirection(
    difference: number
  ): TrendDirection {

    if (difference > 0) {
      return 'up';
    }


    if (difference < 0) {
      return 'down';
    }


    return 'stable';

  }


  /*
   * =====================================================
   * LOAD SYLLABLE STATS
   * =====================================================
   */

  private loadSyllableStats(): void {

    try {

      const saved =
        localStorage.getItem(
          this.syllableStatsStorageKey
        );


      if (!saved) {
        return;
      }


      this.syllableStats.set(
        JSON.parse(saved) as
          Record<
            string,
            SyllableStats
          >
      );

    } catch (error) {

      console.error(
        'Errore caricamento statistiche sillabe',
        error
      );

    }

  }


  /*
   * =====================================================
   * LOAD SYLLABLE SESSIONS
   * =====================================================
   */

  private loadSyllableSessions(): void {

    try {

      const saved =
        localStorage.getItem(
          this.syllableSessionsStorageKey
        );


      if (!saved) {
        return;
      }


      const sessions =
        JSON.parse(saved) as
          SyllableTrainingSession[];


      this.syllableSessions.set(
        this.sortSessions(
          sessions
        )
      );

    } catch (error) {

      console.error(
        'Errore caricamento sessioni sillabe',
        error
      );

    }

  }


  /*
   * =====================================================
   * LOAD WORD STATS
   * =====================================================
   */

  private loadWordStats(): void {

    try {

      const saved =
        localStorage.getItem(
          this.wordStatsStorageKey
        );


      if (!saved) {
        return;
      }


      this.wordStats.set(
        JSON.parse(saved) as
          Record<
            string,
            WordStats
          >
      );

    } catch (error) {

      console.error(
        'Errore caricamento statistiche parole',
        error
      );

    }

  }


  /*
   * =====================================================
   * LOAD WORD SESSIONS
   * =====================================================
   */

  private loadWordSessions(): void {

    try {

      const saved =
        localStorage.getItem(
          this.wordSessionsStorageKey
        );


      if (!saved) {
        return;
      }


      const sessions =
        JSON.parse(saved) as
          WordTrainingSession[];


      this.wordSessions.set(
        this.sortSessions(
          sessions
        )
      );

    } catch (error) {

      console.error(
        'Errore caricamento sessioni parole',
        error
      );

    }

  }


  /*
   * =====================================================
   * SORT SESSIONS
   * =====================================================
   */

  private sortSessions<
    T extends { date: string }
  >(
    sessions: T[]
  ): T[] {

    return [...sessions]
      .sort(
        (a, b) =>
          new Date(
            b.date
          ).getTime() -
          new Date(
            a.date
          ).getTime()
      );

  }


  /*
   * =====================================================
   * RESET
   * =====================================================
   */

  resetProgress(): void {

    const confirmed =
      window.confirm(
        'Vuoi davvero cancellare tutti i progressi di Alyza?'
      );


    if (!confirmed) {
      return;
    }


    localStorage.removeItem(
      this.syllableStatsStorageKey
    );

    localStorage.removeItem(
      this.syllableSessionsStorageKey
    );

    localStorage.removeItem(
      this.wordStatsStorageKey
    );

    localStorage.removeItem(
      this.wordSessionsStorageKey
    );

    localStorage.removeItem(
      'alyza-reading-syllable-errors'
    );


    this.syllableStats.set({});

    this.syllableSessions.set([]);

    this.wordStats.set({});

    this.wordSessions.set([]);

  }

}