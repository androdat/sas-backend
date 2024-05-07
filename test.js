let intervalId;
let iterations = 0;
const maxIterations = 10;

fetchData = async () => {
  try {
    const response = await fetch("http://localhost:2000/tower");
    iterations++;
    if (iterations >= maxIterations) {
        stopInterval();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Start the interval
intervalId = setInterval(fetchData, 5000);

// Stop the interval after reaching the maximum number of iterations
function stopInterval() {
    clearInterval(intervalId);
    console.log('Interval stopped after', maxIterations, 'iterations.');
}