$(document).ready(function () {
  startTest();
});


function startTest() {
  if (!window.questions) return;

  var can_anser = true;
  var goodAnsers;
  var totalCorrect = 0;
  var currentQuestion = 0;

  var resultOfQuestion = [];
  /**
   * {
   * "question":"",
   * "answer":"",
   * "correct": false|true
   * }
   */

  renderQuestion(currentQuestion);

  timer();

  function renderQuestion(index) {
    var question = questions[index];

    var btnText = [];
    goodAnsers = question['good_anser'].split('::');
    var badAnsers = question['bad_anser'].split('::');

    btnText = goodAnsers
      .concat(badAnsers)
      .sort(compareRandom);

    var tpl = '<div class="test">';
    tpl += '<h2 class="test__title">' + question['question'] + '</h2>';
    tpl += '<ul class="test__list">';
    for (var i = 0; i < btnText.length; i++) {
      tpl += '<li class="test__itemlink js-quiz-btn">' + btnText[i] + '</li>';
    }
    tpl += '</ul>';
    tpl += '</div>';

    // console.log(tpl);
    $('#test').html(tpl)
  }

  $(document).on('click', '.js-quiz-btn', clickOnElement);

  function clickOnElement(e) {
    if (!can_anser) {
      return
    }
    e.preventDefault();
    var self = $(this);
    var text = self.text();
    var correct = false;

    var index = goodAnsers.indexOf(text);

    if (index != -1) {
      correct = true;
      totalCorrect += 1;
    }

    var itemToResult = {
      "question": window.questions[currentQuestion].question,
      "answer": text,
      "correct": correct
    };

    resultOfQuestion.push(itemToResult);


    getNextQuestion();
  }

  function getNextQuestion() {
    currentQuestion += 1;

    console.log(currentQuestion);
    if (currentQuestion < window.questions.length) {
      renderQuestion(currentQuestion);
    } else {
      finishQuestions();
    }
  }

  function finishQuestions() {
    can_anser = false;

    var total = window.questions.length;
    var persent = totalCorrect * 100 / total;
    var classTotal = 'exelant';

    persent = persent.toFixed(0);

    if (persent < 40) {
      classTotal = 'bad';
    } else if (persent < 70) {
      classTotal = 'good';
    }

    var tpl = '<h2 class="test__result">Ваш результат:</h2>';
    tpl += '<div class="test__result-count ' + classTotal + '">' + totalCorrect + '/' + total + '</div>';

    $('#test').html(tpl);

    renderResultOfQuestion();

  }

  function renderResultOfQuestion() {

    var tpl = '<h2 class="test__result">Ваши ответы:</h2>';

    for (var i = 0; i < resultOfQuestion.length; i++) {
      var qq = resultOfQuestion[i];
      tpl += '<div class="result">';
      tpl += '<div class="result__question">' + qq.question + '</div>';
      tpl += '<div class="result__answer"><b>Ваш ответ:</b> ' + qq.answer + '</div>';

      var text = "не верно";
      var status = "error";
      if (qq.correct) {
        text = "верно";
        status = "success";
      }
      tpl += '<div class="result__status '+status+'"><b>Результат:</b> ' + text + '</div>';
      tpl += '</div>';

      //question
      //answer
      //correct
    }

    console.log(resultOfQuestion);

    $('#result').html(tpl);
  }

  function timer() {
    var dtart_time = new Date();
    dtart_time = new Date(dtart_time.setMinutes(dtart_time.getMinutes() + 10));

    var timeEl = $('#timer');

    requestAnimationFrame(updateTimer);

    function updateTimer() {
      var current_time = new Date();

      if (!can_anser) {
        return
      }

      if (dtart_time - current_time <= 0) {
        timeEl.text("Время вышло!");
        finishQuestions();
        return
      }

      var seconds = (dtart_time - current_time) / 1000;
      var minuts = (seconds / 60) % 60;
      timeEl.text(Math.floor(minuts).toFixed(0) + ":" + Math.floor(seconds % 60).toFixed(0));
      requestAnimationFrame(updateTimer);

    }
  }
}

function compareRandom(a, b) {
  return Math.random() - 0.5;
}