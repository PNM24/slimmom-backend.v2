require("dotenv").config();
const app = require("./app");
const colors = require("colors");

const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(
    colors.bgBlue.italic.bold(`Server is running. Use our API on port: ${PORT}`)
  );
});
