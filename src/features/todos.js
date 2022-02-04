import { combineReducers } from "redux";
import {
  mac,
  mat,
  makeFetchingReducer,
  makeSetReducer,
  reduceReducers,
  makeCrudReducer,
} from "./utils";
const asyncTodos = mat("todos");

const asyncMac = (asyncTypes) => [
  mac(asyncTypes[0]),
  mac(asyncTypes[1], "payload"),
  mac(asyncTypes[2], "error"),
];

const [setPending, setFulfilled, setError] = asyncMac(asyncTodos);
/* export const setPending = mac("todos/pending");
export const setFulfilled = mac("todos/fulfilled", "payload");
export const setError = mac("todos/error", "error"); */
export const setComplete = mac("todo/complete", "payload");
export const setFilter = mac("filter/set", "payload");

export const fetchThunk = () => async (dispatch) => {
  dispatch(setPending());
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    const todos = data.slice(0, 10);
    dispatch(setFulfilled(todos));
    //console.log(todos);
  } catch (e) {
    dispatch(setError(e.message));
  }
};

export const filterReducer = makeSetReducer(["filter/set"]);
const crudReducer = makeCrudReducer(["todo/app", "todo/complete"]);
export const fetchingReducer = makeFetchingReducer(asyncTodos);

const fulfilledReducer = makeSetReducer(["todos/fulfilled"]);
export const todosReducer = reduceReducers(crudReducer, fulfilledReducer);

export const reducer = combineReducers({
  todos: combineReducers({
    entities: todosReducer,
    status: fetchingReducer,
  }),
  filter: filterReducer,
});
