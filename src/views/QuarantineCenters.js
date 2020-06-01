import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, CircularProgress, Dialog, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import { lightBlue, lightOrange, errorRed } from '../colors'
import Axios from 'axios'
import Apis from '../Apis'


let QuarantineCenters = props => {

    const [loading, setloading] = useState(false)
    const [quarantineCenters, setQuarantineCenters] = useState([])
    const [blocks, setBlocks] = useState([])

    const [block, setBlock] = useState(null)
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')

    const [openAddQuarantine, setOpenAddQuarantine] = useState(false)

    useEffect(() => {
        loadQuarantineCenters()
        loadingBlocks()
        return () => {
            
        }
    }, [])

    let loadQuarantineCenters = () => {
        setloading(true)
        Axios.get(Apis.quarantine_centers).then(res => {
            if(res.status == '200') {
                setQuarantineCenters(res.data.quarantine_centers)
            }
        }).catch(error => alert("Something went wrong"))
        .finally(() => {
            setloading(false)
        })
    }

    let loadingBlocks = () => {
        setloading(true)
        Axios.get(Apis.area_blocks).then(res => {
            if(res.status == '200') {
                setBlocks(res.data.blocks)
            }
        }).catch(err => alert("Failed to load blocks"))
        .finally(() => setloading(false))
    }

    let sortByName = arr => arr.sort((aone, atwo) => {
        if(aone.name > atwo.name) return 1
        else if (aone.name < atwo.name) return -1
        else return 0
    })

    let addQuarantineCenter = () => {
        Axios({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+props.admin.token
            },
            url: Apis.add_quarantine_center,
            method: 'POST',
            data: {
                name: name,
                address: address
            }
        }).then(res => {
            if(res.status == '200') {
                setQuarantineCenters([...quarantineCenters, res.data.quarantine_center])
                window.alert("Quarantine Center added")
                setOpenAddQuarantine(false)
            }
        }).catch(err => console.log(err))
        .finally(() => {
            setName("")
            setAddress('')
        })
    }

    return (
        <div>
            {loading && 
                <div style={{padding: 50, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <CircularProgress />
                </div>
            }
            {!loading &&
                <div>
                    <div style={{position: 'fixed', top: 0, width: '100%', padding: 10, backgroundColor: 'white', 
                    display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Button variant="contained" style={{backgroundColor: lightBlue, color: '#fafafa'}} 
                        startIcon={<Add />} onClick={() => setOpenAddQuarantine(true)} >
                            Add Quarantine Center
                        </Button>
                    </div>

                    <div>
                        <div style={{marginTop: 80}}>
                            {sortByName(quarantineCenters).map(center => (
                                <div style={{padding: 10, display: 'flex', flexDirection: 'row',
                                alignItems: 'center' }} >
                                    <Typography variant="subtitle2" >{center.name}</Typography>
                                    <Typography variant="subtitle2" style={{marginLeft: 30}}>{center.address}</Typography>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Dialog open={openAddQuarantine} onClose={() => setOpenAddQuarantine(false)} >
                        <div style={{padding: 20,display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 250}}>
                            <TextField variant="outlined" label="Name" value={name} onChange={event => setName(event.target.value)} ></TextField>
                            {/* <FormControl variant="outlined" style={{marginTop: 10}} >
                                <InputLabel id="selectOne">Area Block</InputLabel>
                                <Select labelId="selectOne" label="Area Block" value={block} 
                                onChange={event => setBlock(event.target.value)} >
                                    {sortByName(blocks).map(block => (
                                        <MenuItem value={block} >{block.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl> */}
                            <TextField variant="outlined" label="Address" value={address} onChange={event => setAddress(event.target.value)} style={{marginTop: 10}} />
                            <div style={{marginTop: 10, display: 'flex', flexDirection: 'row'}}>
                                <Button variant="contained" style={{backgroundColor: lightBlue,
                                     color: '#fafafa'}} onClick={() => addQuarantineCenter()} >
                                    Create
                                </Button>
                                <Button variant="text" style={{marginLeft: 10, color: lightBlue}}
                                onClick={() => setOpenAddQuarantine(false)} >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Dialog>

                </div>
            }
        </div>
    )
}


let mapStateToProps = state => {
    return {
        admin: state.admin
    }
}

export default connect(mapStateToProps)(QuarantineCenters)