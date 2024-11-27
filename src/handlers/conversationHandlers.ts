import { webln } from "@getalby/sdk";
import {MyContext, MyConversation} from "../types";
import User from '../classes/User'
import supabase from "../config/supabaseConfig";
import {handleError, SenderConnectionError} from "../errors";
import {generateQr} from "../utils/generateQr";

import {InputFile} from "grammy";
import path from "node:path";
import * as fs from "node:fs";

export async function connect(conversation: MyConversation, ctx: MyContext) {
    if(!ctx.update.callback_query){
        throw new Error("No callback query in context!")
    }
    const user = await User.init(ctx.update.callback_query.from.id.toString());
    if (user.isNew) {
        await ctx.reply('To connect your wallet, send your NWC wallet connecting URI', {
            reply_markup: {
                force_reply: true, input_field_placeholder: 'Reply with your NWC connect URI',
            },
        });

        const { message } = await conversation.wait();

        if (message && message.text) {
            try {
                const connection = new webln.NWC({ nostrWalletConnectUrl: message.text });
                await user.addNwcUrl(message.text);
                await ctx.reply("Wallet connected successfully!");
            } catch (err:any) {
                await handleError(err, ctx)
            }
        }
        if (message && message.from) {
            await user.updateUsername("@" + message.from.username!);
        }
    } else {
        await ctx.reply("You're already connected. If you want to change your NWC connection URI, use the update option.");
    }
}

export async function updateConnection(conversation: MyConversation, ctx: MyContext) {
    if(!ctx.update.callback_query){
        throw new Error("No callback query in context!")
    }
    const user = await User.init(ctx.update.callback_query.from.id.toString());
    if (user.connection) {
        await ctx.reply("Please provide your new NWC URL.");
        const { message } = await conversation.wait();

        if (message && message.text) {
            await user.updateNwcUrl(message.text);
            await ctx.reply("Connection URL updated successfully!");
        } else {
            await ctx.reply("This definitely isn't an NWC URL, is it?");
        }
        if (message && message.from) {
            await user.updateUsername("@" + message.from.username!);
        }
    } else {
        await ctx.reply("Can't update a non-existing connection. Use the connect option.");
    }
}

export async function deleteConnection(conversation: MyConversation, ctx: MyContext) {
    await ctx.reply('Do you really want to delete your NWC connection?\nNo funds will be lost.\nIf yes, text me "delete my connection", if not, send anything else.');
    const { message } = await conversation.wait();
    if (message && message.text === "delete my connection") {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('telegram_user_id', message.from.id);
        if (!error) {
            await ctx.reply("Deleted. I hope to see you back!");
        } else {
            await ctx.reply("Error occurred! Please try again later.");
        }
    } else {
        await ctx.reply("Deletion aborted. What a relief!");
    }
}

export async function createInvoice( conversation: MyConversation, ctx: MyContext ){
try{

    if(!ctx.message){
        throw new Error("No message in context!")
    }

    const user = await User.init(ctx.message.from.id.toString());
    (!user.connection)&&(()=>{throw new SenderConnectionError("")})();
    await user.connection.enable();

    await ctx.reply("Alraight! How many sats do you want to receive? ⚡");
    const { message} = await conversation.wait();
    const amount = Math.ceil(Number(message?.text))
    const timestamp = Date.now();
    const username = ctx.message.from.username;
    if(!username){
        throw new Error("No username in context!")
    }

    const invoice = await user.createInvoice(amount, `Thundertip payment to ${username} via qr-code`);
    if(!invoice){
        throw new Error("No invoice!")
    }

    await ctx.reply("Your invoice:")
    await ctx.reply(invoice.paymentRequest.toString());

    await generateQr(invoice.paymentRequest.toString(), username, timestamp);
    const filePath = path.join(__dirname, '..', 'temp', `/${username}_${timestamp}.jpeg`);
    const photoMessage = await ctx.replyWithPhoto(new InputFile(filePath))

    //delete photo after sending
    if(photoMessage){
        fs.unlink(filePath, (err)=>{
            if(err){
                console.error(err);
            }else{
                console.log(`succesfully deleted file ${filePath}`);
            }
            }
        )
    }
} catch (e){
    await handleError(e as unknown as Error, ctx)
}



}