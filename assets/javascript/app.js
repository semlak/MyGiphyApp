const theme = "animal"

var app = null;


let GiphyApp = class {
	constructor() {
		// let topics = [];
		let me = this;
		$(document).on("click", ".btn-load-images", me.loadTopicImages);
		$(document).on("click", ".topic-search-button", me.addTopic);
		$(document).on("click", ".gif", me.gifClick);
		$(document).on("click", "#reset-button", me.reset);
		$(document).on("click", "#search-box-x", me.clearTopicSearch);
		$(document).on("keydown", "#new-topic", me.enableClearSearchButton);
		$(document).on("click", "#images-tab-bar .close", me.closeTab);
		// $(document).on('popover', '[data-toggle="popover"]',{trigger: 'hover'})
			// $('[data-toggle="popover"]').popover({trigger: 'hover'});
		// $(document).on('popover', '[data-toggle="popover"]',{trigger: 'hover'})

			// $('[data-toggle="popover"]').popover({trigger: 'hover'});

		this.initialTopics = ["Kitten", "Puppy"];
		this.topics = this.initialTopics.slice(0);
		// this.theme = theme;
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
		$(".images-container")
			.empty()
			.append($("<div>").addClass("col").text("Click one of the topics to load gifs!"));



	}

	closeTab() {
		var tabContentId = $(this).parent().attr("href");
		$(this).parent().parent().remove(); //remove li of tab
		$('#images-tab-bar a:last').tab('show'); // Select first tab
		$(tabContentId).remove(); //remove respective tab content

	}

	clearTopicSearch() {
		if (!($(this).hasClass('disabled'))) {
			$("#new-topic").val("");
			$("#search-box-x").addClass("disabled")
		}

	}

	enableClearSearchButton() {
		$("#search-box-x").removeClass("disabled")
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

	appendEmptyTabToImageTabBarAndPane(tabTitle, initialText) {

		let currentTabBarLength = $("#images-tab-bar").children().length;
		let newPaneID = "tab-pane-" + currentTabBarLength;
		$(".tab-pane").removeClass("active");
		$("#images-tab-bar li a").removeClass("active");
		$("#images-tab-bar")
			.append($("<li>").addClass("nav-item")
				.append($("<a>").addClass("nav-link active")
					.attr("id", "images-tab-" + currentTabBarLength)
					.attr("data-toggle", "tab")
					.attr("href", "#tab-pane-" + currentTabBarLength)
					.attr("role", "tab")
					.attr("aria-controls", "images-tab-" + currentTabBarLength)
					.attr("aria-selected", true)
					.html((tabTitle || "Images " + currentTabBarLength)+ " <span class=\"close\">×</span>")
				)
			)
		$(".tab-content")
				.append($("<div>").addClass("tab-pane active")
					.attr("id", newPaneID)
					// .attr("href", "#")
					.attr("role", "tabpanel")
					.attr("aria-labeledby", "images-tab-" + currentTabBarLength)
					.append($("<div>").addClass("images-container")
						.text(newPaneID + ": " + (initialText || "Loading..."))
					)
				)
		return newPaneID;
	}

	createInitialImageTabBarAndPane() {
		let tabDivs = $("<div>")
		.append($("<div>").addClass("row")
			.append($("<ul>").addClass("nav nav-tabs").attr("id", "images-tab-bar").attr("role", "tablist")
				.append($("<li>").addClass("nav-item")
					.append($("<a>").addClass("nav-link active")
						.attr("id", "images-tab-0")
						.attr("data-toggle", "tab")
						.attr("href", "#tab-pane-0")
						.attr("role", "tab")
						.attr("aria-controls", "images-tab-0")
						.attr("aria-selected", true)
						.text("Images 0")

					)
				)
			)
		)
		.append($("<div>").addClass("row")
			.append($("<div>").addClass("tab-content")
				.append($("<div>").addClass("tab-pane active")
					.attr("id", "tab-pane-0")
					// .attr("href", "#")
					.attr("role", "tabpanel")
					.attr("aria-labeledby", "images-tab-0")
					.append($("<div>").addClass("images-container")
						.text("Click one of the topics to load gifs!")
					)

				)
			)
		)

		return tabDivs;
	}

	setupAppDivs() {
		let tabbedDivs = this.createInitialImageTabBarAndPane();
		$("#app-container").
			append($("<div>").addClass("row flex-column-reverse flex-md-row").
				append($("<div>").addClass("col-xl-8 col-lg-8 col-md-7 col-sm-push-5" ).
					append($("<div>").addClass("topic-buttons-container")
				)
			).
			append($("<div>").addClass("col-xl-4 col-lg-4 col-md-5 col-sm-pull-7").
				append($("<div>").addClass("search-container"))
			)
		).append(tabbedDivs)


	}

	addSearchPanel() {
		let searchPanel = ($("<div>").addClass("card border-info"))
		searchPanel.append($("<div>").addClass("card-header").text("Add topic"));
		// $("#searchPanel"));
		let cardBody = $("<div>").addClass("card-body");
		// cardBody.append($("<i>").addClass("fa fa-close").attr( "aria-hidden", true).attr("id", "search-box-x"));

		cardBody.append($("<form>").addClass("form-group").
			append($("<div>").addClass("form-group")
				.append($("<input>").addClass("form-control form-control-lg ")
					.attr("type", "text").attr("id", "new-topic").attr("placeholder", "Topic to add")
					// .css({"position": "relative"})

					)
				.append($("<span>").addClass("clear-search fa fa-close disabled").attr("id", "search-box-x")
					// .html("<i class=\"fa fa-close\" aria-hidden=\"true\"></i>")
					)

				)
			.append($("<button>").addClass("btn btn-info btn-square topic-search-button").
				html("<i class=\"fa fa-search\" aria-hidden=\"true\"></i>&nbsp;&nbsp; Add topic")
				// text("Add topic").
				.attr("autofocus", true).attr("type", "submit")));

		searchPanel.append(cardBody);

		// searchPanel
		// .append($("<span>").addClass("clear-search").attr("id", "search-box-x")
		// .html("<i class=\"fa fa-close\" aria-hidden=\"true\"></i>"))

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

	appendGifs(data, newPaneID) {

		var previousColor = null;
		// let colors = ["rgb(0, 255, 153)", "rgb(153, 51, 255)", "rgb(255,102,102)", "rgb(0, 204, 255)", "rgb(255, 243, 92)"];
		let colors = ["#77B300", "#9933CC" , "#CC0000", "#3366cc", "#F5E625", "#FF8C00", "#00FFFF", "#FF1493"];

		var randomColor = function() {
			let filteredColors = colors.filter(color => color !== previousColor);
			previousColor = filteredColors[Math.floor(Math.random()*filteredColors.length)]
			return previousColor;
		};

		$("#" + newPaneID + " .images-container").empty();
		data.forEach(item => {
			let newCard = $("<div>").addClass('card gif-card');
			let image = $("<img>").addClass("card-image-bottom  gif img-fluid").
					attr("data-still", data["data-still"]).
					attr("src", item.images.fixed_width_still.url).
					attr("data-still", item.images.fixed_width_still.url).
					attr("data-animate", item.images.fixed_width.url).
					attr("data-state", "still").
					attr("data-toggle","popover").attr("data-placement","bottom").
					attr("data-content","Click on the image to toggle the GIF animation.")
			newCard.append($("<div>").addClass("card-body").
				css("background-color", randomColor()).
				append($("<div>").addClass("gif-rating").text("Rating: " + item.rating.toUpperCase() )).
				append(image));
			$("#" + newPaneID + " .images-container").append(newCard);
			let cardWidth = newCard.outerWidth();
			let imageHeightToSet = cardWidth * item.images.fixed_width_still.height / item.images.fixed_width_still.width;
			image.height(imageHeightToSet);
		})

	}

	loadGifs(topic) {
		// let url = "https://media1.giphy.com/";
		let url = "https://api.giphy.com/v1/gifs/search?api_key=c5CF9X0IcrkjEmQ6MkiQE6V7D7oo2QAN&q=" + topic + "&limit=25&offset=0&lang=en"
		// $(".images-container").empty().text("Loading images...");
		let newPaneID = this.appendEmptyTabToImageTabBarAndPane(topic, "Loading images...")
		console.log("newPaneID: ", newPaneID);

		$.ajax({
			url: url,
			method: "GET"
		}).done(function(response) {
			let data = response.data;
			// $(".images-container").empty();
			if (data.length>0) {
				app.appendGifs(data, newPaneID);
			}
			else {
				// no images were received with response
				$("#" + newPaneID + " .images-container").empty().text("No images found related to \"" + topic + "\"");

			}
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