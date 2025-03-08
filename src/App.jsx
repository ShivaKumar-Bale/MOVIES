import React, { useEffect, useState } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import {useDebounce} from 'react-use'
import { getTrendingMovies, updateSearchCount } from './Appwrite';


 const API_BASE_URL = 'https://api.themoviedb.org/3';
 const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const API_OPTIONS = { 
    method: 'GET' , 
    headers: {
      accept: 'application/json',
      Authorization :`Bearer ${API_KEY}`
    }
  }
const App = () => { 

const [searchText, setSearchText]=useState('')
const [errorMessage,setErrorMessage] = useState('')
const [movieList, setMovieList] = useState([])
const [isLoading, setIsLoading] = useState(false)
const [deBounceSearchText, setDeBounceSearchText] = useState('')
const [trendingMovies, setTrendingMovies] = useState([])
useDebounce(()=> setDeBounceSearchText(searchText), 500,[searchText])

const fetchMovies = async(query = '')=>{
  setIsLoading(true)
  setErrorMessage('')
  try{
    const endpoint =query 
    ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
    const response = await fetch(endpoint,API_OPTIONS)
    if(!response.ok){
    throw new Error('Failed to fetch movie')
    }
    const data = await response.json()
    
    if(data.Response === 'False'){
      setErrorMessage(data.Error || 'failed to fetch movie')
      setMovieList([])
      return;
    }setMovieList(data.results || [])
     
    if(query && data.results.legth > 0 ){
      await updateSearchCount(query, data.results[0]);
    }
   
  }catch(error){
   console.log(`Error fetching movies: ${error}`)
   setErrorMessage("Error fetching data. Please try again")
  }finally {
       setIsLoading(false)}
}

const loadTrendingMovies = async() => {
  try {
  const movies = await getTrendingMovies()
  setTrendingMovies(movies)
    
  } catch (error) {
    console.log(`Error fetching  trendingmovies: ${error}`)
  
  }
}
   useEffect(()=> {
    fetchMovies(deBounceSearchText)
   },[deBounceSearchText])

   useEffect(()=> {
    loadTrendingMovies()
   }, [])

  return (
   <main>
    <div className='pattern'/>

    <div className='wrapper'>
    <header>
      <img src = "./hero.png" alt="Hero Banner"/>
      <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without Hassle</h1>
      
      <Search  searchText={searchText} setSearchText={setSearchText}/>
      </header>

      {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

     <section className='all-movies'>
      <h2>All Movie</h2>
      {isLoading ? (
<Spinner/> 
) :errorMessage ? (
<p className="text-red-500">{errorMessage}</p>
) : (
<ul>
{movieList.map((movie) => (
<MovieCard key={movie.id} movie={movie}/>
))}
</ul>)}
     </section>
     </div>
   </main>
  )
}

export default App