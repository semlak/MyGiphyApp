const theme = "animal"

var app = null;


let GiphyApp = class {
	constructor() {
		// let topics = [];
		let me = this;
		$(document).on("click", ".btn-load-images", me.loadTopicImages);
		$(document).on("click", ".topic-search-button", me.addTopic);
		$(document).on("click", ".gif", me.gifClick);
		$(document).on("click", "#reset-button", me.reset)
		// $(document).on('popover', '[data-toggle="popover"]',{trigger: 'hover'})
			// $('[data-toggle="popover"]').popover({trigger: 'hover'});
		// $(document).on('popover', '[data-toggle="popover"]',{trigger: 'hover'})

			// $('[data-toggle="popover"]').popover({trigger: 'hover'});

		this.initialTopics = ["Kitten", "Puppy"];
		this.topics = this.initialTopics.slice(0);
		this.theme = theme;
		this.setupAppDivs();

		// setTimeout(function() {
		me.addSearchPanel();
		me.renderTopicButtons();

		// }, 0);
	}

	reset() {
		app.topics = [];
		// app.topics = app.initialTopics.slice(0);
		app.renderTopicButtons();
		$(".images-container .row").empty().append($("<div>").addClass("col").text("Click one of the topics to load gifs!"))
;



	}

	gifClick() {
		// The attr jQuery method allows us to get or set the value of any attribute on our HTML element
		var state = $(this).attr("data-state");
		// If the clicked image's state is still, update its src attribute to what its data-animate value is.
		// Then, set the image's data-state to animate
		// Else set src to the data-still value
		if (state === "still") {
			$(this).attr("src", $(this).attr("data-animate"));
			$(this).attr("data-state", "animate");
		} else {
			$(this).attr("src", $(this).attr("data-still"));
			$(this).attr("data-state", "still");
		}
	}

	loadTopicImages(event) {
		// console.log(event);
		// console.log($(this).text())
		let topic = $(this).text();
		console.log(topic);
		app.loadGifs(topic);
		setTimeout(function() {
			// $('.gif').popover({trigger: 'hover'}, 100);
			  // $('[data-toggle="popover"]').popover()
			// $(".gif").popover('enable');
			// $(".gif").popover({trigger: 'hover'});
			$('[data-toggle="popover"]').popover({trigger: 'hover'});

		}, 1000);
	}

	addTopic(event) {
		// console.log($(this));
		event.preventDefault();
		let newTopic = $("#new-topic").val();
		console.log(newTopic);
		if (newTopic.trim().length > 0) {
			if (app.topics.filter(topic => topic.toLowerCase().replace(/ /, "") === newTopic.toLowerCase().replace(/ /, "")).length < 1) {
				app.topics.push(newTopic);
				// $("#new-topic").attr("value", "");
				$("#new-topic").val("");
				// $("input").val("");
				app.renderTopicButtons();
			}
		}

	}

	setupAppDivs() {
		$("#app-container").
			append($("<div>").addClass("row flex-column-reverse flex-md-row").
				append($("<div>").addClass("col-xl-8 col-lg-8 col-md-7 col-sm-push-5" ).
					append($("<div>").addClass("topic-buttons-container")
				)
			).
			append($("<div>").addClass("col-xl-4 col-lg-4 col-md-5 col-sm-pull-7").
				append($("<div>").addClass("search-container")
			)
		)
			).append($("<div>").addClass("row").
				append($("<div>").addClass("images-container")
					.append($("<div>").addClass("row").append($("<div>").addClass("col").text("Click one of the topics to load gifs!"))
				)
			)
		)
	}

	addSearchPanel() {
		let searchPanel = ($("<div>").addClass("card"))
		searchPanel.append($("<div>").addClass("card-header").text("Add " + this.theme));
		// $("#searchPanel"));
		let cardBody = $("<div>").addClass("card-body");
		cardBody.append($("<form>").
			append($("<input>").attr("type", "text").attr("id", "new-topic").attr("placeholder", "Search for a new " + this.theme)).
			append("<br>").
			append($("<button>").addClass("btn btn-success btn-square topic-search-button").text("Add " + this.theme).
				attr("autofocus", true)));
		searchPanel.append(cardBody);
		$(".search-container").append(searchPanel);
		// <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com">
	}



	renderTopicButtons() {
		let me = this;
		$(".topic-buttons-container").empty();
		if (me.topics.length < 1) {
			$(".topic-buttons-container").text("Add a topic button to get started...");
		}
		me.topics.forEach(function(topic, i) {
			console.log(topic);
			let topicButton = $("<div>").addClass("btn btn-square btn-primary btn-load-images").text(topic).attr("value", topic);
			topicButton.attr("data-toggle", "popover").attr("data-content", "Load images relating to " + topic).attr("data-placement", "bottom").
			attr("delay", 500)
// <button type="button" class="btn btn-lg btn-danger" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?">Click to toggle popover</button>

			$(".topic-buttons-container").append(topicButton);
		});
		setTimeout(function() {
			$('[data-toggle="popover"]').popover({trigger: 'hover'});

		}, 10);

	}

	loadGifs(topic) {
		// let url = "https://media1.giphy.com/";
		let url = "https://api.giphy.com/v1/gifs/search?api_key=c5CF9X0IcrkjEmQ6MkiQE6V7D7oo2QAN&q=" + topic + "&limit=25&offset=0&lang=en"
		$(".images-container .row .col").empty().text("Loading images...");

		$.ajax({
			url: url,
			method: "GET"
		}).done(function(response) {
			let data = response.data;
			$(".images-container .row").empty();

			data.forEach(item => {
				// let newCard = $("<div>").addClass('card gif-card');
				let newCard = $("<figure>").addClass(' gif-card');
				// newCard.append($("<div>").addClass('card-header').text("Rating: " + item.rating ))
				// let image = $("<img>").addClass("card-image-bottom  gif").
				let image = $("<img>").addClass("figure-img img-fluid rounded gif").
				// let image = $("<img>").addClass("img-fluid gif").
						// attr("data-still", data["data-still"]).
						attr("src", item.images.fixed_width_still.url).
						attr("data-still", item.images.fixed_width_still.url).
						attr("data-animate", item.images.fixed_width.url).
						attr("data-state", "still").
						attr("data-toggle","popover").attr("data-placement","bottom").
						attr("data-content","Click on the image to toggle the GIF animation.")
						// popover({delay: { "show": 500, "hide": 100 }})
						// attr("delay", { "show": 500, "hide": 100 })
				// newCard.append($("<div>").addClass("card-body").
				// 	append($("<div>").addClass("card-text").text("Rating: " + item.rating.toUpperCase() )).
				// 	append(image)
				// )
				// newCard.append($("<figcaption>").addClass("figure-caption").text("Rating: " + item.rating.toUpperCase()))
				newCard.append(image);
				newCard.append($("<figcaption>").addClass("figure-caption overlay").text("Rating: " + item.rating.toUpperCase()))
				// newCard.append($("<div>").addClass("overlay").text("Rating: " + item.rating.toUpperCase()));
						  // <img src="https://media1.giphy.com/media/3o85xkQpyMlnBkpB9C/200_s.gif"
						  // data-still="https://media1.giphy.com/media/3o85xkQpyMlnBkpB9C/200_s.gif"
						  // data-animate="https://media1.giphy.com/media/3o85xkQpyMlnBkpB9C/200.gif" data-state="still" class="gif">
				// $(".images-container .row").append($("<div>").addClass("col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12").append(newCard));
				$(".images-container").append(newCard);
			})
		})

	}
}



$(document).ready(function() {
	app = new GiphyApp();
	// $('[data-toggle="popover"]').popover({trigger: 'hover'});
	// $(".gif").popover({trigger: 'focus'});
	$(document).popover({
    	selector: '[rel=popover]'
	});
	// $(document).popover(function(e) {
	// 	console.log("Hey found a popover");
	// })
// add new popover


})