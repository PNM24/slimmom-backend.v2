const passport = require("passport");
require("../passport"); // Import configurarea Passport

// Middleware pentru validarea autentificării
function validateAuth(req, res, next) {
  console.log("✅ Verificare autentificare JWT..."); // Log pentru debugging

  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      console.error("❌ Eroare în autentificare JWT:", err.message); // Log eroare
      return res.status(500).json({
        status: "error",
        code: 500,
        message: "Internal server error during authentication",
      });
    }

    if (!user) {
      console.warn("⚠️ Utilizator neautorizat sau token invalid"); // Log neautorizat
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unauthorized - Invalid or missing token",
      });
    }

    console.log("✅ Autentificare reușită pentru utilizator:", user.email); // Log succes
    req.user = user; // Atașează user-ul validat la request
    next();
  })(req, res, next);
}

// Middleware pentru autorizarea rolurilor
function authorizeRoles(...roles) {
  return (req, res, next) => {
    console.log("🔍 Verificare roluri pentru utilizator:", req.user.role); // Log pentru debugging

    if (!roles.includes(req.user.role)) {
      console.warn(
        `⛔ Acces interzis: Rol necesar - ${roles}, Rol utilizator - ${req.user.role}`
      );
      return res.status(403).json({
        status: "error",
        code: 403,
        message: "Forbidden - You do not have the required permissions",
      });
    }

    console.log("✅ Autorizare reușită pentru rol:", req.user.role); // Log succes autorizare
    next();
  };
}

module.exports = { validateAuth, authorizeRoles };
