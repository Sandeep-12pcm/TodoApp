import React from 'react'
import TodoApp from './components/TodoApp'
// import Header from './components/Header'
// import TempNav from './components/TempNav'
// import Footer from './components/Footer'
// import Navbar from './components/TempNav'
const App = () => {
  return (
    <>
      <div className='w-full'>
        {/* <div className='absolute top-0 left-0 w-full'>
        <Header />
        <Navbar />
      </div>
        <TempNav />
        <Footer /> */}
        <TodoApp/>
      </div>
    </>
  )
}

export default App