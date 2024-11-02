# Teste das Skript in einer Datei (z.B. test_openai.py)
import openai

# Setze den API-Schlüssel direkt für den Test
openai.api_key = "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"

# Teste den Import
print("openai module successfully imported!")

# Deine weitere Logik hier
def generate_text(prompt):
    response = openai.Completion.create(
        engine="gpt-3.5-turbo",
        #engine="davinci-codex",
        prompt=prompt,
        max_tokens=50
    )
    return response.choices[0].text.strip()

# Beispiel für die Verwendung der generate_text Funktion
if __name__ == "__main__":
    print(generate_text("Schreibe ein Gedicht über den Herbst"))
