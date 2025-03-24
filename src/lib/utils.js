export const authUtils = {
    setUserData: async (userData) => {
        await cookieStore.set('user', JSON.stringify(userData), {
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });
    },

    setTokens: async (tokenObj) => {
        await cookieStore.set('accessToken', tokenObj.accessToken, {
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24,
            path: '/'
        });

        await cookieStore.set('refreshToken', tokenObj.refreshToken, {
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30,
            path: '/'
        });
    },

    getUserData: async () => {
        const userDataCookie = await cookieStore.get('user');
        return userDataCookie ? JSON.parse(userDataCookie.value) : null;
    },

    getTokens: async () => {
        const accessToken = await cookieStore.get('accessToken');
        const refreshToken = await cookieStore.get('refreshToken');

        if (!accessToken && !refreshToken) return null;

        return {
            accessToken: accessToken ? accessToken.value : null,
            refreshToken: refreshToken ? refreshToken.value : null
        };
    },

    updateAccessToken: async (newAccessToken) => {
        await cookieStore.set('accessToken', newAccessToken, {
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24,
            path: '/'
        });
    },

    clearAuth: async () => {
        await cookieStore.delete('user');
        await cookieStore.delete('accessToken');
        await cookieStore.delete('refreshToken');
    }
};
