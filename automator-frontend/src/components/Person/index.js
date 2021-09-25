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
        props.setPerson(name, value);
    }

    const setSaveAction = (value) => {
        props.setSaveAction(value);
    }

    const { data, FormElementProps } = props;
    
    return (
        <>
            <Typography variant="h6" className="mb-8 pb-3" align="left">Result</Typography>         
            <Grid container spacing={1}>
                {/* Birth and Death Date */}
                <Grid container spacing={5}>
                    <Grid item xs={6} md={6}>
                        <TextField 
                            {...FormElementProps}                                    
                            label="Birth Date"
                            value={data.person.birthDate}
                            onChange={e => setFormData('birthDate', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <TextField 
                            {...FormElementProps}
                            label="Death Date"
                            value={data.person.deathDate}
                            onChange={e => setFormData('deathDate', e.target.value)}
                        />
                    </Grid>
                </Grid>
                {/* Birth and Death Place */}
                <TextField 
                    {...FormElementProps}                                    
                    label="Birth Place"
                    value={data.person.birthPlace}
                    onChange={e => setFormData('birthPlace', e.target.value)}
                />
                <TextField 
                    {...FormElementProps}
                    label="Death Place"
                    value={data.person.deathPlace}
                    onChange={e => setFormData('deathPlace', e.target.value)}
                />
                <TextField 
                    {...FormElementProps}
                    label="Article"
                    multiline
                    rows={10}
                    value={data.person.article}
                />
                {/* Downloadable Image URL */}
                <TextField 
                    {...FormElementProps}
                    label="Downloadable Image URL"
                    multiline
                    rows={10}
                    value={data.person.downloadableImageURL}
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
