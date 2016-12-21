import {questionType} from './../const.js';
import questions from './../data/questions';
import AbstractView from './abstract';
import getStars from './../templates/stars';

import questionSingleQuestionTemplate from './../templates/question-single';
import questionDoubleQuestionTemplate from './../templates/question-double';
import questionTripleQuestionTemplate from './../templates/question-triple';

const questionTemplate = (question) => {
  switch (question.type) {
    case questionType.SINGLE: {
      return questionSingleQuestionTemplate(question);
    }
    case questionType.DOUBLE: {
      return questionDoubleQuestionTemplate(question);
    }
    case questionType.TRIPLE: {
      return questionTripleQuestionTemplate(question);
    }
    default: {
      throw new RangeError('Передан вопрос с неизвестным типом');
    }
  }
};

export default class QuestionsView extends AbstractView {
  constructor(state) {
    super();
    this._state = state;
    this._question = questions[this._state.questionNumber];
  }

  getMarkup() {
    return `<div class="game">
      ${ questionTemplate(this._question) }
      <div class="stats">
        ${ getStars(this._state.answers) }
      </div>
    </div>`;
  }

  set onAnswer(handler) {
    this._onAnswer = handler;
  }

  bindHandlers() {
    // повесили слушателей
    let elements = null; // let scope; I don't want use var and ternary operator.
    if (this._question.type === questionType.TRIPLE) {
      elements = this.element.querySelectorAll('.game__option');
    } else {
      elements = this.element.querySelectorAll('.game__answer');
    }

    // сработал и если выполнились условия, удалили всё
    const userChoice = (event) => {
      switch (this._question.type) {
        case questionType.SINGLE: {
          const answerElement = document.querySelector('input[name^=question]:checked');
          if (answerElement) {
            this._onAnswer(this._question.options[0].answer === answerElement.value);
          }
        } break;
        case questionType.DOUBLE: {
          const answerElements = document.querySelectorAll('input[name^=question]:checked');
          if (answerElements.length === 2) {
            const isRight = Array.from(answerElements).reduce((result, element, index) => {
              if ( !result) {
                return (element.value === this._question.options[index].answer);
              }

              return result && (element.value === this._question.options[index].answer);
            });
            this._onAnswer(isRight);
            // remove handler
          }
        } break;
        case questionType.TRIPLE: {
          const target = event.target;
          const answerElements = document.querySelectorAll('.game__option');
          const answerIndex = Array.from(answerElements).findIndex((element, index) => {
            return element === target;
          });

          this._onAnswer(this._question.options[answerIndex].answer === 'paint');
        } break;
      }
    };

    for (const item of elements) {
      item.addEventListener('click', userChoice);
    }
  }
}