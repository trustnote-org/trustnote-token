/*jslint node: true */
"use strict";
var headlessWallet = require('trustnote-headless');
var eventBus = require('trustnote-common/event_bus.js');
var assetUtils = require('./assetUtils.js');
var fs = require('fs');
headlessWallet.setupChatEventHandlers();

eventBus.on('headless_wallet_ready', function(){
	headlessWallet.readSingleAddress(function(address){
		setTimeout(function(){
			// 开发者可以修改第一个参数来修改Token的总发行量。
			assetUtils.issueAsset(100000,address,writeTokenId);
		},3000);
	});
});

function writeTokenId(TokenId){
	var ajson = {TokenId:TokenId};
	fs.writeFile("./asset.json", JSON.stringify(ajson, null, '\t'), 'utf8', function(err){
		if (err)
			throw Error("failed to write json");
	});
}

function writeAddress(address){
	var ajson = {address:address};
	fs.writeFile("./address.json", JSON.stringify(ajson, null, '\t'), 'utf8', function(err){
		if (err)
			throw Error("failed to write json");
	});
}