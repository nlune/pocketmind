import os

from groq import Groq


def get_transaction_scannedtxt(user_input):
    client = Groq(
        api_key=os.environ.get("GROQ_API_KEY"),
    )

    SYS_PROMPT = """
    You are a receipt parsing assistant. Your task is to analyze text extracted from a receipt, which may contain errors, formatting issues, or incomplete information, and convert it into a JSON dictionary format with two keys: description and amount.

        description: The main item or transaction details as accurately as possible, even if brief.
        amount: The transaction's amount, represented as a floating-point number. If you are unsure about the exact amount, use 0 or the best possible estimate.

    Return the JSON dictionary in the following format:

    json

    {
    "description": "<description>",
    "amount": <amount>
    }

    Note the receipt can be in German or English. Be careful to find the correct total amount, which may be after 'TOTAL' or 'Gegeben Kartenzahlung', or other relevant keywords. There may be many numbers, so look for the most sensible choice for the total amount number. 
    Make sure the description field makes sense as a summary, either in German or English. It needs to be readable and understandable, just provide a short summary or empty string if you can't extract sensible details. Do not include numbers or confusing details in the description.
    If you can only extract the total amount and no specific description, set description to an empty string. Provide only the JSON dictionary in your response.
    """  # noqaß

    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": SYS_PROMPT},
            {
                "role": "user",
                "content": user_input,
            },
        ],
        model="llama3-8b-8192",
        response_format={"type": "json_object"},
    )

    return chat_completion.choices[0].message.content


if __name__ == "__main__":
    print(
        get_transaction_scannedtxt("""ne 4
1 Chung Gesant
Lad ps Rena is AA { PY
€ "GesChnet ze es in 7,80 ı
 * Prepack Toskana-Mix 2,78 |
* Seidentofu 3,28 1
* Trauben: kg, weiß, kernlos 6,90 |
Netto 0,768 kg x 9,90 EUR Ag
Tara; 89 5,39 1
+ Kähnchenf lige] 4 stk b 2,82 1
PLIzE: Jo, Bong ons, A
TE 32, gg |
2 Kartenzahlung 32,98
Must Netto Steuer Brutto
Pm gy 25 32,99
2 ay Etrich 9 Lisfer gap
an —
oA ek"""
                                   )
    )
