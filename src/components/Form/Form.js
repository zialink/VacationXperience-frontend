import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, Typography, Paper } from "@material-ui/core";
//import FileBase from "react-file-base64";
import Compress from "compress.js";
import { useDispatch, useSelector } from "react-redux";

import { createPost, updatePost } from "../../actions/posts";
import useStyles from "./styles";

const Form = ({ currentId, setCurrentId }) => {
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem("profile"));

  const [postData, setPostData] = useState({
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
  });
  const post = useSelector((state) =>
    currentId ? state.posts.find((p) => p._id === currentId) : null
  );

  const dispatch = useDispatch();
  const fileInput = useRef();

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentId) {
      dispatch(
        updatePost(currentId, { ...postData, name: user?.result?.name })
      );
    } else {
      dispatch(createPost({ ...postData, name: user?.result?.name }));
    }
    clear();
  };

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please Sign In to create your own memories and like other's memories
        </Typography>
      </Paper>
    );
  }

  const clear = (e) => {
    setCurrentId(null);
    setPostData({
      title: "",
      message: "",
      tags: "",
      selectedFile: (fileInput.current.value = ""),
    });
  };

  const compress = new Compress();
  const fileUpload = async (e) => {
    const file = e.target.files[0];
    try {
      const resizedImage = await compress.compress([file], {
        size: 4, // the max size in MB, defaults to 2MB
        quality: 1, // the quality of the image, max is 1,
        maxWidth: 300, // the max width of the output image, defaults to 1920px
        maxHeight: 300, // the max height of the output image, defaults to 1920px
        resize: true, // defaults to true, set false if you do not want to resize the image width and height
      });
      const img = resizedImage[0];
      const base64str = img.prefix + img.data;
      //const imgExt = img.ext;
      //const resizedFile = Compress.convertBase64ToFile(base64str, imgExt);
      setPostData({ ...postData, selectedFile: base64str });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper className={classes.paper}>
      <form
        autoComplete="off"
        noValidate
        className={`${classes.root} ${classes.form}`}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">
          {currentId ? "Edit Your" : "Create a"} Vacation Experience!
        </Typography>
        <TextField
          name="title"
          variant="outlined"
          label="title"
          fullWidth
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <TextField
          name="message"
          variant="outlined"
          label="message"
          fullWidth
          value={postData.message}
          onChange={(e) =>
            setPostData({ ...postData, message: e.target.value })
          }
        />
        <TextField
          name="tags"
          variant="outlined"
          label="tags"
          fullWidth
          value={postData.tags}
          onChange={(e) =>
            setPostData({
              ...postData,
              tags: e.target.value.replace(/\s/g, "").split(","),
            })
          }
        />
        <div className={classes.fileInput}>
          <input
            accept="image/*"
            type="file"
            name="selectedFile"
            ref={fileInput}
            label="selectedFile"
            onChange={(e) => fileUpload(e)}
          />
        </div>
        <Button
          className={classes.buttonSubmit}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          fullWidth
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={clear}
          fullWidth
        >
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default Form;
