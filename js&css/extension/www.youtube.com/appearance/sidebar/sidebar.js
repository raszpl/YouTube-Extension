/*--------------------------------------------------------------
>>> SIDEBAR
----------------------------------------------------------------
# Related videos
--------------------------------------------------------------*/
/*--- RELATED VIDEOS -----------------------------------------*/
extension.features.relatedVideos = function (anything) {
	if (anything instanceof Event) {
		const event = anything;

		if (event.type === 'click') {
			const target = event.target;

			if (target.id === 'items' && target.parentNode.nodeName === 'YTD-WATCH-NEXT-SECONDARY-RESULTS-RENDERER') {
				const rect = target.getBoundingClientRect();

				if (
					event.clientX - rect.left >= 0 &&
					event.clientX - rect.left < rect.width &&
					event.clientY - rect.top >= 0 &&
					event.clientY - rect.top < 48
				) {
					target.toggleAttribute('it-activated');
				}
			}
		}
	} else {
		if (extension.storage.data.related_videos === 'collapsed') {
			window.addEventListener('click', this.relatedVideos, true);
		} else {
			window.removeEventListener('click', this.relatedVideos, true);
		}
	}
};
