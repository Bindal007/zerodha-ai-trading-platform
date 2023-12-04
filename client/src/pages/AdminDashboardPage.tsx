import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AuthState } from '../types';
import { GET_STOCKS, GET_USERS } from '../graphql';
import { CHANGE_USERNAME } from '../graphql';
import { UPDATE_USERNAME } from '../constants/actions';
import { Tab, Dialog } from '@headlessui/react';
import { useQuery, useMutation } from '@apollo/client';

interface User {
    _id: string;
    username: string;
    balance: number;
    type: string;
}

interface Props {
    ticker: string;
}

interface UserCreateModalProps {
    isUCMOpen: boolean;
    onUCMClose: () => void;
}

interface UserUpdateModalProps {
    isUUMOpen: boolean;
    onUUMClose: () => void;
}

interface StockCreateModalProps {
    isSCMOpen: boolean;
    onSCMClose: () => void;
}

interface StockUpdateModalProps {
    isSUMOpen: boolean;
    onSUMClose: () => void;
}

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}

const FloatingButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <button
            className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={onClick}
        >
            +
        </button>
    );
};

const UserCreateModal: React.FC<UserCreateModalProps> = ({ isUCMOpen, onUCMClose }) => {
    if (!isUCMOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onUCMClose}>
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Create New User</h3>
                    <div className="mt-2 px-7 py-3">
                        <form>
                            {/* Your form elements here */}
                            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
                            <button type="submit" className="mt-4 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserUpdateModal: React.FC<UserUpdateModalProps> = ({ isUUMOpen, onUUMClose }) => {
    if (!isUUMOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onUUMClose}>
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Modal Title</h3>
                    <div className="mt-2 px-7 py-3">
                        <form>
                            {/* Your form elements here */}
                            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
                            <button type="submit" className="mt-4 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StockCreateModal: React.FC<StockCreateModalProps> = ({ isSCMOpen, onSCMClose }) => {
    if (!isSCMOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onSCMClose}>
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Modal Title</h3>
                    <div className="mt-2 px-7 py-3">
                        <form>
                            {/* Your form elements here */}
                            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
                            <button type="submit" className="mt-4 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StockUpdateModal: React.FC<StockUpdateModalProps> = ({ isSUMOpen, onSUMClose }) => {
    if (!isSUMOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onSUMClose}>
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Modal Title</h3>
                    <div className="mt-2 px-7 py-3">
                        <form>
                            {/* Your form elements here */}
                            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" />
                            <button type="submit" className="mt-4 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {

    const { data: stocksData, refetch: refetchStockData } = useQuery(GET_STOCKS);
    const { data: usersData, refetch: refetchUsersData } = useQuery(GET_USERS);
    const [searchStocksQuery, setSearchStocksQuery] = useState<string>('');
    const [searchUsersQuery, setSearchUsersQuery] = useState<string>('');
    const [changeUsernameMutation] = useMutation(CHANGE_USERNAME);
    const auth = useSelector((state: AuthState) => state.authReducer.authData);
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('Users');
    const [errors, setErrors] = useState('');
    const [newUsername, setNewUsername] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isLoadingUsername, setIsloadingUsername] = useState(false);

    const [isUserCreateModalOpen, setUserCreateModalOpen] = useState(false);
    const [isUserUpdateModalOpen, setUserUpdateModalOpen] = useState(false);
    const [isStockCreateModalOpen, setStockCreateModalOpen] = useState(false);
    const [isStockUpdateModalOpen, setStockUpdateModalOpen] = useState(false);
    let [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
    let [isDeleteStockOpen, setIsDeleteStockOpen] = useState(false);

    const searchOnStocksChange = (event: any) => {
        setSearchStocksQuery(event?.target?.value);
    };

    const searchOnUsersChange = (event: any) => {
        setSearchUsersQuery(event?.target?.value);
    };

    useEffect(() => {
        document.title = 'Market | Zerodha.ai';
    }, []);

    useEffect(() => {
        if (searchStocksQuery !== '') {
            refetchStockData({
                search: searchStocksQuery,
            });
        } else {
            refetchStockData({
                search: '',
            });
        }
    }, [searchStocksQuery, refetchStockData]);

    useEffect(() => {
        if (searchUsersQuery !== '') {
            refetchUsersData({
                variables: {
                    search: searchUsersQuery,
                }
            });
        } else {
            refetchUsersData({
                variables: {
                    search: '',
                }
            });
        }
    }, [searchUsersQuery, refetchUsersData]);

    const handleUsernameChange = () => {
        setErrors('');
        setIsloadingUsername(true);

        changeUsernameMutation({ variables: { newUsername, confirmPassword } })
            .then(({ data }) => {
                setTimeout(() => {
                    setErrors('');
                    dispatch({ type: UPDATE_USERNAME, payload: { newUsername: data?.changeUsername.newUsername } });
                    setIsloadingUsername(false);
                    setConfirmPassword('');
                    setNewUsername('');
                }, 1500);
            })
            .catch((err) => {
                setErrors(err?.message);
                setIsloadingUsername(false);
            });
    };

    const toggleDeleteUser = (user: any) => {
        console.log(user);
    }

    const toggleUpdateUserModal = (user: any) => {
        console.log(user);
    }

    const toggleDeleteStock = (stock: any) => {
        console.log(stock);
    }
    
    const toggleUpdateStockModal = (stock: any) => {
        console.log(stock);
    }

    const toggleAddStockModal = () => { }
    const toggleAddUserModal = () => { }
    // {
    //     country: "United States"
    //     currency: "USD"
    //     exchange: "NYSE"
    //     industry: "Technology"
    //     ipo: "1994-08-20"
    //     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
    //     name: "Visa Inc."
    //     price: 92.84
    //     ticker: "V"
    //     __typename : "Stock"
    // }
    return (
        <div className='dark:bg-darkBg flex flex-col min-h-screen items-center justify-center overflow-hidden'>
            <div className='container flex flex-col md:items-center text-gray-900 dark:text-white min-w-max'>
                <UserCreateModal isUCMOpen={isUserCreateModalOpen} onUCMClose={() => setUserCreateModalOpen(false)} />
                <UserUpdateModal isUUMOpen={isUserUpdateModalOpen} onUUMClose={() => setUserUpdateModalOpen(false)} />
                <StockCreateModal isSCMOpen={isStockCreateModalOpen} onSCMClose={() => setStockCreateModalOpen(false)} />
                <StockUpdateModal isSUMOpen={isStockCreateModalOpen} onSUMClose={() => setStockCreateModalOpen(false)} />
                {/* <Dialog open={isDeleteStockOpen} onClose={() => setIsDeleteStockOpen(false)}>
                    <Dialog.Panel>
                        <Dialog.Title>Deactivate account</Dialog.Title>
                        <Dialog.Description>
                        This will permanently deactivate your account
                        </Dialog.Description>

                        <p>
                        Are you sure you want to deactivate your account? All of your data
                        will be permanently removed. This action cannot be undone.
                        </p>

                        <button onClick={() => setIsDeleteStockOpen(false)}>Deactivate</button>
                        <button onClick={() => setIsDeleteStockOpen(false)}>Cancel</button>
                    </Dialog.Panel>
                    </Dialog> */}
                <div className='md:flex justify-center items-start h-full w-full '>
                    <Tab.Group onChange={(index) => setActiveTab(index === 0 ? 'Users' : 'Stocks')}>
                        <Tab.List className='flex md:flex-col space-x-1 space-y-1 mb-5 md:mb-0 md:mt-5 mr-5'>
                            <Tab
                                key={'Users'}
                                className={({ selected }) =>
                                    classNames(
                                        selected
                                            ? 'dark:bg-darkField dark:text-white bg-gray-100'
                                            : 'dark:text-gray-300 dark:hover:bg-darkField dark:hover:text-white hover:bg-gray-100',
                                        'text-black px-5 py-2 text-md text-center rounded-2xl flex items-center'
                                    )
                                }>
                                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                                    />
                                </svg>
                                Users
                            </Tab>
                            <Tab
                                key={'Stocks'}
                                className={({ selected }) =>
                                    classNames(
                                        selected
                                            ? 'dark:bg-darkField dark:text-white bg-gray-100'
                                            : 'dark:text-gray-300 dark:hover:bg-darkField dark:hover:text-white hover:bg-gray-100',
                                        'text-black px-5 py-2 text-md text-center rounded-2xl flex items-center'
                                    )
                                }>
                                <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
                                    />
                                </svg>
                                Stocks
                            </Tab>
                        </Tab.List>
                        <Tab.Panels className='dark:bg-darkField bg-gray-100 rounded-2xl dark:text-white p-3 min-h-panel w-full'>
                            <Tab.Panel key={'Users'} className={classNames('min-h-panel')}>
                                <div className='flex h-full min-w-panel'>
                                    <div className='text-xs overflow-auto h-panel w-full'>
                                        <h2 className='text-left text-lg font-semibold text-gray-700 capitalize dark:text-gray-200 mb-2 px-3 pt-2'>
                                            Users {usersData?.getAllUsers?.length + ' latest records'}
                                        </h2>
                                        <div className='shadow rounded-lg relative'>
                                            <table className='leading-normal w-full h-full absolute overflow-hidden'>
                                                <thead>
                                                    <tr>
                                                        <th
                                                            scope='col'
                                                            className='px-5 py-3  border-b border-gray-200 dark:border-gray-800 text-gray-800  dark:text-white text-center text-xs uppercase font-normal'>
                                                            Name
                                                        </th>
                                                        <th
                                                            scope='col'
                                                            className='px-5 py-3  border-b border-gray-200 dark:border-gray-800 text-gray-800  dark:text-white text-center text-xs uppercase font-normal'>
                                                            Balance
                                                        </th>
                                                        <th
                                                            scope='col'
                                                            className='px-5 py-3  border-b border-gray-200 dark:border-gray-800 text-gray-800  dark:text-white text-center text-xs uppercase font-normal'>
                                                            Type
                                                        </th>
                                                        <th
                                                            scope='col'
                                                            className='px-5 py-3  border-b border-gray-200 dark:border-gray-800 text-gray-800  dark:text-white text-center text-xs uppercase font-normal'>
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {usersData?.getAllUsers?.map((user: any) => (
                                                        <tr
                                                            key={user._id}
                                                            className='bg-white dark:bg-darkCard hover:bg-gray-100 dark:hover:bg-gray-600'>
                                                            <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-800  text-xs font-medium text-center'>
                                                                <p className='text-gray-900 dark:text-white whitespace-no-wrap'>{user.username}</p>
                                                            </td>
                                                            <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-800 text-xs font-medium text-center'>
                                                                <p
                                                                    className={'text-gray-900 whitespace-no-wrap rounded-full p-1 bg-green-300'}>
                                                                    {new Intl.NumberFormat('en-US', {
                                                                        style: 'currency',
                                                                        currency: 'USD',
                                                                        maximumFractionDigits: 2,
                                                                        minimumFractionDigits: 2,
                                                                    }).format(user.balance)}
                                                                </p>
                                                            </td>
                                                            <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-800  text-xs font-medium text-center'>
                                                                <p className='text-gray-900 dark:text-white whitespace-no-wrap'>{user.type}</p>
                                                            </td>

                                                            <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-800  text-xs font-medium text-center'>
                                                                <div className="flex justify-end gap-4">
                                                                    <a x-data="{ tooltip: 'Delete' }" href="#" onClick={() => toggleDeleteUser(user)}>
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke-width="1.5"
                                                                            stroke="currentColor"
                                                                            className="h-6 w-6"
                                                                            x-tooltip="tooltip"
                                                                        >
                                                                            <path
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round"
                                                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                                            />
                                                                        </svg>
                                                                    </a>
                                                                    <a x-data="{ tooltip: 'Edite' }" href="#" onClick={() => toggleUpdateUserModal(user)}>
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke-width="1.5"
                                                                            stroke="currentColor"
                                                                            className="h-6 w-6"
                                                                            x-tooltip="tooltip"
                                                                        >
                                                                            <path
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round"
                                                                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                                                            />
                                                                        </svg>
                                                                    </a>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel key={'Stocks'} className={classNames('h-full overflow-auto')}>
                                <div className='flex h-full min-w-panel'>
                                    <div className='text-xs overflow-auto h-panel w-full'>
                                        <h2 className='text-left text-lg font-semibold text-gray-700 capitalize dark:text-gray-200 mb-2 px-3 pt-2'>
                                            Stocks {stocksData?.getStocks?.stocks.length + ' latest records'}
                                        </h2>
                                        <div className='shadow rounded-lg relative'>
                                            <table className='leading-normal w-full h-full absolute overflow-hidden'>
                                                <thead>
                                                    <tr>
                                                        <th
                                                            scope='col'
                                                            className='px-5 py-3  border-b border-gray-200 dark:border-gray-800 text-gray-800  dark:text-white text-center text-xs uppercase font-normal'>
                                                            Name
                                                        </th>
                                                        <th
                                                            scope='col'
                                                            className='px-5 py-3  border-b border-gray-200 dark:border-gray-800 text-gray-800  dark:text-white text-center text-xs uppercase font-normal'>
                                                            Ticker
                                                        </th>
                                                        <th
                                                            scope='col'
                                                            className='px-5 py-3  border-b border-gray-200 dark:border-gray-800 text-gray-800  dark:text-white text-center text-xs uppercase font-normal'>
                                                            Exchange
                                                        </th>
                                                        <th
                                                            scope='col'
                                                            className='px-5 py-3  border-b border-gray-200 dark:border-gray-800 text-gray-800  dark:text-white text-center text-xs uppercase font-normal'>
                                                            Price
                                                        </th>

                                                        <th
                                                            scope='col'
                                                            className='px-5 py-3  border-b border-gray-200 dark:border-gray-800 text-gray-800  dark:text-white text-center text-xs uppercase font-normal'>
                                                            IPO
                                                        </th>
                                                        <th
                                                            scope='col'
                                                            className='px-5 py-3  border-b border-gray-200 dark:border-gray-800 text-gray-800  dark:text-white text-center text-xs uppercase font-normal'>
                                                            Industry
                                                        </th>
                                                        <th
                                                            scope='col'
                                                            className='px-5 py-3  border-b border-gray-200 dark:border-gray-800 text-gray-800  dark:text-white text-center text-xs uppercase font-normal'>
                                                            Website
                                                        </th>
                                                        <th
                                                            scope='col'
                                                            className='px-5 py-3  border-b border-gray-200 dark:border-gray-800 text-gray-800  dark:text-white text-center text-xs uppercase font-normal'>
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {stocksData?.getStocks?.stocks.map((stock: any) => (
                                                        <tr
                                                            key={stock._id}
                                                            className='bg-white dark:bg-darkCard hover:bg-gray-100 dark:hover:bg-gray-600'>
                                                            <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-800  text-xs font-medium text-center'>
                                                                <p className='text-gray-900 dark:text-white whitespace-no-wrap'>{stock.name}</p>
                                                            </td>
                                                            <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-800  text-xs font-medium text-center'>
                                                                <p className='text-gray-900 dark:text-white whitespace-no-wrap'>{stock.ticker}</p>
                                                            </td>
                                                            <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-800  text-xs font-medium text-center'>
                                                                <p className='text-gray-900 dark:text-white whitespace-no-wrap'>{stock.exchange}</p>
                                                            </td>
                                                            <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-800 text-xs font-medium text-center'>
                                                                <p
                                                                    className={'text-gray-900 whitespace-no-wrap rounded-full p-1 bg-green-300'}>
                                                                    {new Intl.NumberFormat('en-US', {
                                                                        style: 'currency',
                                                                        currency: 'USD',
                                                                        maximumFractionDigits: 2,
                                                                        minimumFractionDigits: 2,
                                                                    }).format(stock.price)}
                                                                </p>
                                                            </td>
                                                            <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-800  text-xs font-medium text-center'>
                                                                <p className='text-gray-900 dark:text-white whitespace-no-wrap'>{stock.ipo}</p>
                                                            </td>
                                                            <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-800  text-xs font-medium text-center'>
                                                                <p className='text-gray-900 dark:text-white whitespace-no-wrap'>{stock.industry}</p>
                                                            </td>
                                                            <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-800  text-xs font-medium text-center'>
                                                                <p className='text-gray-900 dark:text-white whitespace-no-wrap'>{stock.website}</p>
                                                            </td>

                                                            <td className='px-5 py-5 border-b border-gray-200 dark:border-gray-800  text-xs font-medium text-center'>
                                                                <div className="flex justify-end gap-4">
                                                                    <a x-data="{ tooltip: 'Delete' }" href="#" onClick={() => toggleDeleteStock(stock)}>
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke-width="1.5"
                                                                            stroke="currentColor"
                                                                            className="h-6 w-6"
                                                                            x-tooltip="tooltip"
                                                                        >
                                                                            <path
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round"
                                                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                                            />
                                                                        </svg>
                                                                    </a>
                                                                    <a x-data="{ tooltip: 'Edite' }" href="#" onClick={() => toggleUpdateStockModal(stock)}>
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke-width="1.5"
                                                                            stroke="currentColor"
                                                                            className="h-6 w-6"
                                                                            x-tooltip="tooltip"
                                                                        >
                                                                            <path
                                                                                stroke-linecap="round"
                                                                                stroke-linejoin="round"
                                                                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                                                            />
                                                                        </svg>
                                                                    </a>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
            <FloatingButton onClick={() => activeTab === 'Stocks' ? toggleAddStockModal() : toggleAddUserModal()} />
        </div>
    );
};

export default AdminDashboard;
