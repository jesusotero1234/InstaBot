const {instagram,instagramUser,writeUserData} = require('./app.js');
// const {writeUserData} = require('./firebase');





(async ()=>{

   
    await instagram.initialize() 
    try {
        await instagram.botcreation()
    } catch (error) {
        await instagram.login('rokkavespa','147368')
    }
   
    await instagram.usernameLike('nanytatoledo')
    await instagram.usernameFollow('nanytatoledo')
    writeUserData(instagramUser)
    // await instagram.login('robocop20190','147369')
 
   
    //  catch{writeUserData(instagramUser)
    console.log('finished')
    

    })()