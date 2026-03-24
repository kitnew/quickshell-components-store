import { Router } from 'express';

const router = Router();

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

export default router;