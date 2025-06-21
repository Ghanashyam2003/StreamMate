import { Router } from 'express';
import { login, register } from '../controllers/user.controller.js';

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/add_to_attivity", (req, res) => {
  // Add your handler here
});
router.get("/get_all_activities", (req, res) => {
  // Add your handler here
});

export default router;

