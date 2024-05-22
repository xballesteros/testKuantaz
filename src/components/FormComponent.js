import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';

const FormComponent = () => {
    const [formConfig, setFormConfig] = useState(null);
    const [formData, setFormData] = useState({});
    const [selectedValue, setSelectedValue] = useState('0');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        axios.get('https://run.mocky.io/v3/5320545a-7539-4c71-9730-8f9f4de3aec6')
            .then(response => {
                const fixedJsonString = response.data.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
                const fixedJsonString2 = fixedJsonString.replace(/'/g, '"');
                const fixedJsonString3 = fixedJsonString2.replace(/("value":\s*null\s*),\s*/g, "$1");
                const jsonData = JSON.parse(fixedJsonString3);

                // Resolver nombres duplicados
                const nameCount = {};
                jsonData.data.forEach(field => {
                    if (nameCount[field.name]) {
                        const originalName = field.name;
                        let newName;
                        let counter = 1;
                        do {
                            newName = `${originalName}_${counter}`;
                            counter++;
                        } while (nameCount[newName]);
                        field.name = newName;
                    }
                    nameCount[field.name] = true;
                });

                setFormConfig(jsonData);
                const initialFormData = jsonData.data.reduce((acc, field) => {
                    acc[field.name] = field.value || '';
                    return acc;
                }, {});
                setFormData(initialFormData);
            })
            .catch(error => {
                console.error('Error fetching form data:', error);
            });
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeRadio = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form data submitted:', formData);
        console.log('Radio submitted:', selectedValue);
        handleClickOpen();
        // Procesar los datos del formulario aquí
    };

    const renderField = (field) => {
        switch (field.type) {
            case 'TextInput':
            case 'TextEmail':
                return (
                    <TextField
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        required={field.isRequired}
                        disabled={field.disabled}
                        type={field.type === 'TextEmail' ? 'email' : 'text'}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="filled"
                    />
                );
            case 'Textarea':
                return (
                    <TextField
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        required={field.isRequired}
                        disabled={field.disabled}
                        multiline
                        rows={4}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="filled"
                    />
                );
            default:
                return null;
        }
    };

    if (!formConfig) {
        return <div>Loading...</div>;
    }

    if (formConfig && Array.isArray(formConfig.data)) {
        return (
            <Container>
                <Typography variant="h3" component="h3" gutterBottom>Formulario Dinámico</Typography>
                <form onSubmit={handleSubmit}>
                    {formConfig.data.map((field) => renderField(field))}
                    <br />
                    <br />
                    <FormControl component="fieldset">
                        <FormLabel component="legend">¿Cual es su nivel de satisfacción?</FormLabel>
                        <Box display="flex" alignItems="center">
                            <Typography>No Mucho</Typography>
                            <RadioGroup
                                row
                                aria-label="satisfaccion"
                                name="satisfaccion"
                                value={selectedValue}
                                onChange={handleChangeRadio}
                                style={{ marginLeft: '10px', marginRight: '10px' }}
                            >
                                <FormControlLabel value="1" control={<Radio />} label="1" />
                                <FormControlLabel value="2" control={<Radio />} label="2" />
                                <FormControlLabel value="3" control={<Radio />} label="3" />
                                <FormControlLabel value="4" control={<Radio />} label="4" />
                                <FormControlLabel value="5" control={<Radio />} label="5" />
                            </RadioGroup>
                            <Typography>Mucho</Typography>
                        </Box>
                    </FormControl>
                    <br />
                    <br />
                    <Button type="submit" variant="contained" color="primary">
                        Confirmar
                    </Button>
                </form>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{"Sus respuestas al formulario son:"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <ul>
                                {Object.entries(formData).map(([key, value]) => (
                                    <li key={key}>
                                        {key}: {value.toString()}
                                    </li>
                                ))}
                            </ul>
                            <Typography>
                                Nivel de satisfacción: {selectedValue}
                            </Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary" autoFocus>
                            Aceptar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        );
    } else {
        console.error('Error: formConfig.data is not defined or not an array');
        return null; // O cualquier manejo de error que prefieras
    }
};

export default FormComponent;
