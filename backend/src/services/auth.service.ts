import { pool } from '../config/db';
import { hashPassword, comparePassword } from '../utils/password';
import { signAccessToken } from '../utils/jwt';

class ApiError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

const registerUser = async (data: any) => {
    const { username, email, password } = data;

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
        throw new ApiError(409, 'User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user in DB
    const result = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
        [username, email, passwordHash]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = signAccessToken({ id: user.id });

    // Return safe data + token
    return { user, token };
};

const loginUser = async (data: any) => {
    const { email, password } = data;

    // Find user by email
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
        throw new ApiError(401, 'Invalid email or password');
    }

    // Compare password with hash
    const isPasswordMatch = await comparePassword(password, user.password_hash);
    if (!isPasswordMatch) {
        throw new ApiError(401, 'Invalid email or password');
    }

    // Generate JWT
    const token = signAccessToken({ id: user.id });

    // Return safe user + token
    const { password_hash, ...safeUser } = user;
    return { user: safeUser, token };
};

const getCurrentUser = async (userId: number) => {
    // Find user by id and return without password_hash
    const result = await pool.query(
        'SELECT id, username, email, created_at FROM users WHERE id = $1',
        [userId]
    );

    if (result.rows.length === 0) {
        throw new ApiError(404, 'User not found');
    }

    return result.rows[0];
};

export {
    registerUser,
    loginUser,
    getCurrentUser
};