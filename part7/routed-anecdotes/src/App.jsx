// part7/routed-anecdotes/src/App.jsx

import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom';
import { useField } from './hooks';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

// Menu Component
const Menu = () => {
  const padding = {
    paddingRight: 5,
  };
  return (
    <div>
      <Link to="/" style={padding}>
        anecdotes
      </Link>
      <Link to="/create" style={padding}>
        create new
      </Link>
      <Link to="/about" style={padding}>
        about
      </Link>
    </div>
  );
};

// Notification Component
const Notification = ({ message }) => {
  if (!message) return null;

  return (
    <div className="notification">
      {message}
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string,
};

// Anecdote Component
const Anecdote = ({ anecdote }) => {
  return (
    <div>
      <h2>{anecdote.content}</h2>
    </div>
  );
};

Anecdote.propTypes = {
  anecdote: PropTypes.shape({
    content: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    info: PropTypes.string,
    votes: PropTypes.number,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

// AnecdoteList Component
const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map((anecdote) => (
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      ))}
    </ul>
  </div>
);

AnecdoteList.propTypes = {
  anecdotes: PropTypes.array.isRequired,
};

// About Component
const About = () => (
  <div className="about-container">
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    <em>
      An anecdote is a brief, revealing account of an individual person or an
      incident...
    </em>
    <p>
      Software engineering is full of excellent anecdotes, at this app you can
      find the best and add more.
    </p>
  </div>
);

// Footer Component
const Footer = () => (
  <div>
    Anecdote app for <a href="https://fullstackopen.com/">Full Stack Open</a>.
    See{" "}
    <a href="https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js">
      https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js
    </a>{" "}
    for the source code.
  </div>
);

// CreateNew Component
const CreateNew = ({ addNew, setNotification }) => {
  const { onReset: onContentReset, ...content } = useField('text');
  const { onReset: onAuthorReset, ...author } = useField('text');
  const { onReset: onInfoReset, ...info } = useField('text');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    });
    setNotification(`A new anecdote '${content.value}' created successfully!`);
    setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
  };

  const handleReset = (e) => {
    e.preventDefault();
    onContentReset();
    onAuthorReset();
    onInfoReset();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button onClick={handleSubmit}>create</button>
        <button onClick={handleReset}>reset</button>
      </form>
    </div>
  );
};

CreateNew.propTypes = {
  addNew: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
};

// App Component
const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1,
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2,
    },
  ]);

  const [notification, setNotification] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNotification(null);
    }, 4000);
    return () => {
      clearTimeout(timeout);
    };
  }, [notification]);

  const match = useMatch('/anecdotes/:id');
  const anecdote = match
    ? anecdotes.find((anecdote) => anecdote.id === Number(match.params.id))
    : null;

  const addNew = (anecdote) => {
    anecdote.id = uuidv4(); // Generate unique ID
    setAnecdotes(anecdotes.concat(anecdote));
  };

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <Notification message={notification} />
      <Routes>
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/create"
          element={<CreateNew addNew={addNew} setNotification={setNotification} />}
        />
        <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote} />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
