import { useState } from "react";
import {
    Container, Typography, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, FormControl,
    FormControlLabel, RadioGroup, Radio, Card,
    CardContent, TextField, Box, Alert, Snackbar, Divider
} from "@mui/material";

import { useNavigate } from "react-router-dom";
function CreateQuiz() {
    const navigate = useNavigate();

    //Question type selection dialog

    const [open, setOpen] = useState(false);
    const [questionType, setQuestionType] = useState("MCQ");
    const [showQuestionForm, setShowQuestionForm] = useState(false);

    //Current question form
    const [quizTitle, setQuizTitle] = useState("");
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState([]);
    const [correctOption, setCorrectOption] = useState("");

    //Multiple questions 
    const [questions, setQuestions] = useState([]);


    //Feedback dialogs/messages
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");


    const handleOpen = () => {
        setOpen(true);

    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleContinue = () => {
        setOpen(false);

        if (questionType === "MCQ") {
            setShowQuestionForm(true);
        } else {
            setErrorMessage("Only MCQ (single correct) is currently implemented.");
        }
    };


    //update an option

    const handleAddOption = () => {
        setOptions([...options, ""]);
    };
    const handleOptionChange = (index, value) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);

        //clear selection if the selected option becoms empty

        if (correctOption === String(index) && !value.trim()) {
            setCorrectOption("");
        }
    };

    // Delete an option

    const handleDeleteOption = (index) => {
        if (options.length <= 2) {
            setErrorMessage("Atleast two option required to save question");
            return;
        }

        const updatedOptions = options.filter(
            (_, optionIndex) => optionIndex !== index);


        setOptions(updatedOptions);


        //update the correct options index after deletion 

        if (correctOption !== "") {
            const selectedIndex = Number(correctOption);

            if (selectedIndex === index) {
                setCorrectOption("");
            } else if (selectedIndex > index) {
                setCorrectOption(String(selectedIndex - 1));

            }
        }

    };



    //Validate and add the current question


    const handleAddQuestion = () => {
        const trimmedTitle = quizTitle.trim();
        const trimmedQuestion = questionText.trim();

        if (trimmedTitle.length < 10 || trimmedTitle.length > 30) {
            setErrorMessage("Quiz title must be between 10 and 30 characters.");
            return;
        }

        if (trimmedQuestion.length < 10 || trimmedQuestion.length > 200) {
            setErrorMessage("Question must be between 10 and 200 characters.");
            return;

        }

        const validOptions = options.map((option) => option.trim());

        if (validOptions.length < 2) {

            setErrorMessage("Atleast two option required to save question");
            return;
        }
        if (validOptions.some((option) => option === "")) {
            setErrorMessage("Please fill in every option.");
            return;

        }

        if (new Set(validOptions).size !== validOptions.length) {
            setErrorMessage("options must be unique.");
            return;
        }


        if (correctOption === "") {
            setErrorMessage("Please select the correct answer.");
            return;
        }

        const newQuestion = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            title: trimmedTitle,
            question: trimmedQuestion,
            options: validOptions,
            correctOption: validOptions[Number(correctOption)],
            type: "MCQ",
            status: "Active",
            createdAt: new Date().toISOString(),
        };

        setQuestions((previousQuestions) => [...previousQuestions, newQuestion]);



        //Reset the question fields for the next question

        setQuestionText("");
        setOptions(["", ""]);
        setCorrectOption("");
        setSuccessMessage("Question added to the current quiz.");
    };


    //Save all question in localStorage
    const handleSaveQuiz = () => {
        if (questions.length === 0) {
            setErrorMessage("Please add at least one question before saving.");
            return;
        }

        try {
            const existingData = localStorage.getItem("question");
            const existingQuestion = existingData ? JSON.parse(existingData) : [];


            if (!Array.isArray(existingQuestion)) {
                setErrorMessage("Saved question data is invalid.");
                return;

            }
            //Append new questions without overwriting existing questions
            const updatedQuestions = [...existingQuestion, ...questions,];

            localStorage.setItem("question", JSON.stringify(updatedQuestions));

            setSuccessMessage("Question created successfully");
            setSuccessOpen(true);
        } catch (error) {
            console.error("Error saving questions:", error);
            setErrorMessage("Unable to save questions. Please try again.");
        }
    };


    //start a fresh quiz afer saving 
    const handleCreateAnother = () => {
        setSuccessOpen(false);
        setQuestions([]);
        setQuizTitle("");
        setQuestionText("");
        setOptions(["", ""]);
        setCorrectOption("");
        setShowQuestionForm(false);
    };



    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Typography variant="h3" align="center" gutterBottom>
                Create Quiz
            </Typography>

            <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
                Create Your own quiz questions.

            </Typography>

            {/* Main Card */}
            <Card elevation={3}>
                <CardContent sx={{ textAlign: "center", p: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Create New Quiz

                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Select a question type to get started
                    </Typography>
                    <Button variant="contained" onClick={handleOpen}>
                        Create Quiz

                    </Button>

                </CardContent>

            </Card>


            {/* SELECT QUESTION TYPE DIALOG */}

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">

                <DialogTitle>Select Question Type</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <RadioGroup value={questionType} onChange={(event)=>setQuestionType(event.target.value)}>
                            <FormControlLabel value="MCQ" control={<Radio />} label="MCQ(Single Correct)"/>
                            <FormControlLabel value="MultiMCQ" control={<Radio />} label="MCQ(Multiple Correct)"/>
                             <FormControlLabel value="Short Answer" control={<Radio />} label="Short Answer(2 words)"/>
                              <FormControlLabel value="Description" control={<Radio />} label="Description(2 or 4 sentences"/>

                        </RadioGroup>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleContinue}>Continue</Button>

                </DialogActions>

            </Dialog>

              {/* MCQ QUESTION FORM */}
            {showQuestionForm && (
                <Card elevation={3} sx={{ mt: 4 }}>

                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Create MCQ question

                        </Typography>


                        <TextField fullWidth label="Quiz Title"
                        placeholder="Enter quiz title"
                        value={quizTitle}
                        onChange={(event)=>setQuizTitle(event.target.value)}
                        inputProps={{maxLength:30}}
                        helperText={`${quizTitle.trim().length}/30 characters (minimum 10)`}
                        sx={{ mt:2, mb:3 }} />


                        <TextField fullWidth label="Question"
                        placeholder="Enter your question"
                        value={questionText}
                        onChange={(event)=>setQuestionText(event.target.value)}
                        inputProps={{maxLength:200}}
                        helperText={`${questionText.trim().length}/200 characters (minimum 10)`}
                        sx={{ mb:3 }} />




                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Options

                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb:2 }}>
                            Enter at least two options and select one correct answer.

                        </Typography>



                        {options.map((option, index)=>(
                            <Box key={index} sx={{
                                display: "flex",
                                alignItems: "center",
                                gap:1,
                                flexWrap: "wrap",
                                mb: 2,
                            }} >  

                            <TextField size="small"
                            label={`option ${index + 1}`}
                            value={option}
                            onChange={(event)=>handleOptionChange(index, event.target.value)}
                            sx={{ flex: "1 1 180px"}} />
                            
                            <Button color="error" onClick={()=> handleDeleteOption(index)} >Delete</Button>

                            <FormControlLabel control={<Radio checked={correctOption === String(index)}
                            onChange={(event)=>setCorrectOption(String(index))} />} label="Correct Answer" />

                            </Box>

                        ))}


                        <Button variant="outlined" sx={{ mt: 2, mr: 2 }} onClick={handleAddOption}>Add Option</Button>

                        <Divider sx={{ my:3}} />
                        <Button variant="contained"
                        onClick={handleAddQuestion}
                        sx={{ mr:2, mb: 1}}>Add Question</Button>


                        <Button variant="contained" color="success" onClick={handleSaveQuiz} sx={{ mb: 1 }}>Save Quiz</Button>



                        {/* QUESTION ADDED TO THE CURRENT QUIZ */}

                        {questions.length > 0 && (
                            <Box sx={{ mt:4 }} >
                                <Typography variant="h6" gutterBottom>Question Added: {questions.length}</Typography>

                                {questions.map((question, index)=>(
                                    <Card key={question.id} variant="outlined" sx={{ mt:2 }} >
                                        <CardContent>
                                            <Typography variant="subtitle2"> Question {index + 1} </Typography>
                                            <Typography variant="body1" sx={{ fontWeight:"bold", mt:1 }}  >{question.question}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt:1 }}>Title:{question.title}</Typography>
                                            

                                            {question.options.map((option, optionIndex)=> (
                                                <Typography
                                                key={optionIndex}
                                                variant="body2"
                                                sx={{ fontWeight: "bold", mt:1 }} >
                                                     {optionIndex + 1}. {option}                                            
                                                {option === question.correctOption ? "✓ correct": ""} </Typography>

                                            )

                                            )}


                                        </CardContent>

                                    </Card>

                                ))}


                            </Box>
                        )}



                    </CardContent>
                </Card>
            )}


            {/* SUCCESS DIALOG */}



            <Dialog open={successOpen} onClose={()=>setSuccessOpen(false)}>
                <DialogTitle>Success</DialogTitle>





                <DialogContent>
                   <Typography>Question created successfully</Typography>
                </DialogContent>


                <DialogActions>
                    <Button onClick={()=> {
                        setSuccessOpen(false);
                        navigate("/my-quizzes");
                    } }>
                       View All Questions

                    </Button>

                    <Button variant="contained" onClick={handleCreateAnother}>Close</Button>


                </DialogActions>

            </Dialog>

            {/* ERROR AND SUCCESS NOTIFICATION */}

            <Snackbar
            open={Boolean(errorMessage)}
            autoHideDuration={4000}
            onClose={()=> setErrorMessage("")}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}  >

                <Alert severity="error" onClose={()=> setErrorMessage("")}
                    sx={{ width: "100%"}} >
                    {errorMessage}
                </Alert>
            </Snackbar>



        </Container>

    );
}

export default CreateQuiz;