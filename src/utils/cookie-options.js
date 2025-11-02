const cookieOptions = (req) =>  {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        secure: isProduction && req.hostname !== 'localhost',
        maxage: 24 * 60 * 60 * 1000 // 1 day
    }
}

export default cookieOptions