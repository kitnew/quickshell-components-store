"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (_req, res) => {
    res.json({ message: 'get all components' });
});
router.get('/:id', (_req, res) => {
    res.json({ message: 'get one component' });
});
router.post('/', (_req, res) => {
    res.json({ message: 'create component' });
});
router.put('/:id', (_req, res) => {
    res.json({ message: 'update component' });
});
router.delete('/:id', (_req, res) => {
    res.json({ message: 'delete component' });
});
exports.default = router;
//# sourceMappingURL=component.routes.js.map