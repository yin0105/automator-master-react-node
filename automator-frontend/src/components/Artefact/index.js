import React from 'react'
import { 
    TextField, 
    Grid, 
    Button, 
    Typography, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel
} from '@material-ui/core';


export default function (props) {

    const setFormData = (name, value) => {
        props.setArtefact(name, value);
    }

    const setSaveAction = (value) => {
        props.setSaveAction(value);
    }

    const { data, FormElementProps } = props;

    return (
        <>
            <Typography variant="h6" className="mb-8 pb-3" align="left">Result</Typography>         
            <Grid container spacing={1}>
                {/* Start and End Date */}
                <TextField 
                    {...FormElementProps}                                    
                    label="Start Date"
                    value={data.artefact.startDate}
                    onChange={e => setFormData('startDate', e.target.value)}
                />
                <TextField 
                    {...FormElementProps}
                    label="End Date"
                    value={data.artefact.endDate}
                    onChange={e => setFormData('endDate', e.target.value)}
                />
                <TextField 
                    {...FormElementProps}
                    label="Article"
                    multiline
                    rows={10}
                    value={data.artefact.article}
                />
                {/* Downloadable Image URL */}
                <TextField 
                    {...FormElementProps}
                    label="Downloadable Image URL"
                    multiline
                    rows={10}
                    value={data.artefact.downloadableImageURL}
                    onChange={e => setFormData('downloadableImageURL', e.target.value)}
                />
                {/* Save Action */}
                <Grid container className="mt-4">
                        <Grid item xs={5} md={5}></Grid>
                        <Grid item xs={3} md={3}>
                            <FormControl {...FormElementProps}>
                                <InputLabel id="saveAction_label">Save Action</InputLabel>
                                <Select 
                                    label="Save Action"
                                    value={data.saveAction}
                                    onChange={e => {
                                        setSaveAction(e.target.value);
                                    }}
                                >                   
                                    <MenuItem value="create">Create</MenuItem>
                                    <MenuItem value="overwrite">Overwrite</MenuItem>
                                    <MenuItem value="merge">Merge</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4} md={4} align="right">
                            <Button variant="outlined" color="primary" size="large" className="mt-2" onClick={props.onSave}>
                                Save to CRIDB
                            </Button>
                        </Grid>
                    </Grid>
            </Grid>
        </>                                                         
    );
}
