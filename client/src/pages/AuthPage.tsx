import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { AUTH, OWNED_STOCKS } from '../constants/actions';
import { LOGIN_USER, REGISTER_USER, GET_OWNEDSTOCKS } from '../graphql';
import { AuthState } from '../types';
import { useMutation, useLazyQuery } from '@apollo/client';
// @ts-ignore
import CheckedIcon from '../assets/icons/checked.png';

const initialState = { username: '', password: '', confirmPassword: '', type: "User" };

interface LocationState {
    redirect: {
        pathname: string;
    };
}

const Auth = () => {
    const [getOwnedStocks, { data: ownedStocksData }] = useLazyQuery(GET_OWNEDSTOCKS);
    const auth = useSelector((state: AuthState) => state.authReducer.authData);
    const [loginMutation] = useMutation(LOGIN_USER);
    const [registerMutation] = useMutation(REGISTER_USER);
    const [errors, setErrors] = useState('');
    const [form, setForm] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingGuest, setIsLoadingGuest] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation<LocationState>();

    useEffect(() => {
        document.title = 'Authorization | Zerodha.ai';
    }, []);

    const switchMode = (e: any) => {
        setIsLoading(false);
        setIsSignup((prevIsSignup) => !prevIsSignup);
    };

    const handleSubmitGuestAccount = (e: any) => {
        e.preventDefault();
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        if (isSignup) {
            registerMutation({ variables: { username: form.username, password: form.password, confirmPassword: form.confirmPassword, type: "User" } })
                .then(({ data }) => {
                    setErrors('');
                    dispatch({ type: AUTH, payload: data?.registerUser });
                    dispatch({ type: OWNED_STOCKS, payload: {} });
                    history.push(location?.state?.redirect || '/market');
                })
                .catch((err) => {
                    setErrors(err?.message);
                    setIsLoading(false);
                });
        } else {
            loginMutation({ variables: { username: form.username, password: form.password, type: "User" } })
                .then(({ data }) => {
                    setErrors('');
                    dispatch({ type: AUTH, payload: data?.loginUser });

                    getOwnedStocks();

                    if (ownedStocksData) {
                        dispatch({ type: OWNED_STOCKS, payload: ownedStocksData?.getOwnedStocks?.ownedStocks });
                    }
                })
                .catch((err) => {
                    setErrors(err?.message);
                    setIsLoading(false);
                });
        }
    };

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className='dark:bg-darkBg h-screen w-full flex flex-auto items-center text-center'>
            <div className='w-full max-w-sm mx-auto overflow-hidden bg-white dark:bg-darkField text-gray-700 dark:text-gray-200 rounded-2xl shadow-xl'>
                {!auth?.user ? (
                    <>
                        <div className='p-8 relative'>
                            <h2 className='text-3xl font-bold text-center text-gray-700 dark:text-white'>Zerodha.ai</h2>

                            <h3 className='mt-1 text-xl font-medium text-center text-gray-600 dark:text-gray-200'>Welcome Back</h3>

                            <p className='mt-1 text-center text-gray-500 dark:text-gray-400'>{isSignup ? 'Create an account.' : 'Login to your account.'}</p>

                            <form onSubmit={handleSubmit} name='auth_form'>
                                <div className='w-full mt-4'>
                                    <input
                                        className='block w-full px-4 py-2 mt-2 text-gray-700 dark:text-gray-200 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:placeholder-gray-400 focus:border-pink-600 shadow-md focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent'
                                        type='text'
                                        required
                                        placeholder='Username'
                                        aria-label='Username'
                                        name='username'
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className='w-full mt-4'>
                                    <input
                                        className='block w-full px-4 py-2 mt-2 text-gray-700 dark:text-gray-200 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:placeholder-gray-400 focus:border-pink-600 shadow-md focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent'
                                        type='password'
                                        required
                                        placeholder='Password'
                                        aria-label='Password'
                                        name='password'
                                        onChange={handleChange}
                                    />
                                </div>

                                {isSignup && (
                                    <>
                                        <div className='w-full mt-4'>
                                            <input
                                                className='block w-full px-4 py-2 mt-2 text-gray-700 dark:text-gray-200 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:placeholder-gray-400 focus:border-pink-600 shadow-md focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-transparent'
                                                type='password'
                                                required
                                                placeholder='Confirm Password'
                                                aria-label='Confirm Password'
                                                name='confirmPassword'
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </>
                                )}

                                {errors && (
                                    <div className='mt-4 flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800'>
                                        <div className='flex items-center justify-center w-12 bg-red-700 dark:bg-red-700'>
                                            <svg className='w-6 h-6 text-white fill-current' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'>
                                                <path d='M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z' />
                                            </svg>
                                        </div>

                                        <div className='px-4 py-2 -mx-3'>
                                            <div className='mx-3'>
                                                <span className='font-semibold text-red-700 dark:text-red-700'>
                                                    Error: <span className='text-sm text-red-700 dark:text-red-700'>{errors}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className='flex items-center justify-center mt-5'>
                                    <button
                                        className='flex items-center justify-center w-full px-6 py-2 font-medium text-white transition-colors duration-200 transform bg-pink-600 rounded-md hover:bg-pink-700 focus:bg-pink-700 focus:outline-none'
                                        type='submit'>
                                        {isLoading && (
                                            <svg
                                                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'>
                                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                                <path
                                                    className='opacity-75'
                                                    fill='currentColor'
                                                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                            </svg>
                                        )}
                                        {isSignup ? 'Create Account' : 'Login'}
                                    </button>
                                </div>
                            </form>
                            {
                                // GUEST ACCOUNT BUTTON
                            }
                            {/* <div className='flex items-center justify-between mt-4'>
                                <span className='w-1/5 border-b dark:border-gray-600 lg:w-1/5'></span>

                                <span className='text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline'>
                                    or login with Guest Account
                                </span>

                                <span className='w-1/5 border-b dark:border-gray-400 lg:w-1/5'></span>
                            </div>

                            <div className='flex items-center justify-center mt-6'>
                                <form onSubmit={handleSubmitGuestAccount} className='w-full'>
                                    <button
                                        disabled
                                        type='submit'
                                        className='w-full px-4 py-2 cursor-not-allowed text-sm leading-5 text-white transition-colors duration-200 transform dark:bg-gray-700 bg-gray-500 rounded hover:bg-gray-600 focus:outline-none flex flex-row items-center justify-center'>
                                        {isLoadingGuest && !errors && (
                                            <svg
                                                className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                                                xmlns='http://www.w3.org/2000/svg'
                                                fill='none'
                                                viewBox='0 0 24 24'>
                                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                                <path
                                                    className='opacity-75'
                                                    fill='currentColor'
                                                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                            </svg>
                                        )}
                                        <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                                            />
                                        </svg>
                                        <span className='hidden mx-2 sm:inline'>Try with Guest Account </span>
                                    </button>
                                </form>
                            </div> */}
                        </div>

                        <div className='flex items-center justify-center py-4 text-center bg-gray-100 dark:bg-gray-800'>
                            <span className='text-sm text-gray-600 dark:text-gray-200'>
                                {!isSignup ? "Don't have an account?" : 'Already have an account?'}{' '}
                            </span>

                            <button onClick={switchMode} className='mx-2 text-sm font-bold text-pink-600 dark:text-pink-600 hover:text-pink-800'>
                                {!isSignup ? 'Register' : 'Login'}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className='p-10 flex flex-col justify-center items-center'>
                        <div className='w-10 mb-5'>
                            <img src={CheckedIcon} alt='Checked Icon' className='' />
                        </div>
                        <h3 className='mt-1 text-xl font-medium text-center text-gray-600 dark:text-gray-200'>You're signed in!</h3>{' '}
                        <div className='mt-8'>
                            <Link
                                to='/market'
                                className='px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md dark:bg-blue-800 hover:bg-blue-500 dark:hover:bg-blue-700 focus:outline-none focus:bg-blue-500 dark:focus:bg-blue-700'>
                                Browse the Market
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Auth;
