import express, { Request, Response } from "express";
import { createServer } from "http";
import bodyParser from "body-parser";

import { init, collections } from "./database/dbConnection";
import { config } from "dotenv";
import { shortenerResult, zeroWidthShortener } from "./ZeroWidthShortener.class";

config({ path: "../.env" });

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const httpServer = createServer(app);

app.get("/", (req, res) => {
	let dirName = __dirname.split("\\");
	dirName.pop();
	res.send("Hello World");
});

app.post("/create", async (req: Request, res: Response) => {
	let shortenerResult: shortenerResult = zeroWidthShortener.generateUrl();
	await collections.urls?.insertOne(
		{
			key: shortenerResult.url,
			picture: req.body.picture,
			video: req.body.video,
		},
		(err, result) => {
			if (err) {
				res.status(500).send("An Error Occured");
			} else {
				res.status(200).send({
					shortUrl: shortenerResult.shortUrl,
					hash: shortenerResult.url,
				});
			}
		}
	);
});

app.get("/:zeroWidth", async(req: Request, res: Response) => {
	let decoded = zeroWidthShortener.decode(req.params.zeroWidth);
	collections.urls?.findOne({ key: decoded }, (err, result) => {
		if (err || !result) {
			res.status(500).send("An Error Occured");
		} else {
			console.log(result);
			res.status(200).send(`
			<!DOCTYPE html>
			<head>
				<meta property="og:type" content="video.other">
				<meta property="twitter:player" content="${result.video}">
				<meta property="og:video:type" content="text/html">
				<meta property="og:video:width" content="900">
				<meta property="og:video:height" content="506">
				<meta name="twitter:image" content="${result.picture}">
				<meta http-equiv="refresh" content="0;url=${result.video}">
			</head>`);
		}
	});
});

let port = process.env.PORT ?? 8081;
init().then(() => {
	httpServer.listen(port, () => {
		console.log(`Monke API started on port ${port}`);
	});
});
