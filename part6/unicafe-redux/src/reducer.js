// part6/unicafe-redux/src/reducer.js

const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log('Current state before action: ', state)  // Debugging log before any action

  switch (action.type) {
    case 'GOOD':
      console.log('State after GOOD action: ', { ...state, good: state.good + 1 }) // Debugging log
      return { ...state, good: state.good + 1 }
    case 'OK':
      console.log('State after OK action: ', { ...state, ok: state.ok + 1 }) // Debugging log
      return { ...state, ok: state.ok + 1 }
    case 'BAD':
      console.log('State before BAD action: ', state) // Debugging log before incrementing
      const newBadState = { ...state, bad: state.bad + 1 }
      console.log('State after BAD action: ', newBadState) // Debugging log after incrementing
      return newBadState
    case 'ZERO':
      console.log('State after ZERO action: ', initialState) // Debugging log
      return initialState
    default:
      return state
  }
}

export default counterReducer
