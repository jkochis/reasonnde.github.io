define([
		'hammer',
		'./question',
		'lib/Util'
	],
	function(Hammer, QuestionController, Util) {

		var questions = [],
			answers = [];

		function setup () {
			var questionsWrapper = $(".questionnaire-cnt"),
				questionElements = $(".question"),
				submitButton = $(".lic-home .bt-action");

			questionElements.each(function (index, item) {
				var questionEl = $(item);
				questions.push(new QuestionController(questionEl));
			});
		}

		function getScore() {

			answers = [];

			for( var i = 0, l = questions.length, item; i < l; i++) {
				item = questions[i];

				answers.push({
					type : item.getType(),
					value : item.getValue()
				});
			}

			var score = 0,
				income = 0,
				age = 0,
				PREDICTED_DEATH = 79;

			//answers.forEach(function(answer){
			for(var n = 0, len = answers.length; n < len; n++) {
				var answer = answers[n];
				var value = parseInt(answer.value, 10);
				switch(answer.type) {
					case 'income':
						income = value;
						break;

					case 'age':
						age = value;
						break;

					case 'subtract':
						score -= value;
						break;

					case 'add':
						score += value;
						break;
				}
			}

			score += ((PREDICTED_DEATH - age) * income);
			if (window.utag) {
			utag.link({_ga_category: 'life insurance calculator',_ga_action: 'complete',_ga_label: 'results : '+score});
			}
			return score;
		}

		return {
			setup: setup,
			getScore: getScore
		};
	}
);
