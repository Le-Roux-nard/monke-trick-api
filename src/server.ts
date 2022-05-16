import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import bodyParser from "body-parser";

import { init, collections } from "./database/dbConnection";
import { config } from "dotenv";
import { shortenerResult, zeroWidthShortener } from "./ZeroWidthShortener.class";
import CustomRequest from "./customRequest.interface";
import * as Swagger from "swagger-ui-express";
import { generateEmbed } from "./embed";

import setupRouter from "./router";

config({ path: "../.env" });

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/static", express.static("../static"));
app.set("views", "../views");
app.set("view engine", "ejs");

const httpServer = createServer(app);

app.get("/", (req, res) => {
	res.render("monke/index", { baseUrl: req.baseUrl });
});

const swaggerOptions = {
	customCss: ".swagger-ui .topbar { display: none }",
	customSiteTitle: "Documentation",
	customfavIcon: "/assets/img/favicon.ico",
};
const swaggerDoc = require("../swagger.json");

app.use("/docs", Swagger.serve, Swagger.setup(swaggerDoc, swaggerOptions));

app.use("*", (req: Request, res: Response, next: NextFunction) => {
	if (collections.urls) {
		(req as CustomRequest).collection = collections.urls;
		next();
	} else {
		res.status(500).send("An Error Occured");
	}
});

app.get("/create", (req: Request, res: Response) => {
	return res.render("monke/create", { baseUrl: req.baseUrl });
});

app.post("/create", async (req, res: Response) => {
	if (!req.body.picture || !req.body.video) return res.status(400).send("Missing picture or video");
	const collection = (req as CustomRequest).collection;
	let shortenerResult: shortenerResult = zeroWidthShortener.generateUrl();
	await collection?.insertOne(
		{
			key: shortenerResult.decodedUrl,
			picture: req.body.picture,
			video: req.body.video,
		},
		(err, result) => {
			if (err) {
				res.status(500).send("An Error Occured");
			} else {
				res.status(200).send({
					shortUrl: `${req.headers.origin}/${shortenerResult.encodedUrl}`,
				});
			}
		}
	);
});

app.get("/:zeroWidth", async (req: Request, res: Response) => {
	let decoded = zeroWidthShortener.decode(req.params.zeroWidth);
	const collection = (req as CustomRequest)?.collection;
	if (!collection) {
		return res.status(500).send("An Error Occured");
	}
	collection.findOne({ key: decoded }, (err, result) => {
		if (err || !result) {
			return res.status(500).send("An Error Occured");
		} else {
			return res.status(200).send(generateEmbed(result.video, result.picture));
		}
	});
});

let port = process.env.PORT ?? 8081;
init().then(() => {
	app.use("/prout", setupRouter({ collection: collections.urls }));

	httpServer.listen(port, () => {
		console.log(`Monke API started on port ${port}`);
	});
});
