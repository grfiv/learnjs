'use strict';

/**
 * learnjs
 *
 * namespace for this app
 */
var learnjs = {};

/**
 * problems
 *
 * json list of data objects
 */
learnjs.problems = [
    {
        description: "What is truth?",
        code: "function problem() { return __; }"
    },
    {
        description: "Simple Math",
        code: "function problem() { return 42 === 6 * __; }"
    }
];

/**
 * applyObject
 *
 * given
 * * a json object like { keyX: valueX,
 *                        keyY: valueY
 *                      }
 *
 * * and elements like <tag data-name="keyX"></tag>
 *                     <tag data-name="keyY"></tag>
 *
 * produce             <tag data-name="keyX">valueX</tag>
 *                     <tag data-name="keyY">valueY</tag>
 *
 * @param obj json
 * @param elem an element or group of elements to fill
 */
learnjs.applyObject = function(obj, elem) {
    for (var key in obj) {
        elem.find('[data-name="' + key + '"]').text(obj[key]);
    }
};


learnjs.flashElement = function (elem, content) {
    elem.fadeOut('fast', function() {
        elem.html(content);
        elem.fadeIn();
    })
};


learnjs.template  = function (name) {
    return $('.templates .' + name).clone();
};


learnjs.buildCorrectFlash = function (problemNum) {
    var correctFlash = learnjs.template('correct-flash');
    var link = correctFlash.find('a');
    if (problemNum < learnjs.problems.length) {
        link.attr('href', '#problem-' + (problemNum + 1));
    } else {
        link.attr('href', '');
        link.text("You're Finished!")
    }
    return correctFlash;
};

learnjs.landingView = function() {
    return learnjs.template('landing-view');
};

learnjs.problemView = function(data) {
    var problemNumber = parseInt(data, 10);
    var problemData = learnjs.problems[problemNumber - 1];

    var view = $('.templates .problem-view').clone();

    // add the button to skip this problem
    var buttonItem = learnjs.template('skip-btn');
    if (problemNumber < learnjs.problems.length) {
        buttonItem.find('a').attr('href', '#problem-' + (problemNumber + 1));
    } else {
        buttonItem.find('a').attr('href', '#');
    }
    $('.nav-list').append(buttonItem);

    // upon receipt of removingItem event, remove the button
    view.bind('removingView', function () {
        buttonItem.remove();
    });


    var resultFlash = view.find('.result');

    function checkAnswer() {
        var answer = view.find('.answer').val();
        var test = problemData.code.replace('__', answer) + '; problem();';
        return eval(test);
    }

    function checkAnswerClick() {
        var chkAns = false;
        try { chkAns = checkAnswer(); } catch(err) {}

        if (chkAns) {
            var correctFlash = learnjs.buildCorrectFlash(problemNumber);
            learnjs.flashElement(resultFlash, correctFlash);
        } else {
            learnjs.flashElement(resultFlash.text('Incorrect!'));
        }
        return false;
    }

    view.find('.check-btn').on('click',checkAnswerClick);
    view.find('.title').text('Problem #' + problemNumber);
    learnjs.applyObject(problemData, view);
    return view;
};

learnjs.triggerEvent = function (name, args) {
    $('.view-container>*').trigger(name, args);
};


learnjs.showView = function(hash) {

    var routes = {
        '#problem' : learnjs.problemView,
        '#' : learnjs.problemView,
        '':   learnjs.landingView
    };
    var hashParts = hash.split('-');
    var viewFn = routes[hashParts[0]];


    if (viewFn) {
        // notify existing view (if any) it is being removed
        learnjs.triggerEvent('removingView', []);

        // empty the container and then fill it
        $('.view-container').empty().append(viewFn(hashParts[1]));
    }
};

learnjs.appOnReady = function () {
    window.onhashchange = function () {
        learnjs.showView(window.location.hash);
    };
    learnjs.showView(window.location.hash);
};
