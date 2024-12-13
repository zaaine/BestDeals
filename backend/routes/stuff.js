const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const stuffCtrl = require("../controllers/stuff");
const multer = require("../middleware/multer-config");

router.post("/", auth, multer, stuffCtrl.createThing);
router.put("/:id", auth, multer, stuffCtrl.modifyThing);
router.delete("/:id", auth, stuffCtrl.deleteThing);
router.get("/:id", auth, stuffCtrl.getOneThing);

// route pour la galerie publique.
router.get("/", stuffCtrl.getAllThings);

module.exports = router;
