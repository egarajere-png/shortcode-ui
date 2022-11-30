import React from 'react'
import './Loading.css'

function Loading({ message }) {
    return (
        <div>
            <div class="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center">
                <div class="bg-white border py-2 px-5 rounded-lg flex items-center flex-col">
                    <div class="loader-dots block relative w-20 h-5 mt-2">
                        <div class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-blue-500"></div>
                        <div class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-blue-500"></div>
                        <div class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-blue-500"></div>
                        <div class="absolute top-0 mt-1 w-3 h-3 rounded-full bg-blue-500"></div>
                    </div>
                    <div class="text-gray-500 text-xs font-medium mt-2 text-center">
                        {message}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Loading