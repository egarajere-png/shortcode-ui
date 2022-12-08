import React from 'react';
import UserService from '../services/UserService';

function Menu() {
    return (
        <nav className="bg-gray-400 border-gray-200 px-12">
            <div className="container flex flex-wrap justify-between items-center mx-auto">
                <a href="https://abcthebank.com" target="_blank" rel='noreferrer' className="flex items-center">
                    <img src="/abc-logo.png" className="mr-6 h-12 sm:h-9" alt="abc logo" />
                    <span className="self-center text-xl font-semibold whitespace-nowrap">
                        Shortcodes Portal
                    </span>
                </a>
                <div>
                    <ul
                        className="flex flex-row p-4 mt-4">
                        {
                            UserService.isLoggedIn() && (
                                <React.Fragment>
                                    <li className='px-2'>
                                        <a href="#user"
                                            className="py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                            Logged in as {UserService.getUsername()}
                                        </a>
                                    </li>
                                    <li className='px-2'>
                                        <a href="#logout" onClick={() => UserService.doLogout()}
                                            className="py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                            Logout
                                        </a>
                                    </li>
                                </React.Fragment>
                            )
                        }
                        {
                            !UserService.isLoggedIn() && (
                                <li>
                                    <div onClick={() => UserService.doLogin()} >
                                        Login
                                    </div>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Menu