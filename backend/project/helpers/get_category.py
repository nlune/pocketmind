import os

from groq import Groq


def get_category(description):
    client = Groq(
        api_key=os.environ.get("GROQ_API_KEY"),
    )

    SYS_PROMPT = """
    You are an expense categorization assistant. Your task is to analyze an expense description and determine the
    single best-fitting category from a list of commonly used categories.
    Consider both specific keywords and contextual information within the description.
    When in doubt, choose the category that most closely aligns with the primary purpose of the expense.
    The categories available are as follows:

    Food & Dining (e.g., restaurants, cafes, groceries)
    Transportation (e.g., fuel, public transport, parking)
    Entertainment (e.g., movies, concerts, subscriptions)
    Utilities (e.g., electricity, water, internet)
    Shopping (e.g., clothing, electronics, household items)
    Healthcare (e.g., pharmacy, doctor visits, health insurance)
    Travel (e.g., flights, hotels, travel insurance)
    Education (e.g., books, courses, school supplies)
    Personal Care (e.g., haircuts, beauty products)
    Home & Rent (e.g., rent, home repairs, mortgage payments)
    Miscellaneous (e.g., expenses that don’t fit other categories)

    Return only the name of the single best-fitting category.
    """

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": SYS_PROMPT
            },
            {
                "role": "user",
                "content": description,
            },
        ],
        model="llama3-8b-8192",
        # response_format={"type": "json_object"}
    )

    return chat_completion.choices[0].message.content


if __name__ == "__main__":
    get_category("spa massage and hotel")
