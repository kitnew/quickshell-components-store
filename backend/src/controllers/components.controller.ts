import { Request, Response } from 'express';
import * as componentsService from '../services/components.service';

const createComponent = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const component = await componentsService.createComponent(req.body, userId);
        res.status(201).json(component);
    } catch (error: any) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message });
    }
};

const getAllComponents = async (req: Request, res: Response) => {
    try {
        const components = await componentsService.getAllComponents();
        res.status(200).json(components);
    } catch (error: any) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message });
    }
};

const getComponentById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'Invalid component ID' });
        }
        const component = await componentsService.getComponentById(id);
        res.status(200).json(component);
    } catch (error: any) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message });
    }
};

const updateComponent = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'Invalid component ID' });
        }
        const userId = (req as any).user.id;
        const component = await componentsService.updateComponent(id, req.body, userId);
        res.status(200).json(component);
    } catch (error: any) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message });
    }
};

const deleteComponent = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'Invalid component ID' });
        }
        const userId = (req as any).user.id;
        await componentsService.deleteComponent(id, userId);
        res.status(200).json({ success: true });
    } catch (error: any) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ error: error.message });
    }
};

export {
    createComponent,
    getAllComponents,
    getComponentById,
    updateComponent,
    deleteComponent
};
