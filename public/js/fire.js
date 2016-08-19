$( document ).ready(function() {

// Quiz result options in a separate object for flexibility
var resultOptions = [
    {   title: 'Axe Class',
        image: '<img class = "result-pic" id = "img" src="/static/css/images/FireSlides/axe.png"/>',
        desc: '<p class="info">You are an axe user. Axe classes often have high hp and deal the most damage out of any class, but have low accuracy and frail defenses. In the weapon triangle, they are strong against lances but weak against swords. Example Classes: Berserker, Warrior </p>'},
    {   title: 'Lance Class',
        image: '<img class = "result-pic" id = "img" src="/static/css/images/FireSlides/lance.png"/>',
        desc: '<p class="info">You are a lance user. Lance classes are often classified as the middleground between swords and lances. They are not the most powerful weapon but not the most accurate either. Majority of lance classes have solid defenses such as Knights, but some can have poor defenses such as Pegasus Knights. Example Classes: Knight, Pegasus Knight</p>'},
    {   title: 'Sword Class',
        image: '<img class = "result-pic" id = "img" src="/static/css/images/FireSlides/sword.png"/>',
        desc: '<p class="info">You are a sword user. Sword classes are the most accurate of the weapon triangle, but are often the weakest in terms of damage. Most sword-primary wielding classes are often complemented with high speed but poor defenses. Example Classes: Swordmaster, Thief</p>'},
    {   title: 'Bow Class',
        image: '<img class = "result-pic" id = "img" src="/static/css/images/FireSlides/bow.png"/>',
        desc: '<p class="info">You are a bow user. Bow classes excel at hitting enemies from long range, however, they are vulnerable to close range attacks since they cannot make follow-up attacks. Example Classes: Sniper, Bow Knight</p>'},
    {   title: 'Tome Class',
        image: '<img class = "result-pic" id = "img" src="/static/css/images/FireSlides/tome.png"/>',
        desc: '<p class="info">You are a tome user. Tome users excel at using magic from both close and long range. They deal great damage against foes with low resistance, however, they are one of the most frailest classes in the game due to their low defenses. Example Classes: Mage, Sorcerer</p>'}
];

//Global variable to use for number of results, change if needed
var QuestionNumbers = 5;

// global variables
var quizSteps = $('#quizzie .quiz-step'),
    totalScore = 0;

// for each step in the quiz, add the selected answer value to the total score
// if an answer has already been selected, subtract the previous value and update total score with the new selected answer value
// toggle a visual active state to show which option has been selected
quizSteps.each(function () {
    var currentStep = $(this),
        ansOpts = currentStep.children('.quiz-answer');
    // for each option per step, add a click listener
    // apply active class and calculate the total score
    ansOpts.each(function () {
        var eachOpt = $(this);
        eachOpt[0].addEventListener('click', check);
        function check() {
            var $this = $(this),
                value = $this.attr('data-quizIndex'),
                //parses a string argument and returns integer of the specified radix, i.e.. 1,2,3...
                answerScore = parseInt(value);
                console.log(answerScore);
                //adds a class named active
                $this.addClass('active');
                // handle score calculation
                totalScore += answerScore;
                calcResults(totalScore);
                //show and hide current step
                nextStep(currentStep);
            // }
        }
    });
});

// fixed-shows current step/hide other steps
function nextStep(currentStep) {
    var y = currentStep.attr('index');
    i= parseInt(y);
    console.log(i);
    if (i<=QuestionNumbers){
    $('.step'+[i]).hide();
    $('.step'+[i+1]).show();
    console.log('looped');
   }
 }

// display scoring results
function calcResults(totalScore) {
    // only update the results div if all questions have been answered
    if (quizSteps.find('.active').length == quizSteps.length){
      $('#results').show();
        var resultsTitle = $('#results h1'),
            resultsDesc = $('#results .desc'),
            resultsImag1 = $('#results #pic1'),
            resultsTitle2 = $('#results h2'),
            resultsDesc2 = $('#results .desc2'),
            resultsImag2 = $('#results #pic2'),
            resultsTitle3 = $('#results h3'),
            resultsDesc3 = $('#results .desc3'),
            resultsImag3 = $('#results #pic3');

        // calc lowest possible score
        var lowestScoreArray = $('#quizzie .low-value').map(function() {
            return $(this).attr('data-quizIndex');
        });
        var minScore = 0;
        for (var i = 0; i < lowestScoreArray.length; i++) {
            minScore += lowestScoreArray[i] << 0;
        }
        // calculate highest possible score
        var highestScoreArray = $('#quizzie .high-value').map(function() {
            return $(this).attr('data-quizIndex');
        });
        var maxScore = 0;
        for (var i = 0; i < highestScoreArray.length; i++) {
            maxScore += highestScoreArray[i] << 0;
        }
        // calc range, number of possible results, and intervals between results
        var range = maxScore - minScore,
            numResults = resultOptions.length,
            interval = range / (numResults - 1),
            increment = '',
            n = 0; //increment index
        // incrementally increase the possible score, starting at the minScore, until totalScore falls into range. then match that increment index (number of times it took to get totalScore into range) and return the corresponding index results from resultOptions object
        while (n < numResults) {
            increment = minScore + (interval * n);
            if (totalScore <= increment) {
                //hide current slide to show results
                $('.step'+[i]).hide();
                // populate results onto page
                resultsTitle.replaceWith("<h1>" + resultOptions[n].title + "</h1>");
                console.log('number in array is' + ' ' + n);
                resultsDesc.replaceWith("<p class='desc'>" + resultOptions[n].desc + "</p>");
                resultsImag1.replaceWith("<span id='pic1'>" + resultOptions[n].image + "</span>");
                // if end of array, then reverse
                  if (n == 4) {
                    resultsTitle2.replaceWith("<h2>" + resultOptions[n-1].title + "</h2>");
                    resultsDesc2.replaceWith("<p class='desc2'>" + resultOptions[n-1].desc + "</p>");
                    resultsImag2.replaceWith("<span id='pic2'>" + resultOptions[n-1].image + "</span>");
                    console.log($(this).width());
                    resultsTitle3.replaceWith("<h3>" + resultOptions[n-2].title + "</h3>");
                    resultsDesc3.replaceWith("<p class='desc3'>" + resultOptions[n-2].desc + "</p>");
                    resultsImag3.replaceWith("<span id='pic3'>" + resultOptions[n-2].image + "</span>");
                }
                else if (n == 3) {
                    resultsTitle2.replaceWith("<h2>" + resultOptions[n+1].title + "</h2>");
                    resultsDesc2.replaceWith("<p class='desc2'>" + resultOptions[n+1].desc + "</p>");
                    var results = resultsImag2.replaceWith("<span id='pic2'>" + resultOptions[n+1].image + "</span>");
                    console.log(resultOptions[n+1].image.style);
                    resultsTitle3.replaceWith("<h3>" + resultOptions[n-1].title + "</h3>");
                    resultsDesc3.replaceWith("<p class='desc3'>" + resultOptions[n-1].desc + "</p>");
                    resultsImag3.replaceWith("<span id='pic3'>" + resultOptions[n-1].image + "</span>");
                  }
              else {
                resultsTitle2.replaceWith("<h2>" + resultOptions[n+1].title + "</h2>");
                resultsDesc2.replaceWith("<p class='desc2'>" + resultOptions[n+1].desc + "</p>");
                resultsImag2.replaceWith("<span id='pic2'>" + resultOptions[n+1].image + "</span>");
                console.log($(this).width());
                resultsTitle3.replaceWith("<h3>" + resultOptions[n+2].title + "</h3>");
                resultsDesc3.replaceWith("<p class='desc3'>" + resultOptions[n+2].desc + "</p>");
                resultsImag3.replaceWith("<span id='pic3'>" + resultOptions[n+2].image + "</span>");
              }
                return;
            } else {
                n++;
            }
        }
    }
}

//event handlers when clicking on image
$('#pic1').click(function() {
  alert('result-pic');
  // document.getElementById('play').style.visibility = "hidden";
});


});
