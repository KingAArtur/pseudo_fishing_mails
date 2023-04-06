import React from "react"
import {Link} from "react-router-dom"

export const NotLoggedIn = () => 

<div className="flex flex-col bg-black" id="notfound">
    <div className="notfound text-white">
        <div className="notfound-404">
            <h2>Для просмотра страницы необходимо авторизоваться!</h2>
        </div>
        <Link to="/auth" className="rounded" >Login</Link>
    </div>
</div>