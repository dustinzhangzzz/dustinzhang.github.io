from flask import Flask, request, Response, render_template,jsonify
import requests
import itertools
from flask_wtf.csrf import CSRFProtect
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField,IntegerField, SelectField
from wtforms.validators import Regexp,ValidationError,InputRequired,Optional
import re
def creat_list():
    result = []
    result.append(("Not select","Not select"))
    for a in range(3,11):
        result.append((str(a),str(a)))
    return result
class WordForm(FlaskForm):
    avail_letters = StringField("Letters", validators= [Optional(),Regexp(r'^[a-z]+$', message="Letters must contains letters only")
    ])
    word_length = SelectField("Word Length",choices=creat_list())
    expression = StringField("Pattern", validators= [Optional(),Regexp(r'^[a-z|.]+$', message=" Pattern must contains letters or . only")
    ])
    submit = SubmitField("Go")
    def needOneInput(self,letters,expression):
        error = None
        if(letters=="" and expression==""):
            error ="You have to enter either the letters or expression"
        return error
    def validate_length(self,wordLen,letters):
        error = None;
        if wordLen =="Not select" or letters =="":
            return error
        elif int(wordLen)>len(letters):
            error = "Length should be less than the given words"
            return error;
    def validate_pattern(self,wordLen,expression):
        error = None;
        if wordLen =="Not select" or expression =="":
            return error
        elif int(wordLen)!=len(expression):
            error = "Length should match with the given pattern"
            return error;
csrf = CSRFProtect()
app = Flask(__name__)
app.config["SECRET_KEY"] = "row the boat"
csrf.init_app(app)
@app.route('/index')
def index():
    form = WordForm()
    return render_template("index.html",name="Dustin Zhang",form=form,link="https://github.com/dustinzhangzzz/dustinzhangzzz.github.io")
@app.route('/words', methods=['POST','GET'])
def letters_2_words():
    form = WordForm()
    wordSet=[];
    if form.validate_on_submit():
        letters = form.avail_letters.data
        word_length= form.word_length.data
        expression = form.expression.data
    else:
        return render_template("index.html", form=form)
    error1 = form.needOneInput(letters,expression)
    if error1:
        return render_template("index.html", form=form, error = error1,link="https://github.com/dustinzhangzzz/dustinzhangzzz.github.io")
    error2 = form.validate_length(word_length,letters)
    if error2:
        return render_template("index.html", form=form, error = error2,link="https://github.com/dustinzhangzzz/dustinzhangzzz.github.io")
    error3 = form.validate_pattern(word_length,expression)
    if error3:
        return render_template("index.html", form=form, error = error3,link="https://github.com/dustinzhangzzz/dustinzhangzzz.github.io")
    with open('sowpods.txt') as f:
        good_words = set(x.strip().lower() for x in f.readlines())
    word_set = set()
    if letters=="":
        for word in good_words:
            exp= "^"+expression+"$"
            result = re.match(exp,word)
            if result:
                word_set.add(word)
    else:
        matchLen = False
        for l in range(3,len(letters)+1):
            for word in itertools.permutations(letters,l):
                w = "".join(word)
                if w in good_words:
                    result = True;
                    matchLen = True
                    if expression!="":
                        exp= "^"+expression+"$"
                        result = re.match(exp,w)
                    if word_length != "Not select":
                        if len(w) != int(word_length):
                            matchLen = False;
                    if result and matchLen:
                        word_set.add(w)
    wordSet = sorted(word_set)
    wordSet = sorted(wordSet,key=len)
    empError = None;
    if len(wordSet)==0:
        empError = "No words found"
    return render_template('wordlist.html',wordlist = wordSet,name="Dustin Zhang",myFunction = findDef, error =empError,link="https://github.com/dustinzhangzzz/dustinzhangzzz.github.io")
@app.route('/proxy/<word>')
def findDef(word):
    result = requests.get('https://www.dictionaryapi.com/api/v3/references/collegiate/json/'+word+'?key=0f8cf90e-40a7-49a5-bfab-5da06b43ce1f')
    section =result.json()[0]["shortdef"]
    counter = 1
    text = ""
    for definition in section:
        text = text+str(counter)+". "+definition.capitalize()+"."+"\n"
        counter+=1
    return jsonify(text)
if __name__ =="__main__":
 app.run(debug=True)
