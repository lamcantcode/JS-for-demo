// ==UserScript==
// @name         main
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Lam
// @match        https://www.hkjc.com/home/chinese/index.aspx
// @icon         https://www.google.com/s2/favicons?domain=hkjc.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    //match hkjc website : https://www.hkjc.com/home/chinese/index.aspx
    //this function is to call out all required website and perform tampermonkey code independently
    //if race not started, it will go to first race
    //if race started, it will go to current race

    //race card
    window.open("https://racing.hkjc.com/racing/information/Chinese/racing/RaceCard.aspx");

})();
