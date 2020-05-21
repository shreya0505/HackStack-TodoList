const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const config = require("config");
const clientID = config.get("google_clientID");
const clientSecret = config.get("google_clientSecret");
const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: "/auth/google/redirect",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      

      let newUser = new User({
        email: profile.email,
        name: profile.displayName,
        username: profile.given_name,
        password: "g",
        otp: "g",
        isVerified: true,
      });
      try {
        let user = await User.findOne({ email: profile.email });
        if (user) {
          
        } else {
          user = await newUser.save();
  
        }
        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);
