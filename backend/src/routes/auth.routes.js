"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/register', (_req, res) => {
    res.json({ message: 'register endpoint' });
});
router.post('/login', (_req, res) => {
    res.json({ message: 'login endpoint' });
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map