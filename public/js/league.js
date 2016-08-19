$( document ).ready(function() {

// Quiz result options in a separate object for flexibility
var resultOptions = [
    {   title: 'ADC',
        image: '<img class = "result-pic" id = "img" src="/static/css/images/LeagueSlides/ADC.png"/>',
        desc: '<p class="info">An abbreviation of Attack Damage Carry. ADC Champions are champions that deals, strong, continous damage with their basic attacks and scales with attack-related stats. Their role is to protect the bottom role along with a Supporting Champion. </p>'},
    {   title: 'AP Mid',
        image: '<img class = "result-pic" id = "img" src="/static/css/images/LeagueSlides/ApMid.png"/>',
        desc: '<p class="info">An abbreviation of Ability Power. AP are usually mage-like champions whose objective is to protect the mid lane. As an AP Mid carry, your primary role is to cast your burst to kill an enemy carry quickly or poking the other team to force them back or for a quick engage once they have been weakened.</p>'},
    {   title: 'Solo Top',
        image: '<img class = "result-pic" id = "img" src="/static/css/images/LeagueSlides/solotop.png"/>',
        desc: '<p class="info">Your role is Solo Top, whose primary objective is to protect the uppermost lane. Unlike the mid and bottom lane objectives, whose primary goal is to fight over map objectives, your goal as a solo top laner is to farm. Solo top champions will usually also be very good pushers/farmers, in order to keep up proper lane pressure throughout the entire game.</p>'},
    {   title: 'Support',
        image: '<img class = "result-pic" id = "img" src="/static/css/images/LeagueSlides/support.png"/>',
        desc: '<p class="info">Supporting champions make plays by enabling their allies through buffs and heals, or disrupting enemy lines through crowd control. They protect the bottom lane, along with an ADC carry champion.</p>'},
    {   title: 'Jungler',
        image: '<img class = "result-pic" id = "img" src="/static/css/images/LeagueSlides/jungler.png"/>',
        desc: '<p class="info">Your role is the Jungler. Unlike the other League roles, junglers are not designated a specific lane and rely on slaying on monsters in the jungle to gain experience and gold. Because monsters give powerful buffs to your champion when slain, Junglers are often optimal for ganking enemy champions.</p>'}
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
        // eachOpt[0].addEventListener('click', check, false);
        eachOpt[0].addEventListener('click', check);
        function check() {
            var $this = $(this),
                value = $this.attr('data-quizIndex'),
                //parses a string argument and returns integer of the specified radix, i.e.. 1,2,3...
                answerScore = parseInt(value);
                console.log(answerScore);
                // handle visual active state
                $this.addClass('active');
                // handle score calculation
                totalScore += answerScore;
                calcResults(totalScore);
                //show and hide current step
                nextStep(currentStep);
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
