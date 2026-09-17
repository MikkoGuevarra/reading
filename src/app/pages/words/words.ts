import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type WordDifficulty = 'easy' | 'medium' | 'hard';

interface ReadingWord {
  word: string;
  syllables: string[];
  difficulty: WordDifficulty;
}

interface WordStats {
  attempts: number;
  correct: number;
  errors: number;
  helps: number;
}

interface WordError {
  word: string;
  syllables: string[];
  count: number;
}

interface WordHelp {
  word: string;
  syllables: string[];
  count: number;
}

interface WordTrainingSession {
  date: string;
  correct: number;
  errors: number;
  helps: number;
  accuracy: number;
}

@Component({
  selector: 'app-words',
  imports: [RouterLink],
  templateUrl: './words.html',
  styleUrl: './words.scss',
})
export class Words {
  /*
   * =====================================================
   * STORAGE
   * =====================================================
   */

  private readonly statsStorageKey = 'alyza-reading-word-stats';

  private readonly sessionsStorageKey = 'alyza-reading-word-sessions';

  /*
   * =====================================================
   * SETTINGS
   * =====================================================
   */

  readonly totalQuestions = 15;

  private readonly maxSavedSessions = 30;

  /*
   * =====================================================
   * WORDS
   * =====================================================
   */

  readonly words: ReadingWord[] = [
    /*
     * =====================================================
     * EASY
     * CH / GH / GN / GLI
     * =====================================================
     */

    {
      word: 'CHIAVE',
      syllables: ['CHIA', 'VE'],
      difficulty: 'easy',
    },
    {
      word: 'CHIESA',
      syllables: ['CHIE', 'SA'],
      difficulty: 'easy',
    },
    {
      word: 'CHIODO',
      syllables: ['CHIO', 'DO'],
      difficulty: 'easy',
    },
    {
      word: 'GHIRO',
      syllables: ['GHI', 'RO'],
      difficulty: 'easy',
    },
    {
      word: 'GHIANDA',
      syllables: ['GHIAN', 'DA'],
      difficulty: 'easy',
    },
    {
      word: 'GHIAIA',
      syllables: ['GHIA', 'IA'],
      difficulty: 'easy',
    },
    {
      word: 'GHIACCIO',
      syllables: ['GHIAC', 'CIO'],
      difficulty: 'easy',
    },
    {
      word: 'BAGNO',
      syllables: ['BA', 'GNO'],
      difficulty: 'easy',
    },
    {
      word: 'RAGNO',
      syllables: ['RA', 'GNO'],
      difficulty: 'easy',
    },
    {
      word: 'GNOMO',
      syllables: ['GNO', 'MO'],
      difficulty: 'easy',
    },
    {
      word: 'FOGLIA',
      syllables: ['FO', 'GLIA'],
      difficulty: 'easy',
    },
    {
      word: 'MAGLIA',
      syllables: ['MA', 'GLIA'],
      difficulty: 'easy',
    },
    {
      word: 'PAGLIA',
      syllables: ['PA', 'GLIA'],
      difficulty: 'easy',
    },
    {
      word: 'SVEGLIA',
      syllables: ['SVE', 'GLIA'],
      difficulty: 'easy',
    },
    {
      word: 'CONIGLIO',
      syllables: ['CO', 'NI', 'GLIO'],
      difficulty: 'easy',
    },

    /*
     * =====================================================
     * MEDIUM
     * SCI / SCE / SCH / QU / CQU / DOPPIE
     * =====================================================
     */

    {
      word: 'SCIARPA',
      syllables: ['SCIAR', 'PA'],
      difficulty: 'medium',
    },
    {
      word: 'SCIMMIA',
      syllables: ['SCIM', 'MIA'],
      difficulty: 'medium',
    },
    {
      word: 'SCIENZA',
      syllables: ['SCIEN', 'ZA'],
      difficulty: 'medium',
    },
    {
      word: 'SCERIFFO',
      syllables: ['SCE', 'RIF', 'FO'],
      difficulty: 'medium',
    },
    {
      word: 'SCHIENA',
      syllables: ['SCHIE', 'NA'],
      difficulty: 'medium',
    },
    {
      word: 'SCHIUMA',
      syllables: ['SCHIU', 'MA'],
      difficulty: 'medium',
    },
    {
      word: 'SCHERZO',
      syllables: ['SCHER', 'ZO'],
      difficulty: 'medium',
    },
    {
      word: 'SCHEDA',
      syllables: ['SCHE', 'DA'],
      difficulty: 'medium',
    },
    {
      word: 'QUADRO',
      syllables: ['QUA', 'DRO'],
      difficulty: 'medium',
    },
    {
      word: 'QUINDICI',
      syllables: ['QUIN', 'DI', 'CI'],
      difficulty: 'medium',
    },
    {
      word: 'ACQUA',
      syllables: ['AC', 'QUA'],
      difficulty: 'medium',
    },
    {
      word: 'ACQUARIO',
      syllables: ['AC', 'QUA', 'RIO'],
      difficulty: 'medium',
    },
    {
      word: 'ACQUOLINA',
      syllables: ['AC', 'QUO', 'LI', 'NA'],
      difficulty: 'medium',
    },
    {
      word: 'CAVALLO',
      syllables: ['CA', 'VAL', 'LO'],
      difficulty: 'medium',
    },
    {
      word: 'OMBRELLO',
      syllables: ['OM', 'BREL', 'LO'],
      difficulty: 'medium',
    },

    /*
     * =====================================================
     * HARD
     * PIÙ DIFFICOLTÀ NELLA STESSA PAROLA
     * =====================================================
     */

    {
      word: 'CONCHIGLIA',
      syllables: ['CON', 'CHI', 'GLIA'],
      difficulty: 'hard',
    },
    {
      word: 'CUCCHIAIO',
      syllables: ['CUC', 'CHIA', 'IO'],
      difficulty: 'hard',
    },
    {
      word: 'BOTTIGLIA',
      syllables: ['BOT', 'TI', 'GLIA'],
      difficulty: 'hard',
    },
    {
      word: 'TOVAGLIA',
      syllables: ['TO', 'VA', 'GLIA'],
      difficulty: 'hard',
    },
    {
      word: 'GHIACCIATO',
      syllables: ['GHIAC', 'CIA', 'TO'],
      difficulty: 'hard',
    },
    {
      word: 'GHIACCIOLI',
      syllables: ['GHIAC', 'CIO', 'LI'],
      difficulty: 'hard',
    },
    {
      word: 'ACQUAZZONE',
      syllables: ['AC', 'QUAZ', 'ZO', 'NE'],
      difficulty: 'hard',
    },
    {
      word: 'ASCIUGAMANO',
      syllables: ['A', 'SCIU', 'GA', 'MA', 'NO'],
      difficulty: 'hard',
    },
    {
      word: 'SCIOGLIERE',
      syllables: ['SCIO', 'GLIE', 'RE'],
      difficulty: 'hard',
    },
    {
      word: 'SCEGLIERE',
      syllables: ['SCE', 'GLIE', 'RE'],
      difficulty: 'hard',
    },
    {
      word: 'BICICLETTA',
      syllables: ['BI', 'CI', 'CLET', 'TA'],
      difficulty: 'hard',
    },
    {
      word: 'PRINCIPESSA',
      syllables: ['PRIN', 'CI', 'PES', 'SA'],
      difficulty: 'hard',
    },
    {
      word: 'PASTICCERIA',
      syllables: ['PA', 'STIC', 'CE', 'RIA'],
      difficulty: 'hard',
    },
    {
      word: 'CROSTICINA',
      syllables: ['CRO', 'STI', 'CI', 'NA'],
      difficulty: 'hard',
    },
    {
      word: 'STRACCIATELLA',
      syllables: ['STRAC', 'CIA', 'TEL', 'LA'],
      difficulty: 'hard',
    },
  ];

  /*
   * =====================================================
   * STATE
   * =====================================================
   */

  readonly currentWord = signal<ReadingWord>(this.words[0]);

  readonly currentQuestion = signal(1);

  readonly correctAnswers = signal(0);

  readonly wrongAnswers = signal(0);

  readonly finished = signal(false);

  readonly showHelp = signal(false);

  readonly helpCount = signal(0);

  /*
   * =====================================================
   * SESSION QUEUE
   * =====================================================
   */

  private sessionQueue: ReadingWord[] = [];

  private sessionIndex = 0;

  private helpUsedForCurrentWord = false;

  private sessionSaved = false;

  /*
   * =====================================================
   * SESSION DATA
   * =====================================================
   */

  readonly sessionErrors = signal<Record<string, number>>({});

  readonly sessionHelp = signal<Record<string, number>>({});

  /*
   * =====================================================
   * HISTORICAL DATA
   * =====================================================
   */

  readonly historicalStats = signal<Record<string, WordStats>>({});

  /*
   * =====================================================
   * DIFFICULTY
   * =====================================================
   */

  readonly unlockedDifficulty = computed<WordDifficulty>(() => {
    const sessions = this.loadSavedSessions();

    if (sessions.length === 0) {
      return 'easy';
    }

    const recent = sessions.slice(0, 3);

    const averageAccuracy =
      recent.reduce((total, session) => total + session.accuracy, 0) /
      recent.length;

    const averageHelp =
      recent.reduce((total, session) => total + session.helps, 0) /
      recent.length;

    /*
     * HARD
     */

    if (sessions.length >= 3 && averageAccuracy >= 90 && averageHelp <= 2) {
      return 'hard';
    }

    /*
     * MEDIUM
     */

    if (sessions.some((session) => session.accuracy >= 80)) {
      return 'medium';
    }

    return 'easy';
  });

  readonly difficultyLabel = computed(() => {
    switch (this.unlockedDifficulty()) {
      case 'hard':
        return '🚀 Sfida';

      case 'medium':
        return '⭐ Intermedio';

      default:
        return '🌱 Facile';
    }
  });

  /*
   * =====================================================
   * ACCURACY
   * =====================================================
   */

  readonly accuracy = computed(() => {
    const answered = this.correctAnswers() + this.wrongAnswers();

    if (answered === 0) {
      return 0;
    }

    return Math.round((this.correctAnswers() / answered) * 100);
  });

  readonly independentAnswers = computed(() => {
    const answered = this.correctAnswers() + this.wrongAnswers();

    return Math.max(0, answered - this.helpCount());
  });

  /*
   * =====================================================
   * ERROR LIST
   * =====================================================
   */

  readonly errorList = computed<WordError[]>(() => {
    return Object.entries(this.sessionErrors())
      .map(([word, count]) => {
        const data = this.findWord(word);

        return {
          word,
          syllables: data?.syllables ?? [],
          count,
        };
      })
      .sort((a, b) => b.count - a.count);
  });

  /*
   * =====================================================
   * HELP LIST
   * =====================================================
   */

  readonly helpList = computed<WordHelp[]>(() => {
    return Object.entries(this.sessionHelp())
      .map(([word, count]) => {
        const data = this.findWord(word);

        return {
          word,
          syllables: data?.syllables ?? [],
          count,
        };
      })
      .sort((a, b) => b.count - a.count);
  });

  /*
   * =====================================================
   * CONSTRUCTOR
   * =====================================================
   */

  constructor() {
    this.loadProgress();

    this.createSession();
  }

  /*
   * =====================================================
   * HELP
   * =====================================================
   */

  toggleHelp(): void {
    if (this.showHelp()) {
      this.showHelp.set(false);

      return;
    }

    this.showHelp.set(true);

    /*
     * L'aiuto viene registrato
     * una sola volta per domanda.
     */

    if (this.helpUsedForCurrentWord) {
      return;
    }

    this.helpUsedForCurrentWord = true;

    this.helpCount.update((value) => value + 1);

    const word = this.currentWord().word;

    this.registerSessionHelp(word);

    this.registerHistoricalHelp(word);
  }

  /*
   * =====================================================
   * ANSWER
   * =====================================================
   */

  answer(isCorrect: boolean): void {
    if (this.finished()) {
      return;
    }

    const word = this.currentWord().word;

    this.registerAttempt(word, isCorrect);

    if (isCorrect) {
      this.correctAnswers.update((value) => value + 1);
    } else {
      this.wrongAnswers.update((value) => value + 1);

      this.registerSessionError(word);
    }

    /*
     * Ultima domanda.
     */

    if (this.sessionIndex >= this.sessionQueue.length - 1) {
      this.finished.set(true);

      this.saveTrainingSession();

      return;
    }

    /*
     * Passiamo alla prossima
     * parola della sessione.
     */

    this.sessionIndex++;

    this.currentQuestion.set(this.sessionIndex + 1);

    this.currentWord.set(this.sessionQueue[this.sessionIndex]);

    this.resetWordHelp();
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

    this.helpCount.set(0);

    this.sessionErrors.set({});

    this.sessionHelp.set({});

    this.showHelp.set(false);

    this.helpUsedForCurrentWord = false;

    this.sessionSaved = false;

    this.finished.set(false);

    /*
     * Generiamo una nuova
     * sessione da zero.
     */

    this.createSession();
  }

  /*
   * =====================================================
   * CREATE SESSION
   * =====================================================
   */

  private createSession(): void {
    const allowedWords = this.getAllowedWords();

    /*
     * Prima mischiamo tutte
     * le parole disponibili.
     */

    const shuffled = this.shuffle(allowedWords);

    /*
     * Se abbiamo almeno 15 parole,
     * prendiamo inizialmente
     * 15 parole diverse.
     */

    let session = shuffled.slice(0, this.totalQuestions);

    /*
     * Se in futuro un livello
     * avesse meno di 15 parole,
     * completiamo la sessione.
     */

    while (session.length < this.totalQuestions) {
      const randomWord =
        allowedWords[Math.floor(Math.random() * allowedWords.length)];

      session.push(randomWord);
    }

    /*
     * Inseriamo intenzionalmente
     * alcune parole difficili.
     *
     * Non vogliamo riempire tutta
     * la sessione di ripetizioni.
     */

    session = this.applyReinforcement(session, allowedWords);

    /*
     * Mescoliamo nuovamente.
     */

    session = this.shuffle(session);

    /*
     * Evitiamo, quando possibile,
     * due parole uguali consecutive.
     */

    session = this.avoidConsecutiveDuplicates(session);

    this.sessionQueue = session.slice(0, this.totalQuestions);

    this.sessionIndex = 0;

    this.currentQuestion.set(1);

    this.currentWord.set(this.sessionQueue[0]);

    this.resetWordHelp();
  }

  /*
   * =====================================================
   * ALLOWED WORDS
   * =====================================================
   */

  private getAllowedWords(): ReadingWord[] {
    const difficulty = this.unlockedDifficulty();

    if (difficulty === 'easy') {
      return this.words.filter((word) => word.difficulty === 'easy');
    }

    if (difficulty === 'medium') {
      return this.words.filter(
        (word) => word.difficulty === 'easy' || word.difficulty === 'medium',
      );
    }

    return [...this.words];
  }

  /*
   * =====================================================
   * REINFORCEMENT
   * =====================================================
   */

  private applyReinforcement(
    session: ReadingWord[],
    allowedWords: ReadingWord[],
  ): ReadingWord[] {
    const stats = this.historicalStats();

    /*
     * Troviamo le parole che
     * richiedono più allenamento.
     */

    const difficultWords = allowedWords
      .map((word) => {
        const wordStats = stats[word.word];

        if (!wordStats || wordStats.attempts < 2) {
          return {
            word,
            priority: 0,
          };
        }

        const accuracy = (wordStats.correct / wordStats.attempts) * 100;

        const helpRate = (wordStats.helps / wordStats.attempts) * 100;

        let priority = 0;

        /*
         * ERRORI
         */

        if (accuracy < 50) {
          priority += 4;
        } else if (accuracy < 70) {
          priority += 3;
        } else if (accuracy < 85) {
          priority += 2;
        }

        /*
         * AIUTO
         */

        if (helpRate >= 50) {
          priority += 3;
        } else if (helpRate >= 25) {
          priority += 1;
        }

        return {
          word,
          priority,
        };
      })

      .filter((item) => item.priority > 0)

      .sort((a, b) => b.priority - a.priority);

    /*
     * Massimo 3 rinforzi
     * per sessione.
     *
     * Quindi almeno 12/15 esercizi
     * rimangono vari.
     */

    const reinforcementCount = Math.min(3, difficultWords.length);

    for (let i = 0; i < reinforcementCount; i++) {
      const difficultWord = difficultWords[i].word;

      /*
       * Sostituiamo una parola
       * verso la fine della lista.
       */

      const replaceIndex = session.length - 1 - i;

      /*
       * Cerchiamo di non eliminare
       * proprio la stessa parola.
       */

      if (session[replaceIndex].word === difficultWord.word) {
        continue;
      }

      session[replaceIndex] = difficultWord;
    }

    return session;
  }

  /*
   * =====================================================
   * AVOID CONSECUTIVE DUPLICATES
   * =====================================================
   */

  private avoidConsecutiveDuplicates(words: ReadingWord[]): ReadingWord[] {
    const result = [...words];

    for (let i = 1; i < result.length; i++) {
      if (result[i].word !== result[i - 1].word) {
        continue;
      }

      /*
       * Cerchiamo una parola diversa
       * più avanti e le scambiamo.
       */

      const swapIndex = result.findIndex(
        (item, index) => index > i && item.word !== result[i - 1].word,
      );

      if (swapIndex === -1) {
        continue;
      }

      const temporary = result[i];

      result[i] = result[swapIndex];

      result[swapIndex] = temporary;
    }

    return result;
  }

  /*
   * =====================================================
   * SHUFFLE
   * =====================================================
   */

  private shuffle<T>(items: T[]): T[] {
    const result = [...items];

    /*
     * Fisher-Yates shuffle.
     */

    for (let i = result.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));

      [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
    }

    return result;
  }

  /*
   * =====================================================
   * RESET CURRENT HELP
   * =====================================================
   */

  private resetWordHelp(): void {
    this.showHelp.set(false);

    this.helpUsedForCurrentWord = false;
  }

  /*
   * =====================================================
   * REGISTER ATTEMPT
   * =====================================================
   */

  private registerAttempt(word: string, isCorrect: boolean): void {
    this.historicalStats.update((stats) => {
      const current = stats[word] ?? {
        attempts: 0,
        correct: 0,
        errors: 0,
        helps: 0,
      };

      return {
        ...stats,

        [word]: {
          ...current,

          attempts: current.attempts + 1,

          correct: current.correct + (isCorrect ? 1 : 0),

          errors: current.errors + (isCorrect ? 0 : 1),
        },
      };
    });

    this.saveProgress();
  }

  /*
   * =====================================================
   * HISTORICAL HELP
   * =====================================================
   */

  private registerHistoricalHelp(word: string): void {
    this.historicalStats.update((stats) => {
      const current = stats[word] ?? {
        attempts: 0,
        correct: 0,
        errors: 0,
        helps: 0,
      };

      return {
        ...stats,

        [word]: {
          ...current,

          helps: current.helps + 1,
        },
      };
    });

    this.saveProgress();
  }

  /*
   * =====================================================
   * SESSION ERROR
   * =====================================================
   */

  private registerSessionError(word: string): void {
    this.sessionErrors.update((errors) => ({
      ...errors,

      [word]: (errors[word] ?? 0) + 1,
    }));
  }

  /*
   * =====================================================
   * SESSION HELP
   * =====================================================
   */

  private registerSessionHelp(word: string): void {
    this.sessionHelp.update((help) => ({
      ...help,

      [word]: (help[word] ?? 0) + 1,
    }));
  }

  /*
   * =====================================================
   * SAVE SESSION
   * =====================================================
   */

  private saveTrainingSession(): void {
    if (this.sessionSaved) {
      return;
    }

    const session: WordTrainingSession = {
      date: new Date().toISOString(),

      correct: this.correctAnswers(),

      errors: this.wrongAnswers(),

      helps: this.helpCount(),

      accuracy: this.accuracy(),
    };

    try {
      const sessions = this.loadSavedSessions();

      sessions.unshift(session);

      localStorage.setItem(
        this.sessionsStorageKey,

        JSON.stringify(sessions.slice(0, this.maxSavedSessions)),
      );

      this.sessionSaved = true;
    } catch (error) {
      console.error(
        'Errore durante il salvataggio della sessione parole',
        error,
      );
    }
  }

  /*
   * =====================================================
   * FIND WORD
   * =====================================================
   */

  private findWord(word: string): ReadingWord | undefined {
    return this.words.find((item) => item.word === word);
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

        JSON.stringify(this.historicalStats()),
      );
    } catch (error) {
      console.error(
        'Errore durante il salvataggio dei progressi parole',
        error,
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
      const saved = localStorage.getItem(this.statsStorageKey);

      if (!saved) {
        return;
      }

      const parsed = JSON.parse(saved) as Record<string, WordStats>;

      this.historicalStats.set(parsed);
    } catch (error) {
      console.error(
        'Errore durante il caricamento dei progressi parole',
        error,
      );
    }
  }

  /*
   * =====================================================
   * LOAD SESSIONS
   * =====================================================
   */

  private loadSavedSessions(): WordTrainingSession[] {
    try {
      const saved = localStorage.getItem(this.sessionsStorageKey);

      if (!saved) {
        return [];
      }

      return JSON.parse(saved) as WordTrainingSession[];
    } catch (error) {
      console.error(
        'Errore durante il caricamento delle sessioni parole',
        error,
      );

      return [];
    }
  }
}
