import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { AppBar, Toolbar, Typography, Button, Radio, FormControl, RadioGroup, FormControlLabel } from '@material-ui/core'
import { ArrowForward } from '@material-ui/icons'
import { lightBlue } from '../../colors'
import { setHead as setFamilyHead  } from '../../actions/family'
import { setHead as setMembersHead } from '../../actions/members'
import { useHistory } from 'react-router-dom'


let FamilyHead = props => {

    const [head, setHead] = useState(null)
    const [headIndex, setHeadIndex] = useState(null)

    let history = useHistory()

    useEffect(() => {
        if(headIndex !==  null) {
            setHead(props.members[parseInt(headIndex)])
        }
        
    }, [headIndex])

    let setHeadAndGo = () => {
        props.setFamilyHead(head)
        props.setMembersHead(head)
        history.push("/survey/symptoms")
    }

    return (
        <div>
            <div style={{position: 'fixed', top: 0, width: '100%'}}>
                <AppBar position="static" >
                    <Toolbar style={{backgroundColor: 'green'}} >
                        <Typography variant="h6" style={{color: '#fafafa'}}>
                            Family Head
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>

            <div style={{marginTop: 70}}>
                <div style={{padding: 10, display: 'flex', flexDirection: 'column'}}>
                    <FormControl component="fieldset">
                        <RadioGroup value={headIndex} onChange={event => setHeadIndex(event.target.value)} >
                            {props.members.map((member, index) => (
                                <FormControlLabel value={index.toString()} control={<Radio />} label={member.name+" ("+member.age+")"} />
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <div style={{padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Button variant="contained" style={{backgroundColor: lightBlue, 
                            color: '#fafafa', marginLeft: 10}} 
                            endIcon={<ArrowForward />} onClick={() => setHeadAndGo()} >
                               Save and Go
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    )
}

let mapStateToProps = state => {
    return {
        family: state.family,
        members: state.members
    }
}

let mapActionsToProps = dispatch => {
    return {
        setFamilyHead: head => dispatch(setFamilyHead(head)),
        setMembersHead: head => dispatch(setMembersHead(head))
    }
}

export default connect(mapStateToProps, mapActionsToProps)(FamilyHead)