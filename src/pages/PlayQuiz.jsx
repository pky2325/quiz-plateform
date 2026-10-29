import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Container, Typography, Paper, Button,
    Radio, RadioGroup, FormControlLabel,
    Alert, Box, LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function PlayQuiz() {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const questions = useSelector((state)=> state.questions);



    //PARTICIPANTS NAME AND QUIZ DATA 
    const [fullName, setFullName] = useState("");
    


    //CURRENT QUESTION AND SELECTED ANSWERS

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState([]);

    //LOAD THE PARTICIPANT NAME AND ACTIVE QUESTIONS
    useEffect(() => {
        try {
            const savedName = sessionStorage.getItem("fullName") || "";
            setFullName(savedName);

            const savedQuestions = JSON.parse(
                localStorage.getItem("question") || "[]"
            );

            if (!Array.isArray(savedQuestions)) {
                setErrorMessage("Saved question data is invalid.");
                dispatch({ type: "SET_QUESTIONS", payload: [] });
                return;
            }

            const activeQuestions = savedQuestions.filter(
                (question) =>
                    question.status === "Active" &&
                    question.type === "MCQ" &&
                    Array.isArray(question.options) &&
                    question.options.length >= 2
            );

           dispatch({
            type: "SET_QUESTIONS",
            payload:activeQuestions,
           });
            if (!savedName.trim()) {
                setErrorMessage( "Please enter your full name before starting the quiz.");
                   
              
            } else if (activeQuestions.length === 0) {
                setErrorMessage(
                    "No active question available. Please activate questions in My Quiz.");
            }
        } catch (error) {
            console.error("Error loading quiz:", error);
            setErrorMessage("Unable to load quiz questions.");
        } finally {
            setLoading(false);
        }
    }, []);

    // GET THE CURRENT QUESTION
    const currentQuestion = questions[currentIndex];

    //SELECT AN ANSWER FOR THE CURRENT QUESTION 
    const handleAnswerChange = (event) => {
        setSelectedAnswer(event.target.value);
    };


    //SAVE THE SELECTED ANSWER AND MOVE TO THE NEXT QUESTION 
    const handleNextQuestion = () => {
        if (!currentQuestion || selectedAnswer === "") {
            setErrorMessage("Please select an answer before continuing.")
            return;
        }
        const updatedAnswers = [...answers];
        updatedAnswers[currentIndex] = selectedAnswer;

        setAnswers(updatedAnswers);
        setErrorMessage("");

        if (currentIndex < questions.length - 1) {
            setCurrentIndex((previousIndex) => previousIndex + 1);
            setSelectedAnswer(updatedAnswers[currentIndex + 1] || "");

        }
    };

    //CALCULATE THE RESULT AND NAVIGATE TO THE RESULT PAGE

    const handleSubmitQuiz = () => {
        if (!currentQuestion || selectedAnswer === "") {
            setErrorMessage("Please select an answer before submitting.");
            return;
        }

        const finalAnswers = [...answers];
        finalAnswers[currentIndex] = selectedAnswer;

        let score = 0;
        questions.forEach((question, index) => {
            if (finalAnswers[index] === question.correctOption) {
                score += 1;
            }

        });

        const result = {
            fullName: fullName.trim(),
            totalQuestions: questions.length,
            score,
            answer: finalAnswers,
            completedAt: new Date().toISOString(),
        };

        try {
            dispatch({
                type: "SET_RESULT",
                payload: result,
            });
            sessionStorage.setItem("quizResult", JSON.stringify(result));
            navigate("/result");
        } catch (error) {
            console.error("Error saving quiz result:", error);
            setErrorMessage("Unable to save your result. Please try again.");
        }
    };

    // LOADING STATE 
    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 5 }}>
                <Typography variant="h5" align="center" >
                    Loading quiz...
                </Typography>
                <LinearProgress sx={{ mt: 3 }} />

            </Container>
        );
    }

    //HANDLE MISSING NAME OR UNAVAILABEL QUESTIONS

    if (!fullName.trim() || questions.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 5 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h4" gutterBottom>
                        Play Quiz

                    </Typography>

                    {errorMessage && (
                        <Alert severity="warning" sx={{ mb: 3 }}>
                            {errorMessage}
                        </Alert>
                    )}

                    <Button variant="contained"
                        onClick={() => navigate("/")}>
                        Back to Home

                    </Button>

                    <Button sx={{ ml: 2 }} variant="outlined"
                        onClick={() => navigate("/my-quizzes")}>
                        My Quizzes

                    </Button>

                </Paper>

            </Container>
        );

    }


    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3,
                }}>

                    <Typography variant="h4">
                        Play Quiz
                    </Typography>

                    <Typography>
                        Participant: <b>{fullName}</b>
                    </Typography>

                </Box>

                <LinearProgress variant="determinate"
                    value={((currentIndex + 1) / questions.length) * 100} sx={{ mb: 3 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Question {currentIndex + 1} of {questions.length}

                </Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    {currentQuestion.title}

                </Typography>
                <Typography variant="h5" sx={{ mb: 3 }}>
                    {currentQuestion.question}

                </Typography>

                <RadioGroup value={selectedAnswer}
                    onChange={handleAnswerChange}>
                    {currentQuestion.options.map((option, index) => (
                        <FormControlLabel key={`${currentQuestion.id}-${index}`}
                            value={option}
                            control={<Radio />}
                            label={option}
                            sx={{
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 1,
                                p: 1,
                                mb: 1,
                                mx: 0,
                            }} />
                    ))}

                </RadioGroup>

                {errorMessage && (
                    <Alert severity="error" sx={{ mt: 2 }}
                        onClose={() => setErrorMessage("")}>
                        {errorMessage}

                    </Alert>
                )}

                <Box sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 4,
                }} >
                    {currentIndex < questions.length - 1 ? (
                        <Button variant="contained"
                            onClick={handleNextQuestion}
                            disabled={selectedAnswer === ""}>
                            Next Question

                        </Button>
                    ) : (
                        <Button variant="contained"
                            color="success"
                            onClick={handleSubmitQuiz}
                            disabled={selectedAnswer === ""}>

                            submit Quiz

                        </Button>
                    )}
                </Box>

            </Paper>

        </Container>
    );


}

export default PlayQuiz;