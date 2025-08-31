from flask import Flask, request
from flask_cors import CORS
from utils.Searcher import Searcher

app = Flask(__name__)
searcher = Searcher()

# CORS跨域支持
CORS(app, resources={
    r"/search": {
        "origins": ["https://paperwithcode-snapshot-frontend.onrender.com"],
        "methods": ["GET"]
    }
}) 

@app.route('/')
def home():
    return "Route to /search?query= to search by title"

@app.route('/search')
def search():
    query_type = request.args.get("type", default="paper_title")
    query = request.args.get("query")
    regex_mode = request.args.get("regex", default=False)
    case_sensitive = request.args.get("caseSensitive", default=False)

    if regex_mode == "false": regex_mode = False
    elif regex_mode == "true": regex_mode = True

    if case_sensitive == "false": case_sensitive = False
    elif case_sensitive == "true": case_sensitive = True

    result = searcher.search(target_value = query, key = query_type, regex_mode = regex_mode, case_sensitive = case_sensitive)
    print(f"Found {len(result)} results.")
    return result

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)