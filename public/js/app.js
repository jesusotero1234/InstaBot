const puppeteer = require('puppeteer');
const generator = require('generate-password');
const scrollPageToBottom = require('puppeteer-autoscroll-down')
const URL = 'https://www.instagram.com'
const BOTURL = 'https://tempmail.net/en/'
const moment = require('moment')
const firebase = require('firebase')
const admin = require('firebase-admin');
const uuid4 = require('uuid4')

const instagramUser = {
    botEmail: '',
    botUsername: 'rokkavespa',
    botPassword: '147369',
    usernameLike: '',
    usernameFollow: '',
    followers: '',
    photosLiked: 0,
    photosAlreadyLiked: 0
}

var serviceAccount = require("../../instabot-4035c-firebase-adminsdk-8g55n-6c59aab2c7.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://instabot-4035c.firebaseio.com"
});

function writeUserData(instagramUse) {

    admin.database().ref('instagramUse').child(`${moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a")}`).set({
        instagramUse
    })
}

const instagram = {
    browser: null,
    page: null,

    initialize: (async () => {

        instagram.browser = await puppeteer.launch({ headless: false });
        // instagram.page = await instagram.browser.newPage();
        instagram.context = await instagram.browser.createIncognitoBrowserContext();
        // // Create a new page in a pristine context.
        instagram.page = await instagram.context.newPage();
    }),

    login: (async (username, password) => {
        await instagram.page.goto(URL, { waitUntil: 'networkidle2' });
        //Search for the switch account
        await instagram.page.waitFor(2000)
        let logInButtonSwitch = await instagram.page.$x('//a[contains(text(),"Log in")]');
        await logInButtonSwitch[0].click();
        // introduce username and password
        await instagram.page.waitFor(1000)
        await instagram.page.type('input[name="username"]', username, { delay: 50 })
        await instagram.page.type('input[name="password"]', password, { delay: 50 })
        //Click on Log in
        let logInButton = await instagram.page.$x('//button[@type="submit"]');
        await logInButton[0].click();
        // await instagram.page.waitFor(3000);
        //Click not now if needed
        await instagram.page.waitFor('//button[text()="Not Now"]')
        let clickNotNow = await instagram.page.$x('//button[text()="Not Now"]');
        if (clickNotNow) { await clickNotNow[0].click() }

    }),
    searchUsername: (async (userSearch) => {
        await instagram.page.goto(`${URL}/${userSearch}`, { waitUntil: 'networkidle2' });
        await instagram.page.waitFor(3000)

        //click first picture
        let firstPicture = await instagram.page.$$('article > div:nth-child(1) img[decoding="auto"]')
        await firstPicture[0].click()
        await instagram.page.waitFor(3000)
        //like picture
        await instagram.page.waitFor('span[aria-label="Like"]')
        await instagram.page.waitFor(1000)

        let likePicture = await instagram.page.$$('span[aria-label="Like"]')
        await likePicture[0].click()
        await instagram.page.waitFor(1000)
        let nextImage = await instagram.page.$x('//a[contains(text(),"Next")]')
        await nextImage[0].click()

        //Do likes until the last picture
        do {
            await instagram.page.waitFor('span[aria-label="Like"]')
            await instagram.page.waitFor(1000)

            let likePicture = await instagram.page.$$('span[aria-label="Like"]')
            await likePicture[0].click()
            await instagram.page.waitFor(1000)
            let nextImage = await instagram.page.$x('//a[contains(text(),"Next")]')
            await nextImage[0].click()
        } while (await instagram.page.$x('//a[contains(text(),"Next")]'));
        debugger

    }),
    usernameLike: (async (userSearch) => {
        await instagram.page.goto(`${URL}/${userSearch}`, { waitUntil: 'networkidle2' });
        //click All pictures in the timeline
        await instagram.page.waitFor('article > div:nth-child(1) img[decoding="auto"]')
        let AllPictures = await instagram.page.$$('article > div:nth-child(1) img[decoding="auto"]')
        await instagram.page.waitForSelector('main[role="main"]');

        //send to Firebase
        instagramUser.usernameLike = userSearch

        //already been liked count
        let countAlreadyLiked = 0
        let countLikes = 0

        //Iterate between photos


        try {
            for (let index = 0; countLikes <= 30; index++) {
                await instagram.page.waitFor('article > div:nth-child(1) img[decoding="auto"]', { timeout: 500 })
                AllPictures = await instagram.page.$$('article > div:nth-child(1) img[decoding="auto"]')
                console.log(AllPictures)
                countLikes
                countAlreadyLiked
                await AllPictures[index].click()

                //scroll
                await instagram.page.waitFor('main[role="main"]')

                await instagram.page.$eval('main[role="main"]',(el)=>{el.scrollIntoView({ behavior: 'smooth', block: 'end' })})
                await instagram.page.waitFor(2000)

                try {

                    await instagram.page.waitFor('span[class="fr66n"]>button>span[aria-label="Like"]', { timeout: 3000 })
                    let like = await instagram.page.$eval('span[class="fr66n"]>button>span[aria-label="Like"]', (el) => { el.click() })
                    await instagram.page.waitFor(2000)
                    countLikes += 1

                } catch (error) {
                    console.log('Has been already Liked')
                    countAlreadyLiked += 1
                }

                try {
                    await instagram.page.waitFor(2000)
                    await instagram.page.waitFor('//h3[contains(text(),"Action Blocked")]', { timeout: 1000 })
                    await instagram.page.$x('//h3[contains(text(),"Action Blocked")]')
                    let checkActionBlocked = await instagram.page.$x(instagram.page.$x('//button[contains(text(),"OK")]'))
                    await checkActionBlocked[0].click()
                    await exit2[0].click()
                    //check if bot has been blocked by IG
                } catch (error) {
                    console.log('Action has not been blocked')
                    await instagram.page.waitFor('//button[contains(text(),"Close")]', { timeout: 1000 })
                    let exit = await instagram.page.$x('//button[contains(text(),"Close")]')
                    await exit[0].click()

                }


                //Exit Picture
                try {
                    // await instagram.page.waitFor(1000)
                    await instagram.page.waitFor('//button[contains(text(),"Close")]', { timeout: 1000 })
                    let exit = await instagram.page.$x('//button[contains(text(),"Close")]')
                    await exit[0].click()
                }
                catch{ console.log('Close button has been pressed already') }
                
                //scroll page
              
            
            
                console.log(index)

            }
            await instagram.page.waitFor(5000)



        } catch (error) {
            console.log(error)
            console.log(`liked photos =${countLikes}, photos already liked = ${countAlreadyLiked}`)

            //Send to firebase
            instagramUser.photosLiked = countLikes
            instagramUser.photosAlreadyLiked = countAlreadyLiked

        }
        console.log(`liked photos =${countLikes}, photos already liked = ${countAlreadyLiked}`)

        //Send to firebase
        instagramUser.photosLiked = countLikes
        instagramUser.photosAlreadyLiked = countAlreadyLiked
    }),

    usernameFollow: (async (userSearch) => {
        //Open famous person IG
        await instagram.page.goto(`${URL}/${userSearch}`, { waitUntil: 'networkidle2' });
        await instagram.page.waitFor(1000)

        //search for the followers

        try {
            const followers = await instagram.page.$x('//ul/li/a/span')
            await followers[0].click()


            userRegistry = []

            //Follow people
            await instagram.page.waitFor(500)
            await instagram.page.waitFor('//a[contains(@class,"notranslate")]')

            let countOfPeople = 0
            do {

                let usernameArray = await instagram.page.$x('//a[contains(@class,"notranslate")]')

                for (let index = 0; index < 20; index++) {
                    usernameArray = await instagram.page.$x('//a[contains(@class,"notranslate")]')
                    //Follow User
                    // const buttonArray = await instagram.page.$x('//button[contains(text(),"Follow")]')
                    // await instagram.page.waitFor(500)
                    // await buttonArray[index + 1].click()

                    //Send user to Array
                    const usernameText = (await (await usernameArray[index].getProperty('textContent')).jsonValue())
                    await userRegistry.push(usernameText)

                    countOfPeople += 1
                    countOfPeople
                    //    debugger
                    //Scroll

                    await instagram.page.evaluate(() => {
                        document.querySelector('div[class="PZuss"]').scrollIntoView({ behavior: 'smooth', block: 'end' })
                        //   window.scrollBy(0,window.innerHeight)

                    })
                    // debugger
                    await instagram.page.waitFor(2500)
                }
            }

            while (countOfPeople < 20) { }
            console.log(userRegistry)

        } catch{ console.log('not working', userRegistry) }

        //Send to Firebase
        instagramUser.followers = userRegistry
        instagramUser.usernameFollow = userSearch


    }),
    botcreation: (async () => {

        await instagram.page.goto(BOTURL, { waitUntil: 'networkidle2' });
        await instagram.page.waitFor(1000)

        //Creates a new email
        const Deletebutton = await instagram.page.$eval('div[class$="yoket-link"]', (el) => { return el.click() })
        await instagram.page.waitFor(3000)


        const email = await instagram.page.$eval('input[id="eposta_adres"]', (el) => { return el.value })

        const getUserName = ((email) => {
            //    debugger
            let number = email.indexOf('@')

            let username = email.substr(0, number)
            return username
        })

        const password = generator.generate({
            length: 10,
            numbers: true
        });
        // go to Instgram
        await instagram.page.goto(URL, { waitUntil: 'networkidle2' });
        await instagram.page.waitFor(1000)

        //Fill the data
        await instagram.page.type('input[name="emailOrPhone"]', email, { delay: 50 })
        instagramUser.botEmail = email

        await instagram.page.type('input[name="fullName"]', getUserName(email), { delay: 50 })



        const botUsername = await instagram.page.type('input[name="username"]', getUserName(email), { delay: 50 })
        instagramUser.botUsername = getUserName(email)

        const botPassword = await instagram.page.type('input[name="password"]', password, { delay: 50 })
        instagramUser.botPassword = password

        await instagram.page.waitFor(1000)

        try {
            const buttonArray = await instagram.page.$x('//button[contains(text(),"Sign up")]')
            await buttonArray[0].click()

        } catch (error) {
            const buttonArray = await instagram.page.$x('//button[contains(text(),"Next")]')
            await buttonArray[0].click()
        }

        try {
            await instagram.page.waitFor(1500)
            const clickAbove18 = await instagram.page.$eval('input[value="above_18"]', (el) => (el.click()))
            await instagram.page.waitFor(4000)
            const buttonArray1 = await instagram.page.$eval('div[role="dialog"] >div button[class*="sqdOP"]', (el) => (el.click()))
        } catch{ console.log('Bot ready or failed caused IG blocked the IP') }
        // await instagram.page.waitFor('//input[contains(text(),"18 or older"',{timeout: 1000})

        try {
            await instagram.page.waitFor(4000)
            await instagram.page.waitFor('//button[text()="Not Now"]', { timeout: 500 })
            let clickNotNow = await instagram.page.$x('//button[text()="Not Now"]');
            if (clickNotNow) { await clickNotNow[0].click() }
        } catch (error) { }

        await instagram.page.waitFor(500)
        const check = await instagram.page.$x('//p[text()="Sorry, something went wrong creating your account. Please try again soon."]')

        if (check) {
            instagramUser.botUsername = 'robocop20190'
            instagram.botPassword = '147369'
            throw new Error('Not possible to create Bot now')
        }



    })
}


module.exports = { instagram, instagramUser, writeUserData }

