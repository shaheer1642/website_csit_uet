import { useContext, useEffect, useState } from 'react';
import { getCookie, putCookie } from '../cookie_handler';
import { AuthContext } from '../contexts/AuthContext';
import { generateNewToken, socket, socketHasConnected } from '../websocket/socket';
import { MakeGETCall, MakePOSTCall } from '../api';
import { useNavigate } from 'react-router';

export const useAuth = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate()

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
                    setUser({
                        ...res,
                        user_department_id: res.user_department_id || 'CS&IT',
                        department_name: res.department_name || 'Computer Science & IT',
                    })
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

    const updateDepartmentId = (id, name) => {
        setUser({
            ...user,
            user_department_id: id,
            department_name: name,
        })
        navigate('/mis')
    }

    return { login, logout, fetchUser, updateDepartmentId };
};