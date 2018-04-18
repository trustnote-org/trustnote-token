"use strict";
var headlessWallet = require('trustnote-headless');
var eventBus = require('trustnote-common/event_bus.js');
var db = require('trustnote-common/db.js');

function onError(err){
	throw Error(err);
}

/**
 * 查询某个地址中，特定token的余额
 * @param {*} assetId TokenId
 * @param {*} address 需要查询的钱包地址
 * @param {*} cb 	  callbacks
 */
function balanceOf(assetId,address,cb){
	db.query(
	"SELECT \n\
		SUM(amount) AS balance \n\
	FROM \n\
		outputs \n\
	WHERE \n\
		outputs.asset = ? \n\
		AND outputs.address = ? \n\
		AND outputs.is_spent = 0",
			[assetId,address],
			function(rows){
				var balance = rows[0].balance;
				cb(balance);
		})
}
/**
 * 	转账操作
 * @param {String} asset 		TokenId
 * @param {String} from_address 发送方钱包地址
 * @param {String} to_address 	接收方钱包地址
 * @param {Number} amount 		发送的Token的数量，必须为整型
 */
function transfer(asset,from_address,to_address,amount){
	var network = require('trustnote-common/network.js');
	var divisibleAsset = require('trustnote-common/divisible_asset.js');
	var walletGeneral = require('trustnote-common/wallet_general.js');
	divisibleAsset.composeAndSaveDivisibleAssetPaymentJoint({
		asset: asset,
		paying_addresses: [from_address],
		fee_paying_addresses: [from_address],
		change_address: from_address,
		to_address: to_address,
		amount: amount,
		signer: headlessWallet.signer,
		callbacks: {
			ifError: onError,
			ifNotEnoughFunds: onError,
			ifOk: function(objJoint, arrChains){
				network.broadcastJoint(objJoint);
			}
		}
	});
}

/**
 * 		发行Token
 * @param {Number} cap 	   Token的发行总量
 * @param {String} address Token发行人的钱包地址
 * @param {} cb 		   回调函数
 */
function issueAsset(cap,address,cb){
	var composer = require('trustnote-common/composer.js');
	var network = require('trustnote-common/network.js');
	var callbacks = composer.getSavingCallbacks({
		ifNotEnoughFunds: onError,
		ifError: onError,
		ifOk: function(objJoint){
			network.broadcastJoint(objJoint);
			var json = JSON.parse(JSON.stringify(objJoint, null, '\t'));
			cb(json['unit']['unit']);
		}
	});
	var asset = {
		cap: cap,
		is_private: false,
		is_transferrable: true,
		auto_destroy: false,
		fixed_denominations: false,
		issued_by_definer_only: true,
		cosigned_by_definer: false,
		spender_attested: false,
	};
	composer.composeAssetDefinitionJoint(address, asset, headlessWallet.signer, callbacks);
}


/**
 * 查询当前地址发行的所有的Token
 * @param {*} address Token发行人的钱包地址
 * @param {*} cb 	  回调
 */
function listAsset(address,cb){
	db.query(
	"SELECT \n\
		assets.unit AS asset \n\
	FROM \n\
		assets \n\
		LEFT JOIN unit_authors ON assets.unit = unit_authors.unit \n\
	WHERE \n\
		unit_authors.address = ?",
		[address],
		function(rows){
			cb(rows)
	})
}

/**
 *  根据TokenId 查询Token的发行总量
 * @param {*} assetId   TokenId
 * @param {*} cb 		回调函数
 */
function totalSupply(assetId,cb){
	db.query(
	"SELECT \n\
		cap \n\
	FROM \n\
		assets \n\
	WHERE \n\
		assets.unit = ?",
			[asset],
			function(rows){
				cap = rows[0].cap;
				cb(cap)
		})
}

exports.totalSupply = totalSupply
exports.issueAsset = issueAsset
exports.transfer = transfer
exports.balanceOf = balanceOf
exports.listAsset = listAsset
