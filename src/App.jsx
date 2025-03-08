import React, { useEffect, useState } from 'react'
import Search from './components/Search'

 const API_BASE_URL = 'https://api.themoviedb.org/3';
 const API_KEY =import.meta.env.TMDB_API_KEY;

  const API_OPTIONS = { 
    method: 'GET' , 
    header: {
      accept: 'application/json',
      Authorization :`Bearer ${API_KEY}`
    }
  }
const App = () => { 

const [searchText, setSearchText]=useState('')
const [errorMessage,setErrorMessage] = useState('')

const fetchMovies = async()=>{
  try{
    const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
  const response = await fetch(endpoint,API_OPTIONS)
    const data = await response.json()
    console.log(data)
  }catch(error){
   console.log(`Error fetching movies: ${error}`)
   setErrorMessage("Error fetching data. Please try again")
  }}
   useEffect(()=> {
    fetchMovies()
   },[])
  return (
   <main>
    <div className='pattern'/>

    <div className='wrapper'>
    <header>
      <img src = "./hero.png" alt="Hero Banner"/>
      <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without Hassle</h1>
      </header>
      <Search  searchText={searchText} setSearchText={setSearchText}/>
     
     <section className='All-movies'>
      <h2>All Movies
        {errorMessage && <p className='error-message'>{errorMessage}</p>}
      </h2>
     </section>
     </div>
   </main>
  )
}

export default App