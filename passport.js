const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const User = require("./models/User");
require("dotenv").config();

// Configurare opțiuni pentru strategia JWT
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrage token-ul din header-ul Authorization
  secretOrKey: process.env.JWT_SECRET, // Cheia secretă pentru validarea token-ului
};

// Strategia JWT pentru validarea utilizatorilor
passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const user = await User.findById(payload.userId);

      if (!user) {
        console.warn("⚠️ Utilizatorul asociat token-ului nu există.");
        return done(null, false);
      }

      console.log("✅ Token JWT valid. Utilizator:", user.email);
      return done(null, user);
    } catch (err) {
      console.error("❌ Eroare în strategia JWT:", err.message);
      return done(err, false);
    }
  })
);

module.exports = passport;
