import "rxjs"
import Rx from "rxjs"
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { createAction } from 'redux-actions';

const increment = createAction("INCREMENT")
const doFizzBuzz = createAction("FIZZBUZZ")
const doReset = createAction("RESET")

const incr = (action$, store) =>
  action$.ofType("ADD")
    .map( () => increment(store.getState().counter))

const fizzBuzz = (action$) => {
  let [ other1, fizzbuzz ] = action$
    .ofType("INCREMENT")
    .partition( ({payload}) => payload % 15)
    .do( a => console.log(a))
    .ignoreElements()
  return Rx.Observable.merge(
    fizzbuzz.map( () => doFizzBuzz("fizzbuzz") ),
    other1.map( () => doReset() )
  )
}

const rootEpics = combineEpics(incr, fizzBuzz)
export default createEpicMiddleware(rootEpics)