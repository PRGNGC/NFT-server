import { Router } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import jwt from "jsonwebtoken";
import { checkTokens } from "../middleware/checkTokens.mjs";
import { renewTokens } from "../middleware/renewTokens.mjs";
import multer from "multer";

const router = Router();
const upload = multer();
//SESSION AUTHENTICATION
// router.get("/api/user", (req, res) => {
//   const user = req.user;
//   console.log("cookie - " + req.headers.cookie);

//   if (!user) {
//     return res.status(401).json({ msg: "You are not logged in" });
//   }

//   return res.status(200).send({ user: user });
// });

//JWT AUTHENTICATION
router.get("/api/user", checkTokens, renewTokens, async (req, res) => {
  console.log("user")
  try {
    
    if(res.locals.login){
      return res.sendStatus(401);
    }

    if(res.locals.restart){
      res.clearCookie("refreshToken");
      return res.sendStatus(440);
    }

    const accessToken = res.locals.refresh ? res.locals.newAccessToken : req.headers.authorization.split(" ")[1];
    const refreshToken = res.locals.refresh ? res.locals.newRefreshToken : req.headers.cookie.split("=")[1];
    console.log("router.get ~ accessToken:", accessToken)
    console.log("router.get ~ refreshToken:", refreshToken)
    
    const accessTokenInfo = jwt.verify(refreshToken, process.env.REFRESH_SIGNATURE_SECRET);

    const accessTokenAge = accessTokenInfo.exp;

    const userLogin = accessTokenInfo.login;
    
    const user = await User.findOne({ login: userLogin });
    

    res.cookie("refreshToken", refreshToken, {
      maxAge: process.env.REFRESH_TOKEN_TIMESTAMP,
      httpOnly: true,
      // sameSite: "strict",
      // secure: true,
      // path: '/'
    });
  
    // res.setHeader("Cache-Control","s-maxage=30, stale-while-revalidate=300");

    return res.status(200).json({ 
      user,
      accessToken: accessToken,
      expiresAt: accessTokenAge
    });
  } catch (err) {
    console.log("router.get ~ err:", err)
    return res.sendStatus(500);
  }
});

router.post("/api/user/update",  checkTokens, renewTokens, upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 8 }
]), async(req, res) => {
  console.log("update");
  const files = req.files;
  console.log("router.post ~ files:", files)
  const { name, userName} = req.body;

  try{
    if(res.locals.login){
    return res.sendStatus(401);
    }

    if(res.locals.restart){
        res.clearCookie("refreshToken");
      return res.sendStatus(440);
    }

    const accessToken = res.locals.refresh ? res.locals.newAccessToken : req.headers.authorization.split(" ")[1];
    const refreshToken = res.locals.refresh ? res.locals.newRefreshToken : req.headers.cookie.split("=")[1];

    const accessTokenInfo = jwt.verify(refreshToken, process.env.REFRESH_SIGNATURE_SECRET);

    const accessTokenAge = accessTokenInfo.exp;

    const userLogin = accessTokenInfo.login;

    if(files.avatar !== undefined){
      await User.findOneAndUpdate({"login": userLogin}, { $set: { "userImg" : Buffer.from(files.avatar[0].buffer).toString('base64') } });
    }
    
    if(files.cover !== undefined){
      await User.findOneAndUpdate({"login": userLogin}, { $set: { "cover" : Buffer.from(files.cover[0].buffer).toString('base64') } });
    }

    if(name !== undefined){
      await User.findOneAndUpdate({"login": userLogin}, { $set: { "name" : name } });
    }

    if(userName !== undefined){
      await User.findOneAndUpdate({"login": userLogin}, { $set: { "username" : userName } });
    } 

    res.cookie("refreshToken", refreshToken, {
      maxAge: process.env.REFRESH_TOKEN_TIMESTAMP,
      httpOnly: true,
      // sameSite: "strict",
      // secure: true,
      // path: '/'
    });

    return res.status(200).json({
      accessToken: accessToken,
      expiresAt: accessTokenAge
    });
  }
  catch(error){
    console.log("router.patch ~ error:", error)
    return res.sendStatus(500);
  }
})

export default router;
