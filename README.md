# drivebot
hello 🐛 this is code for my live updater bot for twitch plays pokemon

feel free to make fun of my code because it is made of spaghetti. i coded this a year ago. do not code like me

## things this bot can announce
  - trainer battles
  - beating an important trainer
  - catching a pokemon
  - getting important items, including badges
  - visiting a new area
  - changing between areas
  - change in amount of money/amount of various pokeballs
  - changes to party (evolution, a mon leaving the party, etc)
  - i hear sidegame isn't a thing anymore but there's still post-sidegame-screenshots code if that becomes useful

## things this bot cannot announce
  - PC-related changes
    -  i started coding this part during randoblack 2 and ran out of steam for obvious reasons lol. i'm leaving the broken code in there if you want to play with it
    -  however it will at least tell you if a pokemon leaves the party
  -  daycare-related changes
  -  picking up regular items
  -  regular pokemon battles

it checks for updates every minute, so don't be alarmed if you don't see an update right away

# how to set up
  - setting up a bot: https://discordjs.guide/ . notably, the part called "Creating configuration files." you'll need a config.json or some other way of not just slamming your token directly into the main code ~~like i did~~
  - there's a bit in the code that says **message.author.id**, followed by a number. replace the number with your own ID which you can find like this https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-
    - this is how i made drive only respond to me
    - there is almost certainly a better way to do this. feel free to replace
  - near the top there's a thing called **runstart**. change this to the time that, uh, the run starts

## how to use
  - `node index.js`
  - when your bot's awake, send 3 separate messages in your updater channel that are like this:
    - !drive all
    - !drive party
    - !drive special
    
  - feel free to recode so you only need to send one lol
    - also don't forget it's set to only check every 60 seconds, to be polite to the API. so you have to sit there and wait a lil
  
  - there's a thing near the top called **allpoint**
    - imagine this is a really long run so the API says 1001 Events have happened, and you have to turn your bot off in the middle. when you restart your bot, it would spit out all 1001 of those events. instead of figuring out how to write good code you can set **allpoint** to 1000 and it'll just skip you to the end
     - or you can be unlike me and write good code. idk i selftaught most of this in a 24-hour red/green/blue race haze. again feel free to make fun of me it's fine
    
## uhhhh thats it?
message me (denne/faeiri#2364) if something doesn't work

yea thats it thanks
