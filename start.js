/*jslint node: true */
"use strict";
var headlessWallet = require('trustnote-headless');
var eventBus = require('trustnote-common/event_bus.js');
var assetUtils = require('./assetUtils.js');
var fs = require('fs');
headlessWallet.setupChatEventHandlers();
eventBus.on('headless_wallet_ready', function(){
	headlessWallet.readSingleAddress(function(address){
		//将当前钱包地址保存到 address.json文件中
		writeAddress(address);
	});
});


function writeAddress(address){
	var ajson = {address:address};
	fs.writeFile("./address.json", JSON.stringify(ajson, null, '\t'), 'utf8', function(err){
		if (err)
			throw Error("failed to write json");
	});
}