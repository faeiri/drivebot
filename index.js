const Discord = require('discord.js');
const fetch = require('node-fetch');
const querystring = require('querystring');
const { token } = require('./config.json');

const client = new Discord.Client();
const prefix = '!';
const msglen = 1900;


var badgepoint = 0;
var pokepoint = 0;
//Literally I manually set this whenever I want them to do past events. Don't code like this
var allpoint = 0;


var trimpoint = 0;
var msgpoint = 0;
var sidegamepoint = 0;
var trimmedmsg = [];
var waiting = 0;
var enemy_yes = 0;
var wild_yes = 0;
var wherearewe = "";
var monies = "";
var buals = 0;

var partychange= 0;
var curparty = [];
var pvs = [];
var specy = [];
var partyfull = [];

var pcboxes = [];


const runstart = 1626105600000; //this was randomized black
//easy way to get the start time for a different one is here https://currentmillis.com/

var msg = "";
var curmsg = "";
var movemsg = "";

const trim = (str, max) => str.length > max ? `${str.slice(0, max - 3)}...` : str;

client.once('ready', () => {
	console.log('Ready!');
});
client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	if(message.author.id != 69696969696969) return; // <- this u


	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	const query = args.join(' ');
	var searchfor = "";

	if (command === 'drive'){
		//sets up the thing where you re-check API every few seconds

		//if you just typed !drive, say hi :)
		if(query.length == 0){
			return message.channel.send('Hello.');
		}

//wat are u!!
		if(query === "about"){
			var about = "";
			about = 'Hello. I am a bot that provides automated updates on TPP\'s runs and sidegames. Currently I can post updates on the following:\n';
			about = about.concat('❗ New badges acquired.\n');
			about = about.concat('📟 New Pok\u{00E9}dex entries.\n');
			about = about.concat('📍 Visits to new locations.\n');
			about = about.concat('🥳 \'Notable\' Trainers defeated.\n');
			about = about.concat(':vs: Trainer battles (sometimes).\n');
			about = about.concat(':regional_indicator_f: Blackouts.\n');
			about = about.concat('\nI\'m in beta™, so I may be easily confused. Please don\'t make fun of me for miscounting Elite Four attempts. However, feel free to :Kappa: me if I get something else flagrantly wrong, and if I stop updating, please ping <@'+message.author.id+'>.\n');
			about = about.concat('Thanks for your reading.');
			return message.channel.send(about);
		}
//worm
		if(query === "worm"){
			return message.channel.send('🎷🐛');
		}
//Sets you to Sidegame Mode.
		if(query === "sidegame" || query === "Sidegame"){
			searchfor = "Sidegame";
		} 
//Sets you to a couple options of Run Mode.
//Holy shit don't write code like this. What is this
		if(query === "badges" || query === "Badges" ){
			searchfor = "Badge";
		} if(query === "pokemon" || query === "Pokemon" || query === "pkmn" || query === "dex" || query === "pokedex" || query === "Pokedex"){
			searchfor = "Pokemon";
		} if(query === "party" || query === "Party"){
			searchfor = "Party";
		} if(query === "all" || query === "All" || query === "all.ping"){
			searchfor = "all";
		} if(query === "battle" || query === "Battle"){
			searchfor = "battle";
		} if(query === "special" || query === "Special"){
			searchfor = "special";
		} if(query === "pc"){
			searchfor = "checkpc";
		} if (searchfor === ""){
			return message.channel.send('No results found for **'+query+'**.');
		}

//OK THIS IS THE PART WHERE YOU START DOING STUFF. cool

//Check sidegame for screenshots every 1 minute.
		if(searchfor === "Sidegame"){
			var intervalsidegame = setInterval (async function() {
				var list = {};
//Currently I have to set the skip=number manually every time I reboot them, like a fuckin asshole.
//Maybe figure out how to like...remember where you are in here at some point? Use Time? h
				try{ 
					list = await fetch(`https://twitchplayspokemon.tv/api/sidegame_inputs?sort=id&skip=6952&limit=9999`).then(list => list.json());
				jsonData = list;
				msg = "";
				curmsg = "";
				var position = 0;
				screenshots = [];

//5 minutes before i press the start button. I think this doesn't...do anything right now
				var d = new Date();
				const timestart = d.getTime()-(60000*5); 



				for(i = sidegamepoint; i < jsonData.length; i++){
					if(new Date(jsonData[i].timestamp) >= timestart){
						position = jsonData[i].id.position
						curmsg = 'https://twitchplayspokemon.tv/sidegame_image/'+position+'\n';
						msg = msg.concat(curmsg);
						sidegamepoint = i+1;
						console.log(sidegamepoint+' : '+position);
						if(msg.length > 250 && msg.length > 0){
							// console.log("length "+msg.length);
							message.channel.send(msg.substring(0, 250));
							msg = msg.substring(250, msg.length);
							// console.log("new length "+msg.length);
							// console.log(msg);
						}
					}
				}
//Once you have an input, wait 7.5 seconds to actually post it.
//This is because the link goes into the API before becoming An Image That Exists, so sometimes it won't embed if you don't wait...
				setTimeout(function(){ 
					if(msg !=""){
					message.channel.send(msg);
					}
				}, 7500);
//This error checker is copy/pasted everywhere atm instead of being like, a thing you can call? Learn how to do that
			} catch(err) {
					var errdate = new Date();
					console.log(err+"\n"+errdate.getTime());
				}



			}, 60 * 1000);
		} 
//List current party by name->level->species->moves
//(Currently updates once per hour. This means if you're testing Change The Wait Length or you'll sit there for An Hour.)
		if (searchfor === "Party") {
			var interval = setInterval (async function () {
			 	var list = {};
			 	try{ 
					list = await fetch(`https://twitchplayspokemon.tv/api/run_status?`).then(list => list.json());
					jsonData = list;

//this bit makes it know when the run time is
					var i;
					var time;
					var elapsed = 0;
					
					var diff = {};
				
					diff.days    = 0
					diff.hours   = 0
					diff.minutes = 0
					diff.seconds = 0

					msg = ":pencil: __Current Party:__\n";
					curmsg = "";
//loops through the party
					for(i = 0; i < jsonData.party.length; i++){
						movemsg = "";
						movecur = "";
						curmsg = "  __"+jsonData.party[i].name+"__, Lv. "+jsonData.party[i].level+" "+jsonData.party[i].species.name+"\n        Moves: "
						//loops through current pokemon's moves
						//this code fuckin sucks dude
						for(m = 0; m<jsonData.party[i].moves.length; m++){
							movecur = jsonData.party[i].moves[m].name+"/"+jsonData.party[i].moves[m].base_power+"/"+jsonData.party[i].moves[m].accuracy;
							if(m < 3){
								movecur = movecur.concat(" | ");
							}
							movemsg = movemsg.concat(movecur);
						}
						msg = msg.concat(curmsg+movemsg+"\n");
					}
					//send message if you have it
					if(msg !=""){
						message.channel.send(msg);
					}

					} catch(err) {
						var errdate = new Date();
						console.log(err+"\n"+errdate.getTime());
					}
		 	}, 60 * 60 * 1000);


		} 

//Checks the events part of run status.
//Runs every 60 seconds.
		if (searchfor === "Badge" || searchfor === "Pokemon" || searchfor === "all" || searchfor === "battle" || searchfor === "special" || searchfor === "checkpc") {
			var interval = setInterval (async function () {
			 	var list = {};
			 	try{ 
					list = await fetch(`https://twitchplayspokemon.tv/api/run_status?`).then(list => list.json());
					jsonData = list;

					//this bit makes it know when the run time is
					var i;
					var time;
					var elapsed = 0;
					
					var diff = {};
				
					diff.days    = 0
					diff.hours   = 0
					diff.minutes = 0
					diff.seconds = 0

					msg = "";
					curmsg = "";

//Badges Mode: check each event to see if it's a Badge
					// then add it to the Discord message, and move the pointer (is this what a pointer is)
					// then when you're all caught up, send the message
					// add this to stream-news at some point maybe?
					if(searchfor == "Badge"){
						for(i = badgepoint; i < jsonData.events.length; i++){
							if(jsonData.events[i].group === searchfor){
								time = jsonData.events[i].time;
								elapsed = (new Date(time) - new Date(runstart).getTime()) / 1000;
								diff.days    = Math.floor(elapsed / 86400);
								diff.hours   = Math.floor(elapsed / 3600 % 24);
								diff.minutes = Math.floor(elapsed / 60 % 60);
								diff.seconds = Math.floor(elapsed % 60);

								curmsg = '**'+searchfor+' obtained:** __'+jsonData.events[i].name+'__ at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s.\n';
								//message.channel.send("Info: "+curmsg);
								msg = msg.concat(curmsg);
								badgepoint = i+1;
							}
						}
						if(msg !=""){
							message.channel.send("<@"+message.author.id+"> \n"+msg);
						}
					}
//Posts new dex entries only. This is pretty useless but I'm not deleting it rn
					if(searchfor == "Pokemon"){
						for(i = pokepoint; i < jsonData.events.length; i++){
							if(jsonData.events[i].group === searchfor){
								time = jsonData.events[i].time;
								elapsed = (new Date(time) - new Date(runstart).getTime()) / 1000;
								diff.days    = Math.floor(elapsed / 86400);
								diff.hours   = Math.floor(elapsed / 3600 % 24);
								diff.minutes = Math.floor(elapsed / 60 % 60);
								diff.seconds = Math.floor(elapsed % 60);

								curmsg = '**New Pok\u{00E9}mon obtained: **__'+jsonData.events[i].name+'__ at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s.\n';
								//message.channel.send("Info: "+curmsg);
								msg = msg.concat(curmsg);
								pokepoint = i+1;
							}
						}
						if(msg !=""){
							message.channel.send("<@"+message.author.id+"> \n"+msg);
						}
					}






//Oh god time to program the PC thing uhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh yeah
					if(searchfor == "checkpc"){
						msg = "";
						curmsg = "";
						//if you don't have the correct box quantity set that and come back
						//this happens when first booting up, or if new boxes show up? which happens sometimes?
						if(jsonData.pc.boxes == null){
							console.log("pc is null rn pls wait");
							return;
						}
						if(pcboxes.length != jsonData.pc.boxes.length){
							pcboxes = jsonData.pc.boxes;
							console.log("pc length = "+pcboxes.length);
							return;
						}

						//now that you've initialized, check every box to see if the amount of mon changed
						//NOTE: this will fuck up if we do a 1:1 deposit/withdraw, but lol. come back to that later
						for(i = 0; i < jsonData.pc.boxes.length; i++){
							//apparently this hapens sometimes just wait until it fixes itself
							if (jsonData.pc.boxes[i] == null){
								return;
							}
							var curcontents = jsonData.pc.boxes[i].box_contents;
							var savedcontents = pcboxes[i].box_contents;

							//if there are MORE pokemon in the box now: loop thru and see who's new
							if(curcontents.length > pcboxes[i].box_contents.length){
								console.log("Box "+jsonData.pc.boxes[i].box_number+" is longer now")
								curmsg = curmsg.concat(":arrow_right: :desktop: Something's changed about Box "+jsonData.pc.boxes[i].box_number+" (I'm not smart enough to say what right now, sorry): \n        ");
								for(j = 0; j < curcontents.length; j++){
									if(!savedcontents.includes(curcontents[j])){
										curmsg = curmsg.concat("__"+curcontents[j].name+"__, lv. "+curcontents[j].level+" "+curcontents[j].species.name);
										if(j < curcontents.length-1){
											curmsg = curmsg.concat (" | ");
										}
									}
								}
							}
							// if(curcontents.length < pcboxes[i].box_contents.length){
							// 	curmsg = ":desktop:⚠️ I think "
							// }
						}
						if(curmsg !=""){
							message.channel.send(curmsg);
						}
						pcboxes = jsonData.pc.boxes;

					}






//"Special" aka Miscellaneous Other Things.
					if(searchfor == "special"){
//Notifies if we're in a battle.
						var classname = "";
						if(jsonData.enemy_trainers && enemy_yes == 0){
							enemy_yes = 1;
							classname = jsonData.enemy_trainers[0].class_name;
							if(classname.includes("\u03c0\u00b5")){
								classname = classname.substring(2);
								classname = "PkMn"+classname;
							}
							msg = ':vs: Battle: '+classname+' '+jsonData.enemy_trainers[0].name+'.\n';

						}
						if(!jsonData.enemy_trainers){
							enemy_yes = 0;
						}

						if(msg !=""){
							message.channel.send(msg);
						}
//Notifies when our ball count changes (lol).
						if(jsonData.ball_count != buals){
							curmsg = ':rice: We now have '+jsonData.ball_count+' Pok\u{00E9} Ball';
							if(jsonData.ball_count != 1){
								curmsg = curmsg+"s";
							}
							curmsg = curmsg+".";
							message.channel.send(curmsg);
							buals = jsonData.ball_count;
						}

//Notifies when our party changes. Currently this works by checking if the personality values (unique) or species in the party have changed.
//It then just posts the whole party because idk how to do it better right now.
//Figure out how to update on level up too please
						partychange = 0;
						msg = "";
						curmsg = "";

						if(curparty.length === 0 && jsonData.party.length > 0){
							for(i = 0; i < jsonData.party.length; i++){
								curparty[i] = {};
								curparty[i].name = jsonData.party[i].name;
								curparty[i].level = jsonData.party[i].level;
								curparty[i].species = jsonData.party[i].species.name;
								curparty[i].personality = jsonData.party[i].personality_value;
								pvs[i] = jsonData.party[i].personality_value;
								specy[i] = jsonData.party[i].species.name;

							}
							partyfull = jsonData.party;
							return;
						}
						for(i = 0; i < jsonData.party.length; i++){
							if(!pvs.includes(jsonData.party[i].personality_value) || !specy.includes(jsonData.party[i].species.name) || jsonData.party.length != pvs.length){
								partychange = 1;
								console.log("what");
							}
						}
						if(partychange === 1){
							console.log('that looks different...');
							curmsg = '✍️ Our party looks different now...\n        Current party: '
							for(i = 0; i < jsonData.party.length; i++){
								curmsg = curmsg.concat("__"+jsonData.party[i].name+"__, Lv. "+jsonData.party[i].level+" "+jsonData.party[i].species.name);
								if(i < jsonData.party.length-1){
									curmsg = curmsg.concat(" | ");
								}
							}
							if(curmsg !=""){
								message.channel.send(curmsg);
							}
							curparty = [];
							pvs = [];
							specy = [];
							for(i = 0; i < jsonData.party.length; i++){
								curparty.push(jsonData.party[i].species.name);
								pvs.push(jsonData.party[i].personality_value);
								specy.push(jsonData.party[i].species.name);
							}
							partyfull = jsonData.party;
						}

//Notifies when we walky
						if(!(jsonData.map_name === wherearewe)){
							message.channel.send('🚶 Current location: '+jsonData.map_name+'.\n');
							wherearewe = jsonData.map_name;
						}
//Notifies when we monie
						if(!(jsonData.money === monies)){
							message.channel.send('💸 We now have '+jsonData.money+' Pok\u{00E9}yen.\n');
							monies = jsonData.money;
						}

						// if(jsonData.battle_kind == "Wild" && wild_yes == 0){
						// 	wild_yes = 1;
						// 	msg = ':seedling: Battling against a wild ';
						// 	for(i = 0; i < jsonData.enemy_party.length; i++){
						// 		msg = msg.concat(jsonData.enemy_party[i].species.name);
						// 		if(i < jsonData.enemy_party.length-1){
						// 			msg = msg.concat(' and ');
						// 		}
						// 	}
						// 	msg = msg.concat('.');
						// 	if(jsonData.battle_kind == "None"){
						// 		enemy_yes = 0;
						// 	}
						// 	if(msg !=""){
						// 		message.channel.send(msg);
						// 	}
						// }

							
					}




//This is the one you're looking for. Whole updater. Every damn thing
					if(searchfor == "all"){ //works for all.ping too
						for(i = allpoint; i < jsonData.events.length; i++){

							//once again learn how to like. call functions?
							time = jsonData.events[i].time;
							elapsed = (new Date(time) - new Date(runstart).getTime()) / 1000;
							diff.days    = Math.floor(elapsed / 86400);
							diff.hours   = Math.floor(elapsed / 3600 % 24);
							diff.minutes = Math.floor(elapsed / 60 % 60);
							diff.seconds = Math.floor(elapsed % 60);
							var eventname = "";

							

							if(jsonData.events[i].group == "Badge"){
								curmsg = '❗ **__Badge obtained:__ __'+jsonData.events[i].name+'__** at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s.\n';
								msg = msg.concat(curmsg);
							} else if(jsonData.events[i].group == "Pokemon"){
								curmsg = '📟 **New Pok\u{00E9}mon obtained: **__'+jsonData.events[i].name+'__ at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s.\n';
								msg = msg.concat(curmsg);
							} else if(jsonData.events[i].group == "First Visit"){
								curmsg = '📍 **First Visit:** '+jsonData.events[i].name+' at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s.\n';
								msg = msg.concat(curmsg);
							} else if(jsonData.events[i].group == "Trainers Undefeated"){
								//return;
								eventname = jsonData.events[i].name;
								if(eventname.includes("\u03c0\u00b5")){
									eventname = eventname.substring(2);
									eventname = "PkMn"+eventname;
								}
								curmsg = ':vs: **Battle:** '+eventname+' at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s.\n';
								msg = msg.concat(curmsg);
								//this sucks. do not code like this
								//if a battle starts give it uhhhhh 7 min to finish the battle. after that give up
								// if(waiting <= 6){
								// 	await delay(1000 * 60 * 1);
								// 	waiting++;
								// } if(waiting > 6){
								// 	curmsg = ':vs: **Battle:** '+jsonData.events[i].name+' at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s.\n';
								// 	msg = msg.concat(curmsg);
								// 	waiting = 0;
								// }
							} else if(jsonData.events[i].group == "Blackouts"){
								curmsg = ':regional_indicator_f: **'+jsonData.events[i].name+'** at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s.\n';
								msg = msg.concat(curmsg);
							} else if(jsonData.events[i].group == "Trainers Defeated"){
								eventname = jsonData.events[i].name;
								if(eventname.includes("\u03c0\u00b5")){
									eventname = eventname.substring(2);
									eventname = "PkMn"+eventname;
								}
								curmsg = '🥳 **Defeated trainer:** '+eventname+' at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s, on attempt '+jsonData.events[i].attempts+'.\n';
								msg = msg.concat(curmsg);
							} else if(jsonData.events[i].group == "Key Items"){
								curmsg = '👜 **Item obtained:** '+jsonData.events[i].name+' at '+diff.days+'d '+diff.hours+'h '+diff.minutes+'m '+diff.seconds+'s.\n';
								msg = msg.concat(curmsg);
							} else {
								curmsg = '<@'+message.author.id+'> I can\'t read this event.\n'
								msg = msg.concat(curmsg);
							}
							console.log(allpoint);
							allpoint++;
			//if it's getting too long send the front part and shorten it
							if(msg != ""){
								if(msg.length > msglen && msg.length > 0){
									message.channel.send(msg.substring(0, msglen));
									msg = msg.substring(msglen, msg.length);
								}
							}
							
							
						}
						if(msg !=""){
							// if(query == "all.ping"){
							// 	msg = msg.concat("\n <@"+message.author.id+">");
							// }
							message.channel.send(msg);
//idk wtf all this is what were you doing
							// for(i = 0; i <= msg.length; i+=msglen){
							// 	var lilmsg = msg.substring(i,i+msglen);
							// 	trimmedmsg.push(lilmsg);
							// 	msgpoint = i;
							// 	//console.log(i);
							// }
							// for(k = trimpoint; k < trimmedmsg.length; k++){
							// 	message.channel.send(trimmedmsg[k]);
							// 	trimpoint++;
							// }
							// console.log(msgpoint);
							// console.log(msg.length);

							// if(msgpoint >= msg.length - msglen){
							// 	msgpoint = msg.length;
							// }
							// // console.log(allpoint);
							// // console.log(trimmedmsg.length);
							// console.log(msgpoint+"is msgpoint now");
							// console.log(trimpoint);
							// console.log(trimmedmsg.length);
							// console.log(lilmsg);
						}
					}

					} catch(err) {
						var errdate = new Date();
						console.log(err+"\n"+errdate.getTime());
					}
		 	}, 60 * 1000);


		} 
		

		/*RUN STUFF
		INCLUDES:
			-Check for badge gains
			-Check for new Pokedex entries
			-WORK IN PROGRESS: Check party (maybe do this every 1 hour? so i guess put this in different interval?)
			-"ALL" - you'll be using this one most the time
				new badges; new pkmn; first visits; trainers defeated/undefeated (NOTE: e4 doesn't work very well); blackouts*/ 
		

			
	}

	else {
		message.channel.send('Not a command. :(');
	}
});

client.login(token);