"use strict";
var headlessWallet = require('trustnote-headless');
var eventBus = require('trustnote-common/event_bus.js');
var assetUtils = require('./assetUtils.js');
headlessWallet.setupChatEventHandlers();
eventBus.on('headless_wallet_ready', function(){
	headlessWallet.readSingleAddress(function(address){
		setTimeout(function(){
			//开发者需将第一个参数设置为自己的 assetId
			assetUtils.balanceOf('DJw4edxgaSbt7VGTsmsadmRdYJ+Vvz1Hrhy+JGrAyiA=',address,cb)
		},3000);
	});
});

//余额查询成功回调函数
function cb(balance){
	console.log(balance);
}