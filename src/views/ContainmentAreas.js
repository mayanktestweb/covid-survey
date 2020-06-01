import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Axios from 'axios'
import Apis from '../Apis'
import { CircularProgress, Button, Dialog, TextField, Switch, Typography, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core'
import { Add, Save, Edit, Delete } from '@material-ui/icons'
import { lightBlue, lightOrange, errorRed } from '../colors'
import { useHistory } from 'react-router-dom'


let ContainmentAreas = props => {

    const [loading, setLoading] = useState(false)
    const [containmentAreas, setContainmentAreas] = useState([])

    const [openAddContainmentArea, setOpenAddContainmentArea] = useState(false)
    const [openEditContainmentArea, setOpenEditContainmentArea] = useState(false)
    const [openDeleteArea, setOpenDeleteArea] = useState(false)
    const [areaToEdit, setAreaToEdit] = useState(null)

    const [newBlockName, setNewBlockName] = useState("")
    const [blocks, setBlocks] = useState([])
    const [containmentStatus, setContainmentStatus] = useState(true)

    const [block, setBlock] = useState(null)

    let history = useHistory()

    useEffect(() => {
        loadContainmentAreas()
        loadBlocks()
        return () => {
            
        }
    }, [])

    let loadContainmentAreas = () => {
        setLoading(true)
        Axios.get(Apis.containment_areas).then(res => {
            if(res.status == '200') {
                setContainmentAreas(res.data.containment_areas)
            }
        }).catch(err => alert("Something went wrong"))
        .finally(() => setLoading(false))
    }

    let loadBlocks = () => {
        Axios.get(Apis.area_blocks).then(res => {
            if (res.status == '200') {
                setBlocks(res.data.blocks)
            }
        }).catch(err => alert("Failed To Load Blocks"))
    }


    let sortByName = areas => {
        return areas.sort((aone, atwo) => {
            if(aone.name > atwo.name) return 1
            else if(aone.name < atwo.name) return -1
            else return 0
        })
    }

    let addContainmentArea = () => {
        //history.push("/admin/add_containment_area")
        setOpenAddContainmentArea(true)
    }

    let saveContainmentArea = () => {
        Axios({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+props.admin.token
            },

            url: Apis.add_containment_area,
            method: 'POST',
            data: {
                name: newBlockName,
                block: block._id,
                blockName: block.name,
                containmentStatus: containmentStatus
            }
        }).then(res => {
            if(res.status == '200') {
                setContainmentAreas([...containmentAreas, res.data.containment_area])
                setNewBlockName("")
                setBlock(null)
                setContainmentStatus(true)
                
                alert("Containment Area Created")
            }
        }).catch(err => alert("Something went wrong"))
        .finally(() => setOpenAddContainmentArea(false))
    }

    let startEditingArea = area => {
        setAreaToEdit(area)
        setNewBlockName(area.name)
        setBlock(blocks.find(blk => {if(blk._id == area.block) return blk}))
        setContainmentStatus(area.containmentStatus)
        setOpenEditContainmentArea(true)
    }

    let cancelEditingArea = area => {
        setAreaToEdit(null)
        setNewBlockName("")
        setBlock(null)
        setContainmentStatus(true)
        setOpenEditContainmentArea(false)
    }

    let edit = () => {
        Axios({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+props.admin.token
            },

            url: Apis.edit_containment_area,
            method: 'POST',
            data: {
                areaId: areaToEdit._id,
                name: newBlockName,
                block: block._id,
                blockName: block.name,
                containmentStatus: containmentStatus
            }
        }).then(res => {
            if(res.status == '200') {
                let areas =  [...containmentAreas]
                areas.forEach((area, index) => {
                    if(area._id == areaToEdit._id) areas.splice(index, 1, res.data.area)
                })
                setContainmentAreas(areas)
                setAreaToEdit(null)
                setNewBlockName("")
                setBlock(null)
                setContainmentStatus(true)
                
                alert("Containment Area Edited")
            }
        }).catch(err => alert("Something went wrong"))
        .finally(() => setOpenEditContainmentArea(false))
    }

    let startDeletingArea = area => {
        setAreaToEdit(area)
        setOpenDeleteArea(true)
    }

    let cancelDeletingArea = () => {
        setAreaToEdit(false)
        setOpenDeleteArea(false)
    }

    let deleteArea = () => {
        Axios({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+props.admin.token
            },
            url: Apis.delete_containment_area,
            method: 'POST',
            data: {
                areaId: areaToEdit._id
            }
        }).then(res => {
            if(res.status == '200') {
                let areas = [...containmentAreas]
                areas.forEach((area, index) => {
                    if(area._id == areaToEdit._id) areas.splice(index, 1)
                })

                setContainmentAreas(areas)
                alert("Containment Area Deleted")
            }
        }).catch(err => alert("Soemthing went wrong"))
        .finally(() => {
            setOpenDeleteArea(false)
            setAreaToEdit(null)
        })
    }

    let addContainmentSource = area => {
        history.push("/admin/add_containment_source/", area)
    }

    return (
        <div style={{height: '100vh'}} >
            {loading &&
                <div style={{height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <CircularProgress />
                </div>
            }

            {!loading &&
                <div>
                    <div style={{position: 'fixed', top: 0, padding: 10, display: 'flex', width: '100%', 
                    flexDirection: 'row', zIndex: 10, backgroundColor: 'white'}}>
                        <Button variant="contained" style={{backgroundColor: lightBlue,
                        color: '#fafafa' }} startIcon={<Add />} onClick={() => addContainmentArea()} >
                            Add New Containment Area
                        </Button>
                    </div>

                    <div style={{marginTop: 80}}>
                        {sortByName(containmentAreas).map(area => (
                            <div style={{padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                <Typography variant="subtitle2" >{area.name}</Typography>
                                <Typography variant="subtitle2" >{area.blockName}</Typography>
                                <Button variant="contained" startIcon={<Edit/>} 
                                style={{backgroundColor: lightOrange, color: '#fafafa'}}
                                onClick={() => startEditingArea(area)} >
                                    Edit
                                </Button>

                                <Button variant="contained" startIcon={<Add/>} 
                                style={{backgroundColor: lightBlue, color: '#fafafa'}} 
                                onClick={() => addContainmentSource(area)}>
                                    Add Containment Source Persons
                                </Button>

                                <Button variant="contained" startIcon={<Delete/>} 
                                style={{backgroundColor: errorRed, color: '#fafafa'}} 
                                onClick={() => startDeletingArea(area)} >
                                    Delete
                                </Button>

                            </div>
                        ))}
                    </div>

                    <Dialog open={openAddContainmentArea} onClose={() => setOpenAddContainmentArea(false)} >
                        <div style={{padding: 20,display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 250}}>
                            <TextField variant="outlined" label="Name" value={newBlockName} onChange={event => setNewBlockName(event.target.value)} />
                            <FormControl variant="outlined" style={{marginTop: 10}} >
                                <InputLabel id="select-label" >Area Block</InputLabel>
                                <Select labelId="select-label" label="Area Block" value={block} onChange={event => 
                                    setBlock(event.target.value)} >
                                    {sortByName(blocks).map(block => (
                                        <MenuItem value={block}>{block.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 10}}>
                                <Typography variant="subtitle2">Containment Status</Typography>
                                <Switch checked={containmentStatus} onChange={event => setContainmentStatus(event.target.checked)}
                                />
                            </div>
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <Button variant="contained" style={{backgroundColor: lightBlue, color: '#fafafa'}}
                                startIcon={<Save />} onClick={() => saveContainmentArea()} >
                                    Save
                                </Button>

                                <Button variant="text" style={{color: lightBlue, marginLeft: 10}}
                                onClick={() => setOpenAddContainmentArea(false)} >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog open={openEditContainmentArea} onClose={() => cancelEditingArea()} >
                        <div style={{padding: 20,display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 250}}>
                            <TextField variant="outlined" label="Name" value={newBlockName} onChange={event => setNewBlockName(event.target.value)} />
                            <FormControl variant="outlined" >
                                <InputLabel id="select-label" >Area Block</InputLabel>
                                <Select labelId="select-label" label="Area Block" value={block} onChange={event => 
                                    setBlock(event.target.value)} style={{marginTop: 10}} >
                                    {sortByName(blocks).map(block => (
                                        <MenuItem value={block}>{block.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 10}}>
                                <Typography variant="subtitle2">Containment Status</Typography>
                                <Switch checked={containmentStatus} onChange={event => setContainmentStatus(event.target.checked)}
                                />
                            </div>
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <Button variant="contained" style={{backgroundColor: lightBlue, color: '#fafafa'}}
                                startIcon={<Save />} onClick={() => edit()} >
                                    Save
                                </Button>

                                <Button variant="text" style={{color: lightBlue, marginLeft: 10}}
                                onClick={() => cancelEditingArea()} >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog open={openDeleteArea} onClose={() => cancelDeletingArea()} >
                        <div style={{padding: 20}}>
                            <Typography>Are sure you want to delete {(areaToEdit !== null) ? areaToEdit.name : '' } </Typography>
                            <div>
                                <Button variant="contained" style={{backgroundColor: errorRed, 
                                    color: '#fafafa'}} onClick={() => deleteArea()} >
                                    Yes, Delete
                                </Button>
                                <Button variant="text" style={{color: errorRed}} onClick={() => cancelDeletingArea()} >
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

export default connect(mapStateToProps)(ContainmentAreas)