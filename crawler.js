import bot from "./app.js";
import { getSpreadsheetData } from "./filedata.js";
import { getData, formattedMessages } from "./filter.js";
import { dataBot } from './values.js';

const getArrayFromColumn = async (spreadsheetId, sheetName, columnName) => {
    const data = await getSpreadsheetData(spreadsheetId, `${sheetName}!${columnName}:${columnName}`);
    return data.values.map(row => row[0]);
};

const crawler = async (spreadsheetId, sheetName, triggerColumn) => {
  // Get array of trigger values in column
  const triggerArray = await getArrayFromColumn(spreadsheetId, sheetName, triggerColumn);
        
  // Find row numbers where trigger value is резерв
  const rowNumbers = triggerArray
    .map((value, index) => value === "reserve" ? index + 1 : null)
    .filter(value => value !== null);    
    if (rowNumbers.length > 0) {
      return false;
    } else {
      return true;
    }
};
  
const crawlerRaw = async (spreadsheetId, sheetName, triggerColumn) => {
  // Get array of trigger values in column
  const triggerArray = await getArrayFromColumn(spreadsheetId, sheetName, triggerColumn);
  
  // Find row numbers where trigger value is резерв
  const rowNumbers = triggerArray
    .map((value, index) => value === "reserve" ? index + 1 : null)
    .filter(value => value !== null);
    
  // Get row data for each row number
  const rowPromises = rowNumbers.map(rowNumber => {
    const range = `${sheetName}!A${rowNumber}:G${rowNumber}`;
    return getSpreadsheetData(spreadsheetId, range);
  });
  
  const rowDataArray = await Promise.all(rowPromises);
  
  // Print row data to console
  rowDataArray.forEach(rowData => {
    if (rowData.values && rowData.values.length > 0) {
      //console.log(rowData.values[0].join("\t"));
    }
  });
};

const crawlerStatusNew = async (spreadsheetId, sheetName, triggerColumn) => {
  // Get array of trigger values in column
  const triggerArray = await getArrayFromColumn(spreadsheetId, sheetName, triggerColumn);
        
  // Find row numbers where trigger value is резерв
  const rowNumbers = triggerArray
    .map((value, index) => value === "new" ? index + 1 : null)
    .filter(value => value !== null);    
    if (rowNumbers.length > 0) {
      return false;
    } else {
      return true;
    }
};

//ВИКОРИСТОВУЄТЬСЯ!!!
const sendNewRowsToTgByPrice710 = async (spreadsheetId, sheetName, columnName, chatId, bot) => {
  const getStatusData = await  getArrayFromColumn(spreadsheetId, sheetName, columnName);
  const newRows = getStatusData
    .map((value, index) => value === "new" ? index + 1 : null)
    .filter(value => value !== null);
  const rowPromises = newRows.map(rowNumber => getSpreadsheetData(spreadsheetId, `${sheetName}!A${rowNumber}:G${rowNumber}`));
  const rowDataArray = await Promise.all(rowPromises);
  // Build row text for each row data
  // rowDataArray.forEach((rowData, index) => {
  //     const rowNumber = newRows[index];
  //     const rowText = `🚗 Варіант Авто  ${rowNumber} \n ${rowData.values[0][0]} \n ${rowData.values[0][1]} \n ${rowData.values[0][2]} \n ${rowData.values[0][3]} \n ${rowData.values[0][4]} \n ${rowData.values[0][5]}`;; // Adds a smiley emoji
  //     bot.sendMessage(chatId, rowText, { reply_markup: { inline_keyboard: [[{ text: "⭐ Детальніше про це авто", callback_data: `${rowNumber}` }]] } });
  // });
  //фильтр тестовый по цене 
  rowDataArray.forEach(async (rowData, index) => {
    const rowNumber = newRows[index];
    const price = parseFloat(rowData.values[0][5]); // Assuming the price is in column F (index 5)
if (!isNaN(price) && price >= 7000 && price <= 10000) {
  const rowText = `🚗 Варіант Авто  ${rowNumber} \n \n ✅ Марка/модель: ${rowData.values[0][0]} \n ✅ Двигун: ${rowData.values[0][1]} \n ✅ Привід: ${rowData.values[0][2]} \n ✅ Пробіг: ${rowData.values[0][3]} \n ✅ Рік: ${rowData.values[0][4]} \n \n 💲 Ціна: ${rowData.values[0][5]} \n \n ${rowData.values[0][6]}`;;
  await bot.sendMessage(chatId, rowText, { reply_markup: { inline_keyboard: [[{ text: "⭐ Детальніше про це авто", callback_data: `${rowNumber}` }]] } });
}
  });
};

const sendNewRowsTgByPrice1015 = async (chatId, bot) => {
  
  // Join the formatted messages with line breaks
  const carMessage = formattedMessages.join('\n');

  await bot.sendMessage(chatId, carMessage);
}

// const sendNewRowsTgByPrice1015 = async (spreadsheetId, sheetName, columnName, chatId, bot) => {
//   const getStatusData = await  getArrayFromColumn(spreadsheetId, sheetName, columnName);
//   const newRows = getStatusData
//     .map((value, index) => value === "new" ? index + 1 : null)
//     .filter(value => value !== null);
//   const rowPromises = newRows.map(rowNumber => getSpreadsheetData(spreadsheetId, `${sheetName}!A${rowNumber}:G${rowNumber}`));
//   const rowDataArray = await Promise.all(rowPromises);
//   //фильтр тестовый по цене 
//   rowDataArray.forEach(async (rowData, index) => {
//     const rowNumber = newRows[index];
//     const price = parseFloat(rowData.values[0][5]); // Assuming the price is in column F (index 5)
// if (!isNaN(price) && price >= 10000 && price <= 15000) {
//   const rowText = `🚗 Варіант Авто  ${rowNumber} \n \n ✅ Марка/модель: ${rowData.values[0][0]} \n ✅ Двигун: ${rowData.values[0][1]} \n ✅ Привід: ${rowData.values[0][2]} \n ✅ Пробіг: ${rowData.values[0][3]} \n ✅ Рік: ${rowData.values[0][4]} \n \n 💲 Ціна: ${rowData.values[0][5]} \n \n ${rowData.values[0][6]}`;;
//   await bot.sendMessage(chatId, rowText, { reply_markup: { inline_keyboard: [[{ text: "⭐ Детальніше про це авто", callback_data: `${rowNumber}` }]] } });
// }
//   });
// };

const sendNewRowsTgByPrice1520 = async (spreadsheetId, sheetName, columnName, chatId, bot) => {
  const getStatusData = await  getArrayFromColumn(spreadsheetId, sheetName, columnName);
  const newRows = getStatusData
    .map((value, index) => value === "new" ? index + 1 : null)
    .filter(value => value !== null);
  const rowPromises = newRows.map(rowNumber => getSpreadsheetData(spreadsheetId, `${sheetName}!A${rowNumber}:G${rowNumber}`));
  const rowDataArray = await Promise.all(rowPromises);
  //фильтр тестовый по цене 
  rowDataArray.forEach(async (rowData, index) => {
    const rowNumber = newRows[index];
    const price = parseFloat(rowData.values[0][5]); // Assuming the price is in column F (index 5)
if (!isNaN(price) && price >= 15000 && price <= 20000) {
  const rowText = `🚗 Варіант Авто  ${rowNumber} \n \n ✅ Марка/модель: ${rowData.values[0][0]} \n ✅ Двигун: ${rowData.values[0][1]} \n ✅ Привід: ${rowData.values[0][2]} \n ✅ Пробіг: ${rowData.values[0][3]} \n ✅ Рік: ${rowData.values[0][4]} \n \n 💲 Ціна: ${rowData.values[0][5]} \n \n ${rowData.values[0][6]}`;;
  await bot.sendMessage(chatId, rowText, { reply_markup: { inline_keyboard: [[{ text: "⭐ Детальніше про це авто", callback_data: `${rowNumber}` }]] } });
}
  });
};
const sendNewRowsTgByPrice20 = async (spreadsheetId, sheetName, columnName, chatId, bot) => {
  const getStatusData = await  getArrayFromColumn(spreadsheetId, sheetName, columnName);
  const newRows = getStatusData
    .map((value, index) => value === "new" ? index + 1 : null)
    .filter(value => value !== null);
  const rowPromises = newRows.map(rowNumber => getSpreadsheetData(spreadsheetId, `${sheetName}!A${rowNumber}:G${rowNumber}`));
  const rowDataArray = await Promise.all(rowPromises);
  //фильтр тестовый по цене 
  rowDataArray.forEach(async (rowData, index) => {
    const rowNumber = newRows[index];
    const price = parseFloat(rowData.values[0][5]); // Assuming the price is in column F (index 5)
if (!isNaN(price) && price >= 20000) {
  const rowText = `🚗 Варіант Авто  ${rowNumber} \n \n ✅ Марка/модель: ${rowData.values[0][0]} \n ✅ Двигун: ${rowData.values[0][1]} \n ✅ Привід: ${rowData.values[0][2]} \n ✅ Пробіг: ${rowData.values[0][3]} \n ✅ Рік: ${rowData.values[0][4]} \n \n 💲 Ціна: ${rowData.values[0][5]} \n \n ${rowData.values[0][6]}`;;
  await bot.sendMessage(chatId, rowText, { reply_markup: { inline_keyboard: [[{ text: "⭐ Детальніше про це авто", callback_data: `${rowNumber}` }]] } });
}
  });
};

export {
  crawler,
  crawlerRaw,
  getArrayFromColumn,
  getSpreadsheetData,
  crawlerStatusNew,
  sendNewRowsToTgByPrice710,
  sendNewRowsTgByPrice1015,
  sendNewRowsTgByPrice1520,
  sendNewRowsTgByPrice20
};