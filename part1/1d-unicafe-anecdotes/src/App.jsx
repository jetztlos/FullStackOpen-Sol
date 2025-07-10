import { useState } from 'react';
import Button from './components/Button';
import Statistics from './components/Statistics';

const App = () => {
  // Unicafe state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  // Anecdotes state
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.',
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  const handleGood = () => setGood(good + 1);
  const handleNeutral = () => setNeutral(neutral + 1);
  const handleBad = () => setBad(bad + 1);

  const nextAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  };

  const voteAnecdote = () => {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);
  };

  const maxVotes = Math.max(...votes);
  const topAnecdoteIndex = votes.indexOf(maxVotes);

  return (
    <div>
      <h1>Unicafe</h1>
      <Button onClick={handleGood} text="good" />
      <Button onClick={handleNeutral} text="neutral" />
      <Button onClick={handleBad} text="bad" />
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />

      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <Button onClick={voteAnecdote} text="vote" />
      <Button onClick={nextAnecdote} text="next anecdote" />

      <h1>Anecdote with most votes</h1>
      {maxVotes === 0 ? (
        <p>No votes yet</p>
      ) : (
        <>
          <p>{anecdotes[topAnecdoteIndex]}</p>
          <p>has {maxVotes} votes</p>
        </>
      )}
    </div>
  );
};

export default App;
