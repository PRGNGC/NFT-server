import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

//db
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

//auth
import session from "express-session";
import passport from "passport";

//routes
import charactersRouter from "./routes/characters.mjs";
import planetsRouter from "./routes/planets.mjs";
import itemsRouter from "./routes/items.mjs";
import bundlesRouter from "./routes/bundles.mjs";
import usersRouter from "./routes/users.mjs";
import authSessionsRouter from "./routes/authSessions.mjs";
import authJWTRouter from "./routes/authJWT.mjs";
import ownCharacters from "./routes/ownCharacters.mjs";
import ownPlanets from "./routes/ownPlanets.mjs";
import ownItems from "./routes/ownItems.mjs";
import ownBundles from "./routes/ownBundles.mjs";

const app = express();

app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(cookieParser());
mongoose
  .connect(
    "mongodb+srv://prgngc:www@cluster0.wdmwgw4.mongodb.net/nftBd?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("DB launched successfully"))
  .catch((e) => console.log(e));

const PORT = process.env.PORT || 4000;

app.use(
  session({
    secret: "complex password",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
      sameSite: "strict",
      secure: false, // for https - true; for http - false
      httpOnly: true,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(charactersRouter);
app.use(planetsRouter);
app.use(itemsRouter);
app.use(bundlesRouter);
app.use(usersRouter);
// app.use(authSessionsRouter);
app.use(authJWTRouter);
app.use(ownCharacters);
app.use(ownPlanets);
app.use(ownItems);
app.use(ownBundles);

app.listen(PORT, () => console.log("Server launched successfully"));
