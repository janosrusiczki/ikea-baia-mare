// ==UserScript==
// @name         IKEA Baia Mare
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adaugă buton de copiat date pentru spreadsheet-ul de comandă pe pagina de produs IKEA România
// @author       You
// @match        https://www.ikea.com/ro/ro/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ikea.com
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// @require      https://gist.githubusercontent.com/BrockA/2625891/raw/waitForKeyElements.js
// @grant        GM_setClipboard
// ==/UserScript==

/* globals $, waitForKeyElements */

(function() {
    'use strict';
    console.log('Start userscript...');

    waitForKeyElements(".js-buy-module.pip-buy-module:not(.pip-buy-module--initially-hidden) .pip-buy-module__buttons--container button:not(#inserted-button)", actionFunction);

    function actionFunction(jNode) {
        jNode.after('<button type="button" id="inserted-button" class="pip-btn pip-btn--emphasised"><span class="pip-btn__inner"><span class="pip-btn__label">Copiază pentru spreadsheet</span></span></button></div>');
        $('#inserted-button').click(copyDataToClipboard);
    };

    function copyDataToClipboard() {
        var productIdentifier = firstText('.pip-product-identifier__value');
        var title = firstText('.pip-header-section__title--big.notranslate');
        var description = `${firstText('.pip-header-section__description-text')} ${firstText('.pip-link-button.pip-header-section__description-measurement')}`;
        var price = `${firstText('.pip-temp-price__integer')}.${firstText('.pip-temp-price__decimal').replace(/\D/g,'')}`;
        var theString = `${productIdentifier}\t${calculateWeight()}\t${title}\t${description}\t${price}`;
        console.log(theString);
        GM_setClipboard(theString);
    };

    function calculateWeight() {
        var totalWeight = 0;
        $(".pip-product-dimensions__measurement-wrapper:contains('Greutate')").each(function() {
            totalWeight += parseFloat($(this).text().replace(/[^.\d]/g, ''));
        });
        return totalWeight;
    }

    function firstText(selector) {
        return $(selector).first().text();
    }
})();