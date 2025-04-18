import { useState } from 'react'
import { BrowserRouter, Route } from "react-router-dom";

import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
          <main>
            <Route exact path="/" component={MainPage} />
          </main>
      </BrowserRouter>
    </>
  )
}

export default App
