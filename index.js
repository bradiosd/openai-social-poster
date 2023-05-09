const dotenv = require('dotenv')
const config = dotenv.config()
const fs = require('fs-extra')
const moment = require('moment')
const args = require('args')

args.option('message', 'Your message to the chat bot')

const flags = args.parse(process.argv)

if (!flags.message) {
    console.error('you need to provide a message for the chat bot')
    return
}

async function start() {
    const { Configuration, OpenAIApi } = require("openai");

    const configuration = new Configuration({
        apiKey: process.env.KEY,
    });

    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { "role": "assistant", "content": "you business name is '128 bit studios'" },
            { "role": "assistant", "content": "the post must use emojis" },
            { "role": "assistant", "content": "the post must be 3 paragraphs long" },
            { "role": "assistant", "content": "the post must be no longer than 300 characters in length" },
            { "role": "assistant", "content": "the post must have 10 hashtags" },
            { "role": "system", "content": flags.message },
        ],
    });

    let message = null

    try {
        message = completion.data.choices[0].message;
    } catch (error) {
        console.error(error)
    }

    if (!message) {
        return;
    }

    if (!fs.pathExistsSync('output')) {
        fs.mkdirSync('output');
    }

    const date = moment().format('DD-MM-YYYY hh-mm')

    fs.writeFile(`output/${date}.txt`, message.content)

    console.info(`message written to file output/${date}.txt with content "${message.content}"`);
}

start()
