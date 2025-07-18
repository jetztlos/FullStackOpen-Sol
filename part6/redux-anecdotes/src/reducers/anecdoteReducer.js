// part6/redux-anecdotes/src/reducers/anecdoteReducer.js

import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

// Action creator for initializing anecdotes
export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes))
  }
}

// Action creator for creating a new anecdote
export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew({ content, votes: 0 })
    dispatch(addAnecdote(newAnecdote))
  }
}

// Action creator for increasing the vote of an anecdote
export const increaseVote = (anecdote) => {
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.updateVote({
      ...anecdote,
      votes: anecdote.votes + 1,
    });
    dispatch(addVote(updatedAnecdote)); // Dispatch the full updated anecdote
  }
}

// Slice definition using createSlice from Redux Toolkit
const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addVote: (state, action) => {
      const updatedAnecdote = action.payload;
      const index = state.findIndex((a) => a.id === updatedAnecdote.id);
      if (index !== -1) {
        state[index] = updatedAnecdote;
      }
    },
    addAnecdote: (state, action) => {
      state.push(action.payload)
    },
    setAnecdotes: (_state, action) => {
      return action.payload
    }
  }
});

export const { addVote, addAnecdote, setAnecdotes } = anecdoteSlice.actions;

export default anecdoteSlice.reducer;
