import React from 'react'

function Footer() {
    const [date,setDate] = React.useState();
    React.useEffect(()=>{
        setDate(new Date().getFullYear());
    },[])
    return (
        <footer className="p-8 bg-white rounded-lg shadow md:px-6 md:py-8 dark:bg-gray-900">
            <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">©
             {date} <a href="https://abcthebank.com/" className="hover:underline">ABC Bank</a>
            </span>
        </footer>

    )
}

export default Footer