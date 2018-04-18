/*jslint node: true */
"use strict";
var headlessWallet = require('trustnote-headless');
var eventBus = require('trustnote-common/event_bus.js');
var assetUtils = require('./assetUtils.js');
headlessWallet.setupChatEventHandlers();
eventBus.on('headless_wallet_ready', function(){
	headlessWallet.readSingleAddress(function(address){
		setTimeout(function(){
			//开发者需将第一个参数设置为自己发行的TokenID
			assetUtils.transfer('DJw4edxgaSbt7VGTsmsadmRdYJ+Vvz1Hrhy+JGrAyiA=',address,'LDFEZ5TWE4XW4NUAUQHCMEPEQV7NAX6X',15);
		},3000);
	});
});
