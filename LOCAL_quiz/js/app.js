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

var quiz = {
  "quizzes": [{
    "title": "Abstract Quiz",
    "questions": [{
      "question": "If two left handed people argue, which one is right?",
      "answers": [{
        "content": "The one on the right.",
        "value": false
      }, {
        "content": "The one on the left.",
        "value": true
      }, {
        "content": "The one with the gun.",
        "value": false
      }, {
        "content": "Tom.",
        "value": false
      }]
    }, {
      "question": "What does Google use if it can't find an answer on Google?",
      "answers": [{
        "content": "Bing",
        "value": false
      }, {
        "content": "Bang",
        "value": false
      }, {
        "content": "Bong",
        "value": false
      }, {
        "content": "Ask Jeeves",
        "value": true
      }]
    }, {
      "question": "What kind of pants do Mario and Luigi wear?",
      "answers": [{
        "content": "Dussault apparel slashed jeans",
        "value": false
      }, {
        "content": "Tapered bell bottoms",
        "value": false
      }, {
        "content": "Acid washed Guccis",
        "value": false
      }, {
        "content": "Denim denim denim",
        "value": true
      }]
    }]
  }, {
    "title": "Dev Quiz",
    "questions": [{
      "question": "How many programmers does it take to change a lightbulb?",
      "answers": [{
        "content": "x = x + 1",
        "value": false
      }, {
        "content": "undefined",
        "value": false
      }, {
        "content": "NaN === NaN",
        "value": false
      }, {
        "content": "None. It's a hardware problem.",
        "value": true
      }]
    }, {
      "question": "What's the object oriented way to become wealthy?",
      "answers": [{
        "content": "Inheritance",
        "value": true
      }, {
        "content": "Have some class",
        "value": false
      }, {
        "content": "Super props",
        "value": false
      }, {
        "content": "Wealth is subjective",
        "value": false
      }]
    }, {
      "question": "What should you do when a bug is sad?",
      "answers": [{
        "content": "Help it out of a bind",
        "value": false
      }, {
        "content": "Console it",
        "value": true
      }, {
        "content": "Express your feelings",
        "value": false
      }, {
        "content": "Be more responsive",
        "value": false
      }]
    }]
  }]
};

//function to render quiz app
renderStart(quiz['quizzes']);
document.querySelector('#reset').addEventListener('click', function() {
  renderStart(quiz['quizzes']);
});
