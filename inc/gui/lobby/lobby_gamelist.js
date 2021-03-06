/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
myLobbyGameList = new Object();

/**
 * class LobbyGameListImpl
 * @constructor
 */
function LobbyGameListImpl()
{
	var self = this;	
	this.isActive = false;
	$("#lobbyGameList").append('<div id="gameListCollapsibleSet" data-role="collapsible-set" data-theme="b" data-content-theme="d" data-inset="true"></div>');
	$("#lobbyGameListButton").html("Games ("+$('.gameListCollapsible').length+")");
	$("#lobbyGameListButton").addClass("ui-btn-active");
	
	//class members
	this.prepare = function() {
		$("#lobbyGameList").append('<div id="gameListCollapsibleSet" data-role="collapsible-set" data-theme="b" data-content-theme="d" data-inset="true"></div>');
	};
	
	this.addGame = function(gameId) 
	{
		var gameTypeGfxUrl;
		switch (myNetCache.getGameData(gameId).gameInfo.netGameType) 
		{
			case 1: gameTypeGfxUrl = "gfx/lobby/gametype_standard.png";
			break;
			case 2: gameTypeGfxUrl = "gfx/lobby/gametype_registered.png";
			break;
			case 3: gameTypeGfxUrl = "gfx/lobby/gametype_inviteonly.png";
			break;
			case 4: gameTypeGfxUrl = "gfx/lobby/gametype_ranking.png";
			break;
			default:;
		}

		var gamePrivateGfxUrl;
		if(myNetCache.getGameData(gameId).isPrivate) {
			gamePrivateGfxUrl = "gfx/lobby/gameprivate_locked.png";      
		}
		else {
			gamePrivateGfxUrl = "gfx/1px.png";
		}

		var gameModeGfxUrl;
		if(myNetCache.getGameData(gameId).gameMode == 1) {
			gameModeGfxUrl = "gfx/lobby/open_game.png";      
		}
		else if(myNetCache.getGameData(gameId).gameMode == 2) {
			gameModeGfxUrl = "gfx/lobby/running_game.png";
		}
		else {
			gameModeGfxUrl = "gfx/1px.png";
		}

		var gameAllowSpectatorsGfxUrl;
		if(myNetCache.getGameData(gameId).gameInfo.allowSpectators) {
			gameAllowSpectatorsGfxUrl = "gfx/lobby/spectator.png";
		}
		else {
			gameAllowSpectatorsGfxUrl = "gfx/lobby/no_spectator.png";
		}

		var playerString = "";
		playerIdArray = myNetCache.getGameData(gameId).playerIds;
		var playerCounter = playerIdArray.length;
		for (var i = 0; i < playerIdArray.length; i++) {      
			var playerNameString = "";
			var avatarFileName = "";
			if(myNetCache.hasPlayerData(playerIdArray[i])) {
				playerNameString = myNetCache.getPlayerData(playerIdArray[i]).playerInfoData.playerName;
				avatarFileName = myNetCache.getPlayerData(playerIdArray[i]).avatarFileName;
				if(avatarFileName != "") { avatarFileName = 'http://avatar.poker-heroes.com/web/'+avatarFileName; }
			}
			else {
				playerNameString = "id"+playerIdArray[i];
			}
			playerString += '<li id="lobbyGameList_playerInGameList_playerId'+playerIdArray[i]+'" data-role="list-divider"><img width="30" height="30" border="0" id="lobbyGameList_playerAvatar" class="ui-li-thumb" src="'+avatarFileName+'"><span id="lobbyGameList_playerName">'+playerNameString+'</span></li>';
		};

		var blindsRaiseIntervalString = "";
		if (myNetCache.getGameData(gameId).gameInfo.raiseIntervalMode == 1) {
			blindsRaiseIntervalString += myNetCache.getGameData(gameId).gameInfo.raiseEveryHands+" hands";	
		}
		else if (myNetCache.getGameData(gameId).gameInfo.raiseIntervalMode == 2) {
			blindsRaiseIntervalString += myNetCache.getGameData(gameId).gameInfo.raiseEveryMinutes+" minutes";

		}

		var blindsRaiseModeString = "";
		if(typeof myNetCache.getGameData(gameId).gameInfo.manualBlinds[0] === "undefined") {
			blindsRaiseModeString = "double blinds";
		}
		else {
			blindsArray = myNetCache.getGameData(gameId).gameInfo.manualBlinds;
			for (var i = 0; i < blindsArray.length; i++) {      
				blindsRaiseModeString += "$"+blindsArray[i]+", ";
			}
			blindsRaiseModeString = blindsRaiseModeString.substring(0, blindsRaiseModeString.length-2);
		}

		var numberOfSpectators = 0;
		if(myNetCache.getGameData(gameId).spectatorIds.length > 0) {
			numberOfSpectators = myNetCache.getGameData(gameId).spectatorIds.length;
		}
		//COLLAPSIBLE TEST
		$('#gameListCollapsibleSet').append('<div class="gameListCollapsible" id="gameListGameID-'+gameId+'" data-role="collapsible"> '+
			'<h2><div id="lobbyGameList_gameDesc">'+myNetCache.getGameData(gameId).gameInfo.gameName+'</div><div class="lobbyGameList_numberOfPlayers" id="lobbyGameList_numberOfPlayers_gameId-'+gameId+'">'+playerCounter+'/'+myNetCache.getGameData(gameId).gameInfo.maxNumPlayers+'</div><div class="lobbyGameList_gameMode" id="lobbyGameList_gameMode_gameId-'+gameId+'"><img src=\"'+gameModeGfxUrl+'\" width=25 height=25></div><div id="lobbyGameList_gameType"><img src=\"'+gameTypeGfxUrl+'\" height=25></div><div id="lobbyGameList_gamePrivate"><img src=\"'+gamePrivateGfxUrl+'\" width=20 height=24></div><div id="lobbyGameList_gameSpectators"><img id="lobbyGameList_gameSpectators_img" src=\"'+gameAllowSpectatorsGfxUrl+'\" width=26 height=26><span class="lobbyGameList_gameNumberOfSpectators" id="lobbyGameList_gameNumberOfSpectators_gameId-'+gameId+'">'+numberOfSpectators+'</span></div><div id="lobbyGameList_gameTimeouts">'+myNetCache.getGameData(gameId).gameInfo.playerActionTimeout+'s/'+myNetCache.getGameData(gameId).gameInfo.delayBetweenHands+'s</div></h2> '+
				'<ul id="lobbyGameList_gameDetails_gameId-'+gameId+'" data-role="listview" data-theme="d" data-divider-theme="d"> '+
                                    playerString +
                                    '<li> '+
                                        '<table width=100%> '+
                                            '<tr> '+
                                                '<td style="text-align:right;">Start cash: </td><td style="text-align:left;"><b>$'+myNetCache.getGameData(gameId).gameInfo.startMoney+'</b></td><td style="text-align:right;">First small blind: </td><td style="text-align:left;"><b>$'+myNetCache.getGameData(gameId).gameInfo.firstSmallBlind+'</b></td> '+
                                            '</tr> '+
                                            '<tr> '+
                                                '<td style="text-align:right;">Blinds raise interval: </td><td style="text-align:left;"><b>'+blindsRaiseIntervalString+'</b></td><td style="text-align:right;">Blinds raise mode: </td><td style="text-align:left;"><b>'+blindsRaiseModeString+'</b></td> '+
                                            '</tr> '+
					'</table> '+
					'</li> '+
					'<li><a class="lobbyGameList_spectateButton" id="lobbyGameList_spectateButton-'+gameId+'" data-gameid="'+gameId+'" href="">Spectate!</a></li> '+
				'</ul> '+
			'</div>');

		$('#gameListCollapsibleSet').collapsibleset();
		$('#gameListCollapsibleSet').collapsibleset('refresh');
		$("#gameListCollapsibleSet ul").each(function(i) {
			$(this).listview(); 
		});
		$("#lobbyGameList").delegate('#lobbyGameList_spectateButton-'+gameId, "click", function(){
			var $this = $(this),
			myGameId = $this.data('gameid');
			myNetCache.callbackSpectateGame(myGameId);
		});
		self.updateGameStats();
	};
        
	this.removeGame = function(gameId) 
	{
		$("#gameListGameID-"+gameId).remove();	
		$('#gameListCollapsibleSet').collapsibleset();
		$('#gameListCollapsibleSet').collapsibleset('refresh');
		self.updateGameStats();
	};


	this.updateGame = function(gameId) 
	{
		var gameModeGfxUrl;
		if(myNetCache.getGameData(gameId).gameMode == 1) {
			gameModeGfxUrl = "gfx/lobby/open_game.png";      
		}
		else if(myNetCache.getGameData(gameId).gameMode == 2) {
			gameModeGfxUrl = "gfx/lobby/running_game.png";
		}
		else {
			gameModeGfxUrl = "gfx/1px.png";
		}

		$("#lobbyGameList_gameMode_gameId-"+gameId).html('<img src=\"'+gameModeGfxUrl+'\" width=25 height=25>');
		$("#lobbyGameList_gameNumberOfSpectators_gameId-"+gameId).html(myNetCache.getGameData(gameId).spectatorIds.length);
	};


	this.gameAddPlayer = function(gameId, playerId) 
	{
		//update playercounter in game desc
		var playerIdArray = myNetCache.getGameData(gameId).playerIds;
		var playerCounter = playerIdArray.length;
		$("#lobbyGameList_numberOfPlayers_gameId-"+gameId).html(playerCounter+'/'+myNetCache.getGameData(gameId).gameInfo.maxNumPlayers);
		
		//add player to game details player list
		var playerNameString = "";
		var avatarFileName = "";
		if(myNetCache.hasPlayerData(playerId)) {
			playerNameString = myNetCache.getPlayerData(playerId).playerInfoData.playerName;
			avatarFileName = myNetCache.getPlayerData(playerId).avatarFileName;
			if(avatarFileName != "") { avatarFileName = 'http://avatar.poker-heroes.com/web/'+avatarFileName; }
		}
		else {
			playerNameString = "id"+playerId;
		}
		$("#lobbyGameList_gameDetails_gameId-"+gameId).prepend('<li id="lobbyGameList_playerInGameList_playerId'+playerId+'" data-role="list-divider"><img width="30" height="30" border="0" id="lobbyGameList_playerAvatar" src="'+avatarFileName+'"><span id="lobbyGameList_playerName">'+playerNameString+'</span></li>');
		$("#lobbyGameList_gameDetails_gameId-"+gameId).listview('refresh');
            
	};

	
	this.gameRemovePlayer = function(gameId, playerId) 
	{
		//update playercounter in game desc
		var playerIdArray = myNetCache.getGameData(gameId).playerIds;
		var playerCounter = playerIdArray.length;
		$("#lobbyGameList_numberOfPlayers_gameId-"+gameId).html(playerCounter+'/'+myNetCache.getGameData(gameId).gameInfo.maxNumPlayers);
		
		//remove player entry
		$("#lobbyGameList_playerInGameList_playerId"+playerId).remove();
	};

	this.updatePlayer = function(playerId) 
	{
		var playerName = myNetCache.getPlayerData(playerId).playerInfoData.playerName;
		playerName = '<span id="lobbyGameList_playerName">'+playerName+'</span>';
		var avatarFileName = myNetCache.getPlayerData(playerId).avatarFileName;
		var avatarString = "";
			if(avatarFileName != "") { 
				avatarFileName = 'http://avatar.poker-heroes.com/web/'+avatarFileName; 
				avatarString = '<img width="30" height="30" border="0" id="lobbyGameList_playerAvatar" class="ui-li-thumb" src="'+avatarFileName+'">';
			}				
		$('#lobbyGameList_playerInGameList_playerId'+playerId).html(avatarString+playerName);
	};
	
	this.updateGameStats = function()
	{
		$("#lobbyGameListButton").html("Games ("+$('.gameListCollapsible').length+")");
	}
        
	this.setActiveState = function(active) 
	{
		if(active) {
			self.isActive = true;
			$("#lobbyGameList").show();
		}
		else {
			self.isActive = false;
			$("#lobbyGameList").hide();
		}
	};
};

function initLobbyGameListImpl()
{
	myLobbyGameList = new LobbyGameListImpl();
}

window.addEventListener("load", initLobbyGameListImpl, false);


