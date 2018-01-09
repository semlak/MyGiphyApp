const theme = "animal"
const initilGifLimit = 10;

function shuffleArray(arr) {
	// returns a shuffled version of the array. Does not alter the input array
	// Tries to implement the Knuth Shuffle.
	function randomUpToN(n) {
		// does not return n, but numbers between 0 and n-1
		return (Math.floor(Math.random() * n));
	}

	function swapArrayElements(arr, i, j) {
		// swaps  the elements i and j or arr. Does  not return anything. It alters input array.
		if (i !== j) {
			let t = arr[i];
			arr[i] = arr[j];
			arr[j] = t;
		}
	}

	// clone the array
	var outputArr = arr.slice(0);
	let n = arr.length;
	for (let i = 0; i < n - 1; i++) {
		let j = randomUpToN(n - i);
		// swap element i with the element at (i+j). max i+j value is i + (n-i) - 1 = n - 1

		swapArrayElements(outputArr, i, i + j)
		// console.log(outputArr)
	}
	return outputArr;
}

// function for getting somewhat random color. Used to make image tiles look pretty while loading
// Function will not same color twice i n a row
var previousColor = null;
let colors = ["#77B300", "#9933CC" , "#CC0000", "#3366cc", "#F5E625", "#FF8C00", "#00FFFF", "#FF1493"];

var randomColor = function() {
	let filteredColors = colors.filter(color => color !== previousColor);
	previousColor = filteredColors[Math.floor(Math.random()*filteredColors.length)]
	return previousColor;
};


var app = null;



let GiphyApp = class {
	constructor() {
		let me = this;
		$(document).on("click", ".btn-load-images", me.loadTopicImages);
		$(document).on("click", ".topic-search-button", me.addTopic);
		$(document).on("click", ".gif", me.gifClick);
		$(document).on("click", "#reset-button", me.reset);
		$(document).on("click", "#search-box-x", me.clearTopicSearch);
		$(document).on("keydown", "#new-topic", me.enableClearSearchButton);
		$(document).on("click", "#images-tab-bar .close", me.closeTab);
		$(document).popover({selector: '[rel=popover]'});

		me.initialTopics = ["Kitten", "Puppy", "Star Trek", "Xena", "JavaScript"];
		me.topics = me.initialTopics.slice(0);
		me.setupAppDivs();
		me.gifLimit = initilGifLimit;
		me.addSearchPanel();
		me.renderTopicButtons();
		me.paneIDs = [];

	}

	reset() {
		app.topics = [];
		app.renderTopicButtons();
	}

	closeTab() {
		let currentTabBarLength = $("#images-tab-bar").children().length;
		if (currentTabBarLength < 2) {
			$("#images-tab-bar").addClass("hidden");
		}
		let paneID = $(this).parent().attr("href");

		let tabToRemove = $(this).parent().parent();
		$("#images-tab-bar").removeClass("active");
		setTimeout(function() {
			tabToRemove.remove();
			$('#images-tab-bar a:last').tab('show'); // Select first tab
			$(paneID).remove(); //remove respective tab content
			paneID = paneID.replace(/#/, "");
			app.paneIDs = app.paneIDs.filter(id => id !== paneID);

		}, 10);

	}

	clearTopicSearch() {
		if (!($(this).hasClass('disabled'))) {
			$("#new-topic").val("");
			$("#search-box-x").addClass("disabled")
		}

	}

	gifLoaded() {
		$(this).removeClass("image-loading").addClass("image-loaded");

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
		let topic = $(this).text();
		console.log(topic);
		app.loadGifs(topic);
		setTimeout(function() {
			$('[data-toggle="popover"]').popover({trigger: 'hover'});

		}, 1000);
	}

	addTopic(event) {
		event.preventDefault();
		let newTopic = $("#new-topic").val().trim();
		console.log(newTopic);
		if (newTopic.trim().length > 0) {
			if (app.topics.filter(topic => topic.toLowerCase().replace(/ /, "") === newTopic.toLowerCase().replace(/ /, "")).length < 1) {
				app.topics.push(newTopic);
				$("#new-topic").val("");
				$("#search-box-x").addClass("disabled")
				$("#new-topic").removeClass("is-invalid");
				app.renderTopicButtons();
			}
			else {
				$("#new-topic").addClass("is-invalid")
				$("#topic-search-feedback-message").text("That topic is already listed!")
			}
		}
		else {
			$("#new-topic").addClass("is-invalid")
			$("#topic-search-feedback-message").text("Please enter text for a topic!")
		}

	}

	appendNewTabToImageTabBarAndPane(tabTitle, initialText) {
		// the tab bar is hidden if 0 or 1 elements are in tab bar.
		let currentTabBarLength = $("#images-tab-bar").children().length;
		if (currentTabBarLength > 0) {
			$("#images-tab-bar").removeClass("hidden");
		}

		// remove any header still left in tabbar
		if ($(".tab-content").html() === "<h3>Click one of the topics to load gifs!</h3>") {
			$(".tab-content").empty();
		}

		let key = tabTitle.toLowerCase().replace(/ /g, "");
		let newPaneID = "tab-pane-" + key;

		if (this.paneIDs.indexOf(newPaneID)> -1) {
			console.log("a pane with id " + newPaneID + " already exists");
			return newPaneID;
		}
		else {
			this.paneIDs.push(newPaneID);
		}
		$(".tab-pane").removeClass("active");
		$("#images-tab-bar li a").removeClass("active");
		$("#images-tab-bar")
			.append($("<li>").addClass("nav-item")
				.append($("<a>").addClass("nav-link active")
					.attr("id", "images-tab-" + key)
					.attr("data-toggle", "tab")
					.attr("href", "#tab-pane-" + key)
					.attr("role", "tab")
					.attr("aria-controls", "images-tab-" + key)
					.attr("aria-selected", true)
					.html((tabTitle || "Images " + $("#images-tab-bar").children().length)+ " <span class=\"close\">×</span>")
				)
			)
		$(".tab-content")
				.append($("<div>").addClass("tab-pane active")
					.attr("id", newPaneID)
					.attr("role", "tabpanel")
					.attr("aria-labeledby", "images-tab-" + tabTitle.toLowerCase())
					.append($("<div>").addClass("images-container")
						.html("<h3>" + (initialText || "Loading...") + "</h3>")
					)
				)
		return newPaneID;
	}

	createInitialImageTabBarAndPane() {
		let tabDivs = $("<div>")
		.append($("<div>").addClass("row")
			.append($("<ul>").addClass("nav nav-tabs hidden")
				.attr("id", "images-tab-bar").attr("role", "tablist"))
		)
		.append($("<div>").addClass("row")
			.append($("<div>").addClass("tab-content").html("<h3>Click one of the topics to load gifs!</h3>"))
		)

		return tabDivs;
	}

	setupAppDivs() {
		let tabbedDivs = this.createInitialImageTabBarAndPane();
		$("#app-container")
			.append($("<div>").addClass("row flex-column-reverse flex-md-row")
				.append($("<div>").addClass("col-xl-8 col-lg-8 col-md-7 col-sm-push-5" )
					.append($("<div>").addClass("topic-buttons-container")
				)
			)
			.append($("<div>").addClass("col-xl-4 col-lg-4 col-md-5 col-sm-pull-7")
				.append($("<div>").addClass("search-container"))
			)
		).append(tabbedDivs)


	}

	addSearchPanel() {
		let searchPanel = ($("<div>").addClass("card border-info"))
		searchPanel.append($("<div>").addClass("card-header").text("Add topic"));
		let cardBody = $("<div>").addClass("card-body");

		cardBody.append($("<form>").addClass("form-group")
			.prop("novalidate", true)
			.attr("id", "topic-search-form")
			.append($("<div>").addClass("form-group")
				.append($("<input>").addClass("form-control form-control-lg ")
					.attr("type", "text").attr("id", "new-topic").attr("placeholder", "Topic to add")
				)
				.append($("<span>").addClass("clear-search fa fa-close disabled").attr("id", "search-box-x")
				)
				.append($("<div>").addClass("invalid-feedback")
					.text("Please enter a valid topic.")
					.attr("id", "topic-search-feedback-message")
				)
			)
			.append($("<button>").addClass("btn btn-info square topic-search-button")
				.html("<i class=\"fa fa-search\" aria-hidden=\"true\"></i>&nbsp;&nbsp; Add topic")
				.attr("autofocus", true).attr("type", "submit")));

		searchPanel.append(cardBody);


		$(".search-container").append(searchPanel);
	}



	renderTopicButtons() {
		let me = this;
		$(".topic-buttons-container").empty();
		if (me.topics.length < 1) {
			$(".topic-buttons-container").text("Add a topic button to get started...");
		}
		me.topics.forEach(function(topic, i) {
			console.log(topic);
			let topicButton = $("<div>").addClass("btn square btn-primary btn-load-images").text(topic).attr("value", topic);
			topicButton
				.attr("data-toggle", "popover")
				.attr("data-content", "Load images relating to " + topic)
				.attr("data-placement", "bottom")
				.attr("delay", 500);
			$(".topic-buttons-container").append(topicButton);
		});
		setTimeout(function() {
			$('[data-toggle="popover"]').popover({trigger: 'hover'});

		}, 10);

	}

	appendGifs(data, newPaneID) {
		$("#" + newPaneID + " .images-container").empty();
		// shuffle order of images to make it seem like images being loaded are not the same every time
		let shuffledItems = shuffleArray(data);

		shuffledItems.forEach(item => {
			let heightToWidthRatio = 100*item.images.fixed_width_still.height / item.images.fixed_width_still.width +0;
			let cardID = "gif-card-" + item.id;
			let newCard = $("<div>").addClass('card gif-card')
						.attr("id", cardID);
			let image = $("<img>").addClass("card-image-bottom  gif img-fluid image-loading")
					.attr("data-still", data["data-still"])
					.attr("src", item.images.fixed_width_still.url)
					.attr("data-still", item.images.fixed_width_still.url)
					.attr("data-animate", item.images.fixed_width.url)
					.attr("data-state", "still")
					.attr("data-toggle","popover").attr("data-placement","bottom")
					.attr("data-content","Click on the image to toggle the GIF animation.")

			let imageWrapper = $("<div>").addClass("image-wrapper");
			imageWrapper.append(image);
			let imageCardBody = ($("<div>").addClass("card-body")
				.css("background-color", randomColor())
				.append($("<div>").addClass("gif-rating").text("Rating: " + item.rating.toUpperCase() ))
				.append(imageWrapper));
			// newCard

			newCard.append(imageCardBody);
			$("#" + newPaneID + " .images-container").append(newCard);
			newCard.append('<style>#' + cardID + ' .image-wrapper:before{content: ""; display: block; width: 100%; padding-top: ' + heightToWidthRatio + '%;}</style>');
		})

		$("#" + newPaneID + " .images-container .gif").on("load", app.gifLoaded)

	}

	loadGifs(topic) {
		let key = topic.toLowerCase().replace(/ /g, "");
		let paneID = "tab-pane-" + key;
		let tabID = "images-tab-" + key;
		if (this.paneIDs.indexOf(paneID)> -1) {
			console.log("a pane with id " + paneID + " already exists. Just switching to it");
			$(".tab-pane").removeClass("active");
			$("#images-tab-bar li a").removeClass("active");

			$("#images-tab-" + key).addClass("active");
			$("#" + paneID).addClass("active");
			return;
		}

		let newPaneID = this.appendNewTabToImageTabBarAndPane(topic, "Retrieving image data...")
		let url = "https://api.giphy.com/v1/gifs/search?api_key=c5CF9X0IcrkjEmQ6MkiQE6V7D7oo2QAN&q=" +
			topic.replace(" ", "+") + "&limit="+ app.gifLimit + "&offset=0&lang=en"

		$.ajax({
			url: url,
			method: "GET"
		}).done(function(response) {
			let data = response.data;
			if (data.length>0) {
				app.appendGifs(data, newPaneID);
			}
			else {
				// no images were received with response
				$("#" + newPaneID + " .images-container").empty().html("<h3>No images found related to \"" + topic + "\".</h3>");
			}
		})
	}
}

$("#options-submit").on("click", function(e) {
	e.preventDefault();
	var val = $("#rangeinput").val();
	app.gifLimit = val;
	$("#optionsModal").modal("hide");
})

// for slider, modified from https://stackoverflow.com/questions/24463678/where-can-i-find-bootstrap-styles-for-html5-range-inputs
$("#rangeinput").on("change", function(e) {
	$(this).val($(this).val());

})

$("#rangeinput").on("mousemove", function(e) {
	$("#rangevalue").text($(this).val())
})

$(document).ready(function() {
	app = new GiphyApp();
	// $(document).popover({selector: '[rel=popover]'});


})