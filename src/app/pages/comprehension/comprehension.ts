import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  COMPREHENSION_STORIES,
  ComprehensionStory,
} from '../../data/comprehension-stories';

@Component({
  selector: 'app-comprehension',
  imports: [RouterLink],
  templateUrl: './comprehension.html',
  styleUrl: './comprehension.scss',
})
export class Comprehension {
  readonly stories: ComprehensionStory[] = COMPREHENSION_STORIES;

  readonly currentStoryIndex = signal(0);
  readonly currentQuestionIndex = signal(0);

  readonly readingStory = signal(true);
  readonly storyVisible = signal(true);
  readonly showAnswer = signal(false);
  readonly finished = signal(false);

  readonly correctAnswers = signal(0);
  readonly reviewAnswers = signal(0);

  readonly currentStory = computed(
    () => this.stories[this.currentStoryIndex()],
  );

  readonly currentQuestion = computed(
    () =>
      this.currentStory()
        .questions[this.currentQuestionIndex()],
  );

  readonly questionNumber = computed(
    () => this.currentQuestionIndex() + 1,
  );

  readonly totalQuestions = computed(
    () => this.currentStory().questions.length,
  );

  readonly accuracy = computed(() => {
    const answered =
      this.correctAnswers() +
      this.reviewAnswers();

    if (!answered) {
      return 0;
    }

    return Math.round(
      (this.correctAnswers() / answered) * 100,
    );
  });

  readonly progress = computed(
    () =>
      (this.questionNumber() / this.totalQuestions()) * 100,
  );

  finishReading(): void {
    this.readingStory.set(false);
    this.storyVisible.set(false);
  }

  toggleStory(): void {
    this.storyVisible.update(
      visible => !visible,
    );
  }

  revealAnswer(): void {
    this.showAnswer.set(true);
  }

  answer(isCorrect: boolean): void {
    if (!this.showAnswer() || this.finished()) {
      return;
    }

    if (isCorrect) {
      this.correctAnswers.update(
        value => value + 1,
      );
    } else {
      this.reviewAnswers.update(
        value => value + 1,
      );
    }

    const isLastQuestion =
      this.currentQuestionIndex() ===
      this.totalQuestions() - 1;

    if (isLastQuestion) {
      this.finished.set(true);
      return;
    }

    this.currentQuestionIndex.update(
      value => value + 1,
    );

    this.showAnswer.set(false);
    this.storyVisible.set(false);
  }

  restart(): void {
    this.currentQuestionIndex.set(0);

    this.correctAnswers.set(0);
    this.reviewAnswers.set(0);

    this.readingStory.set(true);
    this.storyVisible.set(true);
    this.showAnswer.set(false);

    this.finished.set(false);
  }

  nextStory(): void {
    const nextIndex =
      (this.currentStoryIndex() + 1) %
      this.stories.length;

    this.currentStoryIndex.set(nextIndex);

    this.restart();
  }
}