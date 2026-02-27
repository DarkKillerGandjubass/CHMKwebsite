import os
from dotenv import load_dotenv
from flask import Flask, request, render_template, redirect, flash
from flask_mail import Mail, Message

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")

mail = Mail(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    name = request.form.get('name')
    surname = request.form.get('surname')
    phone = request.form.get('phone')

    # Тело письма с кодировкой UTF-8
    msg = Message(
        subject=f"Заявка от {name} {surname}",
        sender=app.config['MAIL_USERNAME'],
        recipients=[app.config['MAIL_USERNAME']],
        body=f"Имя: {name}\nФамилия: {surname}\nТелефон: {phone}",
        charset='utf-8'
    )
    mail.send(msg)
    flash('Заявка отправлена!')
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)