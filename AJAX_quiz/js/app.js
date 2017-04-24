var score = 0;

function playCheer() {
  const audio = document.querySelector(`audio`);
  if (!audio) {
    return;
  } //stops the function from running
  audio.currentTime = 0; //rewind to the start
  audio.play();
}

//Render start screen - takes an array of quizzes
function renderStart(quizzes) {
  var scoreScreen = document.querySelector('#score-screen');
  var startScreen = document.querySelector('#start-screen-buttons');
  scoreScreen.className = "hidden";
  startScreen.innerHTML = "";
  document.querySelector('#start-screen-container').className = "";

  //create buttons for choosing quiz
  for (let i = 0, j = quizzes.length; i < j; i++) {
    let btn = document.createElement('button');
    startScreen.appendChild(btn);
    btn.textContent = quizzes[i]['title'];
    btn.className = quizzes[i]['title'];
    btn.addEventListener('click', function() {
      //begin chosen quiz on click
      document.querySelector('#start-screen-container').className = "hidden";
      score = 0;
      renderQuestions(quizzes[i], 0);
      document.querySelector('#score').textContent = "Score: " + score;
    });
  }
}

//Render question pages - takes quiz number and index of current question/answers
function renderQuestions(quizNum, n) {
  var question = quizNum['questions'][n];
  var btncontainer = document.querySelector('#button-container');
  var answers = question.answers;
  //render header question
  btncontainer.innerHTML = "";
  var header = document.createElement('h2');
  header.textContent = question['question'];
  header.className = quizNum['title'];
  btncontainer.appendChild(header);
  //render answer buttons
  for (let i = 0, j = answers.length; i < j; i++) {
    let btn = document.createElement('button');
    btncontainer.appendChild(btn);
    btn.textContent = answers[i]['content'];
    btn.className = "quiz-btn";
    if (answers[i]['value']) {
      btn.setAttribute('id', "right-answer");
    }
    //increases score and plays cheer if necessary, highlights wrong and right answers
    btn.addEventListener('click', function() {
      var quizBtns = document.querySelectorAll('.quiz-btn');
      for (let i = 0; i < quizBtns.length; i++) {
        //disables btns to prevent score increase by user clicking correct answer during time delay
        quizBtns[i].disabled = true;
      }
      if (answers[i]['value']) {
        btn.className = "right quiz-btn correct-boost";
        playCheer();
        score += 1;
      } else {
        btn.className = "wrong quiz-btn";
      }
      document.querySelector('#right-answer').className = "right correct-boost";
      setTimeout(function() {
        //shows score screen if no more questions and displays win/lose message
        if (n + 1 >= quizNum['questions'].length) {
          document.querySelector('#score').textContent = "";
          document.querySelector('#score-screen').className = "";
          btncontainer.innerHTML = "";
          document.querySelector('#final-score').textContent = "Final Score: " + score + " / " + quizNum['questions'].length;
          if (score >= quizNum['questions'].length / 2) {
            document.querySelector('#message').textContent = "A winner is you!";
          } else {
            document.querySelector('#message').textContent = "casul";
          }
        } else {
          //otherwise render next page of questions
          renderQuestions(quizNum, n + 1);
        }
      }, 3000);
      document.querySelector('#score').textContent = "Score: " + score;
    });
  }
}

//AJAX request for JSON Quiz Data
var requestURL = 'https://raw.githubusercontent.com/redacademy/adp-entrance/master/src/quiz.json?token=AZF-nl0Km-DP-oNyblNRCGf1d5rRTpRaks5ZBHaFwA%3D%3D';

var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function() {
  var quiz = request.response;
  renderStart(quiz['quizzes']);
  document.querySelector('#reset').addEventListener('click', function() {
    renderStart(quiz['quizzes']);
  });
}
