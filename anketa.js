import bot from "./app.js";
import { dataBot } from './values.js';
import axios from 'axios';
import { filterCars } from './filter.js';
import { phrases, keyboards, submitBudget, submitYear, budget, year } from './leguage.js';

let customerPhone;
let customerName;

export const anketaListiner = async() => {
    bot.on('callback_query', (query) => {
        const callback = query.data;
        const chatId = query.message.chat.id;

        if (callback == '/calculation') {
            bot.sendMessage(dataBot.channelId, `CALCULATION: ${customerPhone}, ${customerName}`);
            bot.sendMessage(chatId, `✅Вашу заявку на прорахунок прийнято🙌`);
        }
    });

    bot.on('message', async (msg) => {
        let chatId = msg.chat.id;
        const text = msg.text;   

        switch (msg.text) {
            case '/start':
                bot.sendMessage(chatId, phrases.greetings, {
                    reply_markup: {
                      keyboard: keyboards.startingKeyboard,
                      resize_keyboard: true,
                      one_time_keyboard: true,}})
                break;
            
            case '🚙 Підібрати авто':
                bot.sendMessage(chatId, phrases.bugetQuestion, {
                    reply_markup: {keyboard: 
                      keyboards.surveyQuestion1,
                      resize_keyboard: true,
                      one_time_keyboard: true,}})
                break;
            
            case '💰7000$ - 10000$':
            case '💰10000$ - 15000$':
            case '💰15000$ - 20000$':
            case '💰20000$ - 30000$':
                await submitBudget(text, chatId);
                break;

            case '📅2005 - 2010':
            case '📅2010 - 2015':
            case '📅2015 - 2020':
            case '📅2020 - 2023':
                await submitYear(text, chatId);
                break; 
            case '📞 Звʼяжіться зі мною':
                bot.sendMessage(chatId, phrases.callback, keyboards.sendContact);
                break; 
        }
        if (msg.contact) {
            customerPhone = msg.contact.phone_number;
            customerName = msg.contact.first_name;

            if(!(budget || year)) {
              bot.sendMessage(dataBot.channelId, `Callback: ${customerPhone, customerName}`);
              return;
            };

            await bot.sendMessage(dataBot.channelId, ` ${customerPhone} ${customerName} ${budget} ${year}`);
                
            const filteredCarMessages = await filterCars(budget, year);

            if (filteredCarMessages.length === 0) {
              await bot.sendMessage(chatId, phrases.nodata, keyboards.sendContact);
            };

            const formattedMessages = filteredCarMessages.map((lot, index) => {
                const rowText = 
                    `🚗 Варіант Авто ${index + 1}\n` +
                    `✅ Марка/модель: ${lot[0]}\n` +
                    `✅ Двигун: ${lot[1]}\n` +
                    `✅ Привід: ${lot[2]}\n` +
                    `✅ Пробіг: ${lot[3]}\n` +
                    `✅ Рік: ${lot[4]}\n` +
                    `💲 Ціна в США: ${lot[5]}\n`;
                    
                return rowText;
            });

            async function sendMessages() {
              for (let index = 0; index < formattedMessages.length; index++) {
                  await bot.sendMessage(chatId, formattedMessages[index], { reply_markup: keyboards.calculation });
                  const response = await axios.get(filteredCarMessages[index][6], { responseType: 'arraybuffer' });
                  await bot.sendPhoto(chatId, Buffer.from(response.data));
              }
            };

            sendMessages();
        }
    })
}

