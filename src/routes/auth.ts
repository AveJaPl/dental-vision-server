import { Router, Request, Response } from "express";
import passport from "../config/passport";
import generateToken from "../utils/token.generator";
import { authentication, login, register } from "../controllers/auth.controller";

const router = Router();

router.get("/check", authentication);

// --- REJESTRACJA (manualna) ---
router.post("/register", register);

// --- WYLOGOWANIE ---
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

// --- LOGOWANIE przez LocalStrategy (Passport) ---
router.post("/login", login);

// --- GOOGLE ---
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req: Request, res: Response) => {
    try {
      const user = req.user as { id: string };
      const token = generateToken(user.id);
      res.cookie("token", token, { httpOnly: true });
      res.json({ message: "Logged in via Google" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something went wrong during Google login", error });
    }
  }
);

// --- FACEBOOK ---
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "/login",
  }),
  (req: Request, res: Response) => {
    try {
      const user = req.user as { id: string };
      const token = generateToken(user.id);
      res.cookie("token", token, { httpOnly: true });
      res.json({ message: "Logged in via Facebook" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something went wrong during Facebook login", error });
    }
  }
);

// --- APPLE ---
router.get(
  "/apple",
  passport.authenticate("apple", { scope: ["name", "email"] })
);

// Apple callback potrafi być GET lub POST – zależy od konfiguracji.
// Tutaj przykład z POST:
router.post(
  "/apple/callback",
  passport.authenticate("apple", { session: false }),
  (req: Request, res: Response) => {
    const user = req.user as { id: string };
    const token = generateToken(user.id);
    res.cookie("token", token, { httpOnly: true });
    res.json({ message: "Logged in via Apple" });
  }
);

export default router;
