import { AppBar, Toolbar, Typography, Button, Box} from "@mui/material";
import { Link } from "react-router-dom";
function Navbar(){
    return(
        <AppBar position="static">
            <Toolbar>
                <Typography Variant="h6" sx={{ flexGrow: 1 }}>
                    Quiz Plateform

                </Typography>

                <Box>
                    <Button color="inherit" component={Link} to="/">
                        Home
                    </Button>

                    <Button color="inherit" component={Link} to="/my-quizzes">My Quiz</Button>

                    <Button color="inherit" component={Link} to="/authentication">Play Quiz</Button>
                </Box>
            </Toolbar>

        </AppBar>
    );
}
export default Navbar;