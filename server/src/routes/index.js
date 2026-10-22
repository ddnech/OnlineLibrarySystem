const { Router } = require("express");
const c = require("../controllers");
const { requireAuth } = require("../middleware/auth");
const { imageUpload } = require("../middleware/upload");
const validate = require("../middleware/validators");

const admin = requireAuth("admin");
const reader = requireAuth("user");
const anyone = requireAuth();

// Auth
const auth = Router();
auth.post("/login", validate.login, c.auth.login);
auth.post("/register", validate.register, c.auth.register);
auth.get("/me", anyone, c.auth.me);

// Genres
const genre = Router();
genre.get("/", c.genre.list);
genre.post("/", admin, imageUpload("genres", "imgGenre"), validate.createGenre, c.genre.create);

// Books (auth runs before the upload, so strangers can't drop files on the server)
const book = Router();
book.get("/", c.book.list);
book.get("/genre", c.genre.list); // kept for older clients
book.get("/records", anyone, c.book.records);
book.get("/:id", c.book.getOne);
book.post("/", admin, imageUpload("books", "imgBook"), validate.createBook, c.book.create);
book.patch("/:id", admin, imageUpload("books", "imgBook"), validate.updateBook, c.book.update);

// Reader actions
const user = Router();
user.get("/profile", reader, c.user.profile);
user.post("/:book_id", reader, c.user.requestBook);
user.delete("/requests/:id", reader, c.user.cancelRequest);
user.patch("/pending-return/:id", reader, c.user.returnBook);

// Admin actions
const admins = Router();
admins.get("/stats", admin, c.admin.stats);
admins.get("/admin-action", admin, c.admin.actions);
admins.patch("/approve-borrow/:id", admin, c.admin.approveBorrow);
admins.patch("/reject-borrow/:id", admin, c.admin.rejectBorrow);
admins.patch("/approve-return/:id", admin, c.admin.approveReturn);

module.exports = { auth, genre, book, user, admins };
