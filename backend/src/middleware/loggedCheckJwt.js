import { checkJwt } from "./checkJwt.js";

export function loggedCheckJwt(req, res, next) {
  console.log("🔎 checkJwt start:", {
    method: req.method,
    path: req.originalUrl,
    headers: {
      authorization: req.headers.authorization || null,
    },
  });

  checkJwt(req, res, (err) => {
    if (err) {
      console.error("❌ checkJwt error on:", {
        method: req.method,
        path: req.originalUrl,
        name: err.name,
        message: err.message,
      });
      // Laat de error gewoon door Express afhandelen
      return next(err);
    }

    console.log("✅ checkJwt ok:", {
      method: req.method,
      path: req.originalUrl,
    });

    next();
  });
}

