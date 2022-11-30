import React from 'react'
import Aside from './Aside'
import Footer from './Footer'
import Menu from './Menu'

function ComponentWithAsideBar({ children }) {
    return (
        <React.Fragment>
            <Menu />
            <div className="flex flex-row">
                <div className="basis-1/5">
                    <Aside />
                </div>
                <div className="basis-4/5">
                    {children}
                </div>
            </div>
            <Footer />
        </React.Fragment>
    )
}

export default ComponentWithAsideBar