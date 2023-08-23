// Dependencies
const { OpenAI } = require("langchain/llms/openai");
const { PromptTemplate } = require("langchain/prompts");
const { StructuredOutputParser } = require("langchain/output_parsers");
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
    // With a `StructuredOutputParser` we can define a schema for the output.
    const parser = StructuredOutputParser.fromNamesAndDescriptions({
      code: "Javascript code that answers the user's question",
      explanation: "detailed explanation of the example code provided",
    });
    const formatInstructions = parser.getFormatInstructions();
    // Instantiation of a new object called "prompt" using the "PromptTemplate" class
    const prompt = new PromptTemplate({
      template:
        "You are a javascript expert and will answer the user's coding questions thoroughly as possible.\n{format_instructions}\n{question}",
      inputVariables: ["question"],
      partialVariables: { format_instructions: formatInstructions },
    });
    const promptInput = await prompt.format({
      question: input,
    });
    const res = await model.call(promptInput);
    console.log(await parser.parse(res));
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
