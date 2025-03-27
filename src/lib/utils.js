import Cookies from 'js-cookie';

export const authUtils = {
    setUserData: (userData) => {
        Cookies.set('user', JSON.stringify(userData), {
            secure: true,
            sameSite: 'strict',
            expires: 7, // 7 days
            path: '/'
        });
    },

    setTokens: (tokenObj) => {
        Cookies.set('accessToken', tokenObj.accessToken, {
            secure: true,
            sameSite: 'strict',
            expires: 1, // 1 day
            path: '/'
        });

        Cookies.set('refreshToken', tokenObj.refreshToken, {
            secure: true,
            sameSite: 'strict',
            expires: 30, // 30 days
            path: '/'
        });
    },

    getUserData: () => {
        const userData = Cookies.get('user');
        return userData ? JSON.parse(userData) : null;
    },

    getTokens: () => {
        const accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');

        if (!accessToken && !refreshToken) return null;

        return {
            accessToken: accessToken || null,
            refreshToken: refreshToken || null
        };
    },

    updateAccessToken: (newAccessToken) => {
        Cookies.set('accessToken', newAccessToken, {
            secure: true,
            sameSite: 'strict',
            expires: 1, // 1 day
            path: '/'
        });
    },

    clearAuth: () => {
        Cookies.remove('user', { path: '/' });
        Cookies.remove('accessToken', { path: '/' });
        Cookies.remove('refreshToken', { path: '/' });
    }
};
