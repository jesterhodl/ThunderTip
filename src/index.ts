import {connect, createInvoice, deleteConnection, updateConnection} from "./handlers/conversationHandlers";
import {conversations, createConversation } from "@grammyjs/conversations";
import express from 'express'
import {
    handleStart,
    handleHelp,
    handleConnection,
    handleTip,
    handleBalance,
    handleNwcInfo, handleInlineKeyboards
} from './handlers/commandHandlers';
import bot from './config/botConfig'
import {session} from "grammy";
import {OWNER_ID, PORT} from "./constants";



try{
//set up express server, for heroku
    const app = express();
    app.listen(PORT)

//use middlewares for conversations
    bot.use(session({initial: () => ({})}));
    bot.use(conversations());
    bot.use(createConversation(connect, "connectNWC"));
    bot.use(createConversation(updateConnection, "updateConnection"));
    bot.use(createConversation(deleteConnection, "deleteConnection"));
    bot.use(createConversation(createInvoice, "invoice"));

//handle commands
    bot.command('start', handleStart);
    bot.command('help', handleHelp);
    bot.command('connection', handleConnection);
    bot.command('tip', handleTip);
    bot.command('balance', handleBalance);
    bot.command('nwc', handleNwcInfo);
    bot.command('invoice', async (ctx)=> await ctx.conversation.enter("invoice"))
    //handle inline keyboards in way allowing multi-use of one keyboard
    bot.on("callback_query:data", handleInlineKeyboards)

    //send unhandled errors to bot owner - for debugging process
    bot.catch(async (err) => {
        const message = await bot.api.sendMessage(parseInt(OWNER_ID), err.name + " " + err.message);
        console.trace(err)
    });
    bot.start();

} catch (e){
    console.trace(e);
}