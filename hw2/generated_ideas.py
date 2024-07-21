import gradio as gr
from transformers import pipeline

# Load the GPT-2 model
generator = pipeline('text-generation', model='gpt2')

def generate_ideas():
    # Generate ideas using GPT-2
    prompt = "Give me 5 ideas for exciting web projects with AI:"
    generated_text = generator(prompt, max_length=100, num_return_sequences=1)[0]['generated_text']
    
    # Extract only the ideas portion from the generated text
    ideas_start = generated_text.find(':') + 1
    ideas = generated_text[ideas_start:].strip()

    return ideas

iface = gr.Interface(
    fn=generate_ideas,
    inputs=[],
    outputs=gr.Textbox(label="Generated Ideas"),
    title="5 Ideas for Web Projects with AI",
    description="Click the button to generate 5 exciting web project ideas with AI",
    theme="compact"
)

iface.launch()
