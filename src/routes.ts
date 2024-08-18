import { Router } from "express";

import UsersController from "./app/controllers/users/UsersController";
import AuthController from "./app/controllers/auth/AuthController";
import ItemsController from "./app/controllers/items/ItemsController";

import authMiddleware from "./app/middlewares/authMiddleware";
import CardsController from "./app/controllers/cards/CardsController";
import AddressController from "./app/controllers/addresses/AddressController";
import OrdersController from "./app/controllers/orders/OrdersController";

const router = Router();

// Auth
router.post("/auth/login", AuthController.login);
router.post("/auth/register", AuthController.register);
router.get("/auth/me", authMiddleware, AuthController.me);

// Users
router.get("/users", UsersController.index);
router.get("/users/:id", UsersController.show);
router.post("/users", UsersController.store);
router.put("/users/:id", UsersController.update);

// Address
router.get("/address", authMiddleware, AddressController.index);
router.get("/address/:id", authMiddleware, AddressController.show);
router.post("/address", authMiddleware, AddressController.store);
router.put("/address/:id", authMiddleware, AddressController.update);
router.delete("/address/:id", authMiddleware, AddressController.delete);

// Cards
router.get("/cards", authMiddleware, CardsController.index);
router.get("/cards/:id", authMiddleware, CardsController.show);
router.post("/cards", authMiddleware, CardsController.store);
router.put("/cards/:id", authMiddleware, CardsController.update);
router.delete("/cards/:id", authMiddleware, CardsController.delete);

// Itens
router.get("/items", ItemsController.index);
router.get("/items/:id", ItemsController.show);
router.post("/items", authMiddleware, ItemsController.store);
router.post("/items/many", authMiddleware, ItemsController.createMany);
router.put("/items/:id", authMiddleware, ItemsController.update);
router.delete("/items/:id", authMiddleware, ItemsController.delete);

// Orders
router.get("/orders", authMiddleware, OrdersController.index);
router.post("/orders", authMiddleware, OrdersController.store);

export default router;

