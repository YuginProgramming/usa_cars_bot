import bot from "./app.js";

let customerPhone;
let customerName;
let budget;
let year;


const phrases = {
    greetings: 'Вітаємо ! Це чат-бот компанії "AutoCar - Авто зі США" 🇺🇸',
    contactRequest: 'Нам потрібні ваші контактні дані. Отримати з контактних даних телеграм?',
    dataConfirmation: `Ваш номер телефону: ${customerPhone}. Ваше імя ${customerName}. Дані вірні?`,
    thanksForOrder: `Ваші дані відправлені. Дякуємо ${customerName} за звернення. Менеджер звʼяжеться з Вами найближчим часом.`,
    phoneRequest: 'Введіть ваш номер телефону, та відправте повідомлення',
    bugetQuestion: 'В який, приблизно, бюджет Вам підібрати автомобіль?',
    yearQuestion: 'Яких років Вам підібрати автомобіль?',
    confirmation: `✅ Дані підтверджено. Обрано сегмент підбору ${budget}, ${year}`,
    callback: 'Будь ласка, відправте свій контакт для звʼязку з вами.'
  };

const keyboards = {
    startingKeyboard: [['🚙 Підібрати авто', '📞 Звʼяжіться зі мною']],
    enterPhone: [ ['/start'] ],
    surveyQuestion1: [['💰7000$ - 10000$', '💰10000$ - 15000$'], 
    ['💰15000$ - 20000$', '💰+20000']
  ],
    surveyQuestion2: [['📅2005 - 2010', '📅2010 - 2015'],
    ['📅2015 - 2020', '📅2020 - 2023']],
    calculation: { inline_keyboard: [
        [{ text: 'Замовити прорахунок', callback_data: '/calculation' }],
    ]}
}  

const submitYear = async (text, chatId) => {
    const removedEmoji = text.replace('📅', '');
    year = removedEmoji;
    bot.sendMessage(chatId, `✅ Дані підтверджено. Обрано сегмент підбору ${budget}, ${year}`, {
        reply_markup: {
            keyboard: [[{ text: 'Отримати підбірку', request_contact: true }]],
            resize_keyboard: true,
            one_time_keyboard: true,
          }
    })
};

const submitBudget = async (text, chatId) => {
    const removedEmoji = text.replace('💰', '');
    budget = removedEmoji;
    bot.sendMessage(chatId, phrases.yearQuestion, {
        reply_markup: {keyboard: keyboards.surveyQuestion2}})
};

export {
    phrases,
    keyboards,
    submitYear,
    submitBudget,
    budget,
    year
}
