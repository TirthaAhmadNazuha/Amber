import { usingState } from ".."
import CreateState from "../api/createState"


function IfState(props) {
    const { when, ifTrue, ifElse } = props
    console.log(when, ifTrue, ifElse)
    const [state, setState] = usingState('belon')
    let i = null
    if (when instanceof CreateState) {
        when.onChange = (s) => {
            i = s ? ifTrue : ifElse
            setState(i)
        }
        i = when.value ? ifTrue : ifElse
        setState(i)
    } else {
        i = when ? ifTrue : ifElse
        setState()
    }
    return state
}

export default IfState