const debug = require('debug')("jsensei");
const Telegraf = require('telegraf')
const JTranslate = require('./translate');

const scheduleUrl = "https://goo.gl/3aNohw";

const bot = new Telegraf(process.env.BOT_TOKEN, {username: 'jsenseibot'});

//start debugging
const name = 'jsensei';
debug('boot %s',name);

bot.start((ctx) => {
	console.log('started:', ctx.from.id)
	return ctx.reply('Welcome!')
});

//bot hears "translate-" or "Translate-"
bot.hears(/\b([Tt]ranslate)\b-/, (ctx) => {
	var message = ctx.message.text;
	debug("====================================");
	debug("Received message '" + message + "'");
	var translateSvc = new JTranslate();
	translateSvc.translate(message).then(response => {
		ctx.reply(response);
		debug("====================================");
	});
});
bot.hears('hi', (ctx) => ctx.reply("I'm awake, i'm awake!"));

//Return image of current schedule
bot.command('getschedule', (ctx) => ctx.reply(scheduleUrl));

// bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy!'))
// bot.on('sticker', (ctx) => ctx.reply('👍'))

bot.startPolling();

