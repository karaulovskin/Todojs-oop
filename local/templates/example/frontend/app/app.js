// Load plugins
import 'jquery'
import 'inputmask/dist/min/jquery.inputmask.bundle.min.js'

import svg4everybody from 'svg4everybody'
window.svg4everybody = svg4everybody;

import objectFitImages from 'object-fit-images'
window.objectFitImages = objectFitImages;

import imagesLoaded from 'imagesloaded'
window.imagesLoaded = imagesLoaded;

// load modules
import Utils from'./js/utils/utils'
import SvgUse from'./js/svgUse'
import Tabs from'./js/tabs'
import Sliders from'./js/sliders'
import Modals from'./js/modals'
import Forms from'./js/forms/forms'

// Run components

window.App = {
    debug: false,
    lang: 'ru'
};

// debug detect

if (window.location.href.indexOf('192') !== -1) {
    App.debug = true;
}

if (window.SITE_LANG) {
    App.lang = window.SITE_LANG;
}

if (App.debug) {
    console.log('Debug: ' + App.debug);
    console.log('Lang: ' + App.lang);
}

document.addEventListener('DOMContentLoaded', function() {
    objectFitImages();

    App.Utils = new Utils();
    App.Forms = new Forms();
    App.SvgUse = new SvgUse();
    App.Sliders = new Sliders();
    App.Tabs = new Tabs();
    App.Modals = new Modals();

    $('.inputmask').inputmask({mask: "+7 (999) 999-9999", greedy: false});

    // prevent copying

    $('.no-select').on('selectstart', false);

    $(".no-select img").on('mousedown', false);
});