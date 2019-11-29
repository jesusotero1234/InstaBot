const {instagram} = require('./app.js');


(async ()=>{

    await instagram.initialize() 
    await instagram.botcreation()
    await instagram.searchUsername2('therock')
    await instagram.followUsers('therock')
    // await instagram.login('robocop20190','147369')
    
    })()