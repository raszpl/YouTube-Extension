/*--- INDEX: -------------------------------------------------*/
satus.storage.import(function (items) {
	satus.locale.import(items.it_language, function () {
		if (['?action=import-settings', '?action=export-settings'].includes(location.search)) return;
		satus.render(extension.skeleton);

		satus.parentify(extension.skeleton, [
			'attr',
			'baseProvider',
			'layersProvider',
			'rendered',
			'storage',
			'parentObject',
			'parentSkeleton',
			'childrenContainer',
			'value'
		]);

		extension.attributes();
		satus.events.on('storage-set', extension.attributes);
	}, '_locales/');
});

extension.attributes = function (key) {
	const attributes = {
		theme: true,
		improvedtube_home: true,
		title_version: true,
		it_general: true,
		it_appearance: true,
		it_themes: true,
		it_player: true,
		it_playlist: true,
		it_channel: true,
		it_shortcuts: true,
		it_blocklist: true,
		it_analyzer: true,
		layer_animation_scale: false
	};
	function attrib(attribute) {
		const value = satus.storage.get(attribute);

		attribute = attribute.replace('it_', '').replace(/_/g, '-');

		if (satus.isset(value)) {
			extension.skeleton.rendered.setAttribute(attribute, value);
		} else {
			extension.skeleton.rendered.removeAttribute(attribute);
		}
	};

	if (!key) {
		// init
		for (const attribute in attributes) {
			attrib(attribute);
		}
	} else if (attributes[key]) {
		// changed key on list
		attrib(key);
	}
};

chrome.runtime.sendMessage({
	action: 'options-page-connected'
}, function (response) {
	if (!response) {
		console.error('Cant connect to backgrount.js Service Worker');
		return;
	}
	if (response.isTab) {
		document.body.setAttribute('tab','');
		
		if (!location.search.startsWith('?action=')) return;

		const element = document.createElement('button');
		element.id = 'action';

		if (location.search == '?action=import-settings') {
			element.onclick = extension.skeleton.header.sectionEnd.menu.on.click.settings.on.click.secondSection.backupAndReset.on.click.section.importSettings.on.click.ok;
			element.appendChild(document.createTextNode(satus.locale.get('importSettings')));
		} else if (location.search == '?action=export-settings') {
			element.onclick = extension.skeleton.header.sectionEnd.menu.on.click.settings.on.click.secondSection.backupAndReset.on.click.section.exportSettings.on.click.ok;
			element.appendChild(document.createTextNode(satus.locale.get('exportSettings')));
		}

		document.body.appendChild(element);			
	}
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.action === 'performance-reply') {
		console.log("Message from the content script:");
		console.log(message);
		const element = document.createElement('pre');
		element.style = 'position:fixed; top: 466px;';
		element.appendChild(document.createTextNode('eEements start ' + message.perf.elements_start));
		element.appendChild(document.createTextNode('\nElements injected ' + message.perf.elements_injected));
		element.appendChild(document.createTextNode('\nElements handled ' + (message.perf.elements_handled_name + message.perf.elements_handled_id + message.perf.elements_handled_class)));
		element.appendChild(document.createTextNode('\n name ' + message.perf.elements_handled_name));
		element.appendChild(document.createTextNode('\n id ' + message.perf.elements_handled_id));
		element.appendChild(document.createTextNode('\n class ' + message.perf.elements_handled_class));
		element.appendChild(document.createTextNode('\nTime ' + message.perf.time + ' ms'));
		document.body.appendChild(element);
	}
});

chrome.tabs.query({
	currentWindow: true,
	active: true,
	url: 'https://www.youtube.com/*'
}).then(t => {
	if (t.length) {
		chrome.tabs.sendMessage(t[0].id, {
			action: 'performance-request'
		});
	}
});
