import { useContext, useEffect, useState } from 'react';
import { getCookie, putCookie } from '../cookie_handler';
import { AuthContext } from '../contexts/AuthContext';
import { generateNewToken, socket, socketHasConnected } from '../websocket/socket';

export const useAuth = () => {
    const { setUser } = useContext(AuthContext);

    const login = async (data,callback) => {
        console.log('[useAuth.login] login called')
        await socketHasConnected()
        socket.emit('login/auth', data, res => {
            if (res.code == 200) {
                setUser(res.data, () => {
                    if (callback) callback(res)
                })
                console.log('[useAuth.login] logged in')
            } else {
                console.log('[useAuth.login] error', res)
                if (callback) callback(res)
            }
        })
    };

    const logout = (callback) => {
        console.log('[useAuth.logout] called')
        generateNewToken()
        setUser(null)
    };

    return { login, logout };
};