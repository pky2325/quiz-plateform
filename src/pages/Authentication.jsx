import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, TextField, Button, Card, CardContent, Box,  } from "@mui/material";


function Authentication(){
    
    const[fullName, setFullName] = useState();
    const[error, setError] = useState("");
    const navigate = useNavigate();
    const handleStartQuiz = () => {
        const name = fullName.trim();

        if(name.length < 5 || name.length> 50){
            setError("Name must be between 5 and 50 characters.");
            return;
        }

        sessionStorage.setItem("fullName", name);
        navigate("/play-quiz");
    };
    return(
        <Container maxWidth="sm" sx={{ py: 6}}>
            <Card elevation={3}>
                 <CardContent sx={{p:4}}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Enter Your Name
                    </Typography>
                    <Typography varient="body1" align="center" sx={{ mb:3}}>
                        Enter your name to start the quiz.

                    </Typography>
                    <Box component="form" onSubmit={(event)=> {event.preventDefault(); handleStartQuiz();}}>
                        <TextField fullwidth label="Full Name" value={fullName} onChange={(event) =>{
                            setFullName(event.target.value);
                            setError("");
                        }}
                        error={Boolean(error)}
                        helperText = {error}
                        inputProps={{ maxLength: 50 }}
                        sx={{ mb:3 }}

                        />
                        <Button type="submit" variant="contained" fullwidth>Start Quiz</Button>

                        

                    </Box>
                 </CardContent>
            </Card>
           

        </Container>
    );
}

export default Authentication;