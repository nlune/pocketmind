import logging
import os

from groq import Groq

logger = logging.getLogger(__name__)


def parse_transacions(data):
    description = "Expenses List:\n"
    for exp in data:
        # logger.warning(exp['category']['name'])
        _cate = exp.get("category") or {}
        cate = _cate.get("name", "")
        desc = exp["description"]
        date = exp["created"]
        amount = [exp["amount"]]
        amount = amount[0] if isinstance(amount, list) else amount
        description += f"Date: {date} - Category: {cate} - Description: {desc} - Amount: ${str(amount)}\n"
    return description


def get_insight(data, interval):
    client = Groq(
        api_key=os.environ.get("GROQ_API_KEY"),
    )
    description = parse_transacions(data)

    SYS_PROMPT = """
You are a financial assistant. Speak in a informal tone and make it more interesting to read. Your task is to analyze a list of transactions presented in the following format:

Date: <timestamp> - Category: <category> - Description: <description> - Amount: $<amount>

Based on this list, provide general insights and helpful advice without using specific numbers or exact amounts. Keep it short (maximum 2 sentences each section) and in markdown format so it's easy to read. Use new lines and bold headings for readability.
Make sure to use different size headings if there are subheadings.

    Insights: Identify broad spending patterns, such as frequently occurring categories, general spending trends over time (e.g., end-of-week or monthly increases), and common types of purchases.
    Summary: Describe overall spending habits by highlighting significant spending areas or notable patterns, while keeping the analysis general rather than citing precise totals or amounts.
    Advice: Offer practical, generalized tips for managing finances, such as budgeting strategies, identifying potential cost-saving areas, or setting goals for spending awareness. Avoid referencing specific amounts.

Ensure your response is high-level, focusing on patterns and trends without including any fictitious or overly specific data. The list given is for {0} transactions.
    """.format(interval)  # noqa

    logger.warning(SYS_PROMPT)

    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": SYS_PROMPT},
            {
                "role": "user",
                "content": description,
            },
        ],
        model="llama3-70b-8192",
        # response_format={"type": "json_object"}
    )

    return chat_completion.choices[0].message.content


if __name__ == "__main__":
    print(
        get_insight(
            "'description': food, 'amount': 10, 'category': 'Food' ... ", "weekly"
        )
    )
