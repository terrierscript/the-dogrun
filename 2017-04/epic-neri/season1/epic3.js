require("rxjs")
const uuid = require("uuid")
const { ActionsObservable, combineEpics, createEpicMiddleware } = require("redux-observable")
const { Observable } = require("rxjs")
const { startConnection, finishConnection, patchAction, fullfiledAction } = require("../actions")
const { patchApi } = require("../api")

const connectionEpic = (action$) => 
  action$.filter( (action) => {
    return action.meta && !!(action.meta.uuid)
  }).map( (action) => {
    return startConnection(action.meta.uuid)
  })

const createFinish = (action$) => 
  action$.map( (action) => finishConnection(action.meta.uuid ) )

const patchEpic = (action$, store) =>
  action$.ofType("PATCH")
    .switchMap((action) => patchApi() )
    .map( ({ data }) => {
      return fullfiledAction(data.member)
    })
    .withLatestFrom(createFinish(action$))
    .concatMap( ( a ) => a )


describe("", () => {
  it("3", (done) => {
    const initActionMock = { type: "@INIT"}
    const action$ = ActionsObservable.of(
      patchAction(),
      patchAction()
    )

    const epic = combineEpics( 
      connectionEpic,
      patchEpic
    )
    const start = new Date().getTime()
    epic(action$, {})
      .subscribe( (r) => {
        console.log((new Date().getTime() - start) ,r)
      }, (e) => {} , (result) => {
        done()
      })
  })
})