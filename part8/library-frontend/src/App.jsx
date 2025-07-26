// part8/library-frontend/src/App.jsx

// import { useState, useEffect } from "react";
// import { useApolloClient, useQuery } from '@apollo/client'
// import Authors from "./components/Authors";
// import Books from "./components/Books";
// import NewBook from "./components/NewBook";
// import Recommend from "./components/Recommend";
// import Login from "./components/Login";
// import Notify from "./components/Notify";
// import { ME } from "./queries";

// const App = () => {
//   const [page, setPage] = useState("authors");
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [token, setToken] = useState(null);
//   const [selectedGenre, setSelectedGenre] = useState("");
//   const client = useApolloClient();

//   const userResult = useQuery(ME);
//   const favoriteGenre = userResult?.data?.me?.favoriteGenre;

//   useEffect(() => {
//     const localUserToken = localStorage.getItem("app-user-token");
//     if (localUserToken) {
//       setToken(localUserToken);
//     }
//   }, []);

//   const notify = (message) => {
//     setErrorMessage(message);
//     setTimeout(() => {
//       setErrorMessage(null);
//     }, 10000);
//   };

//   const handleLogin = (token) => {
//     setToken(token);
//     localStorage.setItem("app-user-token", token);
//     setPage("authors");
//   }

//   const handleLogout = () => {
//     setToken(null);
//     localStorage.clear();
//     client.resetStore();
//     setPage("authors");
//   };

//   const handleGenreChange = (event) => {
//     setSelectedGenre(event.target.value);
//   };

//   return (
//     <div>
//       <Notify errorMessage={errorMessage} />
//       <div>
//         <button onClick={() => setPage("authors")}>authors</button>
//         <button onClick={() => setPage("books")}>books</button>
//         {token ? (
//           <>
//             <button onClick={() => setPage("add")}>add book</button>
//             <button onClick={() => setPage("recommend")}>recommend</button>
//             <button onClick={handleLogout}>logout</button>
//           </>
//         ) : (
//           <button onClick={() => setPage("login")}>login</button>
//         )}
//       </div>
//       <Authors
//         show={page === "authors"}
//         setError={notify}
//       />
//       <Books
//         show={page === "books"}
//         selectedGenre={selectedGenre}
//         handleGenreChange={handleGenreChange}
//       />
//       <Recommend
//         show={page === "recommend"}
//         favoriteGenre={favoriteGenre}
//       />
//       <NewBook
//         show={page === "add"}
//         setError={notify}
//         favoriteGenre={favoriteGenre}
//       />
//       <Login
//         show={page === "login"}
//         setError={notify}
//         handleLogin={handleLogin}
//       />
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect } from "react"
import { useApolloClient, useQuery } from "@apollo/client"
import {
  ME,
  ALL_BOOKS,
  BOOK_ADDED
} from "./queries"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import Recommend from "./components/Recommend"
import Login from "./components/Login"
import Notify from "./components/Notify"

const App = () => {
  const [page, setPage] = useState("authors")
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const [selectedGenre, setSelectedGenre] = useState("")
  const client = useApolloClient()

  const userResult = useQuery(ME)
  const favoriteGenre = userResult?.data?.me?.favoriteGenre

  useEffect(() => {
    const token = localStorage.getItem("app-user-token")
    if (token) setToken(token)
  }, [])

  // Subscription for new books
  useEffect(() => {
    const subscription = client.subscribe({ query: BOOK_ADDED }).subscribe({
      next({ data }) {
        const newBook = data.bookAdded
        window.alert(`New book added: "${newBook.title}" by ${newBook.author.name}`)

        const updateCache = (genre) => {
          try {
            const existing = client.readQuery({
              query: ALL_BOOKS,
              variables: genre ? { genre } : {}
            })
            if (existing?.allBooks.some(b => b.id === newBook.id)) return
            const updated = existing
              ? { allBooks: existing.allBooks.concat(newBook) }
              : { allBooks: [newBook] }

            client.writeQuery({
              query: ALL_BOOKS,
              data: updated,
              variables: genre ? { genre } : {}
            })
          } catch (e) {
            // ignore if cache not yet initialized
          }
        }

        updateCache(null)
        if (favoriteGenre) updateCache(favoriteGenre)
      },
      error(err) {
        console.error("Book subscription error", err)
      }
    })

    return () => subscription.unsubscribe()
  }, [client, favoriteGenre])

  const notify = (msg) => {
    setErrorMessage(msg)
    setTimeout(() => setErrorMessage(null), 10000)
  }

  const handleLogin = (tok) => {
    setToken(tok)
    localStorage.setItem("app-user-token", tok)
    setPage("authors")
  }

  const handleLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage("authors")
  }

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value)
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Authors show={page === "authors"} setError={notify} />

      <Books
        show={page === "books"}
        selectedGenre={selectedGenre}
        handleGenreChange={handleGenreChange}
      />

      <Recommend show={page === "recommend"} favoriteGenre={favoriteGenre} />

      <NewBook show={page === "add"} setError={notify} favoriteGenre={favoriteGenre} />

      <Login show={page === "login"} setError={notify} handleLogin={handleLogin} />
    </div>
  )
}

export default App
