import React, { useState } from 'react';
import { 
    TextField,
    Typography, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel,
    Grid,
    Button,
} from '@material-ui/core';
import * as ApiService from "../services/services";

import moment from 'moment';
// import CircleLoading from "../components/Loading/CircleLoading";

import Person from "../components/Person"
import Place from "../components/Place"
import Artefact from "../components/Artefact"

const FormElementProps = {
    fullWidth: true,
    variant: "standard",
    size: "medium",
    className: "mb-4"
}

export default () => {
    const [keyword, setKeyword] = useState("Bayeux_Tapestry");
    const [recordType, setRecordType] = useState("artefact");
    const [saveAction, setSaveAction] = useState("create");
    const [error, setError] = useState(false);

    const dateFormat = (str_date = "", str_format = "") => {
        const date = moment(str_date);
        return date.format(str_format);
    }

    const keywordFormat = (keyword) => {
        keyword = keyword.replace(/\s\s+/g, ' ').trim().replace(' ', '_');
        return keyword;
    }

    const [person, setPerson] = useState({
        birthDate: "",
        deathDate: "",
        birthPlace: "",
        deathPlace: "",
        article: "",
        downloadableImageURL: "",
    });
    const [place, setPlace] = useState({
        coordinate: "",
        article: "",
        downloadableImageURL: "",
    });
    const [artefact, setArtefact] = useState({
        startDate: "",
        endDate: "",
        article: "",
        downloadableImageURL: "",
    });
    
    
    const getPersonForm = async (e) => {
        const res = await ApiService.getDbPediaByKeyword(keywordFormat(keyword));       
        if (res.inValid) {
            setError(true); 
            return;
        }
        const {
            birthDate,
            deathDate,
            comment,
        } = res.data;

        let article = "";
        comment.map((element) => {
            if (element.lang === "en" && article === ""){
                article = element.value;
            }      
        })

        let imageURL = "";
        try{
            const imageList = (await ApiService.getImageFileNames(keyword)).data.result;
            imageList.map(async (image) => {
                const imageName = (await ApiService.getDownloadableImageURL(image)).data.result;
                imageURL += imageName + "\n";
            })
        }catch(ex){imageURL = ""}

        let birth;
        try{birth = dateFormat(birthDate[0].value, "MM/DD/yyyy")}catch(e){birth = ""}
        let death;
        try{death = dateFormat(deathDate[0].value, "MM/DD/yyyy")}catch(e){death = ""}

        let wikiDom = await ApiService.getPerson(keywordFormat(keyword));

        let bPlace;
        try{bPlace = wikiDom.data.result.birthPlace}catch(e){bPlace = ""}
        let dPlace;
        try{dPlace = wikiDom.data.result.deathPlace}catch(e){dPlace = ""}
        
        setPerson({
            birthDate: birth,
            deathDate: death,
            birthPlace: bPlace,
            deathPlace: dPlace,
            article: article,
            downloadableImageURL: imageURL
        });
    }
    const getPlaceForm = async (e) => {
        const res = await ApiService.getDbPediaByKeyword(keywordFormat(keyword));       
        if (res.inValid) {
            setError(true); 
            return;
        }

        const {
            comment,
        } = res.data;
        
        let article = "";
        comment.map((element) => {
            if (element.lang === "en" && article === ""){
                article = element.value;
            }      
        })

        let imageURL = "";
        try{
            const imageList = (await ApiService.getImageFileNames(keyword)).data.result;
            imageList.map(async (image) => {
                const imageName = (await ApiService.getDownloadableImageURL(image)).data.result;
                imageURL += imageName + "\n";
            })
        }catch(ex){imageURL = ""}

        let coord = (await ApiService.getWikiCoord(keywordFormat(keyword))).data.result;

        setPlace({
            coordinate: coord,
            article: article,
            downloadableImageURL: imageURL
        });
    }
    const getArtefactForm = async (e) => {
        const res = await ApiService.getDbPediaByKeyword(keyword);       
        if (res.inValid) {
            setError(true); 
            return;
        }
        const {
            comment,
        } = res.data;
        
        let article = "";
        comment.map((element) => {
            if (element.lang === "en" && article === ""){
                article = element.value;
            }      
        })

        let imageURL = "";
        try{
            const imageList = (await ApiService.getImageFileNames(keyword)).data.result;
            imageList.map(async (image) => {
                const imageName = (await ApiService.getDownloadableImageURL(image)).data.result;
                imageURL += imageName + "\n";
            })
        }catch(ex){imageURL = ""}

        const waiter = (await ApiService.waiter()).data.result;

        setArtefact({
            startDate: "",
            endDate: "",
            article: article,
            downloadableImageURL: imageURL
        });
    }
    
    
    const setPersonForm = (key, value) => {
       
    }
    const setPlaceForm = (key, value) => {
       
    }
    const setArtefactForm = (key, value) => {
       
    }

    const savePersonForm = e => {
        e.preventDefault();
    }
    const savePlaceForm = e => {
        e.preventDefault();
    }
    const saveArtefactForm = e => {
        e.preventDefault();
        
    }
    

    let resultForm;
    if(recordType === "person"){
        resultForm = <Person
        onSave={savePersonForm}
        setSaveAction = {setSaveAction}
        setFormData={setPersonForm}
        data={{person, saveAction}}
        FormElementProps={FormElementProps}
        />;
    }else if(recordType === "place"){
        resultForm = <Place
        onSave={savePlaceForm}
        setSaveAction = {setSaveAction}
        setFormData={setPlaceForm}
        data={{place, saveAction}}
        FormElementProps={FormElementProps}
        />;
    }else if(recordType === "artefact"){
        resultForm = <Artefact
        onSave={saveArtefactForm}
        setSaveAction = {setSaveAction}
        setFormData={setArtefactForm}
        data={{artefact, saveAction}}
        FormElementProps={FormElementProps}
        />;
    }

    const handleSubmit = e => {
        e.preventDefault();
        try{
            if(recordType === "person"){
                getPersonForm();
            }else if(recordType === "place"){
                getPlaceForm();
            }else if(recordType === "artefact"){
                getArtefactForm();
            }
        }catch(ex){
            setError(true); 
            return;
        }
    }

    return (<>
        <Typography variant="h4" className="pb-2" style={{color:"#1e88e5"}} align="center">CRIDB Web Automator</Typography>
        <Grid container className="px-1 py-5" spacing={5}>
            <Grid item xs={1} md={2}></Grid>
            <Grid item xs={5} md={3} className="pr-3">
                <Typography variant="h6" className="mb-8 pb-3" align="left">Search</Typography>
                <FormControl {...FormElementProps}>
                    <InputLabel id="recordType">Record type</InputLabel>
                    <Select 
                        label="Record type"
                        value={recordType}
                        onChange={e => {setSaveAction("create"); setRecordType(e.target.value);}}
                    >
                        <MenuItem value="person">Person</MenuItem>
                        <MenuItem value="place">Place</MenuItem>
                        <MenuItem value="artefact">Artefact</MenuItem>
                    </Select>
                </FormControl>
                <form onSubmit={handleSubmit} className="mb-4">
                    <TextField 
                        fullWidth
                        className="mb-2"
                        variant="standard"
                        value={keyword}
                        onChange={e => {
                            if (error) setError(false);
                            setKeyword(e.target.value);
                        }}
                        
                        label="Keyword Name"
                        error={error}
                        helperText={error ? "Can not find data." : ""}
                    />
                </form>
                <Grid container align="right">
                    <Grid item xs={12} md={12}>
                        <Button variant="outlined" color="primary" size="large" onClick={handleSubmit}>
                            Go
                        </Button>
                    </Grid>
                </Grid> 
            </Grid>
            <Grid item xs={5} md={5}>
                {resultForm}
            </Grid>
            <Grid item xs={1} md={2}></Grid>
        </Grid>
         
    </>);
}