import { pool } from '../config/db';
import { ApiError } from '../utils/ApiError';

const createComponent = async (data: any, userId: number) => {
    const { title, description, category, github_url } = data;
    
    const result = await pool.query(
        `INSERT INTO components (title, description, category, github_url, author_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [title, description, category, github_url, userId]
    );

    return result.rows[0];
};

const getAllComponents = async () => {
    const result = await pool.query(
        'SELECT * FROM components ORDER BY created_at DESC'
    );
    return result.rows;
};

const getComponentById = async (id: number) => {
    const result = await pool.query(
        'SELECT * FROM components WHERE id = $1',
        [id]
    );

    if (result.rows.length === 0) {
        throw new ApiError(404, 'Component not found');
    }

    return result.rows[0];
};

const updateComponent = async (id: number, data: any, userId: number) => {
    // 1. Check if component exists
    const existing = await pool.query('SELECT * FROM components WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
        throw new ApiError(404, 'Component not found');
    }

    // 2. Check if the user is the author
    if (existing.rows[0].author_id !== userId) {
        throw new ApiError(403, 'Permission denied: you are not the author of this component');
    }

    // 3. Dynamics fields for update
    const allowedFields = ['title', 'description', 'category', 'github_url'];
    const fields: string[] = [];
    const values: any[] = [];
    let i = 1;

    for (const [key, value] of Object.entries(data)) {
        if (allowedFields.includes(key)) {
            fields.push(`${key} = $${i++}`);
            values.push(value);
        }
    }

    if (fields.length === 0) {
        return existing.rows[0];
    }

    // 4. Update with updated_at timestamp
    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    const query = `UPDATE components SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteComponent = async (id: number, userId: number) => {
    // 1. Check if component exists
    const existing = await pool.query('SELECT * FROM components WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
        throw new ApiError(404, 'Component not found');
    }

    // 2. Check if the user is the author
    if (existing.rows[0].author_id !== userId) {
        throw new ApiError(403, 'Permission denied: you are not the author of this component');
    }

    // 3. Performance deletion
    await pool.query('DELETE FROM components WHERE id = $1', [id]);
    return { success: true };
};

export {
    createComponent,
    getAllComponents,
    getComponentById,
    updateComponent,
    deleteComponent
};
