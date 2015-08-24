import objectAssign from 'object-assign';
import stripIndent from 'strip-indent';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';

import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import reporter from 'postcss-browser-reporter';
import calc from 'postcss-calc';
import canadian from 'postcss-canadian-stylesheets';
import cssnano from 'cssnano';
import cssvariables from 'postcss-css-variables';
import increaseSpecificity from 'postcss-increase-specificity';
import nested from 'postcss-nested';
import context from 'postcss-plugin-context';
import vars from 'postcss-simple-vars';


if(!window.utility) {
	window.utility = {};
}
objectAssign(window.utility, {
	stripIndent,
	debounce,
	throttle
});


window.postcss = postcss;

if(!window.postcssPlugins) {
	window.postcssPlugins = {};
}
objectAssign(window.postcssPlugins, {
	autoprefixer,
	'postcss-browser-reporter': reporter,
	'postcss-calc': calc,
	'postcss-canadian-stylesheets': canadian,
	cssnano,
	'postcss-css-variables': cssvariables,
	'postcss-increase-specificity': increaseSpecificity,
	'postcss-nested': nested,
	'postcss-plugin-context': context,
	'postcss-simple-vars': vars
});
