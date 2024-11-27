import { createCanvas, loadImage } from 'canvas'
const canvas = createCanvas(200, 200);
const ctx = canvas.getContext("2d");
import QRCode from 'qrcode'
import * as fs from "node:fs";
import * as path from 'node:path'


export async function generateQr(invoice:string, username:string, timestamp:number){

    QRCode.toCanvas(canvas, invoice,  (error)=> {
        if (error) console.error(error)
        console.log('success!');
    })
    const logo = await loadImage(path.join(__dirname, '..', 'static', 'logo.svg'));
    ctx.drawImage(logo, canvas.width/2-logo.width/2, canvas.height/2-logo.height/2, );
    const filePath = path.join(__dirname, '..', 'temp', `${username}_${timestamp}.jpeg`);
    const out = fs.createWriteStream(filePath);
    const stream = canvas.createJPEGStream();
    stream.pipe(out);

    out.on('finish', () =>  {
        console.log(`saved qr`!);
    });
}