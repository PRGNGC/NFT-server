import { Router } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import { Character } from "../mongoose/schemas/characterSchema.mjs";
import jwt from "jsonwebtoken";
import { checkTokens } from "../middleware/checkTokens.mjs";
import { renewTokens } from "../middleware/renewTokens.mjs";

const router = Router();

router.get("/api/own/characters", checkTokens, renewTokens, async (req, res) => {
  console.log("characters");

  if(res.locals.restart){
    res.clearCookie("refreshToken");
    return res.sendStatus(440);
  }

  if(res.locals.login){
    return res.sendStatus(401);
  }

  const accessToken = res.locals.refresh ? res.locals.newAccessToken : req.headers.authorization.split(" ")[1];
  const refreshToken = res.locals.refresh ? res.locals.newRefreshToken : req.headers.cookie.split("=")[1];

  const accessTokenInfo = jwt.verify(accessToken, process.env.ACCESS_SIGNATURE_SECRET);

  const accessTokenAge = accessTokenInfo.exp;

  const userLogin = accessTokenInfo.login;

  const user = await User.findOne({login: userLogin});

  const charactersOfUser = user.nfts.characters;

  const limit = 5;

  if (req.query.search) {
    const nextSearchIndex = req.query.nextSearchIndex;

    const query = req.query.search;

    let lastIndex = req.query.page;

    let charactersWithQuery = [];

    for (let i = nextSearchIndex; i < charactersOfUser.length; i++) {
      if (charactersWithQuery.length === 5) break;

      if (
        charactersOfUser[i].nftName.toLowerCase().includes(query.toLowerCase()) &&
        charactersWithQuery.length <= limit - 1
      ) {
        charactersWithQuery.push(charactersOfUser[i]);
        lastIndex = i;
      }
    }

    res.cookie("refreshToken", refreshToken, {
      maxAge: process.env.REFRESH_TOKEN_TIMESTAMP,
      httpOnly: true,
      // sameSite: "strict",
      // secure: true,
      // path: '/'
    });

    return res.json({
      nfts: charactersWithQuery,
      nextSearchIndex: lastIndex + 1,
      accessToken: accessToken,
      expiresAt: accessTokenAge
    });
  }

  const page = req.query.page - 1;

  res.cookie("refreshToken", refreshToken, {
    maxAge: process.env.REFRESH_TOKEN_TIMESTAMP,
    httpOnly: true,
    // sameSite: "strict",
    // secure: true,
    // path: '/'
  });

  return res.json({

    nfts: charactersOfUser.filter(
      (_, index) => index >= page * limit && index <= page * limit + limit - 1
    ),
    accessToken: accessToken,
    expiresAt: accessTokenAge
  }
    
  );
});

router.post("/api/own/characters/add", checkTokens, renewTokens, async (req, res) =>{
  console.log("add")
  try{
    if(res.locals.restart){
      res.clearCookie("refreshToken");
      return res.sendStatus(440);
    }

    if(res.locals.login){
      console.log("login exit");
      return res.sendStatus(401);
    }

    console.log("out login");
    const accessToken = res.locals.refresh ? res.locals.newAccessToken : req.headers.authorization.split(" ")[1];
    const refreshToken = res.locals.refresh ? res.locals.newRefreshToken : req.headers.cookie.split("=")[1];

    const { nft } = req.body;

    const accessTokenInfo = jwt.verify(accessToken, process.env.ACCESS_SIGNATURE_SECRET);
    console.log("limestone");

    const accessTokenAge = accessTokenInfo.exp;

    const userLogin = accessTokenInfo.login;

    const user = await User.findOne({login: userLogin});

    const nftId = nft.id;

    const nftItem = await Character.findOne({ id: nftId });

    const newNftHistory = [...nftItem.history, {
      user: `@${user.name.split(" ").join("").toLowerCase()}`,
      date: `${new Date().getDate() <= 9 ? `0${new Date().getDate()}` : `${new Date().getDate()}`}.
             ${new Date().getMonth() <= 9 ? `0${new Date().getMonth() + 1}` : `${new Date().getMonth() + 1}`}.
             ${new Date().getFullYear() <= 9 ? `0${new Date().getFullYear()}` : `${new Date().getFullYear()}`}`,
      time: `${new Date().getHours() <= 9 ? `0${new Date().getHours()}` : `${new Date().getHours()}`}:
             ${new Date().getMinutes() <= 9 ? `0${new Date().getMinutes()}` : `${new Date().getMinutes()}`}
             ${new Date().getHours() >= 12 ? 'pm' : 'am'}`,
      userAvatar: user.userImg,
      actionType: "purchased",
      priceETH: nft.nftEthPrice,
    }];
    
    const newCharactersArray = [...user.nfts.characters, nft];
    
    await User.findOneAndUpdate({"login": userLogin}, { $set: { "nfts.characters" : newCharactersArray } });
    
    await Character.findOneAndUpdate({"id": nftId}, { $set: { "history" : newNftHistory } });
    
    res.cookie("refreshToken", refreshToken, {
      maxAge: process.env.REFRESH_TOKEN_TIMESTAMP,
      httpOnly: true,
      // sameSite: "strict",
      // secure: true,
      // path: '/'
    });

    return res.status(200).send({    
      accessToken: accessToken,
      expiresAt: accessTokenAge
    });
  } catch(error){
    console.log("router.post ~ error:", error)
    return res.sendStatus(500);
  }



  // try {  
    // const { nft } = req.body;
    // console.log("router.post ~ nft:", nft)
    
    // const userLogin = "login15";

    // const nftId = nft.id;
    // console.log("router.post ~ nftId:", nftId)

    // console.log("test");
    
    // const user = await User.findOne({ login: userLogin });
    // console.log("test2");
    
    // const nftItem = await Character.findOne({ id: nftId });
    // console.log("test3");
    // const nftItem = await Planet.findOne({ id: nftId });
    // console.log("router.post ~ nftItem:", nftItem)

    // const newNftHistory = [...nftItem.history, {
    //   user: `@${user.name.split(" ").join("").toLowerCase()}`,
    //   date: `${new Date().getDate() <= 9 ? `0${new Date().getDate()}` : `${new Date().getDate()}`}.${new Date().getMonth() <= 9 ? `0${new Date().getMonth()}` : `${new Date().getMonth()}`}.${new Date().getFullYear()}`,
    //   time: `${new Date().getHours()}:${new Date().getMinutes()}${new Date().getHours() >= 12 ? 'pm' : 'am'}`,
    //   userAvatar: user.userImg,
    //   actionType: "purchased",
    //   priceETH: nft.nftEthPrice,
    // }];

    // const newCharactersArray = [...user.nfts.characters, nft];

    // console.log("test4");
    // await User.findOneAndUpdate({"login": userLogin}, { $set: { "nfts.characters" : newCharactersArray } });
    // console.log("test5");

    // await Planet.findOneAndUpdate({"id": nftId}, { $set: { "history" : newNftHistory } });
    // await Character.findOneAndUpdate({"id": nftId}, { $set: { "history" : newNftHistory } });

    // console.log('here')
    // return res.sendStatus(200);
    // return res.status(200);
  // } catch (err) {
  //   console.log("router.post ~ err:", err)
  //   console.log('here2')
  //   return res.sendStatus(400);
  // }
  

})

export default router;
