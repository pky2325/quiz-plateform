import { useEffect, useState } from "react";
import {
    Container, Typography, Paper, Table,
    TableBody, TableCell, TableContainer, TableHead,
    TableRow, Radio, RadioGroup, FormControlLabel, Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Alert, Stack,
    TextField, Box
} from "@mui/material";

function MyQuiz() {
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [message, setMessage] = useState("");
    const[editQuestion, setEditQuestion] = useState(null);
    const[editTitle, setEditTitle] = useState("");
    const[editText, setEditText] = useState("");
    const[editOptions, setEditOptions] = useState([]);
    const[editCorrectOption, setEditCorrectOption] = useState(""); 


    //LOAD SAVED QUESTION WHEN THE PAGE OPENS

    const loadQuestions = () => {
        try {
            const saved = JSON.parse(
                localStorage.getItem("question") || "[]"
            );
            setQuestions(Array.isArray(saved) ? saved : []);
        } catch {
            setQuestions([]);
            setMessage("Unable to read saved questions.");
        }
    };
    useEffect(() => {
        loadQuestions();
    }, []);

    //CHNAGE ACTIVE / INACTIVE STATUS 
    const handleStatusChange = (id, status) => {
        const updated = questions.map((q) => q.id === id ? { ...q, status } : q);

        localStorage.setItem("question", JSON.stringify(updated));
        setQuestions(updated);
    };


    //DELETE A QUESTION AFTER CONFIRMATION 
    const handleDelete = () => {
        const updated = questions.filter((q) => q.id !== deleteId);
        localStorage.setItem("question", JSON.stringify(updated));
        setQuestions(updated);
        setDeleteId(null);
        setMessage("Question deleted successfully.");
    };

    //OPEN EDIT FORM

    const handleEditOpen = (question)=> {
        setEditQuestion(question);
        setEditTitle(question.title);
        setEditText(question.question);

        setEditOptions([...question.options]);
        setEditCorrectOption(
            String(question.options.indexOf(question.correctOption))
        );
    };
    
    //UPDATE AN OPTION WHILE EDITING

    const handleEditOptionChange =(index, value) =>{
        setEditOptions((previous)=>previous.map((option, i)=> i === index ? value : option));
        
    };


    //SAVE EDITED QUESTION

    const handleEditSave = () => {

        const title = editTitle.trim();
        const questionText = editText.trim();
        const options = editOptions.map((option)=>option.trim());


        if(title.length < 10 || title.length > 30){
            setMessage("Quiz title must be betweeen 10 and 30 characters.");
            return;
        }
        if(questionText.length < 10 || questionText.length>200){
            setMessage("question must be between 10 and 200 characters.");
            return;


        }

        if(options.length < 2){
            setMessage("Atleast two option required to save question");
            return;
        }

        if(options.some((option)=> option === "")){
            setMessage("Please fill in every option.");
            return;
        }

        if(new Set(options).size !== options.length){
            setMessage("Option must be unique");
            return;
        }

        if(editCorrectOption === "" || !options[Number(editCorrectOption)] || options[Number(editCorrectOption)].trim() === ""){
            setMessage("Please select the correct answer.");
            return;
        }


        const updated = questions.map((q)=> q.id === editQuestion.id ? { ...q, title, question: questionText, options, correctOption: options[Number(editCorrectOption)],} :q);
        
        
        
        
        try{ localStorage.setItem("question", JSON.stringify(updated));
            setQuestions(updated);
            setEditQuestion(null);
            setMessage("Question updated successfully.");


        } catch {
            setMessage("unable to update question. please try again.");
        }

    };




    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>

            <Typography variant="h3" align="center" gutterBottom>
                My Quizzes
            </Typography>

            {message && (
                <Alert severity={message.toLowerCase().includes("successfully") ? "success" : "error"} sx={{ my:2 }}
                onClose={()=>setMessage("")}>{message}</Alert>
            )}
            {questions.length === 0 ? (<Paper sx={{ p: 4, mt: 3, textAlign: "center" }}>
                <Typography>
                    No quizzes found.
                </Typography>

                <Typography variant="body2"
                    sx={{ mt: 1 }}> Create and save a question first.</Typography>

            </Paper>
            ) : (
                <TableContainer component={Paper} sx={{ mt: 3 }}>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Quiz Title</b></TableCell>
                                <TableCell><b>Status</b></TableCell>
                                <TableCell><b>Created Date</b></TableCell>
                                <TableCell><b>Actions</b></TableCell>
                            </TableRow>
                        </TableHead>


                        <TableBody>
                            {questions.map((q) => (
                                <TableRow key={q.id}>
                                    <TableCell>
                                        <Button onClick={() => setSelectedQuestion(q)}
                                            sx={{ textTransform: "none" }}>
                                            {q.title}
                                        </Button>
                                    </TableCell>

                                    <TableCell>
                                        <RadioGroup value={q.status || "Active"} onChange={(event) => handleStatusChange(q.id, event.target.value)} >
                                            <FormControlLabel value="Active" control={<Radio size="small" />} label="Active" />
                                            <FormControlLabel value="Inactive" control={<Radio size="small" />} label="Inactive" />


                                        </RadioGroup>
                                    </TableCell>

                                    <TableCell>{q.createdAt ? new Date(q.createdAt).toLocaleDateString() : "-"} </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            <Button size="small" onClick={() => setSelectedQuestion(q)}>View</Button>
                                            <Button size="small" onClick={()=>handleEditOpen(q)}>Edit</Button>
                                            <Button size="small" color="error" onClick={() => setDeleteId(q.id)}>Delete</Button>
                                        </Stack>
                                    </TableCell>




                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}



            {/* VIEW QUESTION DETAILS */}

            <Dialog open={Boolean(selectedQuestion)} onClose={()=>setSelectedQuestion(null)} fullWidth maxWidth="sm">
                <DialogTitle>
                    {selectedQuestion?.title}
                </DialogTitle>

                <DialogContent>
                    <Typography sx={{ mb:2 }}>{selectedQuestion?.question}</Typography>



                    {selectedQuestion?.options?.map((option,index)=>(
                        <Typography key={index} sx={{ mb:1 }} >
                           { index + 1}.{option}
                           {option === selectedQuestion.correctOption ? "✓ Correct Answer" : ""}
                        </Typography>
                    ))}

                </DialogContent>


                <DialogActions>
                    <Button onClick={()=>setSelectedQuestion(null)} >close</Button>
                </DialogActions>

            </Dialog>


            {/* EDIT QUESTION DIALOG */}

            <Dialog open={Boolean(editQuestion)}
            onClose={()=> setEditQuestion(null)} fullWidth maxWidth="sm">
                
                <DialogTitle>Edit Question</DialogTitle>

                <DialogContent>
                    <TextField fullWidth label="Quiz Title"
                    value={editTitle}
                    onChange={(event)=> setEditTitle(event.target.value)} inputProps={{ maxLength: 30 }}
                    helperText={`${editTitle.trim().length}/30 characters(minimum 10)`} sx={{ mt:2, mb:3 }} />


                    <TextField fullWidth label="Question"
                    value={editText}
                    onChange={(event)=>setEditText(event.target.value)} inputProps={{ maxLength: 200}}
                    helperText={`${editText.trim().length}/200 characters(minimum 10)`} sx={{ mb: 3}}/>

                    <Typography variant="h6" sx={{ mb: 1 }} >Options</Typography>

                    {editOptions.map((option, index)=>(
                        <Box key={index} sx={{ display: "flex", alignItems:"center", gap:1, mb:2,}}>

                            <TextField fullWidth size="small" label={`Option ${index + 1}`}
                            value={option}
                            onChange={(event)=>handleEditOptionChange(index, event.target.value)}/>


                            <FormControlLabel label="correct"
                            control={<Radio checked={editCorrectOption === String(index)}
                            onChange={()=>setEditCorrectOption(String(index))} />} />

                        </Box>
                    ))}
                </DialogContent>

                <DialogActions>
                    <Button onClick={()=>setEditQuestion(null)}>Cancel</Button>
                    <Button variant="contained" onClick={handleEditSave}>Save Change</Button>
                </DialogActions>

            </Dialog>



            {/* DELETE CONFIRMATION */}

            <Dialog 
            open={deleteId !==null}
            onClose={()=> setDeleteId(null)}>

                <DialogTitle>Delete Question?</DialogTitle>

                <DialogContent>Are you sure you want to delete this question?</DialogContent>
                <DialogActions>
                    <Button onClick={()=> setDeleteId(null)} >No</Button>
                    <Button color="error" onClick={handleDelete}>Yes,Delete</Button>
                </DialogActions>
            </Dialog>
           
        </Container>
    );

}

export default MyQuiz;