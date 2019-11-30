const { instagram } = require('./app.js');


(async () => {

	await instagram.initialize()
	await instagram.login('robocop20190','147369')
	// await instagram.botcreation()
	// await instagram.searchUsername2('therock')
	await instagram.followUsers('therock')

})()