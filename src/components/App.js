import React from 'react'
import Main from './Main/Main.js'
import 'bootstrap/dist/css/bootstrap.css'
import Footer from './Footer/Footer.js'

function App() {

    return (
        <div>
            <main className="container">
                <div onClick={() => { window.location.href = "https://labourmarket.herokuapp.com/"}} className="jumbotron">
                    <h1 className="display-4 text-center">Мониторинг спроса на рынке труда</h1>

                </div>
                <Main/>
            </main>
            <Footer/>

        </div>
    )
}

export default App