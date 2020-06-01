import React, { useState } from 'react'
import { FormControl, InputLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'

let TestComponent = props => {

    const [val, setval] = useState(null)

    const [valList, setValList] = useState([
        {name: 'mayank', game: 'cricket'},
        {name: 'steave', game: 'touring'}
    ])

    return (
        <div>
            <FormControl component="fieldset" >
                <RadioGroup value={val} onChange={event => setval(event.target.value)} >
                    {valList.map((person, index) => (
                        <FormControlLabel value={index.toString()} label={person.name} control={<Radio />} />
                    ))}
                </RadioGroup>
            </FormControl>
        </div>
    )
}

export default TestComponent;