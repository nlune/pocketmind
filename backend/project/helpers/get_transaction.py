import os

from groq import Groq


def get_transaction(user_input):
    client = Groq(
        api_key=os.environ.get("GROQ_API_KEY"),
    )

    SYS_PROMPT = """
    You are a transaction parser. Your task is to analyze a natural speech sentence that describes an expense or
    transaction, then convert it into a JSON dictionary format with two keys: description and amount.

        description: A string summarizing the purpose or details of the expense.
        amount: A floating-point number representing the expense amount.

    The JSON dictionary should follow this format:
    
    json
    
    {
      "description": "<description>",
      "amount": <amount>
    }
    
    If the input cannot be converted into a clear description and amount, respond with:
    
    json
    
    {
      "error": "Unconvertible input"
    }
    
    Only provide the JSON dictionary in your response.
    """  # noqa

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": SYS_PROMPT
            },
            {
                "role": "user",
                "content": user_input,
            },
        ],
        model="llama3-8b-8192",
        response_format={"type": "json_object"}
    )

    return chat_completion.choices[0].message.content


if __name__ == "__main__":
    print(get_transaction("I had a burger and some fries for 10, then another 5 for dessert"))
