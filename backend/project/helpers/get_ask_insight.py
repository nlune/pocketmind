import logging
import os

from groq import Groq

from project.helpers.get_insight import parse_transacions

logger = logging.getLogger(__name__)


def get_ask_insight(user_ask, data, interval):
    client = Groq(
        api_key=os.environ.get("GROQ_API_KEY"),
    )
    description = parse_transacions(data)
    # logger.warning(description)

    SYS_PROMPT = """
You are a trustworthy, insightful assistant tasked with analyzing users' financial transactions and providing clear, friendly summaries based on their queries. You will be provided with a list of transactions presented in the following format:

Date: <timestamp> - Category: <category> - Description: <description> - Amount: $<amount> 

It is followed by a user query. Carefully interpret the transactions based on the query. Note this could be a general query, in which case you should respond appropriately and adjust to the user needs.

Your role is to interpret the data carefully and answer the user's query in a single, highly accurate and professionally written paragraph, formatted in a way that’s easy to understand. 
If the query is general, offer insights into spending patterns or meaningful observations based on the data. 
Your response should be both accurate and delightful to read, ensuring you base all insights strictly on the provided data without introducing any assumptions, estimates, or fictitious information. 
Aim to strike a tone that mirrors the user’s style, whether formal or casual, and use Markdown formatting if it enhances clarity. 
Remember: accuracy is paramount—focus on providing value through precise observations and grounded insights.
Avoid inventing any fictitious details or numbers. If the query requests trends or comparisons, ensure your response is grounded in the actual data provided. 
The list given is for {0} transactions.
    """.format(interval)  # noqa

    logger.warning(SYS_PROMPT)

    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": SYS_PROMPT},
            {
                "role": "user",
                "content": description,
            },
            {
                "role": "user",
                "content": user_ask
            }
        ],
        model="llama3-70b-8192",
        # response_format={"type": "json_object"}
    )

    return chat_completion.choices[0].message.content


if __name__ == "__main__":
    print(
        get_ask_insight(
            "How can I save more", "'description': food, 'amount': 10, 'category': 'Food' ... ", "weekly"
        )
    )
