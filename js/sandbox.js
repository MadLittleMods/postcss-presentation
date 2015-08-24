(function() {

	'use strict';


	// Bling.js
	// https://gist.github.com/paulirish/12fb951a8b893a454b32
	let $ = document.querySelectorAll.bind(document);

	Node.prototype.on = window.on = function(names, fn) {
		names.split(/\s/).forEach(function(name) {
			this.addEventListener(name, fn);
		}.bind(this));

		// Keep the chaining going
		return this;
	};

	HTMLCollection.prototype.__proto__ = Array.prototype;
	NodeList.prototype.__proto__ = Array.prototype;

	NodeList.prototype.on = NodeList.prototype.addEventListener = function(name, fn) {
		this.forEach(function(elem, i) {
			elem.on(name, fn);
		});

		// Keep the chaining going
		return this;
	};
	// Bling.js end





	let stripIndent = window.utility.stripIndent;

	let debounce = window.utility.debounce;
	let throttle = window.utility.throttle;

	let tabOverride = window.tabOverride;



	let generatePayload = function(contents) {
		return `
			<!doctype html>
			<html>
			<head>
				<style>
					html,
					body {
						padding: 0;
						margin: 0;
					}
					html {
						width: 100%;
						height: 100%;

						box-sizing: border-box;
					}
					body {
						width: 100%;
						height: 100%;
						min-width: 100%;
						min-height: 100%;
					}

					body {
						tab-size: 4;

						color: #eeeeee;
						color: rgb(238, 238, 238);
						font-size: 18px;
					}

					*,
					*:before,
					*:after {
						box-sizing: inherit;
					}

					pre,
					code {
						margin: 0;
						padding: 0;

						color: inherit;
						font-size: inherit;
						font-family: monospace;
					}

					.sandbox-output {
						padding: 3px;
					}

					.console-error {
						padding: 2px;

						background: linear-gradient(45deg, transparent 25%,
							#f00 25%, #f00 50%, 
							transparent 50%, transparent 75%, 
							#f00 75%);
						background-size: 40px 40px;

						animation: error-stripe-loading 12s infinite linear;

						font-family: monospace;
					}

					.console-error-message {
						padding: 4px;

						background-color: #222;
					}

					@keyframes error-stripe-loading {
						0% {
							background-position: 0 0;
						}
						100% {
							background-position: 100% 0;
						}
					}
				</style>

				<script>
					(function() {
						'use strict';

						window.onerror = function(message, file, line, column, errorObj) {
							errorObj = errorObj || {};

							document.body.insertAdjacentHTML('beforeend', \`
								<div class="console-error">
									<div class="console-error-message">
										<p>\${message} at \${line}:\${column}</p>
										<p>\${errorObj.stack}</p>
									</div>
								</div>
							\`);
						};
					})();
				</script>
			</head>
			<body>
				<script src="js/bluebird.min.js"></script>
				<script src="dist/build.js"></script>
				<script>
					(function() {
						'use strict';

						let stripIndent = window.utility.stripIndent;

						// template string tag to strip the indent
						let stripIndentTag = function(strings) {
							return strings.raw
								.reduce(function(prevResult, str) {
									return prevResult + stripIndent(str);
								}, '')
								.trim();
						}

						Promise.resolve((function() {
								${contents}
							})())
							.then(function(output) {
								return stripIndent(output);
							})
							.then(function(output) {
								document.body.insertAdjacentHTML('beforeend', \`
									<pre class="sandbox-output"><code>\${output}</code></pre>
								\`);

								document.body.insertAdjacentHTML('beforeend', \`
									<style>\${output}</style>
								\`);
							});
					})();
				</script>
			</body>
			</html>
		`;
	};



	$('.sandbox-script').forEach(function(scriptTag) {
		let getScriptContents = function() {
			// Fix up the indent
			return window.utility.stripIndent(scriptTag.value).trim();
		};

		// Fix up the indent on the contents initially
		scriptTag.innerHTML = getScriptContents();
		// Enable tab, shift + tab, etc
		tabOverride.set(scriptTag);
		
		// Make a side by side wrapper (code and iframe)
		let sandboxWrapper = document.createElement('div');
		sandboxWrapper.classList.add('sandbox-wrapper');
		// Move our wrapper where the script input was
		scriptTag.parentNode.insertBefore(sandboxWrapper, scriptTag.nextSibling);
		// Then move the script input inside
		sandboxWrapper.appendChild(scriptTag);

		let sandboxFrame = document.createElement('iframe');
		sandboxFrame.classList.add('sandbox-frame');
		sandboxFrame.setAttribute('seamless', '');
		sandboxWrapper.appendChild(sandboxFrame);

		/* * /
		// TODO: Move to button saving
		let sandboxUpdateResult = document.createElement('button');
		sandboxUpdateResult.classList.add('sandbox-update-result');
		sandboxWrapper.appendChild(sandboxUpdateResult);
		/* */


		// Update the frame whenever the code changes
		let prevContents = '';
		let updateFrameContents = function(force) {
			let contents = getScriptContents();
			// Only update if actually different
			if(force || contents !== prevContents) {
				console.log('updating contents');
				sandboxFrame.setAttribute('srcdoc', generatePayload(contents));
			}

			prevContents = contents;
		};

		// Update the frame initially
		updateFrameContents();
		scriptTag.on('input change', debounce(updateFrameContents, 800));
	});





})();


