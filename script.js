// Dependencies
const { OpenAI } = require("langchain/llms/openai");
const inquirer = require("inquirer");
require("dotenv").config();

// Creates and stores our API package with basic configuration
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  model: "gpt-3.5-turbo",
});

// Awaits the init inquirer prompt and makes a call to the openAI API
const promptFunc = async (input) => {
  try {
    const res = await model.call(input);
    console.log(res);
  } catch (error) {
    console.error(error);
  }
};

// Prompts the user to ask a coding question.. then sends the response to promptFunc for AI answer.
const init = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Ask a coding question:",
      },
    ])
    .then((inquirerResponse) => {
      promptFunc(inquirerResponse.name);
    });
};

init();
