import React, { useState, useEffect } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { Button, TextField, Container, Typography, Grid, Stack } from '@mui/material';
import '../styles/ui.css';

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [index, setIndex] = useState(0);
  const handleChange = (fileList: FileList) => {
    setFiles(Array.from(fileList));
  };

  const onCreate = () => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContents = event.target.result;
        parent.postMessage({ pluginMessage: { type: 'create-texts', fileName: file.name, fileContents } }, '*');
      };
      reader.readAsText(file);
    });
  };

  const handleIndexChange = (event) => {
    setIndex(parseInt(event.target.value));
    parent.postMessage({ pluginMessage: { type: 'update-index', index: event.target.value } }, '*');
  };

  const handleRefreshClick = () => {
    parent.postMessage({ pluginMessage: { type: 'init' } }, '*');
  };

  useEffect(() => {
    window.onmessage = (event) => {
      if (event.data.pluginMessage.type === 'init') {
        setIndex(event.data.pluginMessage.index);
      }
    };
  }, []);

  return (
    <Container>
      <Typography variant="h6" component="h6" marginBottom={2}>
        Create Text Nodes from JSON
      </Typography>
      <Grid container spacing={3} direction="row" justifyContent="space-evenly" alignItems="center">
        <Grid item xs={12}>
          <FileUploader handleChange={handleChange} name="file" multiple={true} types={['JSON']} />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="caption" noWrap>
            {files.length > 0 ? `File name: ${files[0].name} and ${files.length - 1} files` : 'no files uploaded yet'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Stack direction="row"
            spacing={2}>
            <TextField size="small" label="Index" type="number" value={index} onChange={handleIndexChange} />
            <Button size='small' onClick={handleRefreshClick}>Refresh</Button>
          </Stack>
        </Grid>



        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth onClick={onCreate}>
            Create
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
