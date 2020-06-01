import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Typography, TextField, Select, MenuItem, Switch, Button, FormControlLabel } from '@material-ui/core'
import { Save } from '@material-ui/icons'
import { lightBlue } from '../colors'
import Axios from 'axios'
import Apis from '../Apis'


let AddContainmentArea = props => {

    const [blocks, setBlocks] = useState([])
    const [containmentStatus, setContainmentStatus] = useState(true)

    const [block, setBlock] = useState(null)

    useEffect(() => {
        loadBlocks()
        return () => {
            
        }
    }, [])


    let loadBlocks = () => {
        Axios.get(Apis.area_blocks).then(res => {
            if (res.status == '200') {
                setBlocks(res.data.blocks)
            }
        }).catch(err => alert("Failed To Load Blocks"))
    }

    let sortByName = inputArray => {
        return inputArray.sort((aone, atwo) => {
            if(aone.name > atwo) return 1
            else if (aone.name < atwo.name) return -1
            else return 0
        })
    }

    let save = () => {
        
    }

    return (
        <div style={{height: '100vh'}}>
            <div style={{padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Typography variant="h4" style={{color: lightBlue}}>Add New Containment Area</Typography>
            </div>

            <div style={{marginTop: 20, padding: 10,display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '35%'}}>
                <TextField variant="outlined" label="Name" />
                <Select label="Area Block" variant="outlined" value={block} onChange={event => 
                    setBlock(event.target.value)} style={{marginTop: 10}} >
                    {sortByName(blocks).map(block => (
                        <MenuItem value={block._id}>{block.name}</MenuItem>
                    ))}
                </Select>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 10}}>
                    <Typography variant="subtitle2">Containment Status</Typography>
                    <Switch checked={containmentStatus} onChange={event => setContainmentStatus(event.target.checked)}
                     />
                </div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <Button variant="contained" style={{backgroundColor: lightBlue, color: '#fafafa'}}
                    startIcon={<Save />} >
                        Save And Add Containment Source Persons
                    </Button>
                </div>
            </div>
        </div>
    )
}

let mapStateToProps = state => {
    return {
        admin: state.admin
    }
}

export default connect(mapStateToProps)(AddContainmentArea)