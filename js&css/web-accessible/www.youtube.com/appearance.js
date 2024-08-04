/*------------------------------------------------------------------------------
  APPEARANCE
------------------------------------------------------------------------------*/
ImprovedTube.undoTheNewSidebar = function () {
	if (document.documentElement.dataset.pageType === 'video' && yt) {
		try {
			yt.config_.EXPERIMENT_FLAGS.kevlar_watch_grid = false;
			yt.config_.EXPERIMENT_FLAGS.small_avatars_for_comments = false;
			yt.config_.EXPERIMENT_FLAGS.small_avatars_for_comments_ep = false;
			yt.config_.EXPERIMENT_FLAGS.web_watch_rounded_player_large = false;
		} catch (error) {
			console.error("can't undo description on the side", error);
		}
	}
};

ImprovedTube.descriptionSidebar = function () {
	try {
		yt.config_.EXPERIMENT_FLAGS.kevlar_watch_grid = true;
		yt.config_.EXPERIMENT_FLAGS.small_avatars_for_comments = true;
		yt.config_.EXPERIMENT_FLAGS.small_avatars_for_comments_ep = true;
	} catch (error) {
		console.error("tried to move description to the sidebar", error);
	}
};
/*------------------------------------------------------------------------------
  PLAYER
------------------------------------------------------------------------------*/
/*--- PLAYER SIZE ------------------------------------------------------------*/
ImprovedTube.playerSize = function () {
	if (this.storage.player_size === "custom") {
		var width = Number(this.storage.custom_player_size_width) || 1280,
			height = Number(this.storage.custom_player_size_height) || 720,
			style = this.elements.player_size_style || document.createElement("style");

		style.textContent = ':root {';
		style.textContent += "--it-player-width:" + width + "px;";
		style.textContent += "--it-player-height:" + height + "px;";
		style.textContent += "}";

		document.body.appendChild(style);
		if (document.documentElement.dataset.pageType === 'video') {
			window.dispatchEvent(new Event('resize'));
		}
	}
};
/*--- FORCED THEATER MODE ----------------------------------------------------*/
ImprovedTube.forcedTheaterMode = function () {
	if (ImprovedTube.storage.forced_theater_mode === true && ImprovedTube.elements.ytd_watch && ImprovedTube.elements.player) {
		var button = ImprovedTube.elements.player.querySelector("button.ytp-size-button");
		if (button && ImprovedTube.elements.ytd_watch.theater === false) {
			document.cookie = "wide=1;domain=.youtube.com";
			//     ImprovedTube.elements.ytd_watch.theater = true;
			setTimeout(function () {
				button.click();
			}, 100);
		}
	}
};
/*--- HD THUMBNAIL -----------------------------------------------------------*/
ImprovedTube.playerHdThumbnail = function (node = document.querySelector('#movie_player .ytp-cued-thumbnail-overlay-image')) {
	if (!node) return;

	function observe () {
		if (node.style.backgroundImage.includes("/hqdefault.jpg")) {
			node.style.backgroundImage = node.style.backgroundImage.replace("/hqdefault.jpg", "/maxresdefault.jpg");
		}
	};

	if (this.storage.player_hd_thumbnail) {
		if (!ImprovedTube.playerHdThumbnail.node) {
			// call once to change whats there now
			observe();
			// monitor description
			ImprovedTube.playerHdThumbnail.node = node;
			ImprovedTube.playerHdThumbnail.observer = new MutationObserver(observe);
			ImprovedTube.playerHdThumbnail.observer.observe(node, {
				attributeFilter: ['style'],
			});
		}
	} else {
		if (ImprovedTube.playerHdThumbnail.node) {
			ImprovedTube.playerHdThumbnail.observer.disconnect();
			delete ImprovedTube.playerHdThumbnail.node;
		}
	}
};
/*--- SHOW PROGRESS BAR ------------------------------------------------------*/
ImprovedTube.showProgressBar = function () {
	const player = ImprovedTube.elements.player;

	if (player && player.className.indexOf("ytp-autohide") !== -1) {
		const played = (player.getCurrentTime() * 100) / player.getDuration(),
			loaded = player.getVideoBytesLoaded() * 100,
			play_bars = player.querySelectorAll(".ytp-play-progress"),
			load_bars = player.querySelectorAll(".ytp-load-progress");
		let width = 0,
			progress_play = 0,
			progress_load = 0;

		for (let i = 0, l = play_bars.length; i < l; i++) {
			width += play_bars[i].offsetWidth;
		}

		const width_percent = width / 100;

		for (let i = 0, l = play_bars.length; i < l; i++) {
			let a = play_bars[i].offsetWidth / width_percent,
				b = 0,
				c = 0;

			if (played - progress_play >= a) {
				b = 100;
			} else if (played > progress_play && played < a + progress_play) {
				b = (100 * ((played - progress_play) * width_percent)) / play_bars[i].offsetWidth;
			}

			play_bars[i].style.transform = "scaleX(" + b / 100 + ")";

			if (loaded - progress_load >= a) {
				c = 100;
			} else if (loaded > progress_load && loaded < a + progress_load) {
				c = (100 * ((loaded - progress_load) * width_percent)) / play_bars[i].offsetWidth;
			}

			load_bars[i].style.transform = "scaleX(" + c / 100 + ")";

			progress_play += a;
			progress_load += a;
		}
	}
};
/*------------------------------------------------------------------------------
 VIDEO REMAINING DURATION
------------------------------------------------------------------------------*/
ImprovedTube.formatSecond = function (rTime) {
	var time = new Date(null);
	if (this.storage.duration_with_speed === true) {
		var playbackRate = this.elements.video.playbackRate;
		time.setSeconds(rTime / playbackRate);
	} else {
		time.setSeconds(rTime);
	}

	if (rTime / 3600 < 1) {
		return time.toISOString().substr(14, 5);
	} else {
		return time.toISOString().substr(11, 8);
	}
};

ImprovedTube.playerRemainingDuration = function () {
	var player = ImprovedTube.elements.player;
	var rTime = ImprovedTube.formatSecond((player.getDuration() - player.getCurrentTime()).toFixed(0));
	var element = document.querySelector(".ytp-time-remaining-duration");
	if (!element) {
		var label = document.createElement("span");
		label.textContent = " (-" + rTime + ")";
		label.className = "ytp-time-remaining-duration";
		document.querySelector(".ytp-time-display").appendChild(label);
	} else {
		element.textContent = " (-" + rTime + ")";
	}
};
/*--- COMMENTS SIDEBAR SIMPLE ------------------------------------------------*/
ImprovedTube.commentsSidebarSimple = function () {
	if (ImprovedTube.storage.comments_sidebar_simple === true) {
		if (window.matchMedia("(min-width: 1599px)").matches) {
			document.querySelector("#primary").insertAdjacentElement('afterend', document.querySelector("#comments"));
		}
		if (window.matchMedia("(max-width: 1598px)").matches) {
			document.querySelector("#related").insertAdjacentElement('beforebegin', document.querySelector("#comments"));
			setTimeout(function () {
				document.querySelector("#primary-inner").appendChild(document.querySelector("#related"));
			}
			);
		}
	}
};
/*--- COMMENTS SIDEBAR -------------------------------------------------------*/
ImprovedTube.commentsSidebar = function () {
	if (ImprovedTube.storage.comments_sidebar === true) {
		const video = document.querySelector("#player .ytp-chrome-bottom") || document.querySelector("#container .ytp-chrome-bottom");
		let hasApplied = 0;
		if (/watch\?/.test(location.href)) {
			sidebar();
			styleScrollbars();
			setGrid();
			applyObserver();
			window.addEventListener("resize", sidebar)
		}

		function sidebar () {
			resizePlayer();
			if (window.matchMedia("(min-width: 1952px)").matches) {

				if (!hasApplied) {
					initialSetup()
					setTimeout(() => {
						document.getElementById("columns").appendChild(document.getElementById("related"))
					})
				} else if (hasApplied == 2) { //from medium to big size
					setTimeout(() => {
						document.getElementById("columns").appendChild(document.getElementById("related"))
					})
				}
				hasApplied = 1
			} else if (window.matchMedia("(min-width: 1000px)").matches) {
				if (!hasApplied) {
					initialSetup();
				} else if (hasApplied == 1) { //from big to medium
					document.getElementById("primary-inner").appendChild(document.getElementById("related"));
				}
				hasApplied = 2
			} else { /// <1000
				if (hasApplied == 1) {
					document.getElementById("primary-inner").appendChild(document.getElementById("related"));
					let comments = document.querySelector("#comments");
					let below = document.getElementById("below");
					below.appendChild(comments);
				} else if (hasApplied == 2) {
					let comments = document.querySelector("#comments");
					let below = document.getElementById("below");
					below.appendChild(comments);
				}
				hasApplied = 0;
			}
		}
		function setGrid () {
			let checkParentInterval = setInterval(() => {
				container = document.querySelector("#related ytd-compact-video-renderer.style-scope")?.parentElement;
				if (container) {
					clearInterval(checkParentInterval);
					container.style.display = "flex";
					container.style.flexWrap = "wrap";
					container.style.flexDirection = "row";
				}
			}, 250);
		}
		function initialSetup () {
			let secondaryInner = document.getElementById("secondary-inner");
			let primaryInner = document.getElementById("primary-inner");
			let comments = document.querySelector("#comments");
			setTimeout(() => {
				primaryInner.appendChild(document.getElementById("panels"));
				primaryInner.appendChild(document.getElementById("related"))
				secondaryInner.appendChild(document.getElementById("chat-template"));
				secondaryInner.appendChild(comments);
			})
		}
		function resizePlayer () {
			const width = video.offsetWidth + 24;
			const player = document.querySelector("#player.style-scope.ytd-watch-flexy");
			document.getElementById("primary").style.width = `${width}px`;
			player.style.width = `${width}px`;
		}
		function styleScrollbars () {
			if (!navigator.userAgent.toLowerCase().includes("mac")) {
				let color, colorHover
				const isDarkMode = getComputedStyle(document.querySelector('ytd-app')).getPropertyValue('--yt-spec-base-background') == "#0f0f0f";
				if (isDarkMode) [color, colorHover] = ["#616161", "#909090"];
				else [color, colorHover] = ["#aaaaaa", "#717171"];
				const style = document.createElement("style");
				if (ImprovedTube.storage.comments_sidebar_scrollbars === true) {
					const cssRule = `
            #primary, #secondary {
                overflow: overlay !important;
            }

            ::-webkit-scrollbar
            {
                width: 16px;
                height: 7px;
            }

            ::-webkit-scrollbar-thumb{
                background-color: ${color};
                border-radius: 10px;
                border: 4px solid transparent;
                background-clip: padding-box;
            }

            ::-webkit-scrollbar-thumb:hover{
                background-color: ${colorHover};
            }`;
					style.appendChild(document.createTextNode(cssRule));
				} else {
					const cssRule = `
            #primary, #secondary {
                overflow: overlay !important;
            }
            ::-webkit-scrollbar
            {
                width: 0px;
                height: 0px;
            }`;
					style.appendChild(document.createTextNode(cssRule));
				}
				document.head.appendChild(style);
			}
		}
		function applyObserver () {
			const debouncedResizePlayer = debounce(resizePlayer, 200);
			const resizeObserver = new ResizeObserver(debouncedResizePlayer);
			resizeObserver.observe(video);
		}
		function debounce (callback, delay) {
			let timerId;
			return function (...args) {
				clearTimeout(timerId);
				timerId = setTimeout(() => {
					callback.apply(this, args);
				}, delay);
			};
		}
	}
};
/*------------------------------------------------------------------------------
 SIDEBAR
------------------------------------------------------------------------------*/
/*--- TRANSCRIPT ---------------------------------------------*/
ImprovedTube.transcript = function (el) {
	if (ImprovedTube.storage.transcript === true) {
		el.querySelector('*[target-id*=transcript]')?.removeAttribute('visibility');
	}
};
/*--- CHAPTERS -----------------------------------------------*/
ImprovedTube.chapters = function (el) {
	if (ImprovedTube.storage.chapters === true) {
		el.querySelector('*[target-id*=chapters]')?.removeAttribute('visibility');
	}
};
/*--- LIVECHAT ---------------------------------------------------------------*/
ImprovedTube.livechat = function () {
	if (this.storage.livechat === "collapsed") {
		if (typeof isCollapsed === 'undefined') {
			var isCollapsed = false;
		}
		if (ImprovedTube.elements.livechat && !isCollapsed) {
			ImprovedTube.elements.livechat.button.click();
			isCollapsed = true
		}
	} /* else{
        if(isCollapsed){
            ImprovedTube.elements.livechat.button.click();
            isCollapsed = false
        }
    } */
};
/*------------------------------------------------------------------------------
  DETAILS
------------------------------------------------------------------------------*/
/*--- BUTTONS UNDER PLAYER ---------------------------------------------------*/
ImprovedTube.buttonsUnderPlayer = function () {
	if (window.self !== window.top) return false;
	if (document.documentElement.dataset.pageType != 'video') return;

	const section = document.querySelector('#subscribe-button');
	 /*  if (this.storage.description == "classic"
		||  this.storage.description == "classic_expanded" || this.storage.description == "classic_hidden"  )
	   {var section = document.querySelector('#flex.ytd-video-primary-info-renderer');}
   */
	if (section && !section.querySelector('.improvedtube-player-button')) {
		if (this.storage.below_player_loop !== false) {
			const button = document.createElement('button'),
				svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
				path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	                let transparentOrOn = .5; if (this.storage.player_always_repeat === true ) {
				transparentOrOn = 1;
			}
			button.className = 'improvedtube-player-button';
			button.id = 'it-below-player-loop';
			button.dataset.tooltip = 'Loop';
			svg.style.opacity = transparentOrOn;
			svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
			path.setAttributeNS(null, 'd', 'M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z');

			button.onclick = function () {
				const video = ImprovedTube.elements.video,
					svg = this.children[0];

				function matchLoopState (opacity) {
	    svg.style.opacity = opacity;
					if (ImprovedTube.storage.player_repeat_button === true) {
                  	 const otherButton = document.querySelector('#it-repeat-button');
                   	 otherButton.style.opacity = opacity;
         	        }
	           }
				if (video.hasAttribute('loop')) {
					video.removeAttribute('loop');
					matchLoopState('.5')
				} else if (!/ad-showing/.test(ImprovedTube.elements.player.className)) {
					video.setAttribute('loop', '');
					matchLoopState('1')
				}
			};

			svg.appendChild(path); 	button.appendChild(svg);
			section.insertAdjacentElement('afterend', button)
		}
		if (this.storage.below_player_pip !== false) {
			const button = document.createElement('button'),
				svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
				path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

			button.className = 'improvedtube-player-button';
			button.dataset.tooltip = 'PiP';
			svg.style.opacity = '.64';
			svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
			path.setAttributeNS(null, 'd', 'M19 7h-8v6h8V7zm2-4H3C2 3 1 4 1 5v14c0 1 1 2 2 2h18c1 0 2-1 2-2V5c0-1-1-2-2-2zm0 16H3V5h18v14z');

			button.onclick = function () {
				ImprovedTube.enterPip();
			};

			svg.appendChild(path);	button.appendChild(svg);
			section.insertAdjacentElement('afterend', button)
		}

		if (this.storage.below_player_screenshot !== false) {
			const button = document.createElement('button'),
				svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
				path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

			button.className = 'improvedtube-player-button';
			button.dataset.tooltip = 'Screenshot';
			svg.style.opacity = '.55';
			svg.setAttributeNS(null, 'viewBox', '0 0 24 24');
			path.setAttributeNS(null, 'd', 'M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z');

			button.onclick = ImprovedTube.screenshot;

			svg.appendChild(path);	button.appendChild(svg);
			section.insertAdjacentElement('afterend', button)
		}
	}
};
/*--- EXPAND DESCRIPTION -----------------------------------------------------*/
ImprovedTube.description = function (description = document.querySelector('#description-inline-expander')) {
	function observe () {
		const hidden = description.querySelector('#snippet-text');
		if (!hidden?.hasAttribute('hidden')
			&& hidden.parentNode.parentNode.expanded != ImprovedTube.videoId()) {

			hidden.parentNode.parentNode.isExpanded = true;
			hidden.parentNode.parentNode.expanded = ImprovedTube.videoId();
			hidden.parentNode.parentNode.querySelector('#expand').hidden = true;
		}
	};

	if (this.storage.description === 'expanded') {
		const mutation = description?.querySelector('#attributed-snippet-text');

		if (!description || !mutation) {
			console.error('description: Cant find proper Description element');
			return;
		}

		if (!ImprovedTube.description.node) {
			// call once to change whats there now
			observe();
			// monitor description
			ImprovedTube.description.node = mutation;
			ImprovedTube.description.observer = new MutationObserver(observe);
			ImprovedTube.description.observer.observe(mutation, {
				childList: true,
				subtree: true,
				characterData: true
			});
		}
	} else {
		if (ImprovedTube.description.node) {
			ImprovedTube.description.observer.disconnect();
			delete ImprovedTube.description.node;
		}
	}
};
/*--- DAY OF WEEK ------------------------------------------------------------*/
// This works only with certain browser locales, for example EN/US. Cant fix it, should
// probably remove it completely as it looks quite useless to begin with.
ImprovedTube.dayOfWeek = function (node = document.querySelector('#description-inner')) {
	function observe () {
		const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			date = node.querySelector("#info span:nth-child(3)"),
			dateText = date?.innerText,
			newDate = new Date(dateText).getDay();

		if (!date || isNaN(newDate)) return;

		let element = document.querySelector(".ytd-day-of-week");
		if (!element) {
			element = document.createElement("span");
			element.className = "ytd-day-of-week";
			document.querySelector("#info span:nth-child(2)").append(element);
		}
		element.textContent = days[newDate] + ' ';
	};

	if (this.storage.day_of_week) {
		const date = node?.querySelector("#info span:nth-child(3)");

		if (!date) {
			console.error('dayOfWeek: Cant fint proper Date element');
			return;
		}

		if (!ImprovedTube.dayOfWeek.node) {
			// call once to change whats there now
			observe();
			// monitor Data element
			ImprovedTube.dayOfWeek.node = date;
			ImprovedTube.dayOfWeek.observer = new MutationObserver(observe);
			ImprovedTube.dayOfWeek.observer.observe(date, {
				childList: true,
				subtree: true,
				characterData: true
			});
		}
	} else {
		if (ImprovedTube.dayOfWeek.node) {
			ImprovedTube.dayOfWeek.observer.disconnect();
			delete ImprovedTube.dayOfWeek.node;
			node?.querySelector(".ytd-day-of-week")?.remove();
		}
	}
};
/*--- HOW LONG AGO THE VIDEO WAS UPLOADED ------------------------------------*/
ImprovedTube.howLongAgoTheVideoWasUploaded = function () {
	if (this.storage.how_long_ago_the_video_was_uploaded
		&& (this.storage['google_api_key'] || ImprovedTube.defaultApiKey)
		&& this.elements.yt_channel_name) {

		const xhr = new XMLHttpRequest(),
			key = this.storage['google_api_key'] || ImprovedTube.defaultApiKey,
			id = this.getParam(location.href.slice(location.href.indexOf("?") + 1), "v");

		function timeSince (date) {
			let seconds = Math.floor((new Date() - new Date(date)) / 1000),
				interval = Math.floor(seconds / 31536000);

			if (interval > 1) {
				return interval + " years ago";
			}
			interval = Math.floor(seconds / 2592000);
			if (interval > 1) {
				return interval + " months ago";
			}
			interval = Math.floor(seconds / 86400);
			if (interval > 1) {
				return interval + " days ago";
			}
			interval = Math.floor(seconds / 3600);
			if (interval > 1) {
				return interval + " hours ago";
			}
			interval = Math.floor(seconds / 60);
			if (interval > 1) {
				return interval + " minutes ago";
			}

			return Math.floor(seconds) + " seconds ago";
		}

		xhr.addEventListener("load", function () {
			const response = JSON.parse(this.responseText),
				element = ImprovedTube.elements.how_long_ago_the_video_was_uploaded || document.createElement("div");

			ImprovedTube.empty(element);

			if (response.error) {
				element.appendChild(document.createTextNode("• Error: " + response.error.code));
			} else {
				element.appendChild(document.createTextNode("• " + timeSince(response.items[0].snippet.publishedAt)));
			}

			element.className = "it-how-long-ago-the-video-was-uploaded";

			ImprovedTube.elements.how_long_ago_the_video_was_uploaded = element;

			document.querySelector("#info #info-text").appendChild(element);
		});

		xhr.open("GET", "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + id + "&key=" + key, true);
		xhr.send();
	}
};
/*--- CHANNEL VIDEOS COUNT ---------------------------------------------------*/
ImprovedTube.channelVideosCount = function () {
	if (this.storage.channel_videos_count
		&& (this.storage['google_api_key'] || ImprovedTube.defaultApiKey)
		&& this.elements.yt_channel_name) {

		const key = this.storage['google_api_key'] || ImprovedTube.defaultApiKey;
		let id;

		if (this.elements.yt_channel_link.href.indexOf("/channel/") == -1) {
			const xhr = new XMLHttpRequest();
			id = this.getParam(location.href, "v");
			xhr.open("GET", "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + id + "&key=" + key, false);
			xhr.send();
			if (xhr.readyState === xhr.DONE && xhr.status === 200) {
				const response = JSON.parse(xhr.responseText);
				id = response.items[0].snippet.channelId;
			}
		} else {
			id = this.elements.yt_channel_link.href.slice(this.elements.yt_channel_link.href.indexOf("/channel/") + "/channel/".length);
			if (id.indexOf("/") !== -1) {
				id = id.match(/.+?(?=\/)/)[0];
			}
		}

		xhr = new XMLHttpRequest();

		xhr.addEventListener("load", function () {
			const response = JSON.parse(this.responseText),
				parent = document.querySelector("#meta ytd-channel-name + yt-formatted-string"),
				element = ImprovedTube.elements.channel_videos_count || document.createElement("div");

			ImprovedTube.empty(element);

			if (response.error) {
				element.appendChild(document.createTextNode("• Error: " + response.error.code));
			} else {
				element.appendChild(document.createTextNode("• " + response.items[0].statistics.videoCount + " videos"));
			}

			element.className = "it-channel-videos-count";

			ImprovedTube.elements.channel_videos_count = element;

			parent.appendChild(element);

			ImprovedTube.elements.channel_videos_count = element;
		});

		xhr.open("GET", "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=" + id + "&key=" + key, true);
		xhr.send();
	}
};
