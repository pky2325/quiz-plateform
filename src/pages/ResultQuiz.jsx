import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    Container, Typography, Paper,
    Box, Button, Stack, Alert, Divider, LinearProgress,
} from "@mui/material";


import { EmojiEvents, Home, Replay, CheckCircle, } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";


function ResultQuiz() {
    const navigate = useNavigate();

    const reduxResult = useSelector((state)=>state.result);

    //RESULT DATA AND LOADING STATE
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");


    //LOAD RESULT SAVED BY PLAY QUIZ PAGE
    useEffect(() => {
        setLoading(true);
        setErrorMessage("");
        
        try {
            const savedResult = reduxResult ? JSON.stringify(reduxResult): sessionStorage.getItem("quizResult");

            if (!savedResult) {
                setErrorMessage("No quiz result found. Please complete a quiz first.");
                return;
            }

            const parsedResult = JSON.parse(savedResult);


            if (!parsedResult || typeof parsedResult !== "object" ||
                !Number.isFinite(Number(parsedResult.score)) ||
                !Number.isFinite(Number(parsedResult.totalQuestions)) ||
                Number(parsedResult.totalQuestions) <= 0

            ) {
                setErrorMessage("The saved quiz result is invalid. Please take the quiz again.");
                return;
            }

            const score = Number(parsedResult.score);
            const totalQuestions = Number(parsedResult.totalQuestions);

            if (
                score < 0 ||
                score > totalQuestions
            ) {
                setErrorMessage("The saved score is inavlid. Please take the quiz again");
                return;
            }
            setResult({
                fullName:
                    typeof parsedResult.fullName === "string" ? parsedResult.fullName.trim() : "",
                score, totalQuestions, answer: Array.isArray(parsedResult.answer) ? parsedResult.answer : [],
                completedAt: parsedResult.completedAt || "",
            });

        } catch (error) {
            console.error("Error loading quiz result:", error);
            setErrorMessage("Unable to load your quiz result. Please try again.");

        } finally {
            setLoading(false);
        }
    }, [reduxResult]);


    //CALCULATE RESULT PERCENTAGE
    const percentage = result ? Math.round((result.score / result.totalQuestions) * 100) : 0;


    //FORMATE COMPLETEION DATE AND TIME 
    const formattedDate = (() => {
        if (!result?.completedAt) {
            return "Not available";
        }
        const date = new Date(result.completedAt);

        if (Number.isNaN(date.getTime())) {
            return "Not available";
        }

        return date.toLocaleString();
    })();


    //LOADING SCREN
    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 5 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Loading your result....

                </Typography>
                <LinearProgress sx={{ mt: 3 }} />

            </Container>
        );
    }

    //RESULT NOT FOUND OR INVALID
    if (!result) {
        return (
            <Container maxWidth="sm" sx={{ py: 5 }} >
                <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, textAlign: "center", }}>
                    <Typography variant="h4" gutterBottom>Quiz Result</Typography>

                    <Alert severity="warning" sx={{ my: 3 }}>{errorMessage || "Your result is not available."}</Alert>
                    <Button variant="contained" startIcon={<Home />}
                        onClick={() => navigate("/")}> Back to Home </Button>


                </Paper>

            </Container>
        );
    }

    //MAIN RESULT PAGE
    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, }}>

                {/* PAGE HEADING */}

                <Box sx={{ textAlign: "center", mb: 4 }}>
                    <EmojiEvents sx={{ fontSize: 65, color: "warning.main", mb: 1}} />

                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontSize: { xs: "2rem", sm: "3rem" }, }}>
                        Quiz Result

                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        your quiz has been submitted successfully.

                    </Typography>

                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* PARTICIPANTS DETAILS */}

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" >
                        Participants Name

                    </Typography>

                    <Typography variant="h6">{result.fullName || "participants"}</Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}> completed on {formattedDate} </Typography>

                </Box>


                <Divider sx={{ mb: 3 }} />


                {/* SCORE SUMMARY */}

                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(3, 1fr)",
                    },

                    gap: 2,
                    mb: 4,

                }}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: "center", borderRadius: 2, }}>
                        <Typography variant="body2" color="text.secondary">
                            Total Questions

                        </Typography>
                        <Typography variant="h4" sx={{ mt: 1, fontWeight: "bold" }}>
                            {result.totalQuestions}
                        </Typography>

                    </Paper>

                    <Paper variant="outlined" sx={{ p: 2, textAlign: "center", borderRadius: 2, }}>
                        <Typography variant="body2" color="text.secondary" >
                            Correct Answers
                        </Typography>
                        <Typography variant="h4" color="success.main" sx={{ mt: 1, fontWeight: "bold" }}>
                            {result.score}

                        </Typography>

                    </Paper>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: "center", borderRadius: 2, }}>
                        <Typography variant="body2" color="text.secondary">
                            Percentage

                        </Typography>
                        <Typography variant="h4" color="primary.main" sx={{ mt: 1, fontWeight: "bold" }}>
                            {percentage}%

                        </Typography>

                    </Paper>



                </Box>



                {/* SCORE PROGRESS */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, gap: 1, }}>
                        <Typography variant="subtitle1">Your Score</Typography>

                        <Typography variant="subtitle1" fontWeight="bold">{result.score}/{result.totalQuestions}</Typography>


                    </Box>

                    <LinearProgress variant="determinate" value={percentage} color="success" sx={{ height: 12, borderRadius: 5 }} />

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        You answered {result.score} out of{" "}
                        {result.totalQuestions} questions correctly.

                    </Typography>

                </Box>

                {/* RESULT MESSAGE */}

                <Alert severity={percentage === 100 ? "success" : percentage >= 50 ? "info" : "warning"} icon={<CheckCircle />} sx={{ mb: 4 }}>

                    {percentage === 100 ? "Excellent! you answered every question correctly." : percentage >= 50 ?
                        "Good effort! keep practising to imrove your score."
                        : "keep practising. Review your topics and try again."}

                </Alert>

                <Divider sx={{ mb: 3 }} />

                {/* NAVIGATION BUTTONS */}

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                    <Button variant="contained" startIcon={<Home />} onClick={() => navigate("/")} fullWidth>
                        Back to Home

                    </Button>

                    <Button variant="outlined" startIcon={<Replay />} onClick={() => navigate("/authentication")} fullWidth>
                        Play Again

                    </Button>

                </Stack>


            </Paper>

        </Container>
    );
}

export default ResultQuiz;