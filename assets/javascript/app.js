const theme = "animal"

var app = null;


let GiphyApp = class {
	constructor() {
		// let topics = [];
		let me = this;
		$(document).on("click", ".btn-load-images", me.loadTopicImages);
		$(document).on("click", ".topic-search-button", me.addTopic);
		this.topics = ["Kitten", "Puppy"];
		this.theme = theme;
		this.setupAppDivs();

		// setTimeout(function() {
		me.addSearchPanel();
		me.renderTopicButtons();

		// }, 0);
	}

	loadTopicImages(event) {
		// console.log(event);
		// console.log($(this).text())
		let topic = $(this).text();
		console.log(topic);
	}

	addTopic(event) {
		// console.log($(this));
		let newTopic = $("#new-topic").val();
		console.log(newTopic);
		if (newTopic.trim().length > 0) {
			if (app.topics.filter(topic => topic.toLowerCase().replace(/ /, "") === newTopic.toLowerCase().replace(/ /, "")).length < 1) {
				app.topics.push(newTopic);
				app.renderTopicButtons();
			}
		}

	}

	setupAppDivs() {
		$("#app-container").append($("<div>").addClass("row").
			append($("<div>").addClass("col-md-8").
				append($("<div>").addClass("topic-buttons-container")).append($("<br>")).
				append($("<div>").addClass("images-container").text("Click one of the topics to load gifs!"))

		).
		append($("<div>").addClass("col-md-4").
			append($("<div>").addClass("search-container"))
		));
	}

	addSearchPanel() {
		let searchPanel = ($("<div>").addClass("card"))
		searchPanel.append($("<div>").addClass("card-header").text("Add " + this.theme));
		// $("#searchPanel"));
		let cardBody = $("<div>").addClass("card-body");
		cardBody.append($("<input>").attr("type", "text").attr("id", "new-topic").attr("placeholder", "Search for a new " + this.theme));
		cardBody.append("<br>")
		cardBody.append($("<div>").addClass("btn btn-success btn-square topic-search-button").text("Add " + this.theme));
		searchPanel.append(cardBody);
		$(".search-container").append(searchPanel);
		// <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com">
	}



	renderTopicButtons() {
		let me = this;
		$(".topic-buttons-container").empty();
		me.topics.forEach(function(topic, i) {
			console.log(topic);
			let topicButton = $("<div>").addClass("btn btn-square btn-primary btn-load-images").text(topic).attr("value", topic);
			$(".topic-buttons-container").append(topicButton);
		});

	}
}



$(document).ready(function() {
	app = new GiphyApp();

})