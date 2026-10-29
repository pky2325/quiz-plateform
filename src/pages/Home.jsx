import { Container, Typography, Card, CardContent, CardActions, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();
    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h3" align="center" gutterBottom>
                Quiz Plateform

            </Typography>

            <Typography
                variant="subtitle1"
                align="center"
                sx={{ mb: 5 }}>Welcome to Quiz Plateform

            </Typography>

            <Grid container spacing={3} alignItems="stretch" sx={{display: "flex"}}>
                <Grid item xs={12} sm={6} md={4} sx={{display:"flex", minWidth: 0}}>
                    <Card sx={{ width:"100%", height:"100%", display: "flex", flexDirection: "column"}}>
                        <CardContent sx={{ flexGrow: 1}}>
                            <Typography variant="h5" gutterBottom>
                                Create New Quiz
                            </Typography>
                            <Typography variant="body2">
                                Create your own quiz question.
                            </Typography>
                        </CardContent>
                        <CardActions>

                            <Button variant="contained" onClick={()=> navigate("/create-quiz")}>
                                Create Quiz

                            </Button>
                        </CardActions>
                    </Card>

                </Grid>
                <Grid item xs={12} sm={6} md={4} sx={{display:"flex", minWidth: 0}}>

                    <Card sx={{ width:"100%", height:"100%", display: "flex", flexDirection: "column"}}>
                        <CardContent sx={{ flexGrow: 1}}>
                            <Typography variant="h5" gutterBottom>
                                My Quizzes
                            </Typography>

                            <Typography variant="body2">
                                View all your created quizzes.

                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" onClick={()=> navigate("/my-quizzes")}>My Quizzes</Button>
                        </CardActions>
                    </Card>

                </Grid>
                <Grid item xs={12} sm={6} md={4} sx={{display:"flex", minWidth: 0}}>
                    <Card sx={{ width:"160%", minWidth: "160%", height:"100%", display: "flex", flexDirection: "column"}}>
                        <CardContent sx={{ flexGrow: 1}}>
                            <Typography variant="h5" gutterBottom>Play Quiz</Typography>
                            <Typography variant="body2">Start Playing Quiz.</Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" onClick={()=> navigate("/authentication")}>Play Quiz</Button>
                        </CardActions>

                    </Card>
                </Grid>

            </Grid>

        </Container>
    );
}

export default Home;