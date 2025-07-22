from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import random
from flask_cors import CORS
from datetime import timedelta

from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

load_dotenv()

app = Flask(__name__)
app.secret_key = 'otp_secret_key'
app.permanent_session_lifetime = timedelta(minutes=5)
CORS(app)

SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

# Load Chatbot model
tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.pop("verified", None)
    return redirect("/")

@app.route("/send-otp", methods=['POST'])
def send_otp():
    data = request.get_json()
    email = data.get("email")

    otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    session['otp'] = otp

    message = MIMEText(f"Your OTP is: {otp}")
    message['Subject'] = "Your OTP Code"
    message['From'] = SMTP_EMAIL
    message['To'] = email

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(message)
        return jsonify({"message": "OTP sent successfully!"})
    except Exception as e:
        return jsonify({"message": "Failed to send OTP", "error": str(e)}), 500

@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json()
    entered_otp = data.get("otp")
    if entered_otp == session.get("otp"):
        session['verified'] = True
        return jsonify({"status": "success"})
    return jsonify({"status": "error"})

@app.route("/chat")
def chat_page():
    if not session.get("verified"):
        return redirect(url_for("login"))
    return render_template("chat.html")

@app.route("/get", methods=["POST"])
def chat():
    msg = request.form["msg"]
    return get_chat_response(msg)

def get_chat_response(text):
    new_input_ids = tokenizer.encode(text + tokenizer.eos_token, return_tensors='pt')
    chat_history_ids = model.generate(new_input_ids, max_length=1000, pad_token_id=tokenizer.eos_token_id)
    return tokenizer.decode(chat_history_ids[:, new_input_ids.shape[-1]:][0], skip_special_tokens=True)

if __name__ == "__main__":
    app.run(debug=True)
