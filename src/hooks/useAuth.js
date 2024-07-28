import { useContext, useEffect, useState } from 'react';
import { getCookie, putCookie } from '../cookie_handler';
import { AuthContext } from '../contexts/AuthContext';
import { generateNewToken, socket, socketHasConnected } from '../websocket/socket';
import { MakeGETCall, MakePOSTCall } from '../api';

export const useAuth = () => {
    const { setUser } = useContext(AuthContext);

    const login = async ({ username, password, user_type }) => {
        return new Promise((resolve, reject) => {
            console.log('logging in')
            MakePOSTCall('/api/user/login', { body: { username, password, user_type } })
                .then(res => {
                    const { token } = res
                    localStorage.setItem('token', token)
                    fetchUser()
                        .then((user) => resolve(user))
                        .catch(err => {
                            console.log('removing token')
                            localStorage.removeItem('token')
                            reject(err)
                        })
                }).catch(err => {
                    reject(err)
                })
        })
    };

    const fetchUser = () => {
        return new Promise((resolve, reject) => {
            if (!localStorage.getItem('token')) return reject('No token found')
            MakeGETCall('/api/user')
                .then(res => {
                    setUser(res)
                    resolve(res)
                }).catch(err => {
                    reject(err.message || JSON.stringify(err))
                })
        })
    }

    const logout = () => {
        console.log('removing token')
        localStorage.removeItem('token')
        setUser(null);
    };

    return { login, logout, fetchUser };
};