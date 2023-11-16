import { useEffect, useReducer } from "react";

const INITIAL_BITCOINS = 10;

const initialState = {
  bitcoins: Number(localStorage.getItem("bitcoins")) || INITIAL_BITCOINS,
  investing: false,
  amount: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "startInvesting":
      return {
        ...state,
        investing: true,
      };
    case "invest":
      if (state.bitcoins >= state.amount) {
        return {
          ...state,
          investing: false,
          amount: null,
          bitcoins: state.bitcoins + (Math.random() * 2 - 1) * state.amount,
        };
      } else {
        return state;
      }
    case "changeAmount":
      return {
        ...state,
        amount: Number(action.payload),
      };
    case "restart":
      return { ...state, bitcoins: INITIAL_BITCOINS };
    default:
      throw new Error("Action type not recognized");
  }
}

function App() {
  const [{ bitcoins, investing, amount }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(
    function () {
      localStorage.setItem("bitcoins", bitcoins);
    },
    [bitcoins]
  );

  return (
    <>
      <h1>Hi Bitcoiner!</h1>
      <div>
        <hr />
        <p>Number of Bitcoins: ₿{bitcoins.toFixed(2)}</p>
        <hr />
      </div>
      <div>
        {investing ? (
          <>
            <input
              type="number"
              placeholder="Bitcoins to invest"
              value={amount}
              onChange={(e) =>
                dispatch({ type: "changeAmount", payload: e.target.value })
              }
            />
            &nbsp;
            <button onClick={() => dispatch({ type: "invest" })}>Invest</button>
          </>
        ) : (
          <button
            disabled={investing}
            onClick={() => dispatch({ type: "startInvesting" })}
          >
            Invest in Bitcoin
          </button>
        )}
      </div>
      <br />
      <button onClick={() => dispatch({ type: "restart" })}>Restart</button>
    </>
  );
}

export default App;
